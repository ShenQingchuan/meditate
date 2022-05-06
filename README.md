# meditate

a powerful slack-off CLI application.

[![NPM](https://nodei.co/npm/@slackoff/meditate.png?mini=true)](https://npmjs.org/package/@slackoff/meditate)

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@slackoff/meditate.svg)](https://www.npmjs.com/package/@slackoff/meditate)
[![Download/week](https://img.shields.io/npm/dw/@slackoff/meditate.svg)](https://www.npmjs.com/package/@slackoff/meditate)
[![License](https://img.shields.io/npm/l/meditate.svg)](https://github.com/ShenQingchuan/meditate/blob/master/package.json)

# Preview

## Reading book

**Read view**

```
med ~/Downloads/天才基本法.txt
```

![read view](https://user-images.githubusercontent.com/46062972/150922709-00989370-f025-4c89-beaf-fb041c50f21b.png)

**Search view**

```bash
 med book ~/Downloads/金凤华庭.txt -s 未梳洗
```

![search view](https://user-images.githubusercontent.com/46062972/150922533-9d76b830-55c3-4c2f-8eed-e87916ad3777.png)

## Wordle game

![Wordle game](https://user-images.githubusercontent.com/46062972/151534206-de70fdec-9960-4aae-be85-9333441a90b7.png)

<!-- toc -->
* [meditate](#meditate)
* [Preview](#preview)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g @slackoff/meditate
$ med COMMAND
running command...
$ med (--version)
@slackoff/meditate/1.2.0 win32-x64 node-v14.19.0
$ med --help [COMMAND]
USAGE
  $ med COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`med book [FILEPATH]`](#med-book-filepath)
* [`med cnpoem`](#med-cnpoem)
* [`med help [COMMAND]`](#med-help-command)
* [`med init`](#med-init)
* [`med plugins`](#med-plugins)
* [`med plugins:install PLUGIN...`](#med-pluginsinstall-plugin)
* [`med plugins:inspect PLUGIN...`](#med-pluginsinspect-plugin)
* [`med plugins:link PLUGIN`](#med-pluginslink-plugin)
* [`med plugins:uninstall PLUGIN...`](#med-pluginsuninstall-plugin)
* [`med plugins update`](#med-plugins-update)
* [`med wordle`](#med-wordle)

## `med book [FILEPATH]`

Read a novel, enjoy a story...

```
USAGE
  $ med book [FILEPATH] [-h] [-r] [-s <value>] [-j <value>]

FLAGS
  -h, --help            help information for book reading command.
  -j, --jump=<value>    assign a position to start reading.
  -r, --restart         restart reading progress of a given book.
  -s, --search=<value>  open searching view to locate given words.

DESCRIPTION
  Read a novel, enjoy a story...
```

_See code: [dist/commands/book/index.ts](https://github.com/ShenQingchuan/meditate/blob/v1.2.0/dist/commands/book/index.ts)_

## `med cnpoem`

get one sentence of a Chinese poem

```
USAGE
  $ med cnpoem

DESCRIPTION
  get one sentence of a Chinese poem
```

_See code: [dist/commands/cnpoem/index.ts](https://github.com/ShenQingchuan/meditate/blob/v1.2.0/dist/commands/cnpoem/index.ts)_

## `med help [COMMAND]`

Display help for med.

```
USAGE
  $ med help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for med.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.10/src/commands/help.ts)_

## `med init`

initialize meditate application data.

```
USAGE
  $ med init [-h]

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  initialize meditate application data.
```

_See code: [dist/commands/init/index.ts](https://github.com/ShenQingchuan/meditate/blob/v1.2.0/dist/commands/init/index.ts)_

## `med plugins`

List installed plugins.

```
USAGE
  $ med plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ med plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.0.11/src/commands/plugins/index.ts)_

## `med plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ med plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ med plugins add

EXAMPLES
  $ med plugins:install myplugin 

  $ med plugins:install https://github.com/someuser/someplugin

  $ med plugins:install someuser/someplugin
```

## `med plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ med plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ med plugins:inspect myplugin
```

## `med plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ med plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLES
  $ med plugins:link myplugin
```

## `med plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ med plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ med plugins unlink
  $ med plugins remove
```

## `med plugins update`

Update installed plugins.

```
USAGE
  $ med plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

## `med wordle`

an interesting word guessing game.

```
USAGE
  $ med wordle [-h]

FLAGS
  -h, --history  print current month's game record

DESCRIPTION
  an interesting word guessing game.
```

_See code: [dist/commands/wordle/index.ts](https://github.com/ShenQingchuan/meditate/blob/v1.2.0/dist/commands/wordle/index.ts)_
<!-- commandsstop -->
