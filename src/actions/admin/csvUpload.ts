'use server';

import * as XLSX from 'xlsx';
import { getJwtToken } from '@/utils/auth';
import {
  BUSINESS_UNITS,
  EMISSION_ESTIMATES,
  PROJECT,
  TemplateKey,
  UploadType,
} from '@/types/admin';

interface UploadResult {
  success: boolean;
  message: string;
}

interface LookupItem {
  id: string;
  name?: string;
  slug?: string;
  code?: string;
}

interface UploadLookups {
  companies: LookupItem[];
  certifiers: LookupItem[];
  developpers: LookupItem[];
  businessUnits: LookupItem[];
  countries: LookupItem[];
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function csvEscape(value: string | number): string {
  const str = String(value ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCsv(headers: string[], rows: (string | number)[][]): string {
  return [headers.map(csvEscape).join(','), ...rows.map((row) => row.map(csvEscape).join(','))].join('\n');
}

async function fileToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

function isSpreadsheet(file: File): boolean {
  const name = file.name.toLowerCase();
  return name.endsWith('.xlsx') || name.endsWith('.xls');
}

async function fetchJson(url: string, token: string): Promise<any> {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Lookup request failed (${response.status}) for ${url}`);
  }

  return response.json();
}

async function fetchCountries(token: string): Promise<LookupItem[]> {
  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_API_URL || `${process.env.API_URL}/graphql`;
  const response = await fetch(graphqlUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `query CountriesForAdminUpload { countries { id name code } }`,
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Countries lookup failed (${response.status})`);
  }

  const payload = await response.json();
  return payload?.data?.countries ?? [];
}

async function getLookups(token: string): Promise<UploadLookups> {
  const apiUrl = process.env.API_URL;

  if (!apiUrl) {
    throw new Error('API_URL is not configured');
  }

  const [companies, certifiers, developpers, businessUnits, countries] = await Promise.all([
    fetchJson(`${apiUrl}/company`, token),
    fetchJson(`${apiUrl}/certifier`, token),
    fetchJson(`${apiUrl}/developper`, token),
    fetchJson(`${apiUrl}/business-units`, token),
    fetchCountries(token),
  ]);

  return { companies, certifiers, developpers, businessUnits, countries };
}

function resolveLookup(value: string, label: string, items: LookupItem[]): string {
  const cleaned = value.trim();
  if (!cleaned) {
    throw new Error(`${label} is required`);
  }

  const direct = items.find((item) => item.id === cleaned);
  if (direct) return direct.id;

  const normalized = normalize(cleaned);
  const match = items.find(
    (item) =>
      normalize(item.name || '') === normalized ||
      normalize(item.slug || '') === normalized ||
      normalize(item.code || '') === normalized,
  );

  if (!match) {
    throw new Error(`${label} "${value}" was not found in the current platform data`);
  }

  return match.id;
}

function getWorkbook(fileBuffer: Buffer): XLSX.WorkBook {
  return XLSX.read(fileBuffer, { type: 'buffer' });
}

function getSheetRows(workbook: XLSX.WorkBook, index = 0): any[][] {
  const sheet = workbook.Sheets[workbook.SheetNames[index]];
  return XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    raw: false,
    defval: '',
  }) as any[][];
}

function getSheetObjects(workbook: XLSX.WorkBook, index = 0): Record<string, any>[] {
  const sheet = workbook.Sheets[workbook.SheetNames[index]];
  return XLSX.utils.sheet_to_json(sheet, {
    raw: false,
    defval: '',
  }) as Record<string, any>[];
}

