import { WebDocument } from '../../web-audit';
import { getLogsForEmptyElements } from '../utils';

describe('getLogsForEmptyElements', () => {
  it('document does not have any empty elements', () => {
    const document: Pick<WebDocument, 'getEmptyElementsByTagName'> = {
      getEmptyElementsByTagName: jest.fn(() => ({ length: 0 })),
    };
    expect(
      getLogsForEmptyElements(document, ['div', 'article']),
    ).toMatchSnapshot();
  });
  it('document has some empty div elements', () => {
    const document: Pick<WebDocument, 'getEmptyElementsByTagName'> = {
      getEmptyElementsByTagName: jest.fn((tag) => ({
        length: tag === 'div' ? 5 : 0,
      })),
    };
    expect(
      getLogsForEmptyElements(document, ['div', 'article']),
    ).toMatchSnapshot();
  });
});
