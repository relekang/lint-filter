import _ from 'lodash';
import test from 'ava';
import Promise from 'bluebird';
import cp from 'child_process';
import path from 'path';

const execFile = Promise.promisify(cp.execFile);
const babelPath = path.resolve(__dirname, '../node_modules/.bin/babel-node');
const filePath = path.resolve(__dirname, '../src/index.js');

test('CLI should show help section for option -h', async (t) => {
  const output = await execFile(babelPath, [filePath, '-h']);
  t.truthy(_.includes(output, 'Usage: index [options] <subcommand|file ...>'));
});
