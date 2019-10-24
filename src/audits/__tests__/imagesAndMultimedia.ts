import { WebDocument } from '../../web-audit';
import { auditImagesAndMultimedia } from '../imagesAndMultimedia';
import { createGetTagAmountMapMock } from '../../tests-utils/mock';

describe('auditImagesAndMultimedia', () => {
  it('document is ok', () => {
    const document: Pick<WebDocument, 'querySelectorAll' | 'getTagAmountMap'> = {
      getTagAmountMap: createGetTagAmountMapMock(tag => (tag === 'image' ? 0 : 3)),
      querySelectorAll: jest.fn(() => ({ length: 1 })),
    };
    expect(auditImagesAndMultimedia(document)).toMatchSnapshot();
  });

  it('document has image tag', () => {
    const document: Pick<WebDocument, 'querySelectorAll' | 'getTagAmountMap'> = {
      getTagAmountMap: createGetTagAmountMapMock(tag => (tag === 'image' ? 1 : 3)),
      querySelectorAll: jest.fn(() => ({ length: 1 })),
    };
    expect(auditImagesAndMultimedia(document)).toMatchSnapshot();
  });

  it('document has not flexible images', () => {
    const document: Pick<WebDocument, 'querySelectorAll' | 'getTagAmountMap'> = {
      getTagAmountMap: createGetTagAmountMapMock(tag => (tag === 'img' ? 10 : 0)),
      querySelectorAll: jest.fn(() => ({ length: 0 })),
    };
    expect(auditImagesAndMultimedia(document)).toMatchSnapshot();
  });
});
