meditate
========

a powerful slack-off CLI application.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![NPM](https://nodei.co/npm/@slackoff/meditate.png?mini=true)](https://npmjs.org/package/@slackoff/meditate)
[![Version](https://img.shields.io/npm/v/@slackoff/meditate.svg)](https://www.npmjs.com/package/@slackoff/meditate)
[![Download/week](https://img.shields.io/npm/dw/@slackoff/meditate.svg)](https://www.npmjs.com/package/@slackoff/meditate)
[![License](https://img.shields.io/npm/l/meditate.svg)](https://github.com/ShenQingchuan/meditate/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @slackoff/meditate
$ med COMMAND
running command...
$ med (-v|--version|version)
@slackoff/meditate/1.0.12 darwin-x64 node-v16.13.1
$ med --help [COMMAND]
USAGE
  $ med COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`med book [FILEPATH]`](#med-book-filepath)
* [`med help [COMMAND]`](#med-help-command)
* [`med init`](#med-init)

## `med book [FILEPATH]`

Read a novel, enjoy a story...

```
USAGE
  $ med book [FILEPATH]

OPTIONS
  -h, --help           help information for book reading command.
  -j, --jump=jump      assign a position to start reading.
  -r, --restart        restart reading progress of a given book.
  -s, --search=search  open searching view to locate given words.
```

_See code: [src/commands/book.ts](https://github.com/ShenQingchuan/meditate/blob/v1.0.12/src/commands/book.ts)_

## `med help [COMMAND]`

display help for med

```
USAGE
  $ med help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.3.1/src/commands/help.ts)_

## `med init`

initialize meditate application config.

```
USAGE
  $ med init

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/init.ts](https://github.com/ShenQingchuan/meditate/blob/v1.0.12/src/commands/init.ts)_
<!-- commandsstop -->
