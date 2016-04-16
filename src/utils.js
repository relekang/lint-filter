import _ from 'lodash'
import cp from 'child_process'
import Promise from 'bluebird'
import inRange from 'in-range'

export const execFile = Promise.promisify(cp.execFile)
export const execFileSync = cp.execFileSync

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

let diffAgainst
let diffs = {}
export function resetDiffCache() {
  diffs = {}
}

export function getDiffForFile(file) {
  if (!diffAgainst) {
    diffAgainst = String(
      exports.execFileSync('git', ['merge-base', 'origin/master', 'HEAD'])
    ).trim()
  }

  const command = ['git', 'diff', diffAgainst, file]

  if (diffs.hasOwnProperty(file)) {
    return Promise.resolve(diffs[file])
  }

  diffs[file] = new Promise((resolve, reject) => {
    exports.execFile(command.shift(), command, (error, stdout) => {
      if (error) {
        return reject(error)
      }
      return resolve(stdout)
    })
  })

  return diffs[file]
}

export function isLineInDiff({ file, line }) {
  return exports.getDiffForFile(file)
    .then(exports.parseDiffRanges)
    .then(ranges => {
      if (ranges) {
        return ranges.reduce((lastValue, [addStart, addEnd]) =>
          lastValue || inRange(parseInt(line, 10), addStart, addEnd)
        , false)
      }
      return false
    })
}

export function hasError(result = []) {
  return _.some(result, { severity: 'error', isInDiff: true })
}
