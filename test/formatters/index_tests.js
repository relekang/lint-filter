import test from 'ava'

import { generateStats, preFormatter } from '../../src/formatters'

const input = [
  {
    line: '5',
    column: '23',
    severity: 'warning',
    message: 'Extra semicolon. (semi)',
    source: 'eslint.rules.semi',
    file: '~/dev/lint-filter/src/checks.js',
    isInDiff: false,
  },
  {
    line: '7',
    column: '23',
    severity: 'error',
    message: 'Extra semicolon. (semi)',
    source: 'eslint.rules.semi',
    file: '~/dev/lint-filter/src/checks.js',
    isInDiff: false,
  },
  {
    line: '7',
    column: '23',
    severity: 'error',
    message: 'Extra semicolon. (semi)',
    source: 'eslint.rules.semi',
    file: '~/dev/lint-filter/src/index.js',
    isInDiff: true,
  },
]

const output = [
  {
    filename: '~/dev/lint-filter/src/index.js',
    messages: [
      {
        line: '7',
        column: '23',
        severity: 'error',
        message: 'Extra semicolon. (semi)',
        source: 'eslint.rules.semi',
      },
    ],
  },
]

test('preFormatter(data) should return formatted output', t => {
  t.deepEqual(preFormatter(input), output)
})

test('generateStats(data) should return stats for data', t => {
  const stats = generateStats(input)

  t.deepEqual(stats.errors, { in: 1, out: 1, total: 2 })
  t.deepEqual(stats.warnings, { in: 0, out: 1, total: 1 })
})
