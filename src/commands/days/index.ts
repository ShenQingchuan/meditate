import {Command, Flags} from '@oclif/core'
import chalk from 'chalk'
import {keyIn} from 'readline-sync'
import {isEmpty} from 'underscore'
import {loadCommandData, parseDate, setCommandData} from '../../utils'

const fieldConnector = '  '
const headerTitle = 'Meditate Days'
const timestampToDateDisplayString = (timestamp: string) => new Date(Number(timestamp)).toLocaleDateString()

export default class Days extends Command {
  static description = `Memorize your important days.
  Input date format could be any valid connector: dot(.)、slash(/) and dash(-)`

  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> -n 2022.2.1 -d "Spring Festival"',
  ]

  static flags = {
    // create a new memorize day (-n, --new)
    new: Flags.string({char: 'n', description: 'create a new memorize day'}),
    // description of a memo date
    desc: Flags.string({char: 'd', description: 'description of a memo date', dependsOn: ['new']}),
  }

  static args = [{name: 'date'}]

  private isAppRunning = true;
  private memoDaysMap: DaysDataMap = {};
  private selectedFieldIndex = 0;

  private initData = (): DaysDataMap => {
    return {}
  };

  private showDaysListView(): boolean {
    if (Object.entries(this.memoDaysMap).length === 0) {
      console.log('⚠️ There\'re not any memorized day here.')
      return false
    }

    console.clear()
    // print header
    const tableHeaderDate = 'Date'
    const tabelHeaderDesc = 'Description'
    let maxKeyLength = tableHeaderDate.length
    let maxDescLength = tabelHeaderDesc.length
    for (const [key, value] of Object.entries(this.memoDaysMap)) {
      const dateDisplayString = timestampToDateDisplayString(key)
      if (dateDisplayString.length > maxKeyLength) {
        maxKeyLength = dateDisplayString.length
      }

      if (value.desc.length > maxDescLength) {
        maxDescLength = value.desc.length
      }
    }

    const fieldLength = maxKeyLength + fieldConnector.length + maxDescLength
    const padLength = Math.floor((fieldLength - headerTitle.length) / 2)
    const padBlank = Array.from({length: padLength}).fill(' ').join('')
    const tableHeader = tableHeaderDate.padEnd(maxKeyLength, ' ') + fieldConnector + tabelHeaderDesc.padEnd(maxDescLength, ' ')
    const helpTipString = chalk.green('(J)-Next (K)-Previous')
    console.log(chalk.bgCyan.black.bold(padBlank + headerTitle + padBlank) + '\n' + helpTipString + '\n')
    console.log(chalk.bold(tableHeader))

    // build field strings
    const displayStrings: string[] = []
    const sortedMemoDates = Object.entries(this.memoDaysMap).sort(([keyA], [keyB]) => {
      return Number(keyA) - Number(keyB)
    })
    for (const [i, [key, value]] of sortedMemoDates.entries()) {
      const keyFieldStr = timestampToDateDisplayString(key).padEnd(maxKeyLength, ' ')
      const valueFieldStr = value.desc.padEnd(maxDescLength, ' ')
      let fieldStr = keyFieldStr + fieldConnector + valueFieldStr
      if (i === this.selectedFieldIndex) {
        fieldStr = chalk.yellow(fieldStr)
      }

      displayStrings.push(fieldStr)
    }

    for (const fieldStr of displayStrings) {
      console.log(fieldStr)
    }

    return true
  }

  private handleFlags(flags: any): void {
    if (flags.new) {
      const [date, desc] = [flags.new, flags.desc]
      const parseDateResult = parseDate(date)
      if (parseDateResult) {
        const [dateObj] = parseDateResult
        this.memoDaysMap[dateObj.getTime()] = {desc: desc ?? ''} // timestamp as key
      }
    }
  }

  private saveMemoDaysMap(): void {
    setCommandData('days', {
      memoDaysMap: this.memoDaysMap,
    })
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(Days)

    // load days data
    const {memoDaysMap} = loadCommandData('days', this.initData)
    this.memoDaysMap = memoDaysMap ?? {}

    if (isEmpty(flags)) {
      // no flags, go to list display view
      do {
        if (!this.showDaysListView()) return

        const opKey = keyIn('', {limit: 'qjk'})
        switch (opKey) {
        case 'q':
          console.clear()
          return

        case 'j':
          if (this.selectedFieldIndex < Object.entries(this.memoDaysMap).length) {
            this.selectedFieldIndex += 1
          }

          break

        case 'k':
          if (this.selectedFieldIndex > 0) {
            this.selectedFieldIndex -= 1
          }

          break
        }
      } while (this.isAppRunning)
    } else {
      this.handleFlags(flags)

      this.saveMemoDaysMap()
    }
  }
}
