import { Command, flags } from "@oclif/command";
import chalk from "chalk";
import dayjs, { Dayjs } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { keyIn, question } from "readline-sync";
import { json } from "stream/consumers";
import {
  allWords,
  answers,
  HistoryKeyDayFormat,
  HistoryCalendarViewKeyTips,
  narrowViewWarn,
  validWordleGuessRegExp,
  WordleFlag,
  flagToColor,
} from "../../constants";
import { loadCommandData, setCommandData } from "../../utils";
import { Calterm } from "../../utils/calterm";

dayjs.extend(relativeTime);

const printAlreadyPassedInfo = (next: Dayjs) => {
  console.log(
    `\n🎉 ${chalk.green("You've already passed today!")}\n` +
      "next wordle will be posted " +
      chalk.yellow(next.fromNow()) +
      " later.\n"
  );
};
const getWordOfTheDay = () => {
  const now = new Date();
  const start = new Date(2022, 0, 0);
  const diff = Number(now) - Number(start);
  let day = Math.floor(diff / (1000 * 60 * 60 * 24));
  while (day > answers.length) {
    day -= answers.length;
  }
  return answers[day];
};
const computeWordleFlags = (input: string, answer: string) => {
  const charFoundCount: Record<string, number> = {};
  Array.from(answer).forEach((char) => {
    const foundCount = charFoundCount[char];
    charFoundCount[char] = foundCount ? foundCount + 1 : 1;
  });

  const result = Array.from(input).map<WordleChar>((char) => {
    return {
      char,
      flag: WordleFlag.ABSENT,
    };
  });

  // mark up all correct
  result.forEach((wc, i) => {
    if (wc.char === answer[i]) {
      wc.flag = WordleFlag.CORRECT;
      charFoundCount[wc.char] -= 1;
    }
  });

  // mark up all present
  result.forEach((wc) => {
    if (
      wc.flag !== WordleFlag.CORRECT &&
      answer.includes(wc.char) &&
      charFoundCount[wc.char] > 0
    ) {
      wc.flag = WordleFlag.PRESENT;
    }
  });

  return result;
};
const printEvaluationsView = (
  evaluations: (WordleChar[] | null)[],
  title = "  WORDLE  "
) => {
  console.clear();
  console.log(chalk.white.bold.bgGray(`     ${title}    \n`));
  evaluations.forEach((line) => {
    const lineString =
      line
        ?.map((item) => flagToColor[item.flag](` ${item.char.trim() || "□"} `))
        .join(" ") ?? Array.from({ length: 5 }, () => ` □ `).join(" ");
    console.log(lineString + "\n");
  });
};
const isAfterThisMonth = (base: Dayjs, next: Dayjs) =>
  next.isAfter(base.startOf("month").add(1, "month"));
const isBeforeThisMonth = (base: Dayjs, next: Dayjs) =>
  next.isBefore(base.startOf("month"));
const handleHistoryViewCursorMove: Record<
  "j" | "k" | "h" | "l",
  (day: Dayjs) => Dayjs | void
> = {
  j: (base: Dayjs) => {
    const next = base.add(7, "days");
    if (!isAfterThisMonth(base, next)) {
      return next;
    }
  },
  k: (base: Dayjs) => {
    const next = base.subtract(7, "days");
    if (!isBeforeThisMonth(base, next)) {
      return next;
    }
  },
  h: (base: Dayjs) => {
    const next = base.subtract(1, "day");
    if (!isBeforeThisMonth(base, next)) {
      return next;
    }
  },
  l: (base: Dayjs) => {
    const next = base.add(1, "day");
    if (!isAfterThisMonth(base, next)) {
      return next;
    }
  },
};

/** ### What is Wordle ?
 * https://www.powerlanguage.co.uk/wordle/
 *
 * It's an interesting and popular word guessing game.
 * Rule:
 *   - You're supposed to figure out a word which's length is 5
 *   - You can try 6 times
 *     Each time you could get a judge information for every character:
 *     - Green: absolutely right position
 *     - Yellow: it's actually included in the answer but not this position
 *     - Gray: totally wrong, it's not included in the answer
 *
 * Every day, we generate a new word dictionary which contains 100 words,
 * all of them are 5-letter words.
 */
export default class Wordle extends Command {
  static description = "an interesting word guessing game.";
  static flags = {
    // print the current player's historical record
    history: flags.boolean({
      char: "h",
      description: "print current month's game record",
    }),
  };
  static args = [];

  evaluations: (WordleChar[] | null)[] = Array.from({ length: 6 }, () => null);

  initData(): WordleData {
    return {
      history: [],
    };
  }

  zipEvaluations() {
    return this.evaluations.map(
      (line) =>
        line?.map((item) => `${item.char}${item.flag}`).join(",") ?? null
    );
  }

  openHistoryView(wordleData: WordleData) {
    // handle operations for toggle rendering history evaluations record
    // - calendar view: when displaying the calendar
    // - evaluations view: when displaying the evaluations of one day
    this.delegateCalendarView(wordleData);
  }

