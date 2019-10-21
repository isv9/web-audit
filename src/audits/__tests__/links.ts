import { WebDocument } from '../../web-audit';
import { auditLinks } from '../links';

describe('auditLinks', () => {
  it('document is ok', () => {
    const document: Pick<WebDocument, 'getEmptyElementsByTagName' | 'getElementsByTagName'> = {
      getElementsByTagName: jest.fn(() => ({ length: 3 })),
      getEmptyElementsByTagName: jest.fn(() => ({ length: 0 })),
    };
    expect(auditLinks(document)).toMatchSnapshot();
  });
  it('document has some empty links', () => {
    const document: Pick<WebDocument, 'getEmptyElementsByTagName' | 'getElementsByTagName'> = {
      getElementsByTagName: jest.fn(() => ({ length: 3 })),
      getEmptyElementsByTagName: jest.fn(() => ({ length: 5 })),
    };
    expect(auditLinks(document)).toMatchSnapshot();
  });
});
