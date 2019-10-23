import { WebDocument } from '../../web-audit';
import { auditOpenGraph, createOpenGraphMetaPropertyQuerySelector } from '../seo';

describe('auditOpenGraph', () => {
  it('document has all Open Graph base tags', () => {
    const document: Pick<WebDocument, 'querySelectorAll'> = {
      querySelectorAll: jest.fn(() => ({ length: 1 })),
    };
    expect(auditOpenGraph(document)).toMatchSnapshot();
  });

  it('document has only Open Graph title tag from base tags', () => {
    const document: Pick<WebDocument, 'querySelectorAll'> = {
      querySelectorAll: jest.fn(querySelector => ({
        length: querySelector === 'meta[property="og:title"]' ? 1 : 0,
      })),
    };
    expect(auditOpenGraph(document)).toMatchSnapshot();
  });

  it('createOpenGraphMetaPropertyQuerySelector', () => {
    expect(createOpenGraphMetaPropertyQuerySelector('title')).toMatchSnapshot();
  });
});
