// @flow
import _ from 'lodash'

import checkstyle from './checkstyle'
import text from './text'

import type { CheckstyleItem } from '../parser'

const formatters = {
  checkstyle,
  text,
}

export type OutputFormat = Array<{ filename: string, messages: Array<CheckstyleItem> }>

export function preFormatter(data: Array<CheckstyleItem>): OutputFormat {
  return _.filter(_.map(_.groupBy(data, 'file'), (value, key) => {
    if (!_.isEmpty(_.filter(value, 'isInDiff'))) {
      return {
        filename: key,
        messages: _.filter(value, 'isInDiff').map(item => _.omit(item, ['isInDiff', 'file'])),
      }
    }
    return null
  }))
}

export type Stats = {
  errors: {in: number, out: number, total: number },
  warnings: {in: number, out: number, total: number },
}

export function generateStats(data: Array<CheckstyleItem>): Stats {
  return {
    errors: {
      total: _.filter(data, { severity: 'error' }).length,
      in: _.filter(data, { severity: 'error', isInDiff: true }).length,
      out: _.filter(data, { severity: 'error', isInDiff: false }).length,
    },
    warnings: {
      total: _.filter(data, { severity: 'warning' }).length,
      in: _.filter(data, { severity: 'warning', isInDiff: true }).length,
      out: _.filter(data, { severity: 'warning', isInDiff: false }).length,
    },
  }
}

export function formatOutput(format: string, data: Array<CheckstyleItem>) {
  let formatter
  if (/^require:/.test(format)) {
    // $SuppressFlow somehow flow marks the returned of replace as any
    formatter = require(format.replace(/^require:/, '')) // eslint-disable-line global-require

    if (formatter.default) {
      formatter = formatter.default
    }
  }

  if (_.has(formatters, format)) {
    formatter = formatters[format]
  }

  if (formatter) {
    return formatter(preFormatter(data), generateStats(data))
  }

  throw new Error(`Could not find formatter: '${format}'`)
}
