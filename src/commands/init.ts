import { Command, flags } from "@oclif/command";
import { initMedHomeDir } from "../utils";

export default class Init extends Command {
  static description = "initialize meditate application config.";

  static flags = {
    help: flags.help({ char: "h" }),
  };

  async run() {
    initMedHomeDir();
  }
}
