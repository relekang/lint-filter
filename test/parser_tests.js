import test from 'ava'
import sinon from 'sinon'
import { first } from 'lodash'

import * as parser from '../src/parser' // eslint-disable-line

test.serial('parseFile(path) should read file and call parseString', async t => {
  sinon.stub(parser, 'readFile').returns(Promise.resolve('content'))
  sinon.stub(parser, 'parseString').returns(Promise.resolve('parsed'))

  const parsed = await parser.parseFile('path')
  t.is(parsed, 'parsed')
  t.is(parser.parseString.args[0][0], 'content')

  parser.readFile.restore()
  parser.parseString.restore()
})

const parseStringResult = [
  { line: '7', column: '23', severity: 'error', message: 'Extra semicolon. (semi)',
    source: 'eslint.rules.semi', file: 'lint-filter/README.md' },
  { line: '7', column: '23', severity: 'error', message: 'Extra semicolon. (semi)',
    source: 'eslint.rules.semi', file: 'lint-filter/src/index.js' },
  { line: '7', column: '23', severity: 'error', message: 'Extra semicolon. (semi)',
    source: 'eslint.rules.semi', file: 'lint-filter/src/index.js' },
]

test.serial('parseString(str) should parse xml and make paths relative', async t => {
  const xml = await parser.readFile('./fixtures/eslint/extra-semi.xml')
  sinon.stub(process, 'cwd').returns('/Users/rolf/dev')
  const parsed = await parser.parseString(xml.toString())
  t.deepEqual(parsed, parseStringResult, JSON.stringify(parsed))
  process.cwd.restore()
})

test.serial('parseString(str) should parse xml and convert windows paths', async t => {
  const xml = await parser.readFile('./fixtures/eslint/dummy_js_windows.xml')
  sinon.stub(process, 'cwd').returns('C:\\dev')
  const parsed = await parser.parseString(xml.toString())
  t.is(first(parsed).file, 'lint-filter/test/fixtures/dummy.js')
  process.cwd.restore()
})

test.serial('parseFiles(files) should call parseFile and flatten out the result ', async t => {
  sinon.stub(parser, 'parseFile').returns(Promise.resolve(parseStringResult))
  const result = await parser.parseFiles([
    './fixtures/eslint/extra-semi.xml',
    './fixtures/eslint/extra-semi.xml',
  ])

  t.deepEqual(result, [...parseStringResult, ...parseStringResult])
})
