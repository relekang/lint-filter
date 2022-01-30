import test from 'ava';

import spawn from '../../src/utils/spawn';

test('spawn should resolve a promise with the result', async (t) => {
  const result = await spawn('ls', ['../../src']);

  t.deepEqual(
    result,
    'checks.js\ncli.js\nformatters\nindex.js\nparser.js\nsetup.js\nutils\n'
  );
});

test('spawn should reject a promise with an error', (t) => {
  t.throws(spawn('ls', ['non-existing-directory']));
});
