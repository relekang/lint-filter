import test from 'ava'

import * as utils from '../../src/utils'

test('isLineInDiff({ file, line }, diff) should return true when line is in range', t => {
  t.is(utils.isLineInDiff({ file: 'somefile', line: '4' }, { somefile: [[1, 8]] }), true)
})

test('isLineInDiff({ file, line }, diff) should return replace working dir from filename', t => {
  t.is(
    utils.isLineInDiff({ file: `${process.cwd()}/somefile`, line: '4' }, { somefile: [[1, 8]] }),
    true
  )
})

test('isLineInDiff({ file, line }, diff) should return false when line is not in range', t => {
  t.is(utils.isLineInDiff({ file: 'somefile', line: '10' }, { somefile: [[1, 8]] }), false)
})

test('isLineInDiff({ file, line }, diff) should return false when file is not in diff', t => {
  t.is(utils.isLineInDiff({ file: 'somefile', line: '10' }, {}), false)
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
  t.deepEqual(utils.hasError(input), true)
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
  t.deepEqual(utils.hasError(input), false)
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
  t.deepEqual(utils.hasError(input), false)
})
