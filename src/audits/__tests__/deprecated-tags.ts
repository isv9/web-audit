import { auditDeprecatedTags } from '../deprecated-tags';
import { WebDocument } from '../../web-audit';

describe('auditDeprecatedTags', () => {
  it('document does not have any deprecated tags', () => {
    const document: Pick<WebDocument, 'getElementsByTagNameCount'> = {
      getElementsByTagNameCount: jest.fn(() => 0),
    };
    expect(auditDeprecatedTags(document)).toMatchSnapshot();
  });
  it('document has some deprecated tags', () => {
    const document: Pick<WebDocument, 'getElementsByTagNameCount'> = {
      getElementsByTagNameCount: jest.fn(() => 1),
    };
    expect(auditDeprecatedTags(document)).toMatchSnapshot();
  });
});
