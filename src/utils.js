import _ from 'lodash'
import cp from 'child_process'
import Promise from 'bluebird'
import inRange from 'in-range'

export const exec = Promise.promisify(cp.exec)

export function parseDiffRanges(diff) {
  const matches = diff.match(/^\@\@ -\d+,\d+ \+(\d+),(\d+) \@\@/gm)
  if (!_.isEmpty(matches)) {
    return matches.map(match => {
      const [start, end] = /^\@\@ -\d+,\d+ \+(\d+),(\d+) \@\@/.exec(match).slice(1, 3)
      return [parseInt(start, 10), parseInt(start, 10) + parseInt(end, 10)]
    })
  }
  return []
}

let diffs = {}
export function resetDiffCache() {
  diffs = {}
}

export function getDiffForFile(file) {
  const command = `git diff origin/master... ${file}`

  if (diffs.hasOwnProperty(command)) {
    return Promise.resolve(diffs[command])
  }

  diffs[command] = new Promise((resolve, reject) => {
    exports.exec(command, (error, stdout) => {
      if (error) {
        return reject(error)
      }
      return resolve(stdout)
    })
  })

  return diffs[command]
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
