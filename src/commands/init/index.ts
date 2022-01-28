import { Command, flags } from "@oclif/command";
import { initMedHomeDir } from "../../utils";

export default class Init extends Command {
  static description = "initialize meditate application data.";
  static flags = {
    help: flags.help({ char: "h" }),
  };

  async run() {
    initMedHomeDir();
  }
}
