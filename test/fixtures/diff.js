export default `diff --git a/lint-filter.js b/lint-filter.js
index 0e34c94..8b80ccc 100755
--- a/lint-filter.js
+++ b/lint-filter.js
@@ -1,3 +1,2 @@
 #!/usr/bin/env node
-require('babel-core/register')
 require('./lib').default()
diff --git a/lint-filter.js b/lint-filter.js
index 0e34c94..8b80ccc 100755
--- a/lint-filter.js
+++ b/lint-filter.js
@@ -1,3 +2,3 @@
 #!/usr/bin/env node
-require('babel-core/register')
 require('./lib').default()
diff --git a/src/index.js b/src/index.js
index 7d064f4..baca4da 100644
--- a/src/index.js
+++ b/src/index.js
@@ -4,11 +4,13 @@ import stdin from 'stdin'
 import info from '../package.json'
 import { checkFiles, checkString } from './checks'
 import { formatOutput } from './formatters'
+import { hasError } from './utils'

 function handleResult(promise, options) {
   return promise
     .then(result => {
       console.log(formatOutput(options.format, result)) // eslint-disable-line no-console
+      process.exit(hasError(result) ? 1 : 0)
     })
     .catch(error => {
       throw error
diff --git a/src/utils.js b/src/utils.js
index 9c9b4c1..6306db8 100644
--- a/src/utils.js
+++ b/src/utils.js
@@ -3,33 +3,41 @@ import cp from 'child_process'
 import {promisify} from 'util'
 import inRange from 'in-range'

-export const exec = promisify(cp.exec)
+export const execFile = Promise.promisify(cp.execFile)
+export const execFileSync = cp.execFileSync

 export function parseDiffRanges(diff) {
-  const matches = diff.match(/^\@\@ -\d+,\d+ \+(\d+),(\d+) \@\@/gm)
+  const matches = diff.match(/^@@ -\d+,\d+ \+(\d+),(\d+) @@/gm)
   if (!_.isEmpty(matches)) {
     return matches.map(match => {
-      const [start, end] = /^\@\@ -\d+,\d+ \+(\d+),(\d+) \@\@/.exec(match).slice(1, 3)
+      const [start, end] = /^@@ -\d+,\d+ \+(\d+),(\d+) @@/.exec(match).slice(1, 3)
       return [parseInt(start, 10), parseInt(start, 10) + parseInt(end, 10)]
     })
   }
   return []
 }

+let diffAgainst
 let diffs = {}
 export function resetDiffCache() {
   diffs = {}
 }

 export function getDiffForFile(file) {
-  const command = \`git diff origin/master... $\{file\}\`
+  if (!diffAgainst) {
+    diffAgainst = String(
+      exports.execFileSync('git', ['merge-base', 'origin/master', 'HEAD'])
+    ).trim()
+  }
+
+  const command = ['git', 'diff', diffAgainst, file]

-  if (diffs.hasOwnProperty(command)) {
-    return Promise.resolve(diffs[command])
+  if (diffs.hasOwnProperty(file)) {
+    return Promise.resolve(diffs[file])
   }

-  diffs[command] = new Promise((resolve, reject) => {
-    exports.exec(command, (error, stdout) => {
+  diffs[file] = new Promise((resolve, reject) => {
+    exports.execFile(command.shift(), command, (error, stdout) => {
       if (error) {
         return reject(error)
       }
@@ -37,7 +45,7 @@ export function getDiffForFile(file) {
     })
   })

-  return diffs[command]
+  return diffs[file]
 }

 export function isLineInDiff({ file, line }) {
@@ -52,3 +60,7 @@ export function isLineInDiff({ file, line }) {
       return false
     })
 }
+
+export function hasError(result = []) {
+  return _.some(result, { severity: 'error', isInDiff: true })
+}
diff --git a/test/utils_tests.js b/test/utils_tests.js
index dea55a3..ac63070 100644
--- a/test/utils_tests.js
+++ b/test/utils_tests.js
@@ -40,17 +40,25 @@ test(
   t => t.same(utils.parseDiffRanges('+@@ -8,27 +8,43 @@'), [])
 )

-test('getDiffForFile(file) should call exec(git diff ...)', t => {
-  sandbox.stub(utils, 'exec').returns(Promise.resolve(''))
+test('getDiffForFile(file) should call execFile(git diff ...) with the merge base', t => {
+  sandbox.stub(utils, 'execFileSync').returns('somerev')
+  sandbox.stub(utils, 'execFile').returns(Promise.resolve(''))
   utils.getDiffForFile('somefile')
-  t.ok(utils.exec.calledWith('git diff origin/master... somefile'))
+  t.ok(utils.execFile.calledWith('git', ['diff', 'somerev', sinon.match.any]))
 })

-test('getDiffForFile(file) should call exec one time for same file', t => {
-  sandbox.stub(utils, 'exec').returns(Promise.delay(20))
+test('getDiffForFile(file) should call execFile(git diff ...) with the file', t => {
+  sandbox.stub(utils, 'execFileSync')
+  sandbox.stub(utils, 'execFile').returns(Promise.resolve(''))
+  utils.getDiffForFile('somefile')
+  t.ok(utils.execFile.calledWith('git', ['diff', sinon.match.any, 'somefile']))
+})
+
+test('getDiffForFile(file) should call execFile one time for same file', t => {
+  sandbox.stub(utils, 'execFile').returns(Promise.delay(20))
   utils.getDiffForFile('somefile')
   utils.getDiffForFile('somefile')
-  t.is(utils.exec.callCount, 1)
+  t.is(utils.execFile.callCount, 1)
 })

 test('isLineInDiff({ file, line }) should return true when line is in range', t => {
@@ -66,3 +74,48 @@ test('isLineInDiff({ file, line }) should return false when line is in range', t
   return utils.isLineInDiff({ file: 'somefile', line: '10' })
     .then(result => t.is(result, false))
 })
+
+test('hasError(result) should return true if contains error', t => {
+  const input = [
+    {
+      line: '7',
+      column: '23',
+      severity: 'error',
+      message: 'Extra semicolon. (semi)',
+      source: 'eslint.rules.semi',
+      file: '/Users/rolf/dev/lint-filter/README.md',
+      isInDiff: true,
+    },
+  ]
+  t.same(utils.hasError(input), true)
+})
+
+test('hasError(result) should return false if contains warning', t => {
+  const input = [
+    {
+      line: '7',
+      column: '23',
+      severity: 'warning',
+      message: 'Extra semicolon. (semi)',
+      source: 'eslint.rules.semi',
+      file: '/Users/rolf/dev/lint-filter/README.md',
+      isInDiff: true,
+    },
+  ]
+  t.same(utils.hasError(input), false)
+})
+
+test('hasError(result) should return false if contains error not in diff', t => {
+  const input = [
+    {
+      line: '7',
+      column: '23',
+      severity: 'warning',
+      message: 'Extra semicolon. (semi)',
+      source: 'eslint.rules.semi',
+      file: '/Users/rolf/dev/lint-filter/README.md',
+      isInDiff: false,
+    },
+  ]
+  t.same(utils.hasError(input), false)
+})`;
