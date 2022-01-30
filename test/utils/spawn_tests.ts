import { spawn } from '../../src/utils/spawn';

test('spawn should resolve a promise with the result', async () => {
  const result = await spawn('ls', ['./src']);

  expect(result).toEqual(
    'checks.ts\ncli.ts\nformatters\nindex.ts\nparser.ts\nsetup.ts\nutils\n'
  );
});

test('spawn should reject a promise with an error', async () => {
  await expect(spawn('ls', ['non-existing-directory'])).rejects.toEqual(
    new Error('ls non-existing-directory failed')
  );
});
