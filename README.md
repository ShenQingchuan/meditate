meditate
========

a powerful slack-off CLI application.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/meditate.svg)](https://npmjs.org/package/meditate)
[![Downloads/week](https://img.shields.io/npm/dw/meditate.svg)](https://npmjs.org/package/meditate)
[![License](https://img.shields.io/npm/l/meditate.svg)](https://github.com/ShenQingchuan/meditate/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g meditate
$ med COMMAND
running command...
$ med (-v|--version|version)
meditate/0.0.1 darwin-x64 node-v16.13.0
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
* [`med init [FILE]`](#med-init-file)

## `med book [FILEPATH]`

Read a novel, enjoy a story...

You can use `j` and `k` to move page forward / backward, and `q` to quit reading view.

```
USAGE
  $ med book [FILEPATH]

OPTIONS
  -h, --help  show CLI help
  --restart   restart reading target book
```

_See code: [src/commands/book.ts](https://github.com/ShenQingchuan/meditate/blob/v0.0.1/src/commands/book.ts)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.4/src/commands/help.ts)_

## `med init`

initialize med configuration file.

```
USAGE
  $ med init
```

_See code: [src/commands/init.ts](https://github.com/ShenQingchuan/meditate/blob/v0.0.1/src/commands/init.ts)_
<!-- commandsstop -->
