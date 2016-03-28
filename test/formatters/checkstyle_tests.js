import test from 'ava'
import checkstyle from '../../src/formatters/checkstyle'

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

const output =
`<?xml version="1.0" encoding="utf-8"?>
<checkstyle version="4.3">
<file name="~/dev/steering/src/index.js">
<error line="7" column="23" severity="error" message="Extra semicolon. (semi)" />
</file>
</checkstyle>`

test('checkstyle formatter should return checkstyle formatted output', t => {
  t.is(checkstyle(input), output)
})
