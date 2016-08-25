// @flow
import _ from 'lodash'
import program from 'commander'

import info from '../package.json'

export type Options = {
  command: ?string,
  files: Array<string>,
  format: string,
  branch: string,
  linter: string,
  warning: boolean,
  hash?: string,
}

export function parseOptions(): Options {
  program
    .version(info.version)
    .usage('[options] <subcommand|file ...>')
    .option('-f, --format [format]', 'The output format.', 'text')
    .option('-b, --branch [branch]', 'The branch to diff against.')
    .option('-l, --linter [linter]', 'The linter that is used in the project.', 'eslint')
    .option('-w, --warning', 'Make all errors that make it through the filter a warning')
    .parse(process.argv)

  let [command] = program.args

  if (!_.includes(command, ['generate-config', 'list-files'])) {
    command = undefined
  }

  return {
    command,
    files: program.args,
    format: program.format,
    branch: program.branch,
    linter: program.linter,
    warning: !!program.warning,
  }
}
