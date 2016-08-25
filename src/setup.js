// @flow
import _ from 'lodash'
import fs from 'fs'
import Promise from 'bluebird'

import spawn from './utils/spawn'
import { getRulesFromCheckstyle } from './utils/checkstyle'
import { parseString } from './parser'

export const readdir = Promise.promisify(fs.readdir)

export default function setup(program: Object) {
  switch (program.linter) {
    case 'eslint':
      return exports.setupEslint(program)

    default:
      throw new Error('Unknown linter')
  }
}

export async function getEslintRcFilename(path: string = '.'): Promise<string> {
  const files = await exports.readdir(path)
  return files.reduce((last, item) => {
    if (/^\.eslintrc/.test(item)) {
      return item
    }
    return last
  })
}

export async function setupEslint(): Promise<> {
  let result
  try {
    result = await spawn('eslint', ['.', '-f', 'checkstyle'])
  } catch (error) {
    result = error.stdout
  }

  const rules = getRulesFromCheckstyle(await parseString(result))
  const config = {
    extends: await getEslintRcFilename(),
    rules: _.reduce(rules, (last, rule) => _.assign({}, last, { [rule]: 0 }), {}),
  }

  console.log(JSON.stringify(config, null, 2)) // eslint-disable-line no-console
}
