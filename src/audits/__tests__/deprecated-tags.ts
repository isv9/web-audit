import { auditDeprecatedTags } from '../deprecated-tags';
import { WebDocument } from '../../web-audit';
import { createGetTagAmountMapMock } from '../../tests-utils/mock';

describe('auditDeprecatedTags', () => {
  it('document does not have any deprecated tags', () => {
    const document: Pick<WebDocument, 'getTagAmountMap'> = {
      getTagAmountMap: createGetTagAmountMapMock(() => 0),
    };
    expect(auditDeprecatedTags(document)).toMatchSnapshot();
  });
  it('document has some deprecated tags', () => {
    const document: Pick<WebDocument, 'getTagAmountMap'> = {
      getTagAmountMap: createGetTagAmountMapMock((tag) =>
        ['content', 'dir'].includes(tag) ? 1 : 0,
      ),
    };
    expect(auditDeprecatedTags(document)).toMatchSnapshot();
  });
});
