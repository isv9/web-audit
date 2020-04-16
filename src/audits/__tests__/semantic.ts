import { WebDocument } from '../../web-audit';
import {
  auditBlockSemantics,
  auditCommonSemantics,
  auditHeaderSemantics,
  auditTextSemantics,
} from '../semantic';
import { createGetTagAmountMapMock } from '../../tests-utils/mock';

describe('auditCommonSemantics', () => {
  it('document has each common elements', () => {
    const document: Pick<WebDocument, 'getTagAmountMap'> = {
      getTagAmountMap: createGetTagAmountMapMock(() => 1),
    };
    expect(auditCommonSemantics(document)).toMatchSnapshot();
  });
  it('document has two main tags', () => {
    const document: Pick<WebDocument, 'getTagAmountMap'> = {
      getTagAmountMap: createGetTagAmountMapMock((tag) =>
        tag === 'main' ? 2 : 1,
      ),
    };
    expect(auditCommonSemantics(document)).toMatchSnapshot();
  });

  it('document has two header tags', () => {
    const document: Pick<WebDocument, 'getTagAmountMap'> = {
      getTagAmountMap: createGetTagAmountMapMock((tag) =>
        tag === 'header' ? 2 : 1,
      ),
    };
    expect(auditCommonSemantics(document)).toMatchSnapshot();
  });

  it('document does not have any common tag', () => {
    const document: Pick<WebDocument, 'getTagAmountMap'> = {
      getTagAmountMap: createGetTagAmountMapMock(() => 0),
    };
    expect(auditCommonSemantics(document)).toMatchSnapshot();
  });
});

it('auditTextSemantics', () => {
  let inc = 0;
  const document: Pick<WebDocument, 'getTagAmountMap'> = {
    getTagAmountMap: createGetTagAmountMapMock(() => ++inc),
  };
  expect(auditTextSemantics(document)).toMatchSnapshot();
});

it('document does not any text tag', () => {
  const document: Pick<WebDocument, 'getTagAmountMap'> = {
    getTagAmountMap: createGetTagAmountMapMock(() => 0),
  };
  expect(auditTextSemantics(document)).toMatchSnapshot();
});

describe('auditHeaderSemantics', () => {
  it('document has some headers', () => {
    let inc = 0;
    const document: Pick<WebDocument, 'getTagAmountMap'> = {
      getTagAmountMap: createGetTagAmountMapMock(() => ++inc),
    };
    expect(auditHeaderSemantics(document)).toMatchSnapshot();
  });
  it('document does not have any headers', () => {
    const document: Pick<WebDocument, 'getTagAmountMap'> = {
      getTagAmountMap: createGetTagAmountMapMock(() => 0),
    };
    expect(auditHeaderSemantics(document)).toMatchSnapshot();
  });
  it('document has two h1', () => {
    const document: Pick<WebDocument, 'getTagAmountMap'> = {
      getTagAmountMap: createGetTagAmountMapMock((tag) =>
        tag === 'h1' ? 2 : 0,
      ),
    };
    expect(auditHeaderSemantics(document)).toMatchSnapshot();
  });
});

describe('auditBlocksSemantics', () => {
  it('document has good block semantic', () => {
    const document: Pick<
      WebDocument,
      'getEmptyElementsByTagName' | 'getElementsByTagName' | 'getTagAmountMap'
    > = {
      getTagAmountMap: createGetTagAmountMapMock(() => 20),
      getEmptyElementsByTagName: jest.fn(() => ({ length: 0 })),
      getElementsByTagName: jest.fn(() => ({ length: 7 })),
    };
    expect(auditBlockSemantics(document)).toMatchSnapshot();
  });

  it('document has divatos and empty articles', () => {
    const document: Pick<
      WebDocument,
      'getEmptyElementsByTagName' | 'getElementsByTagName' | 'getTagAmountMap'
    > = {
      getTagAmountMap: createGetTagAmountMapMock((tag) =>
        tag === 'div' ? 100 : 20,
      ),
      getEmptyElementsByTagName: jest.fn((tag) => ({
        length: tag === 'article' ? 2 : 0,
      })),
      getElementsByTagName: jest.fn(() => ({ length: 7 })),
    };
    expect(auditBlockSemantics(document)).toMatchSnapshot();
  });
});
