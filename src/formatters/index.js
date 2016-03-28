import _ from 'lodash'

import checkstyle from './checkstyle'

const formatters = {
  checkstyle,
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

export function formatOutput(format, data) {
  if (!formatters.hasOwnProperty(format)) {
    throw new Error(`Formatter with name '${format}' does not exist.`)
  }
  return formatters[format](preFormatter(data))
}
