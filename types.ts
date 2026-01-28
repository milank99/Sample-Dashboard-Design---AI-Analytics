export type UtilityType = 'AI' | 'Analytics' | 'Other';

export interface UtilityItem {
  name: string;
  description: string;
  url: string;
  type: UtilityType;
}

export interface CsvRow {
  Name: string;
  Description: string;
  Url: string;
  Type: string;
}
