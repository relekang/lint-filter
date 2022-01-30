import _ from 'lodash';
import inRange from 'in-range';

import { DiffInfo } from './git';
import { CheckstyleItemWithDiffCheck } from '../parser';

export function isLineInDiff(
  { file, line }: { file: string; line: string },
  diff: DiffInfo = {}
): boolean {
  const ranges = diff[file];

  if (ranges) {
    return ranges.reduce<boolean>(
      (lastValue, [start, end]) =>
        lastValue || inRange(parseInt(line, 10), { start, end }),
      false
    );
  }

  return false;
}

export function hasError(
  result: Array<CheckstyleItemWithDiffCheck> = []
): boolean {
  return _.some(result, { severity: 'error', isInDiff: true });
}
