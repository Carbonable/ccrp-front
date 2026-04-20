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
      'Upload your project information using an easy-to-follow template that matches your onboarding file.',
    acceptedFormats: '.xlsx, .csv',
    uploadCta: 'Upload Projects',
    templateFileName: 'projects-template.xlsx',
  },
  {
    key: 'business-units',
    uploadType: BUSINESS_UNITS,
    title: 'Business Units',
    description:
      'Import the business units you want to track and manage across your dashboard and reports.',
    acceptedFormats: '.xlsx, .csv',
    uploadCta: 'Upload Business Units',
    templateFileName: 'business-units-template.xlsx',
  },
  {
    key: 'emission-estimates',
    uploadType: EMISSION_ESTIMATES,
    title: 'Emission Estimates',
    description:
      'Upload an annual emissions calendar by business unit to understand your baseline and plan your net-zero goals.',
    acceptedFormats: '.xlsx, .csv',
    uploadCta: 'Upload Emission Estimates',
    templateFileName: 'emission-estimates-template.xlsx',
  },
];
