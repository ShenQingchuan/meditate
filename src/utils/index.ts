import { resolve as pathResolve } from "path";
import {
  readFileSync as fsReadFileSync,
  writeFileSync as fsWriteFileSync,
  existsSync as fsExistsSync,
  mkdirSync as fsMkdirSync
} from "fs";
import type { CommandConfigMap } from "../types";

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
  const jsonConfigPath = pathResolve(configDir, "config.json");
  const isConfigJsonExists = fsExistsSync(jsonConfigPath);
  if (!isConfigJsonExists) {
    printMessage("... 🛠 Creating Meditate config JSON file ...");
    fsWriteFileSync(jsonConfigPath, JSON.stringify({}, null, 2));
  } else {
    printMessage("... ✅ Meditate config JSON file found.");
  }

  printMessage("🎉 You can start using meditate now !");
}

export function loadCommandConfig<K extends keyof CommandConfigMap>(
  cmd: keyof CommandConfigMap,
  init?: () => any // run init if command config is undefined
): CommandConfigMap[K] {
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
    const cmdConfig = configJSON[cmd] ?? init?.();

    // write in initialized config
    configJSON[cmd] = cmdConfig;
    fsWriteFileSync(configFilePath, JSON.stringify(configJSON, null, 2));

    return cmdConfig;
  } catch (err) {
    throw new Error("load Meditate config failed!");
  }
}

export function setCommandConfig<K extends keyof CommandConfigMap>(
  cmd: keyof CommandConfigMap,
  newConfig: CommandConfigMap[K]
): void {
  const configFilePath = pathResolve(getMedHomeDir(), "config.json");
  const configBuffer = fsReadFileSync(configFilePath);
  try {
    const configJSON: CommandConfigMap = JSON.parse(configBuffer.toString());
    configJSON[cmd] = newConfig;
    fsWriteFileSync(configFilePath, JSON.stringify(configJSON, null, 2));
  } catch (err) {
    throw new Error("load Meditate config failed!");
  }
}

export function cutByLength(str: string, len: number): string[] {
  const slices: string[] = [];
  for (let i = 0, l = str.length; i < l / len; i++) {
    slices.push(str.slice(len * i, len * (i + 1)));
  }
  return slices;
}
