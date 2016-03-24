import program from 'commander'
import stdin from 'stdin'

import info from '../package.json'
import { checkFiles, checkString } from './checks'

export default function main() {
  program
    .version(info.version)
    .usage('[options] <file ...>')
    .parse(process.argv)

  if (program.args.length === 0) {
    return new Promise(resolve => stdin(resolve))
      .then(checkString)
      .then(result => {
        if (result.indexOf(true) >= 0) {
          console.error('This seems to be your doing') // eslint-disable-line no-console
        }
      })
  }

  return checkFiles(program.args, program)
    .then(result => {
      if (result.indexOf(true) >= 0) {
        console.error('This seems to be your doing') // eslint-disable-line no-console
      }
    })
    .catch(error => {
      throw error
    })
}

if (!module.parent) {
  main()
}
