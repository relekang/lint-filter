import _ from 'lodash'

import checkstyle from './checkstyle'
import text from './text'

const formatters = {
  checkstyle,
  text,
}

export function preFormatter(data) {
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

export function generateStats(data) {
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

export function formatOutput(format, data) {
  if (!formatters.hasOwnProperty(format)) {
    throw new Error(`Formatter with name '${format}' does not exist.`)
  }
  return formatters[format](preFormatter(data), generateStats(data))
}
