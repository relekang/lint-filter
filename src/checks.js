import _ from 'lodash'
import Promise from 'bluebird'

import { isLineInDiff } from './utils'
import { parseFiles, parseString } from './parser'

export function checkError(error) {
  return new Promise((resolve, reject) => {
    isLineInDiff(error)
      .catch(reject)
      .then(isInDiff => resolve(_.assign({}, error, { isInDiff })))
  })
}

export function checkErrors(errors) {
  return Promise.all(errors.map(checkError))
}

export function checkFiles(files, options) {
  return parseFiles(files, options)
    .then(checkErrors)
}

export function checkString(str, options) {
  return parseString(str, options)
    .then(checkErrors)
}
