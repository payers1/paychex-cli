paychex-cli
===========



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/paychex-cli.svg)](https://npmjs.org/package/paychex-cli)
[![Downloads/week](https://img.shields.io/npm/dw/paychex-cli.svg)](https://npmjs.org/package/paychex-cli)
[![License](https://img.shields.io/npm/l/paychex-cli.svg)](https://github.com/payers1/paychex-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g paychex-cli
$ pchx COMMAND
running command...
$ pchx (-v|--version|version)
paychex-cli/0.0.0 darwin-x64 node-v13.5.0
$ pchx --help [COMMAND]
USAGE
  $ pchx COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`pchx hello [FILE]`](#pchx-hello-file)
* [`pchx help [COMMAND]`](#pchx-help-command)

## `pchx hello [FILE]`

describe the command here

```
USAGE
  $ pchx hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ pchx hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/payers1/paychex-cli/blob/v0.0.0/src/commands/hello.ts)_

## `pchx help [COMMAND]`

display help for pchx

```
USAGE
  $ pchx help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_
<!-- commandsstop -->
