export interface BookReadHistory {
  total: number;
  progress: [number, number];
}
export interface BookConfig {
  history: Record<string, BookReadHistory>;
}
