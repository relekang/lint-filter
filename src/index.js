import program from 'commander'
import stdin from 'stdin'

import info from '../package.json'
import { checkFiles, checkString } from './checks'
import { formatOutput } from './formatters'

function handleResult(promise, options) {
  return promise
    .then(result => {
      console.log(formatOutput(options.format, result)) // eslint-disable-line no-console
    })
    .catch(error => {
      throw error
    })
}

export default function main() {
  program
    .version(info.version)
    .usage('[options] <file ...>')
    .option('-f, --format [format]', 'The output format', 'checkstyle')
    .parse(process.argv)

  if (program.args.length === 0) {
    return handleResult(new Promise(resolve => stdin(resolve)).then(checkString), program)
  }

  return handleResult(checkFiles(program.args, program), program)
}

if (!module.parent) {
  main()
}
