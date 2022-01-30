import _ from 'lodash/fp';

import checkstyle from './checkstyle';
import text from './text';
import { CheckstyleItem, CheckstyleItemWithDiffCheck } from '../parser';

type Formatter = (result: OutputFormat, stats: Stats) => string;
type FormatKey = 'text' | 'checkstyle';
const formatters: Record<FormatKey, Formatter> = {
  checkstyle,
  text,
};

export type OutputFormat = Array<{
  filename: string;
  messages: Array<CheckstyleItem>;
}>;

export function preFormatter(data: Array<CheckstyleItem>): OutputFormat {
  return _.flow([
    _.groupBy('file'),
    _.entries,
    _.map<
      [string, CheckstyleItemWithDiffCheck[]],
      {
        filename: string;
        messages: Array<CheckstyleItem>;
      }
    >(([key, value]) => ({
      filename: key,
      messages: _.flow([
        _.filter('isInDiff'),
        _.map(_.omit(['isInDiff', 'file'])),
      ])(value),
    })),
    _.filter(({ messages }) => messages.length),
  ])(data);
}

export type Stats = {
  errors: {
    in: number;
    out: number;
    total: number;
  };
  warnings: {
    in: number;
    out: number;
    total: number;
  };
};

export function generateStats(data: Array<CheckstyleItem>): Stats {
  return {
    errors: {
      total: _.filter({ severity: 'error' }, data).length,
      in: _.filter({ severity: 'error', isInDiff: true }, data).length,
      out: _.filter({ severity: 'error', isInDiff: false }, data).length,
    },
    warnings: {
      total: _.filter({ severity: 'warning' }, data).length,
      in: _.filter({ severity: 'warning', isInDiff: true }, data).length,
      out: _.filter({ severity: 'warning', isInDiff: false }, data).length,
    },
  };
}

function isValidFormat(key: string): key is FormatKey {
  return Object.keys(formatters).includes(key);
}

export function formatOutput(format: string, data: Array<CheckstyleItem>) {
  let formatter;
  if (/^require:/.test(format)) {
    formatter = require(format.replace(/^require:/, ''));

    if (formatter.default) {
      formatter = formatter.default;
    }
  }

  if (isValidFormat(format)) {
    formatter = formatters[format] || formatters.text;
  }

  if (formatter) {
    return formatter(preFormatter(data), generateStats(data));
  }

  throw new Error(`Could not find formatter: '${format}'`);
}
