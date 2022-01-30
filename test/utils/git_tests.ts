import mockDiffFixture from '../fixtures/diff';

import * as gitUtils from '../../src/utils/git';
import { spawn } from '../../src/utils/spawn';

jest.mock('../../src/utils/spawn', () => ({
  spawn: jest.fn().mockResolvedValue(mockDiffFixture),
}));

afterEach(() => jest.clearAllMocks());

test('parseDiffRanges(diff) should return empty array for no matches', () => {
  expect(gitUtils.parseDiffRanges('')).toEqual([]);
});

test('parseDiffRanges(diff) should return diff range for one match', () => {
  const diff = `
+++ b/src/gitUtils.js
@@ -0,0 +1,2 @@
+const exec = promisify(cp.exec)
+export function parseDiffRanges(diff) {
+const matches = diff.match(/\@\@ -\d+,\d+ \+(\d+),(\d+) \@\@/g)
  `;
  expect(gitUtils.parseDiffRanges(diff)).toEqual([[1, 3]]);
});

test('parseDiffRanges(diff) should return diff range for multiple matches', () => {
  const diff = `
+++ b/src/gitUtils.js
@@ -8,27 +8,43 @@
+const exec = promisify(cp.exec)
+export function parseDiffRanges(diff) {
const matches = diff.match(/\@\@ -\d+,\d+ \+(\d+),(\d+) \@\@/g)
@@ -0,0 +45,55 @@
const exec = promisify(cp.exec)
export function parseDiffRanges(diff) {
+const matches = diff.match(/\@\@ -\d+,\d+ \+(\d+),(\d+) \@\@/g)
  `;
  expect(gitUtils.parseDiffRanges(diff)).toEqual([
    [8, 9],
    [47, 47],
  ]);
});

test('parseDiffRanges(diff) should return not match range if it is in the code diff', () =>
  expect(gitUtils.parseDiffRanges('+@@ -8,27 +8,43 @@')).toEqual([]));

test('getDiffInformation({branch, hash}) should return object with diff ranges for all files', async () => {
  const diff = await gitUtils.getDiffInformation();

  expect(diff).toEqual({
    'lint-filter.js': [],
    'src/index.js': [
      [7, 7],
      [13, 13],
    ],
    'src/utils.js': [
      [6, 7],
      [10, 10],
      [13, 13],
      [20, 20],
      [27, 33],
      [35, 36],
      [39, 40],
      [48, 48],
      [63, 66],
    ],
    'test/utils_tests.js': [
      [43, 45],
      [47, 47],
      [50, 58],
      [61, 61],
      [77, 121],
    ],
  });
});

test('getDiffInformation({branch, hash}) should use origin/master as default', async () => {
  await gitUtils.getDiffInformation({});

  expect(spawn).toHaveBeenCalledWith('git', [
    'merge-base',
    'origin/master',
    'HEAD',
  ]);
});

test('getDiffInformation({branch, hash}) should use custom branch when specified', async () => {
  await gitUtils.getDiffInformation({ branch: 'origin/production' });

  expect(spawn).toHaveBeenCalledWith('git', [
    'merge-base',
    'origin/production',
    'HEAD',
  ]);
});
