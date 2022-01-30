import { CheckstyleItemWithDiffCheck } from '../../src/parser';
import { hasError, isLineInDiff } from '../../src/utils';

test('isLineInDiff({ file, line }, diff) should return true when line is in range', () => {
  expect(
    isLineInDiff({ file: 'somefile', line: '4' }, { somefile: [[1, 8]] })
  ).toBe(true);
});

test('isLineInDiff({ file, line }, diff) should return false when line is not in range', () => {
  expect(
    isLineInDiff({ file: 'somefile', line: '10' }, { somefile: [[1, 8]] })
  ).toBe(false);
});

test('isLineInDiff({ file, line }, diff) should return false when file is not in diff', () => {
  expect(isLineInDiff({ file: 'somefile', line: '10' }, {})).toBe(false);
});

test('hasError(result) should return true if contains error', () => {
  const input: CheckstyleItemWithDiffCheck[] = [
    {
      line: '7',
      column: '23',
      severity: 'error',
      message: 'Extra semicolon. (semi)',
      source: 'eslint.rules.semi',
      file: '/Users/rolf/dev/lint-filter/README.md',
      isInDiff: true,
    },
  ];
  expect(hasError(input)).toEqual(true);
});

test('hasError(result) should return false if contains warning', () => {
  const input: CheckstyleItemWithDiffCheck[] = [
    {
      line: '7',
      column: '23',
      severity: 'warning',
      message: 'Extra semicolon. (semi)',
      source: 'eslint.rules.semi',
      file: '/Users/rolf/dev/lint-filter/README.md',
      isInDiff: true,
    },
  ];
  expect(hasError(input)).toEqual(false);
});

test('hasError(result) should return false if contains error not in diff', () => {
  const input: CheckstyleItemWithDiffCheck[] = [
    {
      line: '7',
      column: '23',
      severity: 'warning',
      message: 'Extra semicolon. (semi)',
      source: 'eslint.rules.semi',
      file: '/Users/rolf/dev/lint-filter/README.md',
      isInDiff: false,
    },
  ];
  expect(hasError(input)).toEqual(false);
});
