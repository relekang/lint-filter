// @flow
import _ from 'lodash'

import spawn from './spawn'

export type DiffInfo = {
  [key: string]: Array<Array<number>>,
}

export function parseDiffRanges(diff: string) {
  const matches = diff.match(/^@@ -\d+,\d+ \+(\d+),(\d+) @@/gm)
  return _.map(matches, match => {
    const [start, end] = /^@@ -\d+,\d+ \+(\d+),(\d+) @@/.exec(match).slice(1, 3)
    return [parseInt(start, 10), parseInt(start, 10) + parseInt(end, 10)]
  })
}

const filenameRegex = /^a\/([^\n]+) b\/[^\n]+/
export function parseDiffForFile(diff: string) {
  const matches = filenameRegex.exec(diff)
  if (matches === null) {
    return null
  }
  const filename = matches[1]
  return { filename, ranges: parseDiffRanges(diff) }
}

export function parseFullDiff(diff: string) {
  return _(`\n${diff}`.split('\ndiff --git '))
    .map(parseDiffForFile)
    .filter(_.isObject)
    .reduce((lastValue, { filename, ranges }) => _.assign(
      {},
      lastValue,
      { [filename]: lastValue[filename] ? _.concat(lastValue[filename], ranges) : ranges })
    , {})
}

export async function getDiffInformation(
  { branch = 'origin/master', hash }: {branch: string, hash: string } = {}
): Promise<DiffInfo> {
  const diffAgainst = hash || await spawn('git', ['merge-base', branch, 'HEAD'])
  return parseFullDiff(await spawn('git', ['diff', diffAgainst.trim()]))
}
