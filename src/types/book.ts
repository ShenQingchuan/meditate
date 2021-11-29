export interface BookReadHistory {
  total: number;
  progress: [number, number];
}
export interface BookConfig {
  pageSize: number; // how many lines per page
  lineSize: number; // how many chars per line
  history: Record<string, BookReadHistory>;
  preCutted: boolean;
}
