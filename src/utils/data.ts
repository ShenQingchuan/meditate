import {resolve as pathResolve} from 'node:path'
import {
  readFileSync as fsReadFileSync,
  writeFileSync as fsWriteFileSync,
  existsSync as fsExistsSync,
  mkdirSync as fsMkdirSync,
} from 'node:fs'
import type {CommandDataMap} from '../types'
import {isEmpty} from 'underscore'

export function getMedHomeDir(): string {
  const userHomeDir = process.env.HOME || process.env.USERPROFILE || '~'
  return pathResolve(userHomeDir, '.meditate')
}

// eslint-disable-next-line default-param-last
export function initMedHomeDir(quite = false, callback?: () => void): void {
  const homeDir = getMedHomeDir()
  const dataDir = `${homeDir}/data`
  const printMessage = (msg: string) => {
    !quite && console.log(msg)
  }

  // guard for home directory
  const isMedHomeExists = fsExistsSync(homeDir)
  if (isMedHomeExists) {
    printMessage('... ✅ Meditate home directory found.')
  } else {
    printMessage('... 🛠 Creating Meditate home directory ...')
    fsMkdirSync(homeDir)
  }

  // guard for $home/data directory
  const isMedDataDirExists = fsExistsSync(dataDir)
  if (isMedDataDirExists) {
    printMessage('... ✅ Meditate data directory found.')
  } else {
    printMessage('... 🛠 Creating Meditate data directory ...')
    fsMkdirSync(dataDir)
  }

  callback?.()

  printMessage('🎉 You can start using meditate now !')
}

export function loadCommandData<K extends keyof CommandDataMap>(
  cmd: K,
  init?: () => any, // run init if command data is undefined
): CommandDataMap[K] {
  const dataFilePath = pathResolve(`${getMedHomeDir()}/data`, `${cmd}.json`)
  let dataString = '{}'
  try {
    const dataBuffer = fsReadFileSync(dataFilePath)
    dataString = dataBuffer.toString()
  } catch {
    // read error: data file not found
    // need to initialize
    initMedHomeDir(true, () => {
      const isDataJsonExists = fsExistsSync(dataFilePath)
      if (!isDataJsonExists) {
        fsWriteFileSync(dataFilePath, JSON.stringify({}))
      }
    })
    // and continue to use the initialized '{}' above.
  }

  try {
    let dataJSON = JSON.parse(dataString)
    const cmdData = isEmpty(dataJSON) ? (init?.() ?? {}) : dataJSON

    // write in initialized data
    dataJSON = {
      ...dataJSON,
      ...cmdData, // override
    }
    fsWriteFileSync(dataFilePath, JSON.stringify(dataJSON))

    return cmdData
  } catch {
    throw new Error('load Meditate data failed!')
  }
}

export function setCommandData<K extends keyof CommandDataMap>(
  cmd: K,
  newData: Partial<CommandDataMap[K]>,
): void {
  const dataFilePath = pathResolve(`${getMedHomeDir()}/data`, `${cmd}.json`)
  const dataBuffer = fsReadFileSync(dataFilePath)
  try {
    let dataJSON = JSON.parse(dataBuffer.toString()) as CommandDataMap[K]
    dataJSON = {
      ...dataJSON,
      ...newData, // override
    }
    fsWriteFileSync(dataFilePath, JSON.stringify(dataJSON))
  } catch {
    throw new Error('load Meditate data failed!')
  }
}
