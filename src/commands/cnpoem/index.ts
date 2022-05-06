import {Command} from '@oclif/core'
import {loadCommandData, setCommandData} from '../../utils'
import chalk from 'chalk'
import fetch from 'node-fetch'

export default class Cnpoem extends Command {
  static description = 'get one sentence of a Chinese poem';
  static flags = {};
  static args = [];

  private initData = (): CnpoemData => {
    return {
      token: '',
    }
  };

  private getToken = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      fetch('https://v2.jinrishici.com/token', {
        method: 'GET',
      })
      .then(res => res.json())
      .then(json => {
        resolve((json as TokenResponse).data)
      })
      .catch(error => {
        reject(error)
      })
    })
  };

  public async run(): Promise<void> {
    // load command data
    const cnpoemData = loadCommandData('cnpoem', this.initData)
    let token = ''
    if (cnpoemData.token === '') {
      try {
        this.log(`💡 ${chalk.blue("Initializing Jinrishici's token ...")}`)
        token = await this.getToken()
        cnpoemData.token = token
        this.log(`✔ ${chalk.green('Successfully got permanent token.')}`)
        setCommandData('cnpoem', {...cnpoemData})
      } catch {
        this.log(`❌ ${chalk.red('Failed to get permanent token!')}`)
        this.exit(-1)
      }
    } else {
      token = cnpoemData.token
    }

    // get one sentence of a poem
    try {
      const sentenceResp = (await fetch('https://v2.jinrishici.com/sentence', {
        method: 'GET',
        headers: {
          'X-User-Token': token,
        },
      }).then(res => res.json())) as SentenceResponse
      if (sentenceResp.status === 'success') {
        const {data} = sentenceResp as SentenceSuccessResponse
        this.log(`
╔════════════════════════════════════╗        
  ${chalk.blue(data.content)}
╚════════════════════════════════════╝
`)
        this.log(`📖 Source：《${chalk.green(data.origin.title)}》 -- ${chalk.yellow(data.origin.dynasty)} · ${chalk.yellow(data.origin.author)}`)
        data.origin.translation && this.log(`🖊 ${chalk.gray(data.origin.translation.join('\n\t '))}`)
        data.matchTags && this.log(`📌 ${chalk.cyan(data.matchTags.join('，'))}`)
      } else {
        this.log(
          `Poem sentence API Error: ${chalk.red(
            (sentenceResp as SentenceErrorResponse).errMessage,
          )}`,
        )
      }
    } catch (error) {
      this.log(error as any)
      this.log(
        `❌ ${chalk.red('Failed to fetch poem sentence!')} (Network Error)`,
      )
    }
  }
}
