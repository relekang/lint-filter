import test from 'ava'
import sinon from 'sinon'
import Promise from 'bluebird'
import diffFixture from '../fixtures/diff'

import * as gitUtils from '../../src/utils/git'
import * as spawn from '../../src/utils/spawn'

test.beforeEach(t => {
  t.context.sandbox = sinon.sandbox.create() // eslint-disable-line no-param-reassign
})

test.afterEach(t => t.context.sandbox.restore())

test('parseDiffRanges(diff) should return empty array for no matches', t => {
  t.deepEqual(gitUtils.parseDiffRanges(''), [])
})

test('parseDiffRanges(diff) should return diff range for one match', t => {
  const diff = `
+++ b/src/gitUtils.js
@@ -0,0 +1,2 @@
+const exec = Promise.promisify(cp.exec)
+export function parseDiffRanges(diff) {
+const matches = diff.match(/\@\@ -\d+,\d+ \+(\d+),(\d+) \@\@/g)
  `
  t.deepEqual(gitUtils.parseDiffRanges(diff), [[1, 3]])
})

test('parseDiffRanges(diff) should return diff range for multiple matches', t => {
  const diff = `
+++ b/src/gitUtils.js
@@ -8,27 +8,43 @@
+const exec = Promise.promisify(cp.exec)
+export function parseDiffRanges(diff) {
const matches = diff.match(/\@\@ -\d+,\d+ \+(\d+),(\d+) \@\@/g)
@@ -0,0 +45,55 @@
const exec = Promise.promisify(cp.exec)
export function parseDiffRanges(diff) {
+const matches = diff.match(/\@\@ -\d+,\d+ \+(\d+),(\d+) \@\@/g)
  `
  t.deepEqual(gitUtils.parseDiffRanges(diff), [[8, 9], [47, 47]])
})

test(
  'parseDiffRanges(diff) should return not match range if it is in the code diff',
  t => t.deepEqual(gitUtils.parseDiffRanges('+@@ -8,27 +8,43 @@'), [])
)

test.serial(
  'getDiffInformation({branch, hash}) should return object with diff ranges for all files',
  async (t) => {
    t.plan(1)
    t.context.sandbox.stub(spawn, 'default').returns(Promise.resolve(diffFixture))
    const diff = await gitUtils.getDiffInformation()

    t.deepEqual(diff, {
      'lint-filter.js': [],
      'src/index.js': [[7, 7], [13, 13]],
      'src/utils.js': [
        [6, 7], [10, 10], [13, 13], [20, 20], [27, 33],
        [35, 36], [39, 40], [48, 48], [63, 66],
      ],
      'test/utils_tests.js': [[43, 45], [47, 47], [50, 58], [61, 61], [77, 121]],
    })
  }
)

test.serial(
  'getDiffInformation({branch, hash}) should use origin/master as default',
  async (t) => {
    t.plan(1)
    t.context.sandbox.stub(spawn, 'default').returns(Promise.resolve(diffFixture))
    await gitUtils.getDiffInformation({})

    t.deepEqual(
      spawn.default.getCall(0).args,
      ['git', ['merge-base', 'origin/master', 'HEAD']]
    )
  }
)

test.serial(
  'getDiffInformation({branch, hash}) should use custom branch when specified',
  async (t) => {
    t.plan(1)
    t.context.sandbox.stub(spawn, 'default').returns(Promise.resolve(diffFixture))
    await gitUtils.getDiffInformation({ branch: 'origin/production' })

    t.deepEqual(
      spawn.default.getCall(0).args,
      ['git', ['merge-base', 'origin/production', 'HEAD']]
    )
  }
)
