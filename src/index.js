/* eslint-disable no-console */
import _ from 'lodash'
import program from 'commander'
import stdin from 'stdin'
import Promise from 'bluebird'

import info from '../package.json'
import { checkFiles, checkString } from './checks'
import { formatOutput } from './formatters'
import { hasError } from './utils'
import { getDiffInformation } from './utils/git'

function handleResult(result, options) {
  console.log(formatOutput(options.format, result))
  process.exit(hasError(result) ? 1 : 0)
}

export default async function main() {
  program
    .version(info.version)
    .usage('[options] <file ...>')
    .option('-f, --format [format]', 'The output format', 'text')
    .option('-b, --branch [branch]', 'The branch to diff against')
    .parse(process.argv)

  const diff = await getDiffInformation(program)

  if (program.args.length === 0) {
    const input = await new Promise(resolve => stdin(resolve))
    const result = await checkString(diff, input)
    return handleResult(result, program)
  }

  if (program.args[0] === 'list-files') {
    return console.log(_.keys(diff).join(' '))
  }

  const result = await checkFiles(diff, program.args, program)
  return handleResult(result, program)
}

if (!module.parent) {
  exports.default()
}
