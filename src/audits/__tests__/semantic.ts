import { WebDocument } from '../../web-audit';
import {
  auditBlockSemantics,
  auditCommonSemantics,
  auditHeaderSemantics,
  auditTextSemantics,
} from '../semantic';

describe('auditCommonSemantics', () => {
  it('document has each common elements', () => {
    const document: Pick<WebDocument, 'getElementsByTagNameCount'> = {
      getElementsByTagNameCount: jest.fn(() => 1),
    };
    expect(auditCommonSemantics(document)).toMatchSnapshot();
  });
  it('document has two main tags', () => {
    const document: Pick<WebDocument, 'getElementsByTagNameCount'> = {
      getElementsByTagNameCount: jest.fn(tag => (tag === 'main' ? 2 : 1)),
    };
    expect(auditCommonSemantics(document)).toMatchSnapshot();
  });

  it('document does not have any common tag', () => {
    const document: Pick<WebDocument, 'getElementsByTagNameCount'> = {
      getElementsByTagNameCount: jest.fn(() => 0),
    };
    expect(auditCommonSemantics(document)).toMatchSnapshot();
  });
});

it('auditTextSemantics', () => {
  let inc = 0;
  const document: Pick<WebDocument, 'getElementsByTagNameCount'> = {
    getElementsByTagNameCount: jest.fn(() => ++inc),
  };
  expect(auditTextSemantics(document)).toMatchSnapshot();
});

it('document does not any text tag', () => {
  const document: Pick<WebDocument, 'getElementsByTagNameCount'> = {
    getElementsByTagNameCount: jest.fn(() => 0),
  };
  expect(auditTextSemantics(document)).toMatchSnapshot();
});

describe('auditHeaderSemantics', () => {
  it('document has some headers', () => {
    let inc = 0;
    const document: Pick<WebDocument, 'getElementsByTagNameCount'> = {
      getElementsByTagNameCount: jest.fn(() => ++inc),
    };
    expect(auditHeaderSemantics(document)).toMatchSnapshot();
  });
  it('document does not have any headers', () => {
    const document: Pick<WebDocument, 'getElementsByTagNameCount'> = {
      getElementsByTagNameCount: jest.fn(() => 0),
    };
    expect(auditHeaderSemantics(document)).toMatchSnapshot();
  });
  it('document has two h1', () => {
    const document: Pick<WebDocument, 'getElementsByTagNameCount'> = {
      getElementsByTagNameCount: jest.fn(tag => (tag === 'h1' ? 2 : 0)),
    };
    expect(auditHeaderSemantics(document)).toMatchSnapshot();
  });
});

describe('auditBlocksSemantics', () => {
  it('document has good block semantic', () => {
    const document: Pick<WebDocument, 'getEmptyElementsByTagName' | 'getElementsByTagNameCount'> = {
      getElementsByTagNameCount: jest.fn(() => 20),
      getEmptyElementsByTagName: jest.fn(() => ({ length: 0 })),
    };
    expect(auditBlockSemantics(document)).toMatchSnapshot();
  });

  it('document has divatos and empty articles', () => {
    const document: Pick<WebDocument, 'getEmptyElementsByTagName' | 'getElementsByTagNameCount'> = {
      getElementsByTagNameCount: jest.fn(tag => (tag === 'div' ? 100 : 20)),
      getEmptyElementsByTagName: jest.fn(tag => ({ length: tag === 'article' ? 2 : 0 })),
    };
    expect(auditBlockSemantics(document)).toMatchSnapshot();
  });
});
