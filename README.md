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
med book ~/Downloads/天才基本法.txt
```

![read view](https://user-images.githubusercontent.com/46062972/150922709-00989370-f025-4c89-beaf-fb041c50f21b.png)

**Search view**

```bash
 med book ~/Downloads/金凤华庭.txt -s 未梳洗
```

![search view](https://user-images.githubusercontent.com/46062972/150922533-9d76b830-55c3-4c2f-8eed-e87916ad3777.png)

## Wordle game

![Wordle game](https://user-images.githubusercontent.com/46062972/151534206-de70fdec-9960-4aae-be85-9333441a90b7.png)

# Chinese poem · 一言

![Chinese poem](https://user-images.githubusercontent.com/46062972/167068053-e5c36959-68cb-4a04-a1d6-1a598d9658c9.png)


<!-- toc -->
* [meditate](#meditate)
* [Preview](#preview)
* [Chinese poem · 一言](#chinese-poem--一言)
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
@slackoff/meditate/2.0.1 win32-x64 node-v16.15.0
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

_See code: [dist/commands/book/index.ts](https://github.com/ShenQingchuan/meditate/blob/v2.0.1/dist/commands/book/index.ts)_

## `med cnpoem`

get one sentence of a Chinese poem

```
USAGE
  $ med cnpoem

DESCRIPTION
  get one sentence of a Chinese poem
```

_See code: [dist/commands/cnpoem/index.ts](https://github.com/ShenQingchuan/meditate/blob/v2.0.1/dist/commands/cnpoem/index.ts)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.12/src/commands/help.ts)_

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

_See code: [dist/commands/init/index.ts](https://github.com/ShenQingchuan/meditate/blob/v2.0.1/dist/commands/init/index.ts)_

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

_See code: [dist/commands/wordle/index.ts](https://github.com/ShenQingchuan/meditate/blob/v2.0.1/dist/commands/wordle/index.ts)_
<!-- commandsstop -->
