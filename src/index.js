import program from 'commander'

import info from '../package.json'
import { checkFiles } from './checks'

export default function main() {
  program
    .version(info.version)
    .usage('[options] <file ...>')
    .parse(process.argv)

  if (program.args.length === 0) {
    console.error('Reading from stdin is not supported yet') // eslint-disable-line no-console
    process.exit(1)
  }

  checkFiles(program.args, program)
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
