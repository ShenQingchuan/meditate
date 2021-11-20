export interface BookReadHistory {
  total: number;
  progress: [number, number];
}
export interface BookConfig {
  pageSize: number; // how many lines per page
  history: Record<string, BookReadHistory>;
}
