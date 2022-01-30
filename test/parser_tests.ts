import fs from 'fs/promises';

import * as parser from '../src/parser';
import { cwd } from '../src/utils/cwd';

jest.mock('../src/utils/cwd', () => ({
  cwd: jest.fn(() => '/Users/rolf/dev'),
}));

const expected: Record<string, parser.CheckstyleItem[]> = {
  'extra-semi': [
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
      message: 'Extra semicolon. (semi)',
      source: 'eslint.rules.semi',
      file: 'lint-filter/src/index.js',
    },
    {
      line: '7',
      column: '23',
      severity: 'error',
      message: 'Extra semicolon. (semi)',
      source: 'eslint.rules.semi',
      file: 'lint-filter/src/index.js',
    },
  ],
  dummy_js_windows: [
    {
      column: '3',
      file: 'C:/dev/lint-filter/test/fixtures/dummy.js',
      line: '6',
      message: 'Unexpected console statement. (no-console)',
      severity: 'warning',
      source: 'eslint.rules.no-console',
    },
    {
      column: '16',
      file: 'C:/dev/lint-filter/test/fixtures/dummy.js',
      line: '6',
      message: 'Unnecessary escape character: \\o (no-useless-escape)',
      severity: 'error',
      source: 'eslint.rules.no-useless-escape',
    },
    {
      column: '21',
      file: 'C:/dev/lint-filter/test/fixtures/dummy.js',
      line: '6',
      message: 'Extra semicolon. (semi)',
      severity: 'error',
      source: 'eslint.rules.semi',
    },
    {
      column: '1',
      file: 'C:/dev/lint-filter/test/fixtures/dummy.js',
      line: '9',
      message: 'Unexpected console statement. (no-console)',
      severity: 'warning',
      source: 'eslint.rules.no-console',
    },
    {
      column: '14',
      file: 'C:/dev/lint-filter/test/fixtures/dummy.js',
      line: '11',
      message: 'Extra semicolon. (semi)',
      severity: 'error',
      source: 'eslint.rules.semi',
    },
    {
      column: '14',
      file: 'lint-filter/test/fixtures/dummy.js',
      line: '11',
      message: 'Extra semicolon. (semi)',
      severity: 'error',
      source: 'eslint.rules.semi',
    },
  ],
};

test('parseFile(path) should read file and call parseString', async () => {
  const parsed = await parser.parseFile(
    './test/fixtures/eslint/extra-semi.xml'
  );
  expect(parsed).toEqual(expected['extra-semi']);
});

test('parseString(str) should parse xml and make paths relative', async () => {
  const xml = await fs.readFile('./test/fixtures/eslint/extra-semi.xml');
  const parsed = await parser.parseString(xml.toString());
  expect(parsed).toEqual(expected['extra-semi']);
});

test('parseString(str) should parse xml and convert windows paths', async () => {
  jest.mocked(cwd).mockReturnValueOnce('C://');
  const xml = await fs.readFile('./test/fixtures/eslint/dummy_js_windows.xml');
  const parsed = await parser.parseString(xml.toString());
  expect(parsed).toEqual(expected['dummy_js_windows']);
});

test('parseFiles(files) should call parseFile and flatten out the result ', async () => {
  const result = await parser.parseFiles([
    './test/fixtures/eslint/extra-semi.xml',
    './test/fixtures/eslint/extra-semi.xml',
  ]);

  expect(result).toEqual([
    ...expected['extra-semi'],
    ...expected['extra-semi'],
  ]);
});
