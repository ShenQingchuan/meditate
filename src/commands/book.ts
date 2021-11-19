import ora from "ora";
import chalk from "chalk";
import { Command, flags } from "@oclif/command";
import { keyIn } from 'readline-sync';
import { loadCommandConfig, setCommandConfig } from "../utils";
import { BookConfig } from "../types/book";
import * as path from "path";
import * as fs from "fs";

function pageMoveForward(
  start: number,
  end: number,
  step: number,
  edge: number,
): [number, number] {
  let nextStart = start + step,
    nextEnd = end + step;
  if (nextStart > edge) {
    return [edge, edge];
  }
  if (nextEnd > edge) {
    nextEnd = edge;
  }
  return [nextStart, nextEnd];
}

function pageMoveBackward(
  start: number,
  end: number,
  step: number,
): [number, number] {
  let nextStart = start - step,
    nextEnd = end - step;
  if (nextEnd < 0) {
    return [0, 0];
  }
  if (nextStart < 0) {
    nextStart = 0;
  }
  return [nextStart, nextEnd];
}

function getLineNumberText(n: number, allCount: number) {
  const maxLength = String(allCount).length;
  const lineNumberLength = String(n).length;
  const needMoreSpace = maxLength - lineNumberLength;
  const spaces = Array.from({ length: needMoreSpace }, () => ' ').join('');
  return chalk.cyanBright(`${spaces}${n} |`);
}

export default class Book extends Command {
  static description = "Read a novel, enjoy a story...";

  static flags = {
    help: flags.help({ char: "h" }),
    restart: flags.boolean(),
  };

  static args = [{ name: "filepath" }];

  initConfig = (): BookConfig => {
    return {
      pageLines: 5,
      history: {},
    };
  };

  async run() {
    const { flags } = this.parse(Book);

    // load book command config
    const bookConfig = loadCommandConfig("book", this.initConfig);

    const { args } = this.parse(Book);
    let filepath: string = args.filepath;
    if (args.filepath.startsWith(".")) {
      filepath = path.resolve(__dirname, filepath);
    }
    const loading = ora(`Opening file：${filepath}`).start();

    const bookBuffer = fs.readFileSync(filepath, "utf-8");

    let contents = bookBuffer.split(/\r?\n/); // load all lines contents in memory
    let allLinesCount = contents.length; // get line count for text, preparing for reading progress statistics

    let bookName = filepath.split("/").pop();
    if (bookName?.endsWith('.txt')) {
      bookName = bookName.slice(0, bookName.length - 4);
    }
    loading.succeed();

    let inReadingMode = true;
    let sliceStart = 0, sliceEnd = sliceStart + bookConfig.pageLines;

    // load progress history
    const readHistory = bookConfig.history[filepath];
    if (readHistory && !flags.restart) {
      [sliceStart, sliceEnd] = readHistory.progress;
    }
    
    if (sliceEnd > allLinesCount) {
      sliceEnd = allLinesCount;
    }
    do {
      // print lines from book content
      console.clear();

      const progressText = chalk.bold.yellow(`[${sliceEnd}/${allLinesCount}]`);
      const percentageText = chalk.bold.cyan(`${((sliceEnd / allLinesCount) * 100).toFixed(2)}%`);
      console.log(`${bookName} ${progressText} - ${percentageText}`);

      const contentSlice = contents.slice(sliceStart, sliceEnd);
      contentSlice.forEach((line, i) => {
        console.log(`${getLineNumberText(sliceStart + 1 + i, allLinesCount)}  ${line}`);
      });

      const opKey = keyIn('', { hideEchoBack: true, mask: '', limit: 'qjk' });
      switch (opKey) {
        case 'q':
          bookConfig.history[filepath] = {
            total: allLinesCount,
            progress: [sliceStart, sliceEnd]
          }
          setCommandConfig('book', {
            ...bookConfig,
          })
          console.clear();
          this.exit();
        case 'j':
          [sliceStart, sliceEnd] = pageMoveForward(
            sliceStart,
            sliceEnd,
            bookConfig.pageLines,
            allLinesCount,
          );
          break;
        case 'k':
          [sliceStart, sliceEnd] = pageMoveBackward(
            sliceStart,
            sliceEnd,
            bookConfig.pageLines
          );
          break;
      }
    } while (inReadingMode);
  }
}
