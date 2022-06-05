declare interface MemoDayData {
  desc: string;
}

declare type DaysDataMap = Record<number, MemoDayData>;

declare interface DaysData {
  memoDaysMap: DaysDataMap;
}
