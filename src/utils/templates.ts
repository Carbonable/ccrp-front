import * as XLSX from 'xlsx';

export interface TemplateDefinition {
  headers: string[];
  sampleRow: (string | number)[];
}

export const TEMPLATES: Record<string, TemplateDefinition> = {
  company: {
    headers: ['name', 'slug'],
    sampleRow: ['Acme Corp', 'acme-corp'],
  },
  certifier: {
    headers: ['name', 'slug'],
    sampleRow: ['Gold Standard', 'gold-standard'],
  },
  developper: {
    headers: ['name', 'slug'],
    sampleRow: ['EcoProjects Ltd', 'ecoprojects-ltd'],
  },
  project: {
    headers: [
      'name',
      'slug',
      'description',
      'localization',
      'start_date',
      'end_date',
      'area',
      'type',
      'origin',
      'funding_amount',
      'color',
      'protected_species',
      'protected_forest',
      'risk_analysis',
      'country_code',
      'certifier_slug',
      'developper_slug',
    ],
    sampleRow: [
      'Amazon Reforestation',
      'amazon-reforestation',
      'Large-scale reforestation project in the Amazon basin',
      '-3.4653, -62.2159',
      '2024',
      '2034',
      '50000',
      'REFORESTATION',
      'FORWARD_FINANCE',
      '1000000',
      'GREEN',
      'true',
      'true',
      '2023',
      'BR',
      'gold-standard',
      'ecoprojects-ltd',
    ],
  },
  'absorption-curve': {
    headers: ['project_slug', 'year', 'quantity'],
    sampleRow: ['amazon-reforestation', 2025, 5000],
  },
  'business-units': {
    headers: [
      'name',
      'description',
      'default_emission',
      'default_target',
      'debt',
      'company_slug',
    ],
    sampleRow: [
      'Operations BU',
      'Main operations business unit',
      '1000000',
      '0.3',
      '0',
      'acme-corp',
    ],
  },
  demands: {
    headers: [
      'business_unit_name',
      'year',
      'emissions_in_grams',
      'target_percentage',
      'target_amount_in_grams',
    ],
    sampleRow: ['Operations BU', 2025, 1000000000, 0.3, 300000000],
  },
};

export function downloadTemplate(type: string): void {
  const template = TEMPLATES[type];
  if (!template) {
    console.error(`No template found for type: ${type}`);
    return;
  }

  const worksheetData = [template.headers, template.sampleRow];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Auto-width columns
  const colWidths = template.headers.map((header, idx) => {
    const sampleVal = String(template.sampleRow[idx] ?? '');
    return { wch: Math.max(header.length, sampleVal.length) + 4 };
  });
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, type);

  XLSX.writeFile(workbook, `${type}-template.xlsx`);
}
