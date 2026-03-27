import * as XLSX from 'xlsx';
import { TemplateKey, adminUploadTemplates } from '@/types/admin';

interface WorkbookTemplate {
  sheets: {
    name: string;
    data: (string | number)[][];
  }[];
}

const PROJECT_TEMPLATE: WorkbookTemplate = {
  sheets: [
    {
      name: 'Project data',
      data: [
        ['Project', ''],
        ['key', 'value'],
        ['', ''],
        ['GENERIC', ''],
        ['name', 'Las Delicias'],
        [
          'description',
          'The island of Colón in Bocas del Toro archipelago in Panama will see 100,000 native mangrove trees restore their wetlands. The project will span 20 years, producing 36,030 carbon credits.',
        ],
        ['startDate', '2022'],
        ['endDate', '2042'],
        ['localization', '9.3452, -82.2414'],
        ['Country', 'Panama'],
        ['Company', 'Sanofi'],
        ['projectDevelopper', 'Fundacion Naturaleza Panama'],
        ['Certifier', 'ERS'],
        ['Risk Analysis', 'A'],
        ['', ''],
        ['FINANCE', ''],
        ['origin', 'FORWARD_FINANCE'],
        ['fundingAmount', '396330'],
        ['', ''],
        ['FIELD', ''],
        ['Project type', 'Mangrove'],
        ['Project Category', 'RESTORATION'],
        ['color', 'GREEN'],
        ['Project Area (ha)', '180'],
        ['Protected Forest', '0'],
        ['Audit Start Date', '2023'],
        ['Audit Frequency', '1Y'],
        ['protectedSpecies', '132'],
        ['SDGs', '8;13;14;15'],
        ['Rating', 'A'],
        ['', ''],
        ['TECH', ''],
        ['slug', 'mangrove-regeneration-las-delicias-panama'],
        ['Project status', 'Active'],
        ['Img (PNG)', ''],
        ['Collection Img (PNG)', ''],
        ['Impact Report Link', 'https://carbonable.sextan.app/public/report/project/zulohdpr516dah162'],
      ],
    },
    {
      name: 'Reference',
      data: [
        ['Field', 'Expected value / note'],
        ['Company', 'Existing company name or ID from the platform'],
        ['Country', 'Country name (e.g. Panama)'],
        ['projectDevelopper', 'Existing project developer name or ID'],
        ['Certifier', 'Existing certifier name or ID'],
        ['Project Category', 'Backend enum, e.g. RESTORATION'],
        ['origin', 'Backend enum, e.g. FORWARD_FINANCE'],
        ['color', 'Backend enum, e.g. GREEN'],
        ['SDGs', 'Semicolon-separated values, e.g. 8;13;14;15'],
        ['slug', 'Optional. If empty, a slug is generated from the project name'],
      ],
    },
  ],
};

const BUSINESS_UNITS_TEMPLATE: WorkbookTemplate = {
  sheets: [
    {
      name: 'Business Units',
      data: [
        ['business_unit_name', 'description', 'company', 'default_emission', 'target', 'debt'],
        ['Genzyme', 'Global BU focused on specialty care', 'Sanofi', '850000000', '30', '0'],
        ['Medley', 'Regional BU in Latin America', 'Sanofi', '240000000', '25', '0'],
      ],
    },
  ],
};

const EMISSION_ESTIMATES_TEMPLATE: WorkbookTemplate = {
  sheets: [
    {
      name: 'Emission Estimates',
      data: [
        ['business_unit_name', 'year', 'emissions_in_grams', 'target'],
        ['Genzyme', '2026', '850000000', '30'],
        ['Genzyme', '2027', '790000000', '35'],
        ['Medley', '2026', '240000000', '20'],
        ['Medley', '2027', '225000000', '25'],
      ],
    },
  ],
};

const WORKBOOK_TEMPLATES: Record<TemplateKey, WorkbookTemplate> = {
  projects: PROJECT_TEMPLATE,
  'business-units': BUSINESS_UNITS_TEMPLATE,
  'emission-estimates': EMISSION_ESTIMATES_TEMPLATE,
};

export function downloadTemplate(key: TemplateKey): void {
  const definition = WORKBOOK_TEMPLATES[key];
  const templateMeta = adminUploadTemplates.find((template) => template.key === key);

  if (!definition || !templateMeta) {
    console.error(`No template found for key: ${key}`);
    return;
  }

  const workbook = XLSX.utils.book_new();

  for (const sheet of definition.sheets) {
    const worksheet = XLSX.utils.aoa_to_sheet(sheet.data);
    const colCount = Math.max(...sheet.data.map((row) => row.length));
    worksheet['!cols'] = Array.from({ length: colCount }, (_, index) => {
      const width = Math.max(
        ...sheet.data.map((row) => String(row[index] ?? '').length),
        14,
      );
      return { wch: Math.min(width + 2, 42) };
    });

    XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name);
  }

  XLSX.writeFile(workbook, templateMeta.templateFileName);
}
