import { OutputFormat } from '../../src/formatters';
import checkstyle from '../../src/formatters/checkstyle';

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

const output = `<?xml version="1.0" encoding="utf-8"?>
<checkstyle version="4.3">
<file name="~/dev/lint-filter/src/index.js">
<error line="7" column="23" severity="error" message="Extra semicolon. (semi)" source="eslint.rules.semi" />
</file>
</checkstyle>`;

test('checkstyle formatter should return checkstyle formatted output', () => {
  expect(checkstyle(input)).toBe(output);
});
