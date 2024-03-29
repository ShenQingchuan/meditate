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

You can also input numbers to jump with multiple pages change. (After you input these numbers, you can use `j` or `k` to jump to the next/previous page.)

<img src="https://user-images.githubusercontent.com/46062972/171224113-35d8ead1-f4f4-49ba-b80c-b85438b9ca18.png" width="528">

Here I'll go on typing a `j` as demo:

<img src="https://user-images.githubusercontent.com/46062972/171225612-e64c7959-7969-44a8-86d4-5da524076870.png" width="328">

**Search view**

```bash
 med book ~/Downloads/金凤华庭.txt -s 未梳洗
```

![search view](https://user-images.githubusercontent.com/46062972/150922533-9d76b830-55c3-4c2f-8eed-e87916ad3777.png)

You can even add an alias for your book:

![set alias](https://user-images.githubusercontent.com/46062972/194533089-c4f37001-d76f-4817-96e6-d8b27cb1b6d4.png)

## Wordle game

![Wordle game](https://user-images.githubusercontent.com/46062972/151534206-de70fdec-9960-4aae-be85-9333441a90b7.png)

## Chinese poem · 一言

![Chinese poem](https://user-images.githubusercontent.com/46062972/167068053-e5c36959-68cb-4a04-a1d6-1a598d9658c9.png)

## Game · 2048

![game2048](https://user-images.githubusercontent.com/46062972/171021184-e6644620-515a-4652-bc30-50ebb8ec2b92.png)

## Days

![days](https://user-images.githubusercontent.com/46062972/172086572-170fb83b-ec57-466a-9c53-c5b2831786bd.png)

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
@slackoff/meditate/2.3.0 win32-x64 node-v16.17.0
$ med --help [COMMAND]
USAGE
  $ med COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`med 2048`](#med-2048)
* [`med book [FILEPATH]`](#med-book-filepath)
* [`med book alias [ALIASNAME] [ALIASPATH]`](#med-book-alias-aliasname-aliaspath)
* [`med cnpoem`](#med-cnpoem)
* [`med days`](#med-days)
* [`med help [COMMAND]`](#med-help-command)
* [`med init`](#med-init)
* [`med wordle`](#med-wordle)

## `med 2048`

2048 Game in terminal

```
USAGE
  $ med 2048

DESCRIPTION
  2048 Game in terminal
```

_See code: [dist/commands/2048/index.ts](https://github.com/ShenQingchuan/meditate/blob/v2.3.0/dist/commands/2048/index.ts)_

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

_See code: [dist/commands/book/index.ts](https://github.com/ShenQingchuan/meditate/blob/v2.3.0/dist/commands/book/index.ts)_

## `med book alias [ALIASNAME] [ALIASPATH]`

Set an alias for your book

```
USAGE
  $ med book alias [ALIASNAME] [ALIASPATH] [-l]

FLAGS
  -l, --list  list all aliases

DESCRIPTION
  Set an alias for your book
```

## `med cnpoem`

get one sentence of a Chinese poem

```
USAGE
  $ med cnpoem

DESCRIPTION
  get one sentence of a Chinese poem
```

_See code: [dist/commands/cnpoem/index.ts](https://github.com/ShenQingchuan/meditate/blob/v2.3.0/dist/commands/cnpoem/index.ts)_

## `med days`

Memorize your important days.

```
USAGE
  $ med days [-d <value> -n <value>]

FLAGS
  -d, --desc=<value>  description of a memo date
  -n, --new=<value>   create a new memorize day

DESCRIPTION
  Memorize your important days.

  Input date format could be any valid connector: dot(.)、slash(/) and dash(-)

EXAMPLES
  $ med days

  $ med days -n 2022.2.1 -d "Spring Festival"
```

_See code: [dist/commands/days/index.ts](https://github.com/ShenQingchuan/meditate/blob/v2.3.0/dist/commands/days/index.ts)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.14/src/commands/help.ts)_

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

_See code: [dist/commands/init/index.ts](https://github.com/ShenQingchuan/meditate/blob/v2.3.0/dist/commands/init/index.ts)_

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

_See code: [dist/commands/wordle/index.ts](https://github.com/ShenQingchuan/meditate/blob/v2.3.0/dist/commands/wordle/index.ts)_
<!-- commandsstop -->
