import { WebDocument } from '../../web-audit'
import { auditImages } from '../images'

describe('auditImages', () => {
  it('document is ok', () => {
    const document: Pick<WebDocument, 'querySelectorAll' | 'getElementsByTagNameCount'> = {
      getElementsByTagNameCount: jest.fn((tag) => tag === 'image' ? 0 : 3),
      querySelectorAll: jest.fn(() => ({ length: 1 })),
    }
    expect(auditImages(document)).toMatchSnapshot()
  })

  it('document has image tag', () => {
    const document: Pick<WebDocument, 'querySelectorAll' | 'getElementsByTagNameCount'> = {
      getElementsByTagNameCount: jest.fn((tag) => tag === 'image' ? 1 : 3),
      querySelectorAll: jest.fn(() => ({ length: 1 })),
    }
    expect(auditImages(document)).toMatchSnapshot()
  })

  it('document has not flexible images', () => {
    const document: Pick<WebDocument, 'querySelectorAll' | 'getElementsByTagNameCount'> = {
      getElementsByTagNameCount: jest.fn((tag) => tag === 'img' ? 10 : 0),
      querySelectorAll: jest.fn(() => ({ length: 0 })),
    }
    expect(auditImages(document)).toMatchSnapshot()
  })

})
