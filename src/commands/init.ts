import { Command, flags } from "@oclif/command";
import { getMedHomeDir } from "../utils";
import * as path from "path";
import * as fs from 'fs'

export default class Init extends Command {
  static description = "initialize meditate application config.";

  static flags = {
    help: flags.help({ char: "h" }),
  };

  async run() {
    let configDir = getMedHomeDir();
    
    const isMedHomeExists = fs.existsSync(configDir);
    if (!isMedHomeExists) {
      this.log('🛠 Creating Meditate home directory ...');
      fs.mkdirSync(configDir);
    } else {
      this.log('✅ Meditate home directory found.');
    }
    const jsonConfigPath = path.resolve(configDir, 'config.json');
    const isConfigJsonExists = fs.existsSync(jsonConfigPath);
    if (!isConfigJsonExists) {
      this.log('🛠 Creating Meditate config JSON file ...');
      fs.writeFileSync(jsonConfigPath, JSON.stringify({}, null, 2));
    } else {
      this.log('✅ Meditate config JSON file found.');
    }
  }
}
