import { resolve as pathResolve } from "path";
import {
  readFileSync as fsReadFileSync,
  writeFileSync as fsWriteFileSync,
} from "fs";
import type { CommandConfigMap } from "../types";

export function getMedHomeDir(): string {
  const userHomeDir = process.env.HOME || process.env.USERPROFILE || "~";
  return pathResolve(userHomeDir, ".meditate");
}

export function loadCommandConfig<K extends keyof CommandConfigMap>(
  cmd: keyof CommandConfigMap,
  init?: () => any // run init if command config is undefined
): CommandConfigMap[K] {
  const configFilePath = pathResolve(getMedHomeDir(), "config.json");
  const configBuffer = fsReadFileSync(configFilePath);
  try {
    const configJSON = JSON.parse(configBuffer.toString());
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
  newConfig: CommandConfigMap[K],
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
  for (let i = 0, l = str.length; i < l/len; i++) {
    slices.push(str.slice(len * i, len * (i + 1)));
  }
  return slices
}