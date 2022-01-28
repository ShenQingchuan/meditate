import { Command, flags } from "@oclif/command";
import chalk from "chalk";
import dayjs, { Dayjs } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { question } from "readline-sync";
import { allWords, answers, narrowViewWarn, WordleFlag } from "../../constants";
import { loadCommandData, setCommandData } from "../../utils";
import { WordleChar, WordleData } from "./types";

dayjs.extend(relativeTime);

const printAlreadyPassedInfo = (next: Dayjs) => {
  console.log(
    `\n🎉 ${chalk.green("You've already passed today!")}\n` +
      "next wordle will be posted at " +
      next.fromNow() +
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
const creactEvaluations = () =>
  Array.from({ length: 6 }, () =>
    Array.from({ length: 5 }, () => ({ char: "", flag: WordleFlag.NONE }))
  );

const computeWordleFlags = (input: string, answer: string) =>
  input.split("").map<WordleChar>((char, i) => {
    // input and answer are all 5 letters
    const correctChar = answer[i];
    const flag =
      char === correctChar
        ? WordleFlag.RIGHT
        : answer.includes(char)
        ? WordleFlag.MISPOSITION
        : WordleFlag.WRONG;
    return {
      char,
      flag,
    };
  });
const flagToColor = {
  [WordleFlag.NONE]: (s: string) => s,
  [WordleFlag.RIGHT]: chalk.black.bold.bgGreen,
  [WordleFlag.MISPOSITION]: chalk.black.bold.bgYellow,
  [WordleFlag.WRONG]: chalk.black.bold.bgWhite,
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
    history: flags.string({
      char: "h",
      description: "print the current player's historical record",
    }),
  };
  static args = [];

  evaluations: WordleChar[][] = creactEvaluations();

  initData(): WordleData {
    return {
      history: [],
    };
  }

  openHistoryView(wordleData: WordleData) {
    // todo...
  }

  printResultView() {
    console.clear();
    console.log(chalk.yellow.bgGray("       WORDLE      \n"));
    this.evaluations.forEach((line) => {
      const lineString = line
        .map((item) => flagToColor[item.flag](` ${item.char || "□"} `))
        .join(" ");
      console.log(lineString + "\n");
    });
  }

  saveEvaluations(wordleData: WordleData) {
    const { history } = wordleData;
    const today = new Date();
    history.push(today.getTime());
    setCommandData("wordle", {
      lastPassDate: today.getTime(),
      history,
      lastEvaluations: this.evaluations,
    });
  }

  openGameView(wordleData: WordleData) {
    const answer = getWordOfTheDay();
    let round = 0;

    while (round <= 6) {
      // waiting for user sinput
      let input = "",
        isInputValid = false,
        alertMsg = process.stdout.rows < 16 ? narrowViewWarn : "";

      do {
        this.printResultView();
        input = question(chalk.cyan(`${alertMsg}\ninput your answer: `));
        if (!allWords.includes(input)) {
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
        this.printResultView();
        console.log(chalk.green("🎉 Congratulations!\n"));
        this.saveEvaluations(wordleData);
        this.exit();
      }
    }
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
        this.evaluations = wordleData.lastEvaluations!;
        this.printResultView();
        printAlreadyPassedInfo(next);
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
