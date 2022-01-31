import cp from 'child_process';
import path from 'path';
import { promisify } from 'util';

const execFile = promisify(cp.execFile);
const babelPath = path.resolve(__dirname, '../node_modules/.bin/ts-node');
const filePath = path.resolve(__dirname, '../src/index.ts');

test('CLI should show help section for option -h', async () => {
  const output = await execFile(babelPath, [
    '--transpile-only',
    filePath,
    '-h',
  ]);
  expect(output.stdout).toContain(
    'Usage: lint-filter [options] <subcommand|file ...>'
  );
  expect(output.stdout).toMatchInlineSnapshot(`
    "Usage: lint-filter [options] <subcommand|file ...>

    Options:
      -h, --help                                                           [boolean]
          --version  Show version number                                   [boolean]
      -f, --format                                        [string] [default: \\"text\\"]
      -b, --branch                                                          [string]
      -l, --linter                                      [string] [default: \\"eslint\\"]
      -w, --warning                                                        [boolean]
    "
  `);
});
