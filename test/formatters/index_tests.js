import test from 'ava';

import {
  formatOutput,
  generateStats,
  preFormatter,
} from '../../src/formatters';

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

test('preFormatter(data) should return formatted output', (t) => {
  t.deepEqual(preFormatter(input), preFormatterOutput);
});

test('generateStats(data) should return stats for data', (t) => {
  const stats = generateStats(input);

  t.deepEqual(stats.errors, { in: 1, out: 1, total: 2 });
  t.deepEqual(stats.warnings, { in: 0, out: 1, total: 1 });
});

test('formatOutput(format, data) should call correct formatter', (t) => {
  const output = formatOutput('text', input);
  t.is(output, textOutput);
});

test('formatOutput(format, data) should call correct external formatter', (t) => {
  const output = formatOutput('require:./text', input);
  t.is(output, textOutput);
});

test('formatOutput(format, data) should throw if formatter does not exist', (t) => {
  t.throws(() => {
    formatOutput('format..', input);
  });
});

test('formatOutput(format, data) should throw if external formatter does not exist', (t) => {
  t.throws(() => {
    formatOutput('require:formaty', input);
  });
});
