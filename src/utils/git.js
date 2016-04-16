import _ from 'lodash'
import cp from 'child_process'
import Promise from 'bluebird'

export const execFile = Promise.promisify(cp.execFile)

export function parseDiffRanges(diff) {
  const matches = diff.match(/^@@ -\d+,\d+ \+(\d+),(\d+) @@/gm)
  if (!_.isEmpty(matches)) {
    return matches.map(match => {
      const [start, end] = /^@@ -\d+,\d+ \+(\d+),(\d+) @@/.exec(match).slice(1, 3)
      return [parseInt(start, 10), parseInt(start, 10) + parseInt(end, 10)]
    })
  }
  return []
}

const filenameRegex = /a\/([^\n]+) b\/[^\n]+/
export function parseDiffForFile(diff) {
  const matches = filenameRegex.exec(diff)
  if (matches === null) {
    return null
  }
  const filename = matches[1]
  return { filename, ranges: parseDiffRanges(diff) }
}

export function parseFullDiff(diff) {
  return _(diff.split('diff --git '))
    .map(parseDiffForFile)
    .filter(_.isObject)
    .reduce((lastValue, { filename, ranges }) => _.assign(
      {},
      lastValue,
      { [filename]: lastValue[filename] ? _.concat(lastValue[filename], ranges) : ranges })
    , {})
}

export async function getDiffInformation(hash) {
  const diffAgainst = hash || await exports.execFile('git', ['merge-base', 'origin/master', 'HEAD'])
  return parseFullDiff(await exports.execFile('git', ['diff', diffAgainst.trim()]))
}
