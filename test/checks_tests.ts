import { checkError } from '../src/checks';
import { CheckstyleItem } from '../src/parser';
import { isLineInDiff } from '../src/utils';

jest.mock('../src/utils', () => ({
  isLineInDiff: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

const item: CheckstyleItem = {
  message: 'some message',
  line: '10',
  column: '22',
  severity: 'error',
  source: '',
  file: 'the-file',
};

test('checkError(error) should resolve error object with isInDiff set to true', () => {
  jest.mocked(isLineInDiff).mockReturnValue(true);
  expect(checkError(item, {})).toEqual(
    expect.objectContaining({
      isInDiff: true,
    })
  );
});

test('checkError(error) should resolve error object with isInDiff set to false', () => {
  jest.mocked(isLineInDiff).mockReturnValue(false);
  expect(checkError(item, {})).toEqual(
    expect.objectContaining({
      isInDiff: false,
    })
  );
});
