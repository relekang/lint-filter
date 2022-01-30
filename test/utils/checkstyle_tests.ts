import { CheckstyleItem } from '../../src/parser';
import {
  getRulesFromCheckstyle,
  setErrorToWarning,
} from '../../src/utils/checkstyle';

const checkstyleOutput: CheckstyleItem[] = [
  {
    line: '7',
    column: '23',
    severity: 'error',
    message: 'Extra semicolon. (semi)',
    source: 'eslint.rules.semi',
    file: 'lint-filter/README.md',
  },
  {
    line: '7',
    column: '23',
    severity: 'error',
    message: 'Extra semicolon. (semi)',
    source: 'eslint.rules.semi',
    file: 'lint-filter/src/index.js',
  },
  {
    line: '7',
    column: '23',
    severity: 'error',
    message:
      'Property should be placed on a new line. (react/jsx-first-prop-new-line)',
    source: 'eslint.rules.react/jsx-first-prop-new-line',
    file: 'r/src/index.js',
  },
];

test('getRulesFromCheckstyle(checkstyle) return a list of rules', async () => {
  const result = getRulesFromCheckstyle(checkstyleOutput);

  expect(result).toEqual(['semi', 'react/jsx-first-prop-new-line']);
});

test('setErrorToWarning(item) should error severity to warning', () => {
  expect(setErrorToWarning({ severity: 'error' })).toEqual({
    severity: 'warning',
  });
});

test('setErrorToWarning(item) should leave severity as is if it is not error', () => {
  expect(setErrorToWarning({})).toEqual({});
  expect(setErrorToWarning({ severity: 'info' })).toEqual({ severity: 'info' });
});
