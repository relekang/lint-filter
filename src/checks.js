import _ from 'lodash'
import Promise from 'bluebird'

import { isLineInDiff } from './utils'
import { parseFiles } from './parser'

export function checkErrors(errors) {
  return Promise.all(errors.map(error => isLineInDiff(error)))
    .then(_.flatten)
}

export function checkFiles(files, options) {
  return parseFiles(files, options)
    .then(checkErrors)
}
