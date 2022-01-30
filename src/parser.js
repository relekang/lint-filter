// @flow
import _, { assign, isEmpty } from 'lodash';
import fs from 'fs';
import xml2js from 'xml2js';
import { promisify } from 'util';

export type CheckstyleItem = {
  line: string,
  column: string,
  severity: 'error' | 'warning',
  message: string,
  source: string,
  file: string,
};

export const readFile = promisify(fs.readFile);

export function makePathRelative(filepath: string): string {
  const path = filepath.replace(`${process.cwd()}`, '').replace(/\\/g, '/');
  return path.substr(0, 1) === '/' ? path.substr(1) : path;
}

export function mapErrorsFromFileBlock(file: Object) {
  return _.map(file.error, ({ $ }) =>
    assign({}, $, { file: makePathRelative(file.$.name) })
  );
}

export const xmlParser = promisify(new xml2js.Parser().parseString);
export async function parseString(str: string): Promise<Array<CheckstyleItem>> {
  const { checkstyle } = await exports.xmlParser(str);

  return _(checkstyle.file)
    .map(mapErrorsFromFileBlock)
    .reject(isEmpty)
    .flatten()
    .value();
}

export async function parseFile(path: string): Promise<Array<CheckstyleItem>> {
  const content = await exports.readFile(path);
  return await exports.parseString(content.toString());
}

export async function parseFiles(
  files: Array<string>
): Promise<Array<CheckstyleItem>> {
  const result = await Promise.all(files.map(exports.parseFile));

  return _(result).flatten().flatten().reject(isEmpty).value();
}
