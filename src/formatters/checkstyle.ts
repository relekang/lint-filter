import checkstyleFormatter from 'checkstyle-formatter';

import { OutputFormat } from './';

export default function checkstyle(result: OutputFormat) {
  return checkstyleFormatter(result);
}
