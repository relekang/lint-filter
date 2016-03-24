import _ from 'lodash'
import fs from 'fs'
import Promise from 'bluebird'
import xml2js from 'xml2js'

Promise.promisifyAll(fs)
Promise.promisifyAll(xml2js)

export function mapErrorsFromFileBlock(file) {
  if (file.error) {
    return file.error.map(({ $ }) => _.assign({}, $, { file: file.$.name }))
  }
  return null
}

const parser = new xml2js.Parser()
export function parseFile(file) {
  return fs.readFileAsync(file)
    .then(content => parser.parseStringAsync(content))
    .then(({ checkstyle }) => checkstyle.file.map(mapErrorsFromFileBlock))
}

export function parseFiles(files) {
  return Promise.all(files.map(parseFile))
    .then(result => _.flatten(_.flatten(result)))
    .then(result => _.reject(result, _.isEmpty))
}
