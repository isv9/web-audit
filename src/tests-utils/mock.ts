import { WebDocument } from '../web-audit';

export function createGetTagAmountMapMock(
  getTagAmount: (tag: string) => number,
): WebDocument['getTagAmountMap'] {
  return jest.fn(tagsNames =>
    Object.fromEntries(tagsNames.map(tagName => [tagName, getTagAmount(tagName)])),
  );
}
