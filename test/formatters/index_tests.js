import test from 'ava'

import { preFormatter } from '../../src/formatters'

const input = [
  {
    line: '7',
    column: '23',
    severity: 'error',
    message: 'Extra semicolon. (semi)',
    source: 'eslint.rules.semi',
    file: '~/dev/steering/src/checks.js',
    isInDiff: false,
  },
  {
    line: '7',
    column: '23',
    severity: 'error',
    message: 'Extra semicolon. (semi)',
    source: 'eslint.rules.semi',
    file: '~/dev/steering/src/index.js',
    isInDiff: true,
  },
]

const output = [
  {
    filename: '~/dev/steering/src/index.js',
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
  t.same(preFormatter(input), output)
})
