// @flow
/* eslint-disable no-console */
import 'babel-polyfill'
import _ from 'lodash'
import stdin from 'get-stdin'
import Promise from 'bluebird'

import { parseOptions } from './cli'
import { checkFiles, checkString } from './checks'
import { formatOutput } from './formatters'
import { hasError } from './utils'
import { getDiffInformation } from './utils/git'
import { setErrorToWarning } from './utils/checkstyle'
import setup from './setup'

function handleResult(result, options) {
  const output = options.warning ? _.map(result, setErrorToWarning) : result
  console.log(formatOutput(options.format, output))
  process.exit(hasError(output) ? 1 : 0)
}

export default async function main(): Promise<> {
  const options = parseOptions()

  if (options.command === 'generate-config') {
    return setup(options)
  }

  const diff = await getDiffInformation(options)

  if (options.command === 'list-files') {
    return console.log(_.keys(diff).join(' '))
  }

  if (!options.command) {
    let result
    if (_.isEmpty(options.files)) {
      const input = await stdin()

      if (input === '') {
        throw new Error('stdin was empty')
      }

      result = await checkString(diff, input, options)
    } else {
      result = await checkFiles(diff, options.files, options)
    }
    return handleResult(result, options)
  }

  throw new Error(`Unknown command '${options.command}'`)
}

if (!module.parent) {
  exports.default()
}
