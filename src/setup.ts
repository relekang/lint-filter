import _ from 'lodash';
import fs from 'fs/promises';

import { spawn } from './utils/spawn';
import { getRulesFromCheckstyle } from './utils/checkstyle';
import { parseString } from './parser';
import { Options } from './cli';

export default function setup(options: Options) {
  switch (options.linter) {
    case 'eslint':
      return exports.setupEslint(options);

    default:
      throw new Error('Unknown linter');
  }
}

export async function getEslintRcFilename(path: string = '.'): Promise<string> {
  const files = await fs.readdir(path);
  return files.reduce((last, item) => {
    if (/^\.eslintrc/.test(item)) {
      return item;
    }
    return last;
  });
}

export async function setupEslint(): Promise<void> {
  let result;
  try {
    result = await spawn('eslint', ['.', '-f', 'checkstyle']);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    result = error.stdout;
  }

  const rules = getRulesFromCheckstyle(await parseString(result));
  const config = {
    extends: await getEslintRcFilename(),
    rules: _.reduce(
      rules,
      (last, rule) => _.assign({}, last, { [rule]: 0 }),
      {}
    ),
  };

  console.log(JSON.stringify(config, null, 2));
}
