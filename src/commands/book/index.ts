import ora from "ora";
import chalk from "chalk";
import { Command, flags } from "@oclif/command";
import { keyIn } from "readline-sync";
import {
  wrapByTerminalWidth,
  loadCommandData,
  setCommandData,
  terminalStringWidth,
} from "../../utils";
import { emptyLineRegExp } from "../../constants";
import { BookData } from "./types";
import * as path from "path";
import * as fs from "fs";

function pageMoveForward(
  start: number,
  end: number,
  step: number,
  edge: number
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
  step: number
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
  const spaces = Array.from({ length: needMoreSpace }, () => " ").join("");
  return chalk.cyanBright(`${spaces}${n} |`);
}

interface BookContext {
  allLinesCount: number;
  filepath: string;
  bookName: string;
}
export default class Book extends Command {
  static description = "Read a novel, enjoy a story...";
  contents: string[] = [];
  ctx: BookContext = {} as any; // lateinit
  static flags = {
    help: flags.help({
      char: "h",
      description: "help information for book reading command.",
    }),
    restart: flags.boolean({
      char: 'r',
      description: "restart reading progress of a given book.",
    }),
    search: flags.string({
      char: "s",
      description: "open searching view to locate given words.",
    }),
    jump: flags.integer({
      char: "j",
      description: "assign a position to start reading.",
    }),
  };
  static args = [{ name: "filepath" }];

  initData = (): BookData => {
    return {
      history: {},
    };
  };

  openReadView(bookData: BookData, flags: any, assignStart?: number) {
    const { filepath, bookName } = this.ctx;
    const allLinesCount = this.contents.length; // get line count for text, preparing for reading progress statistics
    let inReadingMode = true;
    let pageSize = process.stdout.rows - 2; // remain 2 lines for progress bar and others
    let sliceStart = 0,
      sliceEnd = sliceStart + pageSize;

    // load progress history
    const readHistory = filepath ? bookData?.history[filepath] : undefined;
    if (readHistory && !flags.restart) {
      [sliceStart, sliceEnd] = readHistory.progress;
      // if the step of start & end from history is less than now page size,
      // need to make correction, keep start, recompute end.
      if (sliceEnd - sliceStart !== pageSize) {
        sliceEnd = sliceStart + pageSize;
      }
    }

    if (!assignStart) {
      assignStart = flags.jump;
    }
    if (assignStart) {
      // using assigned start position
      [sliceStart, sliceEnd] = [assignStart, assignStart + pageSize];
    }
    if (sliceEnd > allLinesCount) {
      // avoid overflow
      sliceEnd = allLinesCount;
    }
    if (sliceEnd - sliceStart !== pageSize) {
      // fix slice range
      sliceEnd = sliceStart + pageSize;
    }

    const saveProgress = () => {
      bookData.history[filepath] = {
        total: allLinesCount,
        progress: [sliceStart, sliceEnd],
      };

      setCommandData("book", {
        ...bookData,
      });
    }

    do {
      // clear screen before printing lines from book content
      console.clear();

      const progressText = chalk.bold.yellow(`[${sliceEnd}/${allLinesCount}]`);
      const percentageText = chalk.bold.cyan(
        `${((sliceEnd / allLinesCount!) * 100).toFixed(2)}%`
      );
      console.log(`${bookName} ${progressText} - ${percentageText}`);

      const contentSlice = this.contents.slice(sliceStart, sliceEnd);
      contentSlice.forEach((line, i) => {
        console.log(
          `${getLineNumberText(sliceStart + 1 + i, allLinesCount!)}  ${line}`
        );
      });

      const opKey = keyIn("", { hideEchoBack: true, mask: "", limit: "qjk" });
      switch (opKey) {
        case "q":
          saveProgress();
          console.clear();
          return;
        case "j":
          [sliceStart, sliceEnd] = pageMoveForward(
            sliceStart,
            sliceEnd,
            pageSize,
            allLinesCount
          );
          if (sliceStart === allLinesCount) {
            console.clear();
            console.log(`🎉 You've finished reading the book!`);
            saveProgress();
            return;
          }
          break;
        case "k":
          [sliceStart, sliceEnd] = pageMoveBackward(
            sliceStart,
            sliceEnd,
            pageSize
          );
          if (sliceEnd === 0) {
            return;
          }
          break;
      }
    } while (inReadingMode);
  }

