import {Command, Flags} from '@oclif/core'
import {initMedHomeDir} from '../../utils'

export default class Init extends Command {
  static description = 'initialize meditate application data.';
  static flags = {
    help: Flags.help({char: 'h'}),
  };

  async run(): Promise<void> {
    initMedHomeDir()
  }
}