  deserializeEvaluations(wordleData: WordleData) {
    return new Map(
      wordleData.history.map(([key, val]) => [key, this.unzipEvaluations(val)])
    );
  }

  delegateCalendarView(wordleData: WordleData) {
    console.clear();
    const currentMonthCalterm = new Calterm();
    let selectDay = dayjs(); // default to today

    while (true) {
      console.log(chalk.white.bold.bgGray("   WORDLE MONTHLY   "));
      currentMonthCalterm.print((str, day) => {
        const deserializedEvaluationsMap =
          this.deserializeEvaluations(wordleData);
        const isPassed = deserializedEvaluationsMap.has(
          day.format(HistoryKeyDayFormat)
        );
        if (isPassed) {
          str = chalk.bold.green(str);
        }
        if (day.isSame(selectDay, "day")) {
          str = chalk.bgGray(str);
        }

        return str;
      });

      console.log(chalk.yellow(HistoryCalendarViewKeyTips));
      const calendarViewKeyIn = keyIn("", { limit: "jkhloq" });
      console.clear();
      switch (calendarViewKeyIn) {
        case "q":
          this.exit();
        case "j":
        case "k":
        case "h":
        case "l":
          const nextSelect =
            handleHistoryViewCursorMove[calendarViewKeyIn](selectDay);
          if (nextSelect) {
            selectDay = nextSelect;
          }
          break;
        case "o":
          this.delegateEvaluationsView(wordleData, selectDay);
      }
    }
  }

  delegateEvaluationsView(wordleData: WordleData, selectDay: Dayjs) {
    const deserializedEvaluationsMap = this.deserializeEvaluations(wordleData);
    const evaluations = deserializedEvaluationsMap.get(
      selectDay.format(HistoryKeyDayFormat)
    );
    if (evaluations) {
      console.clear();
      printEvaluationsView(evaluations, selectDay.format(HistoryKeyDayFormat));
      console.log(chalk.yellow("[q] - go back to calendar view"));
      keyIn("", { limit: "q" });
      console.clear();
    }
  }

  saveEvaluations(wordleData: WordleData) {
    const { history } = wordleData;
    const today = dayjs();
    history.push([today.format(HistoryKeyDayFormat), this.zipEvaluations()]);
    setCommandData("wordle", {
      lastPassDate: today.valueOf(),
      history,
      lastEvaluations: this.zipEvaluations(),
    });
  }

  openGameView(wordleData: WordleData) {
    const answer = getWordOfTheDay();
    let round = 0;

    while (round < 6) {
      // waiting for user sinput
      let input = "",
        isInputValid = false,
        alertMsg = process.stdout.rows < 16 ? narrowViewWarn : "";

      do {
        printEvaluationsView(this.evaluations);
        input = question(chalk.cyan(`${alertMsg}\ninput your answer: `));
        if (!validWordleGuessRegExp.test(input)) {
          alertMsg = chalk.redBright(
            "Answer is supposed to contain 5 letters only"
          );
        } else if (!allWords.includes(input)) {
          alertMsg = chalk.redBright("Not in the word list.");
        } else if (input.length < 5) {
          alertMsg = chalk.redBright("Answer words contains 5 letters");
        } else {
          break;
        }
      } while (!isInputValid);

      this.evaluations[round] = computeWordleFlags(input, answer);
      if (input !== answer) {
        round++;
      } else {
        printEvaluationsView(this.evaluations);
        console.log(chalk.green("🎉 Congratulations!\n"));
        this.saveEvaluations(wordleData);
        this.exit();
      }
    }
    printEvaluationsView(this.evaluations); // after `round` is assigned to 6
    console.log(chalk.green("🤔 Maybe try again?\n"));
  }

  unzipEvaluations(last: (string | null)[]) {
    return last.map((line) => {
      return (
        line?.split(",").map<WordleChar>((item) => {
          // item: {char}{flag}
          const [char, flag] = item;
          return {
            char,
            flag: flag as WordleFlag,
          };
        }) ?? null
      );
    });
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(Wordle);

    // load wordle game data
    const wordleData = loadCommandData("wordle", this.initData);

    if (flags.history) {
      this.openHistoryView(wordleData);
    } else {
      const { lastPassDate } = wordleData;
      const now = dayjs(),
        next = dayjs().add(1, "day").hour(0).minute(0).second(0);

      // if player has already passed today
      const passed = lastPassDate && now.isSame(lastPassDate, "day");
      if (passed) {
        if (wordleData.lastEvaluations) {
          this.evaluations = this.unzipEvaluations(wordleData.lastEvaluations);
          printEvaluationsView(this.evaluations);
          printAlreadyPassedInfo(next);
        }
        this.exit();
      }

      // if it's a new daily game
      const isNewDaily = !lastPassDate || now.isAfter(lastPassDate);
      if (isNewDaily) {
        this.openGameView(wordleData);
      }
    }
  }
}
