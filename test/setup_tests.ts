import setup, { getEslintRcFilename } from '../src/setup';

jest.mock('fs', () => ({
  readdir: jest.fn().mockResolvedValue(Promise.resolve(['.eslintrc.js'])),
}));

test('setup should throw for unknown linter', () => {
  // @ts-expect-error invalid test data
  expect(() => setup({ linter: 'o/' })).toThrow();
});

test('getEslintRcFilename should return .eslintrc file with correct extension', async () => {
  const filename = await getEslintRcFilename();
  expect(filename).toBe('.eslintrc.js');
});
