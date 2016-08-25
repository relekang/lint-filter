// @flow
import _ from 'lodash'
import inRange from 'in-range'

import type { DiffInfo } from './git'
import type { CheckstyleItem } from '../parser'

export function isLineInDiff({ file, line }: CheckstyleItem, diff: DiffInfo = {}): boolean {
  const ranges = diff[file]

  if (ranges) {
    return ranges.reduce(
      (lastValue, [addStart, addEnd]) => lastValue || inRange(parseInt(line, 10), addStart, addEnd)
    , false)
  }

  return false
}

export function hasError(result: Array<CheckstyleItem> = []): boolean {
  return _.some(result, { severity: 'error', isInDiff: true })
}
