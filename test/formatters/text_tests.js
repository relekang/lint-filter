import test from 'ava'

import formatter from '../../src/formatters/default'

const input = [
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
const output = '\u001b[4mFile: ~/dev/steering/src/index.js\u001b[24m\n' +
  '  ✖ \u001b[90m7:23\u001b[39m Extra semicolon. (semi)\n'

test('text formatter should return checkstyle formatted output', t => {
  t.is(formatter(input), output)
})
