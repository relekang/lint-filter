import test from 'ava'
import sinon from 'sinon'

import * as checks from '../src/checks'
import * as utils from '../src/utils'

const sandbox = sinon.sandbox.create()

test.beforeEach(() => {
  sandbox.restore()
})

test('checkError(error) should resolve error object with isInDiff set to true', t => {
  sandbox.stub(utils, 'isLineInDiff').returns(Promise.resolve(true))
  checks.checkError({ message: 'some message' })
    .then(result => t.same(result, { message: 'some message', isInDiff: true }))
})

test('checkError(error) should resolve error object with isInDiff set to false', t => {
  sandbox.stub(utils, 'isLineInDiff').returns(Promise.resolve(false))
  checks.checkError({ message: 'some message' })
    .then(result => t.same(result, { message: 'some message', isInDiff: false }))
})
