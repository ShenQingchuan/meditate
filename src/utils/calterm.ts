import textTable from "text-table";
import dayjs, { Dayjs } from "dayjs";
import _ from "underscore";
import chalk from "chalk";

export class Calterm {
  private dayjs = dayjs();
  static daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  getNowDate = () => this.dayjs.date();
  getMonth = () => this.dayjs.format("MMMM");
  setMonth = (month: number) => this.dayjs.month(month - 1);

  getYear = () => this.dayjs.year();
  setYear = (year: number) => this.dayjs.year(year);

  getDaysInMonth = () => this.dayjs.daysInMonth();
  getDaysOfWeekByMonth = () =>
    Array.from({ length: this.getDaysInMonth() }, (_, i) =>
      this.dayjs.startOf("month").add(i, "days").format("dddd")
    );
  getFirstDayOfMonth = () => this.getDaysOfWeekByMonth()[0];

  public print = (customizeDay?: (str: string, day: Dayjs) => string) => {
    const daysAbbr = Calterm.daysOfWeek.map((d) => d.substring(0, 2)),
      blank = [];
    let header = `${this.getMonth()} ${this.getYear()}`;
    for (let i = 0; i < Math.floor((20 - header.length) / 2); i++) {
      blank.push(" ");
    }
    header = textTable([blank.concat([header])], { hsep: "" });

    const firstDay = this.getFirstDayOfMonth().substring(0, 2),
      grid = [],
      today = parseInt(this.dayjs.format("D"), 10);

    for (let day = 1; day <= this.getDaysInMonth(); day++) {
      let item = `${day}`.padStart(2, " ");
      if (day === today) {
        item = chalk.red(item);
      }
      if (customizeDay) {
        item = customizeDay(
          item,
          // pass in the `day`'s corresponding Dayjs structure model
          this.dayjs.startOf("month").add(day - 1, "days")
        );
      }
      grid.push(item);
    }

    const startDay = daysAbbr.findIndex((d) => d === firstDay);
    for (let i = 0; i < startDay; i++) {
      grid.unshift(" ");
    }

    const weeks = _.chain(grid)
      .groupBy((_, i) => Math.floor(i / 7))
      .toArray()
      .value();
    const calendar = textTable([daysAbbr].concat(weeks), {
      hsep: " ",
      align: Array.from({ length: 7 }, () => "r"),
      // Colors adds encoding to the string which screws up the table,
      // here we are checking if the day has encoding
      stringLength: (str) => (str.length >= 11 ? 2 : str.length),
    });

    console.log(chalk.cyan(header));
    console.log(calendar);
  };
}
