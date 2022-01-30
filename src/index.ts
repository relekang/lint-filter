import _ from 'lodash';
import stdin from 'get-stdin';

import { Options, parseOptions } from './cli';
import { checkFiles, checkString } from './checks';
import { formatOutput } from './formatters';
import { hasError } from './utils';
import { getDiffInformation } from './utils/git';
import { setErrorToWarning } from './utils/checkstyle';
import setup from './setup';
import { CheckstyleItemWithDiffCheck } from './parser';

function handleResult(result: CheckstyleItemWithDiffCheck[], options: Options) {
  const output = options.warning ? _.map(result, setErrorToWarning) : result;
  console.log(formatOutput(options.format, output));
  process.exit(hasError(output) ? 1 : 0);
}

export default async function main(): Promise<void> {
  const options = parseOptions();

  if (options.command === 'generate-config') {
    return setup(options);
  }

  const diff = await getDiffInformation(options);

  if (options.command === 'list-files') {
    return console.log(_.keys(diff).join(' '));
  }

  if (!options.command) {
    let result;
    if (_.isEmpty(options.files)) {
      const input = await stdin();

      if (input === '') {
        throw new Error('stdin was empty');
      }

      result = await checkString(diff, input);
    } else {
      result = await checkFiles(diff, options.files);
    }
    return handleResult(result, options);
  }

  throw new Error(`Unknown command '${options.command}'`);
}

if (!module.parent) {
  exports.default();
}
