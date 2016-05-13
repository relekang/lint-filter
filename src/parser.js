import _, { assign, isEmpty } from 'lodash'
import fs from 'fs'
import Promise from 'bluebird'
import xml2js from 'xml2js'

export const readFile = Promise.promisify(fs.readFile)

export function makePathRelative(filepath) {
  return filepath.replace(`${process.cwd()}`, '').replace(/\\/g, '/').slice(1)
}

export function mapErrorsFromFileBlock(file) {
  return _.map(file.error, ({ $ }) => assign({}, $, { file: makePathRelative(file.$.name) }))
}

export const xmlParser = Promise.promisify(new xml2js.Parser().parseString)
export async function parseString(str) {
  const { checkstyle } = await exports.xmlParser(str)

  return _(checkstyle.file)
    .map(mapErrorsFromFileBlock)
    .reject(isEmpty)
    .flatten()
    .value()
}

export async function parseFile(path) {
  const content = await exports.readFile(path)
  return await exports.parseString(content.toString())
}

export async function parseFiles(files) {
  const result = await Promise.all(files.map(exports.parseFile))

  return _(result)
    .flatten()
    .flatten()
    .reject(isEmpty)
    .value()
}
