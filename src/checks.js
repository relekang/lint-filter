import _ from 'lodash'

import { isLineInDiff } from './utils'
import { parseFiles, parseString } from './parser'

export function checkError(error, diff) {
  const isInDiff = isLineInDiff(error, diff)
  return _.assign({}, error, { isInDiff })
}

export function checkErrors(errors, diff) {
  return errors.map(error => checkError(error, diff))
}

export function checkFiles(diff, files, options) {
  return parseFiles(files, options)
    .then(errors => checkErrors(errors, diff))
}

export function checkString(diff, str, options) {
  return parseString(str, options)
    .then(errors => checkErrors(errors, diff))
}
