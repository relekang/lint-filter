import test from 'ava'
import sinon from 'sinon'
import Promise from 'bluebird'
import diffFixture from '../fixtures/diff'

import * as gitUtils from '../../src/utils/git'

test.beforeEach(t => {
  t.context.sandbox = sinon.sandbox.create() // eslint-disable-line no-param-reassign
})

test.afterEach(t => t.context.sandbox.restore())

test('parseDiffRanges(diff) should return empty array for no matches', t => {
  t.same(gitUtils.parseDiffRanges(''), [])
})

test('parseDiffRanges(diff) should return diff range for one match', t => {
  t.same(gitUtils.parseDiffRanges('@@ -0,0 +1,2 @@'), [[1, 3]])
  t.same(gitUtils.parseDiffRanges('@@ -0,0 +14,20 @@'), [[14, 34]])
})

test('parseDiffRanges(diff) should return diff range for multiple matches', t => {
  const diff = `
+++ b/src/gitUtils.js
@@ -8,27 +8,43 @@
const exec = Promise.promisify(cp.exec)
export function parseDiffRanges(diff) {
const matches = diff.match(/\@\@ -\d+,\d+ \+(\d+),(\d+) \@\@/g)
@@ -0,0 +45,55 @@
  `
  t.same(gitUtils.parseDiffRanges(diff), [[8, 51], [45, 100]])
})

test(
  'parseDiffRanges(diff) should return not match range if it is in the code diff',
  t => t.same(gitUtils.parseDiffRanges('+@@ -8,27 +8,43 @@'), [])
)

test('getDiffInformation(hash) should return object with diff ranges for all files', async (t) => {
  t.plan(1)
  t.context.sandbox.stub(gitUtils, 'execFile').returns(Promise.resolve(diffFixture))
  const diff = await gitUtils.getDiffInformation('1f2d836')

  t.same(diff, {
    'lint-filter.js': [[1, 3], [2, 5]],
    'src/index.js': [[4, 17]],
    'src/utils.js': [[3, 44], [45, 52], [60, 67]],
    'test/utils_tests.js': [[40, 65], [74, 122]],
  })
})
