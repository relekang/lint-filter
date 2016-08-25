// @flow
import _ from 'lodash'

import { isLineInDiff } from './utils'
import { parseFiles, parseString } from './parser'

import type { DiffInfo } from './utils/git'
import type { CheckstyleItem } from './parser' // eslint-disable-line no-duplicate-imports

export function checkError(error: CheckstyleItem, diff: DiffInfo) {
  const isInDiff = isLineInDiff(error, diff)
  return _.assign({}, error, { isInDiff })
}

export function checkErrors(errors: Array<CheckstyleItem>, diff: DiffInfo) {
  return errors.map(error => checkError(error, diff))
}

export function checkFiles(diff: DiffInfo, files: Array<string>, options: Object) {
  return parseFiles(files, options)
    .then(errors => checkErrors(errors, diff))
}

export function checkString(diff: DiffInfo, str: string, options: Object) {
  return parseString(str, options)
    .then(errors => checkErrors(errors, diff))
}
