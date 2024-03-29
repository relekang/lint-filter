import { OutputFormat } from '../../src/formatters';
import formatter from '../../src/formatters/text';

const input: OutputFormat = [
  {
    filename: '~/dev/lint-filter/src/index.js',
    messages: [
      {
        line: '7',
        column: '23',
        severity: 'error',
        message: 'Extra semicolon. (semi)',
        source: 'eslint.rules.semi',
        file: 'file',
      },
    ],
  },
];

const stats = {
  errors: { in: 1, out: 9, total: 10 },
  warnings: { in: 3, out: 9, total: 11 },
};

const output =
  '\u001b[4mFile: ~/dev/lint-filter/src/index.js\u001b[24m\n' +
  '  \u001b[31m✖\u001b[39m \u001b[90m7:23\u001b[39m Extra semicolon. (semi)\n' +
  '\n1 of 10 errors and 3 of 11 warnings';

test('text formatter should return formatted output', () => {
  expect(formatter(input, stats)).toBe(output);
});
