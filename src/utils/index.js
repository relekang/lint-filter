import _ from 'lodash'
import inRange from 'in-range'

export function isLineInDiff({ file, line }, diff = {}) {
  const ranges = diff[file.replace(`${process.cwd()}/`, '')]

  if (ranges) {
    return ranges.reduce((lastValue, [addStart, addEnd]) =>
      lastValue || inRange(parseInt(line, 10), addStart, addEnd)
    , false)
  }

  return false
}

export function hasError(result = []) {
  return _.some(result, { severity: 'error', isInDiff: true })
}
