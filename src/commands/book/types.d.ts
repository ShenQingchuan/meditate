declare interface BookReadHistory {
  total: number;
  progress: [number, number];
}
declare interface BookData {
  history: Record<string, BookReadHistory>;
  alias: Record<string, string>; // alias name -> book path
}
