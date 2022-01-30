import _ from 'lodash';

import { isLineInDiff } from './utils';
import { CheckstyleItemWithDiffCheck, parseFiles, parseString } from './parser';

import { DiffInfo } from './utils/git';
import { CheckstyleItem } from './parser';

export function checkError(error: CheckstyleItem, diff: DiffInfo) {
  const isInDiff = isLineInDiff(error, diff);
  return _.assign({}, error, { isInDiff });
}

export function checkErrors(
  errors: Array<CheckstyleItem>,
  diff: DiffInfo
): CheckstyleItemWithDiffCheck[] {
  return errors.map((error) => checkError(error, diff));
}

export async function checkFiles(
  diff: DiffInfo,
  files: Array<string>
): Promise<CheckstyleItemWithDiffCheck[]> {
  const errors = await parseFiles(files);
  return checkErrors(errors, diff);
}

export async function checkString(diff: DiffInfo, str: string) {
  const errors = await parseString(str);
  return checkErrors(errors, diff);
}