function parseProjectTemplate(buffer: Buffer, lookups: UploadLookups): string {
  const workbook = getWorkbook(buffer);
  const rows = getSheetRows(workbook, 0);
  const kv = new Map<string, string>();

  for (const row of rows) {
    const key = String(row[0] ?? '').trim();
    const value = String(row[1] ?? '').trim();
    if (!key || ['Project', 'key', 'GENERIC', 'FINANCE', 'FIELD', 'TECH'].includes(key)) {
      continue;
    }
    kv.set(key, value);
  }

  const read = (...keys: string[]): string => {
    for (const key of keys) {
      const value = kv.get(key);
      if (value) return value;
    }
    return '';
  };

  const name = read('name');
  const slug = read('slug') || slugify(name);
  const description = read('description');
  const localization = read('localization');
  const startDate = read('startDate');
  const endDate = read('endDate');
  const area = read('Project Area (ha)');
  const type = (read('Project Category') || 'RESTORATION').toUpperCase();
  const origin = (read('origin') || 'FORWARD_FINANCE').toUpperCase();
  const fundingAmount = read('fundingAmount') || '0';
  const color = (read('color') || 'GREEN').toUpperCase();
  const protectedSpecies = read('protectedSpecies') || '0';
  const protectedForest = read('Protected Forest') || '0';
  const riskAnalysis = read('Risk Analysis') || 'A';
  const countryId = resolveLookup(read('Country'), 'Country', lookups.countries);
  const companyId = resolveLookup(read('Company'), 'Company', lookups.companies);
  const certifierId = read('Certifier')
    ? resolveLookup(read('Certifier'), 'Certifier', lookups.certifiers)
    : '';
  const developperId = read('projectDevelopper')
    ? resolveLookup(read('projectDevelopper'), 'Project Developper', lookups.developpers)
    : '';

  const sdgs = read('SDGs')
    .split(/[;,]/)
    .map((value) => value.trim())
    .filter(Boolean);

  const metadata = JSON.stringify({
    projectType: read('Project type'),
    auditStartDate: read('Audit Start Date'),
    auditFrequency: read('Audit Frequency'),
    rating: read('Rating'),
    projectStatus: read('Project status'),
    image: read('Img (PNG)'),
    collectionImage: read('Collection Img (PNG)'),
    impactReportLink: read('Impact Report Link'),
  });

  const headers = [
    'id',
    'name',
    'slug',
    'description',
    'localization',
    'start_date',
    'end_date',
    'area_ha',
    'type',
    'origin',
    'funding_amount',
    'color',
    'protected_species',
    'protected_forest',
    'risk_analysis',
    'metadata',
    'certifier_id',
    'developper_id',
    'country_id',
    'company_id',
    'sdgs_id',
  ];

  const row = [
    crypto.randomUUID(),
    name,
    slug,
    description,
    localization,
    startDate,
    endDate,
    area,
    type,
    origin,
    fundingAmount,
    color,
    protectedSpecies,
    protectedForest,
    riskAnalysis,
    metadata,
    certifierId,
    developperId,
    countryId,
    companyId,
    JSON.stringify(sdgs),
  ];

  return toCsv(headers, [row]);
}

function parseBusinessUnitsTemplate(buffer: Buffer, lookups: UploadLookups): string {
  const workbook = getWorkbook(buffer);
  const rows = getSheetObjects(workbook, 0);

  const headers = [
    'id',
    'name',
    'description',
    'default_emission',
    'default_target',
    'debt',
    'metadata',
    'company_id',
  ];

  const csvRows = rows
    .filter((row) => String(row.business_unit_name || '').trim())
    .map((row) => [
      crypto.randomUUID(),
      String(row.business_unit_name || '').trim(),
      String(row.description || '').trim(),
      String(row.default_emission || '0').trim(),
      String(row.target || '0').trim(),
      String(row.debt || '0').trim(),
      JSON.stringify({}),
      resolveLookup(String(row.company || '').trim(), 'Company', lookups.companies),
    ]);

  return toCsv(headers, csvRows);
}

function parseEmissionEstimatesTemplate(buffer: Buffer, lookups: UploadLookups): string {
  const workbook = getWorkbook(buffer);
  const rows = getSheetObjects(workbook, 0);

  const headers = ['business_unit_id', 'year', 'emissions_in_grams', 'target'];
  const csvRows = rows
    .filter((row) => String(row.business_unit_name || '').trim())
    .map((row) => [
      resolveLookup(String(row.business_unit_name || '').trim(), 'Business Unit', lookups.businessUnits),
      String(row.year || '').trim(),
      String(row.emissions_in_grams || '').trim(),
      String(row.target || '').trim(),
    ]);

  return toCsv(headers, csvRows);
}

async function normalizeFile(
  file: File,
  uploadType: UploadType,
  templateKey: TemplateKey | null,
  token: string,
): Promise<File> {
  if (!isSpreadsheet(file)) {
    return file;
  }

  const buffer = await fileToBuffer(file);
  const lookups = await getLookups(token);

  let csvContent = '';
  if (uploadType === PROJECT) {
    csvContent = parseProjectTemplate(buffer, lookups);
  } else if (uploadType === BUSINESS_UNITS) {
    csvContent = parseBusinessUnitsTemplate(buffer, lookups);
  } else if (uploadType === EMISSION_ESTIMATES) {
    csvContent = parseEmissionEstimatesTemplate(buffer, lookups);
  } else {
    throw new Error(`Unsupported upload type: ${uploadType}`);
  }

  const fileName = `${templateKey || uploadType}.csv`;
  return new File([csvContent], fileName, { type: 'text/csv' });
}

export async function uploadFile(formData: FormData): Promise<UploadResult> {
  const token = await getJwtToken();
  const file = formData.get('file') as File | null;
  const type = formData.get('type') as UploadType | null;
  const templateKey = (formData.get('templateKey') as TemplateKey | null) || null;

  if (!token) {
    return { success: false, message: 'Could not authenticate against the backend' };
  }

  if (!file || !type) {
    return { success: false, message: 'No file or type provided' };
  }

  const endpoint = `${process.env.API_URL}/${type.toLowerCase()}/upload`;

  try {
    const normalizedFile = await normalizeFile(file, type, templateKey, token);
    const uploadFormData = new FormData();
    uploadFormData.append('file', normalizedFile, normalizedFile.name);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: uploadFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`${response.status} ${errorText}`);
    }

    const payload = await response.json().catch(() => null);
    return {
      success: true,
      message: payload?.message || `${type} file uploaded successfully`,
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      message: `Error uploading ${type} file: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
