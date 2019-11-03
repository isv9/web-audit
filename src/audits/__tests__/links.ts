import { WebDocument } from '../../web-audit';
import { auditLinks } from '../links';

describe('auditLinks', () => {
  it('document is ok', () => {
    const document: Pick<
      WebDocument,
      'getEmptyElementsByTagName' | 'getElementsByTagName' | 'getElementsWhichHasAttribute'
    > = {
      getElementsByTagName: jest.fn(() => ({ length: 3 })),
      getEmptyElementsByTagName: jest.fn(() => ({ length: 0 })),
      getElementsWhichHasAttribute: jest.fn(() => ({ length: 0 })),
    };
    expect(auditLinks(document)).toMatchSnapshot();
  });
  it('document has some empty links', () => {
    const document: Pick<
      WebDocument,
      'getEmptyElementsByTagName' | 'getElementsByTagName' | 'getElementsWhichHasAttribute'
    > = {
      getElementsByTagName: jest.fn(() => ({ length: 3 })),
      getEmptyElementsByTagName: jest.fn(() => ({ length: 5 })),
      getElementsWhichHasAttribute: jest.fn(() => ({ length: 0 })),
    };
    expect(auditLinks(document)).toMatchSnapshot();
  });

  it('document has some links which has deprecated attribute', () => {
    const document: Pick<
      WebDocument,
      'getEmptyElementsByTagName' | 'getElementsByTagName' | 'getElementsWhichHasAttribute'
    > = {
      getElementsByTagName: jest.fn(() => ({ length: 3 })),
      getEmptyElementsByTagName: jest.fn(() => ({ length: 5 })),
      getElementsWhichHasAttribute: jest.fn((tag, attribute) => ({
        length: ['name', 'rev'].includes(attribute) ? 2 : 0,
      })),
    };
    expect(auditLinks(document)).toMatchSnapshot();
  });
});
