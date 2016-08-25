import test from 'ava'

import { getRulesFromCheckstyle, setSeverityToWarning } from '../../src/utils/checkstyle'

const checkstyleOutput = [
  { line: '7', column: '23', severity: 'error', message: 'Extra semicolon. (semi)',
    source: 'eslint.rules.semi', file: 'lint-filter/README.md' },
  { line: '7', column: '23', severity: 'error', message: 'Extra semicolon. (semi)',
    source: 'eslint.rules.semi', file: 'lint-filter/src/index.js' },
  { line: '7', column: '23', severity: 'error',
    message: 'Property should be placed on a new line. (react/jsx-first-prop-new-line)',
    source: 'eslint.rules.react/jsx-first-prop-new-line', file: 'r/src/index.js' },
]

test('getRulesFromCheckstyle(checkstyle) return a list of rules', async t => {
  const result = getRulesFromCheckstyle(checkstyleOutput)

  t.deepEqual(result, ['semi', 'react/jsx-first-prop-new-line'])
})

test('setSeverityToWarning(item) should set severity', t => {
  t.deepEqual(setSeverityToWarning({}), { severity: 'warning' })
  t.deepEqual(setSeverityToWarning({ severity: 'error' }), { severity: 'warning' })
})