  openSearchView(bookData: BookData, search: string) {
    console.clear();
    const slices: [number, string][][] = [];
    this.contents.forEach((line, i) => {
      // got all search results lines(with its relative +2/-2 lines)
      if (line.includes(search)) {
        const pickSlice = this.contents.slice(i - 2, i + 3);
        const fiveLines: [number, string][] = [];
        let sliceStartLineIndex = i - 2;
        for (let c = 0; c < 5; c++) {
          let pickLine = pickSlice[c];
          // highlight search words and the found line
          if (c === 2) {
            const searchIndex = pickLine.indexOf(search);
            pickLine = chalk.bgGray.bold(
              pickLine.slice(0, searchIndex),
              chalk.bgYellowBright.redBright(search),
              pickLine.slice(searchIndex + search.length)
            );
          }
          fiveLines.push([sliceStartLineIndex, pickLine]);
          sliceStartLineIndex++;
        }
        slices.push(fiveLines);
      }
    });

    if (slices.length === 0) {
      console.log(`❎ Searching keyword "${search}" not found!`);
      return;
    }

    let inSearchingMode = true;
    let showSearchResultIndex = 0;
    do {
      console.clear();
      const searchTip = [
        chalk.bold.yellow(`Searching: ${search}`),
        chalk.cyan(`${showSearchResultIndex + 1} / ${slices.length} results`),
      ].join(" - ");
      console.log(searchTip);

      const currentSlice = slices[showSearchResultIndex];
      currentSlice.forEach(([lineIndex, line]) => {
        const lineNumberText = chalk.cyanBright(`${lineIndex} |`);
        console.log(`${lineNumberText}  ${line}`);
      });

      const opKey = keyIn("", { hideEchoBack: true, mask: "", limit: "oqjk" });
      switch (opKey) {
        case "j":
          showSearchResultIndex += 1;
          if (showSearchResultIndex === slices.length) {
            showSearchResultIndex = 0;
          }
          break;
        case "k":
          showSearchResultIndex -= 1;
          if (showSearchResultIndex < 0) {
            showSearchResultIndex = slices.length - 1;
          }
          break;
        case "o":
          inSearchingMode = false;
          break;
        case "q":
          console.clear();
          return;
      }
    } while (inSearchingMode);

    this.openReadView(bookData, flags, slices[showSearchResultIndex][2][0]);
  }

  preLineWrap() {
    const maxLineCountLength = String(this.contents.length).length;
    const maxColumns = process.stdout.columns;
    const contentMaxLength = maxColumns - (maxLineCountLength + 4); // 4 = space + vertical line + 2 space

    for (let i = 0; i < this.contents.length; i++) {
      const line = this.contents[i];
      const width = terminalStringWidth(line);
      if (width > contentMaxLength) {
        const cutSlice = wrapByTerminalWidth(
          line,
          Math.round(contentMaxLength * 0.8)
        );
        this.contents.splice(i, 1, ...cutSlice);
      }
    }
  }

  async run() {
    const { flags, args } = this.parse(Book);

    // load book command data
    const bookData = loadCommandData("book", this.initData);

    try {
      let filepath: string = args.filepath;
      if (!filepath) {
        return;
      }
      if (args.filepath.startsWith(".")) {
        filepath = path.resolve(__dirname, filepath);
      }
      const loading = ora(`Opening file ${filepath} ...\n`).start();
      const bookBuffer = fs.readFileSync(filepath, "utf-8");
      this.contents = bookBuffer.split(/\r?\n/).filter((line) => {
        return !emptyLineRegExp.test(line.trim());
      }); // load all lines contents in memory
      this.ctx.filepath = filepath;

      // pre line wrap contents
      this.preLineWrap();

      let bookName = filepath.split("/").pop() || 'Unknown book';
      this.ctx.bookName = bookName;
      if (bookName?.endsWith(".txt")) {
        bookName = bookName.slice(0, bookName.length - 4);
      }
      loading.succeed();

      // if search some text in novel:
      if (flags.search) {
        this.openSearchView(bookData, flags.search);
      } else {
        this.openReadView(bookData, flags);
      }
    } catch (err) {
      console.clear();
      this.error(`${chalk.red('Panicked during reading book:')} ${
        (err as Error).stack || err
      }`);
    }
  }
}
