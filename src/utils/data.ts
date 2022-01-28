import { resolve as pathResolve } from "path";
import {
  readFileSync as fsReadFileSync,
  writeFileSync as fsWriteFileSync,
  existsSync as fsExistsSync,
  mkdirSync as fsMkdirSync,
} from "fs";
import type { CommandDataMap } from "../types";

export function getMedHomeDir(): string {
  const userHomeDir = process.env.HOME || process.env.USERPROFILE || "~";
  return pathResolve(userHomeDir, ".meditate");
}

export function initMedHomeDir(quite = false, callback?: () => void) {
  const homeDir = getMedHomeDir();
  let dataDir = `${homeDir}/data`;
  const printMessage = (msg: string) => {
    !quite && console.log(msg);
  };

  // guard for home directory
  const isMedHomeExists = fsExistsSync(homeDir);
  if (!isMedHomeExists) {
    printMessage("... 🛠 Creating Meditate home directory ...");
    fsMkdirSync(homeDir);
  } else {
    printMessage("... ✅ Meditate home directory found.");
  }

  // guard for $home/data directory
  const isMedDataDirExists = fsExistsSync(dataDir);
  if (!isMedDataDirExists) {
    printMessage("... 🛠 Creating Meditate data directory ...");
    fsMkdirSync(dataDir);
  } else {
    printMessage("... ✅ Meditate data directory found.");
  }

  callback?.();

  printMessage("🎉 You can start using meditate now !");
}

export function loadCommandData<K extends keyof CommandDataMap>(
  cmd: K,
  init?: () => any // run init if command data is undefined
): CommandDataMap[K] {
  const dataFilePath = pathResolve(`${getMedHomeDir()}/data`, `${cmd}.json`);
  let dataString = "{}";
  try {
    const dataBuffer = fsReadFileSync(dataFilePath);
    dataString = dataBuffer.toString();
  } catch (err) {
    // read error: data file not found
    // need to initialize
    initMedHomeDir(true, () => {
      const isDataJsonExists = fsExistsSync(dataFilePath);
      if (!isDataJsonExists) {
        fsWriteFileSync(dataFilePath, JSON.stringify({}));
      }
    });
    // and continue to use the initialized '{}' above.
  }

  try {
    const dataJSON = JSON.parse(dataString);
    const cmdData = dataJSON[cmd] ?? init?.();

    // write in initialized data
    dataJSON[cmd] = cmdData;
    fsWriteFileSync(dataFilePath, JSON.stringify(dataJSON));

    return cmdData;
  } catch (err) {
    throw new Error("load Meditate data failed!");
  }
}

export function setCommandData<K extends keyof CommandDataMap>(
  cmd: K,
  newData: CommandDataMap[K]
): void {
  const dataFilePath = pathResolve(`${getMedHomeDir()}/data`, `${cmd}.json`);
  const dataBuffer = fsReadFileSync(dataFilePath);
  try {
    const dataJSON: CommandDataMap = JSON.parse(dataBuffer.toString());
    dataJSON[cmd] = newData;
    fsWriteFileSync(dataFilePath, JSON.stringify(dataJSON));
  } catch (err) {
    throw new Error("load Meditate data failed!");
  }
}
