import test from 'ava'
import sinon from 'sinon'
import Promise from 'bluebird'

import * as utils from '../src/utils'

const sandbox = sinon.sandbox.create()

test.beforeEach(() => {
  sandbox.restore()
})

test.afterEach(() => {
  utils.resetDiffCache()
})

test('parseDiffRanges(diff) should return empty array for no matches', t => {
  t.same(utils.parseDiffRanges(''), [])
})

test('parseDiffRanges(diff) should return diff range for one match', t => {
  t.same(utils.parseDiffRanges('@@ -0,0 +1,2 @@'), [[1, 3]])
  t.same(utils.parseDiffRanges('@@ -0,0 +14,20 @@'), [[14, 34]])
})

test('parseDiffRanges(diff) should return diff range for multiple matches', t => {
  const diff = `
+++ b/src/utils.js
@@ -8,27 +8,43 @@
const exec = Promise.promisify(cp.exec)
export function parseDiffRanges(diff) {
const matches = diff.match(/\@\@ -\d+,\d+ \+(\d+),(\d+) \@\@/g)
@@ -0,0 +45,55 @@
  `
  t.same(utils.parseDiffRanges(diff), [[8, 51], [45, 100]])
})

test(
  'parseDiffRanges(diff) should return not match range if it is in the code diff',
  t => t.same(utils.parseDiffRanges('+@@ -8,27 +8,43 @@'), [])
)

test('getDiffForFile(file) should call execFile(git diff ...)', t => {
  sandbox.stub(utils, 'execFile').returns(Promise.resolve(''))
  utils.getDiffForFile('somefile')
  t.ok(utils.execFile.calledWith('git', ['diff', 'origin/master...', 'somefile']))
})

test('getDiffForFile(file) should call execFile one time for same file', t => {
  sandbox.stub(utils, 'execFile').returns(Promise.delay(20))
  utils.getDiffForFile('somefile')
  utils.getDiffForFile('somefile')
  t.is(utils.execFile.callCount, 1)
})

test('isLineInDiff({ file, line }) should return true when line is in range', t => {
  sandbox.stub(utils, 'getDiffForFile').returns(Promise.resolve(''))
  sandbox.stub(utils, 'parseDiffRanges').returns([[1, 8]])
  return utils.isLineInDiff({ file: 'somefile', line: '4' })
    .then(result => t.is(result, true))
})

test('isLineInDiff({ file, line }) should return false when line is in range', t => {
  sandbox.stub(utils, 'getDiffForFile').returns(Promise.resolve(''))
  sandbox.stub(utils, 'parseDiffRanges').returns([[1, 8]])
  return utils.isLineInDiff({ file: 'somefile', line: '10' })
    .then(result => t.is(result, false))
})

test('hasError(result) should return true if contains error', t => {
  const input = [
    {
      line: '7',
      column: '23',
      severity: 'error',
      message: 'Extra semicolon. (semi)',
      source: 'eslint.rules.semi',
      file: '/Users/rolf/dev/lint-filter/README.md',
      isInDiff: true,
    },
  ]
  t.same(utils.hasError(input), true)
})

test('hasError(result) should return false if contains warning', t => {
  const input = [
    {
      line: '7',
      column: '23',
      severity: 'warning',
      message: 'Extra semicolon. (semi)',
      source: 'eslint.rules.semi',
      file: '/Users/rolf/dev/lint-filter/README.md',
      isInDiff: true,
    },
  ]
  t.same(utils.hasError(input), false)
})

test('hasError(result) should return false if contains error not in diff', t => {
  const input = [
    {
      line: '7',
      column: '23',
      severity: 'warning',
      message: 'Extra semicolon. (semi)',
      source: 'eslint.rules.semi',
      file: '/Users/rolf/dev/lint-filter/README.md',
      isInDiff: false,
    },
  ]
  t.same(utils.hasError(input), false)
})
