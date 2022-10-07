import {Command, Flags} from '@oclif/core'
import chalk from 'chalk'
import {isEmpty} from 'underscore'
import {loadCommandData, setCommandData} from '../../utils'

export default class BookAlias extends Command {
  static description = 'Set an alias for your book';
  static args = [
    {name: 'aliasName'},
    {name: 'aliasPath'},
  ];

  static flags = {
    list: Flags.boolean({
      char: 'l',
      description: 'list all aliases',
    }),
  }

  listView(alias: CommandDataMap['book']['alias']): void {
    if (isEmpty(alias)) {
      this.log('No alias found.')
    } else {
      this.log(`\n${chalk.bold.bgYellow('  Book aliases list  ')}\n`)
      for (const name of Object.keys(alias)) {
        this.log(`  ${chalk.bold.green(name)} -> ${chalk.blue(alias[name])}`)
      }

      this.log('\n')
    }
  }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(BookAlias)
    const {aliasName, aliasPath} = args

    const bookData = loadCommandData('book')
    if (!bookData.alias) {
      bookData.alias = {}
    }

    const {alias} = bookData

    if (flags.list) {
      return this.listView(alias)
    }

    // Set alias
    if (!aliasName) {
      this.error('Please specify an alias name')
    } else if (!aliasPath) {
      this.error('Please specify a path to the book')
    }

    alias[aliasName] = aliasPath
    setCommandData('book', bookData)

    this.log(chalk.green(`\n🎉 Successfully alias ${aliasName} set to ${aliasPath}\n`))
  }
}
