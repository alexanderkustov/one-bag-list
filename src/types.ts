export interface ChecklistItem {
  id: string;
  name: string;
  category: 'flight' | 'clothing' | 'electronics' | 'toiletries' | 'documents';
  details?: string;
  isPacked: boolean;
  weightGrams?: number;
}

export type ExportTheme = 'bw-light' | 'bw-dark';
export type ExportRatio = 'poster' | 'story' | 'square';
