import { resolve as pathResolve } from "path";
import {
  readFileSync as fsReadFileSync,
  writeFileSync as fsWriteFileSync,
  existsSync as fsExistsSync,
  mkdirSync as fsMkdirSync
} from "fs";
import type { CommandDataMap } from "../types";

export function getMedHomeDir(): string {
  const userHomeDir = process.env.HOME || process.env.USERPROFILE || "~";
  return pathResolve(userHomeDir, ".meditate");
}

export function initMedHomeDir(quite = false) {
  let configDir = getMedHomeDir();
  const printMessage = (msg: string) => {
    quite && console.log(msg)
  }

  const isMedHomeExists = fsExistsSync(configDir);
  if (!isMedHomeExists) {
    printMessage("... 🛠 Creating Meditate home directory ...");
    fsMkdirSync(configDir);
  } else {
    printMessage("... ✅ Meditate home directory found.");
  }
  const jsonDataPath = pathResolve(configDir, "config.json");
  const isDataJsonExists = fsExistsSync(jsonDataPath);
  if (!isDataJsonExists) {
    printMessage("... 🛠 Creating Meditate config JSON file ...");
    fsWriteFileSync(jsonDataPath, JSON.stringify({}, null, 2));
  } else {
    printMessage("... ✅ Meditate config JSON file found.");
  }

  printMessage("🎉 You can start using meditate now !");
}

export function loadCommandData<K extends keyof CommandDataMap>(
  cmd: keyof CommandDataMap,
  init?: () => any // run init if command config is undefined
): CommandDataMap[K] {
  const configFilePath = pathResolve(getMedHomeDir(), "config.json");
  let configString = '{}';
  try {
    const configBuffer = fsReadFileSync(configFilePath);
    configString = configBuffer.toString();
  } catch (err) {
    // read error: config file not found
    // need to reinitialize
    initMedHomeDir();
  }

  try {
    const configJSON = JSON.parse(configString);
    const cmdData = configJSON[cmd] ?? init?.();

    // write in initialized config
    configJSON[cmd] = cmdData;
    fsWriteFileSync(configFilePath, JSON.stringify(configJSON, null, 2));

    return cmdData;
  } catch (err) {
    throw new Error("load Meditate config failed!");
  }
}

export function setCommandData<K extends keyof CommandDataMap>(
  cmd: keyof CommandDataMap,
  newData: CommandDataMap[K]
): void {
  const configFilePath = pathResolve(getMedHomeDir(), "config.json");
  const configBuffer = fsReadFileSync(configFilePath);
  try {
    const configJSON: CommandDataMap = JSON.parse(configBuffer.toString());
    configJSON[cmd] = newData;
    fsWriteFileSync(configFilePath, JSON.stringify(configJSON, null, 2));
  } catch (err) {
    throw new Error("load Meditate config failed!");
  }
}