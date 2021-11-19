export interface BookReadHistory {
  total: number;
  progress: [number, number];
}
export interface BookConfig {
  pageLines: number; // how many lines per page
  history: Record<string, BookReadHistory>;
}
