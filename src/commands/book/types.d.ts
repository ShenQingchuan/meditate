export interface BookReadHistory {
  total: number;
  progress: [number, number];
}
export interface BookData {
  history: Record<string, BookReadHistory>;
}
