// @flow
import checkstyleFormatter from 'checkstyle-formatter';

import type { OutputFormat } from './';

export default function checkstyle(result: OutputFormat) {
  return checkstyleFormatter(result);
}
