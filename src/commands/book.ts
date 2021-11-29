import ora from "ora";
import chalk from "chalk";
import { Command, flags } from "@oclif/command";
import { keyIn } from "readline-sync";
import { cutByLength, loadCommandConfig, setCommandConfig } from "../utils";
import { BookConfig } from "../types/book";
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
  bookConfig: BookConfig;
}
export default class Book extends Command {
  static description = "Read a novel, enjoy a story...";
  contents: string[] = [];
  ctx: Partial<BookContext> = {};

  static flags = {
    help: flags.help({ char: "h", description: "help information for book reading command." }),
    restart: flags.boolean({ description: "restart reading progress of a given book." }),
    pageSize: flags.integer({ char: "p", description: "lines count displaying per page." }),
    lineSize: flags.integer({ char: "l", default: 80, description: "chars count displaying per line." }),
    search: flags.string({ char: "s", description: "open searching view to locate given words." }),
    jump: flags.integer({ char: "j", description: "assign a position to start reading." }),
  };

  static args = [{ name: "filepath" }];

  initConfig = (): BookConfig => {
    return {
      pageSize: 5,
      lineSize: 80,
      history: {},
      preCutted: false,
    };
  };

  openReadView(flags: any, assignStart?: number) {
    const { bookConfig, filepath, bookName } = this.ctx;
    const allLinesCount = this.contents.length; // get line count for text, preparing for reading progress statistics

    let inReadingMode = true;
    const pageSize = flags.pageSize ?? bookConfig!.pageSize;
    let sliceStart = 0,
      sliceEnd = sliceStart + pageSize;

    // load progress history
    const readHistory = bookConfig?.history[filepath!];
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
    if (assignStart) { // using assigned start position
      [sliceStart, sliceEnd] = [assignStart, assignStart + pageSize];
    }
    if (sliceEnd > allLinesCount!) { // avoid overflow
      sliceEnd = allLinesCount;
    }
    if (sliceEnd - sliceStart !== pageSize) { // fix slice range
      sliceEnd = sliceStart + pageSize;
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
          bookConfig!.history[filepath!] = {
            total: allLinesCount!,
            progress: [sliceStart, sliceEnd],
          };
          if (flags.pageSize) {
            bookConfig!.pageSize = flags.pageSize;
          }
          if (flags.lineSize) {
            bookConfig!.lineSize = flags.lineSize;
          }

          setCommandConfig("book", {
            ...bookConfig!,
          });
          console.clear();
          return;
        case "j":
          [sliceStart, sliceEnd] = pageMoveForward(
            sliceStart,
            sliceEnd,
            pageSize,
            allLinesCount!
          );
          break;
        case "k":
          [sliceStart, sliceEnd] = pageMoveBackward(
            sliceStart,
            sliceEnd,
            pageSize
          );
          break;
      }
    } while (inReadingMode);
  }

  openSearchView(search: string) {
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

    this.openReadView(flags, slices[showSearchResultIndex][2][0]);
  }

  preLineWrap(flags: any) {
    for (let i = 0; i < this.contents.length; i++) {
      const line = this.contents[i];
      if (line.length > 80) {
        const cutSlice = cutByLength(line, flags.lineSize);
        this.contents[i] = cutSlice.join("\n");
      }
    }
    this.contents = this.contents.join("\n").split(/\r?\n/);
  }

  async run() {
    const { flags, args } = this.parse(Book);

    // load book command config
    this.ctx.bookConfig = loadCommandConfig("book", this.initConfig);

    try {
      let filepath: string = args.filepath;
      if (!filepath) {
        return;
      }
      if (args.filepath.startsWith(".")) {
        filepath = path.resolve(__dirname, filepath);
      }
      const loading = ora(`Opening file：${filepath}`).start();
      const bookBuffer = fs.readFileSync(filepath, "utf-8");
      this.contents = bookBuffer.split(/\r?\n/); // load all lines contents in memory
      this.ctx.filepath = filepath;

      // pre line wrap contents
      if (this.ctx.bookConfig) {
        this.preLineWrap(flags);
        this.ctx.bookConfig.preCutted = true;

        // async write wrapped contents back to source file
        fs.writeFile(filepath, this.contents.join("\n"), (error) => {
          if (error) {
            throw Error("pre line wrap failed !");
          }
        });
      }

      let bookName = filepath.split("/").pop();
      this.ctx.bookName = bookName;
      if (bookName?.endsWith(".txt")) {
        bookName = bookName.slice(0, bookName.length - 4);
      }
      loading.succeed();

      // if search some text in novel:
      if (flags.search) {
        this.openSearchView(flags.search);
      } else {
        this.openReadView(flags);
      }
    } catch (err) {
      this.error(`Error occured when opening book: ${err}`);
    }
  }
}
