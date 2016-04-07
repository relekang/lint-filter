import test from 'ava'

import formatter from '../../src/formatters/text'

const input = [
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
const output = '\u001b[4mFile: ~/dev/lint-filter/src/index.js\u001b[24m\n' +
  '  ✖ \u001b[90m7:23\u001b[39m Extra semicolon. (semi)\n'

test.skip('text formatter should return checkstyle formatted output', t => {
  t.is(formatter(input), output)
})
