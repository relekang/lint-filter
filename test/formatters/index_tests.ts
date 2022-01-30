import stripAnsi from 'strip-ansi';

import {
  formatOutput,
  generateStats,
  preFormatter,
} from '../../src/formatters';
import { CheckstyleItemWithDiffCheck } from '../../src/parser';

const input: CheckstyleItemWithDiffCheck[] = [
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
];

const preFormatterOutput = [
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
];

const textOutput =
  'File: ~/dev/lint-filter/src/index.js\n  ' +
  '✖ 7:23 Extra semicolon. (semi)\n\n' +
  '1 of 2 errors and 0 of 1 warnings';

test('preFormatter(data) should return formatted output', () => {
  expect(preFormatter(input)).toEqual(preFormatterOutput);
});

test('generateStats(data) should return stats for data', () => {
  const stats = generateStats(input);

  expect(stats.errors).toEqual({ in: 1, out: 1, total: 2 });
  expect(stats.warnings).toEqual({ in: 0, out: 1, total: 1 });
});

test('formatOutput(format, data) should call correct formatter', () => {
  const output = formatOutput('text', input);
  expect(stripAnsi(output)).toEqual(textOutput);
});

test('formatOutput(format, data) should call correct external formatter', () => {
  const output = formatOutput('require:./text', input);
  expect(stripAnsi(output)).toEqual(textOutput);
});

test('formatOutput(format, data) should throw if formatter does not exist', () => {
  expect(() => {
    formatOutput('format..', input);
  }).toThrow();
});

test('formatOutput(format, data) should throw if external formatter does not exist', () => {
  expect(() => {
    formatOutput('require:formaty', input);
  }).toThrow();
});
