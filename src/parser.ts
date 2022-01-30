import _, { assign, isEmpty } from 'lodash';
import fs from 'fs/promises';
import xml2js from 'xml2js';
import { promisify } from 'util';
import { cwd } from './utils/cwd';

export interface CheckstyleItem {
  line: string;
  column: string;
  severity: 'error' | 'warning';
  message: string;
  source: string;
  file: string;
}
export interface CheckstyleItemWithDiffCheck extends CheckstyleItem {
  isInDiff: boolean;
}

export function makePathRelative(filepath: string): string {
  const path = filepath.replace(`${cwd()}`, '').replace(/\\/g, '/');
  return path.substr(0, 1) === '/' ? path.substr(1) : path;
}

export function mapErrorsFromFileBlock(file: any) {
  return _.map(file.error, ({ $ }) =>
    assign({}, $, { file: makePathRelative(file.$.name) })
  );
}

export const xmlParser = promisify<string, any>(
  new xml2js.Parser().parseString
);
export async function parseString(str: string): Promise<Array<CheckstyleItem>> {
  const { checkstyle } = await xmlParser(str);

  return _(checkstyle.file)
    .map(mapErrorsFromFileBlock)
    .reject(isEmpty)
    .flatten()
    .value();
}

export async function parseFile(path: string): Promise<Array<CheckstyleItem>> {
  const content = await fs.readFile(path);
  return await parseString(content.toString());
}

export async function parseFiles(
  files: Array<string>
): Promise<Array<CheckstyleItem>> {
  const result = await Promise.all(files.map(parseFile));

  return _(result).flatten().flatten().reject(isEmpty).value();
}
