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
export function parseString(str) {
  return parser.parseStringAsync(str)
    .then(({ checkstyle }) => checkstyle.file.map(mapErrorsFromFileBlock))
    .then(result => _.reject(result, _.isEmpty))
    .then(result => _.flatten(result))
}

export function parseFile(file) {
  return fs.readFileAsync(file)
    .then(content => parseString(content.toString()))
}

export function parseFiles(files) {
  return Promise.all(files.map(parseFile))
    .then(result => _.flatten(_.flatten(result)))
    .then(result => _.reject(result, _.isEmpty))
}
