import test from 'ava';
import sinon from 'sinon';

import * as setup from '../src/setup';

test('setup should throw for unknown linter', (t) => {
  t.throws(() => setup.default({ linter: 'o/' }));
});

test('getEslintRcFilename should return .eslintrc file with correct extension', async (t) => {
  sinon.stub(setup, 'readdir').returns(Promise.resolve(['.eslintrc.js']));
  const filename = await setup.getEslintRcFilename();
  t.is(filename, '.eslintrc.js');
});
