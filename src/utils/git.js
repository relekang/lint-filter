// @flow
import _ from 'lodash';

import spawn from './spawn';

import type { Options } from '../cli';

export type DiffInfo = {
  [key: string]: Array<Array<number>>,
};

export function parseDiffRanges(diff: string) {
  const lines = diff.split(/\r\n|[\n\v\f\r\x85\u2028\u2029]/);
  const ranges = [];
  let lineNumber;
  lines.forEach((line) => {
    const matches = /^@@ -\d+,\d+ \+(\d+),\d+ @@/.exec(line);
    if (matches) lineNumber = --matches[1];
    if (lineNumber !== undefined && /^\+/.test(line)) ranges.push(lineNumber);
    if (lineNumber !== undefined && !/^-/.test(line)) lineNumber++;
  });
  return ranges.reduce((previous, current) => {
    const last = previous[previous.length - 1];
    if (last && current === last[1] + 1) last[1] = current;
    else previous.push([current, current]);
    return previous;
  }, []);
}

const filenameRegex = /^a\/([^\n]+) b\/[^\n]+/;
export function parseDiffForFile(diff: string) {
  const matches = filenameRegex.exec(diff);
  if (matches === null) {
    return null;
  }
  const filename = matches[1];
  return { filename, ranges: parseDiffRanges(diff) };
}

export function parseFullDiff(diff: string) {
  return _(`\n${diff}`.split('\ndiff --git '))
    .map(parseDiffForFile)
    .filter(_.isObject)
    .reduce(
      (lastValue, { filename, ranges }) =>
        _.assign({}, lastValue, {
          [filename]: lastValue[filename]
            ? _.concat(lastValue[filename], ranges)
            : ranges,
        }),
      {}
    );
}

export async function getDiffInformation({
  branch = 'origin/master',
  hash,
}: Options = {}): Promise<DiffInfo> {
  const diffAgainst =
    hash || (await spawn('git', ['merge-base', branch, 'HEAD']));
  return parseFullDiff(
    await spawn('git', ['--no-pager', 'diff', '--no-color', diffAgainst.trim()])
  );
}
