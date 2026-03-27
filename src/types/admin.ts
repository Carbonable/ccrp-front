export const PROJECT = 'project';
export const BUSINESS_UNITS = 'business-units';
export const EMISSION_ESTIMATES = 'demands';

export type UploadType =
  | typeof PROJECT
  | typeof BUSINESS_UNITS
  | typeof EMISSION_ESTIMATES;

export type TemplateKey = 'projects' | 'business-units' | 'emission-estimates';

export interface AdminUploadTemplate {
  key: TemplateKey;
  uploadType: UploadType;
  title: string;
  description: string;
  acceptedFormats: string;
  uploadCta: string;
  templateFileName: string;
}

export const adminUploadTemplates: AdminUploadTemplate[] = [
  {
    key: 'projects',
    uploadType: PROJECT,
    title: 'Projects',
    description:
      'Import project metadata with a client-facing template aligned with the realistic onboarding spreadsheet.',
    acceptedFormats: '.xlsx, .csv',
    uploadCta: 'Upload Projects',
    templateFileName: 'projects-template.xlsx',
  },
  {
    key: 'business-units',
    uploadType: BUSINESS_UNITS,
    title: 'Business Units',
    description:
      'Import the business units that will be tracked across the dashboard and reporting flows.',
    acceptedFormats: '.xlsx, .csv',
    uploadCta: 'Upload Business Units',
    templateFileName: 'business-units-template.xlsx',
  },
  {
    key: 'emission-estimates',
    uploadType: EMISSION_ESTIMATES,
    title: 'Emission Estimates',
    description:
      'Import a yearly emissions calendar per business unit to feed baseline demand and net-zero planning.',
    acceptedFormats: '.xlsx, .csv',
    uploadCta: 'Upload Emission Estimates',
    templateFileName: 'emission-estimates-template.xlsx',
  },
];
