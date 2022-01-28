export interface WordleChar {
  char: string;
  flag: import('../../constants').WordleFlag;
}
export interface WordleData {
  lastPassDate?: number;
  lastEvaluations?: WordleChar[][];
  history: number[];
}
