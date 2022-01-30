import test from 'ava';
import sinon from 'sinon';

import * as checks from '../src/checks';
import * as utils from '../src/utils';

const sandbox = sinon.sandbox.create();

test.beforeEach(() => {
  sandbox.restore();
});

test.serial(
  'checkError(error) should resolve error object with isInDiff set to true',
  (t) => {
    sandbox.stub(utils, 'isLineInDiff').returns(true);
    t.deepEqual(checks.checkError({ message: 'some message' }), {
      message: 'some message',
      isInDiff: true,
    });
  }
);

test.serial(
  'checkError(error) should resolve error object with isInDiff set to false',
  (t) => {
    sandbox.stub(utils, 'isLineInDiff').returns(false);
    t.deepEqual(checks.checkError({ message: 'some message' }), {
      message: 'some message',
      isInDiff: false,
    });
  }
);
