import { BookData } from "./commands/book/types";
import { WordleData } from "./commands/wordle/types";

export interface CommandDataMap {
  book: BookData;
  wordle: WordleData
}
