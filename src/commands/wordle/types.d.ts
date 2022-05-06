declare interface WordleChar {
  char: string;
  flag: import('../../constants').WordleFlag;
}
declare interface WordleData {
  lastPassDate?: number;
  lastEvaluations?: (string | null)[];
  history: [string, (string | null)[]][];
}
