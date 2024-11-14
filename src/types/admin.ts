export type FileType = string;

export const DEMAND= 'demands';
export const CURVE_POINTS = 'absorption-curve';
// Define an array of currently supported file types
export const supportedFileTypes: FileType[] = [
  'company',
  'certifier',
  'developper',
  'project',
  CURVE_POINTS,
  'business-units',
  DEMAND,
];


