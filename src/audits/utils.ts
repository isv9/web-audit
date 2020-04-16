import { AuditResultLog, WebDocument } from '../web-audit';

export function getLogsForEmptyElements(
  document: Pick<WebDocument, 'getEmptyElementsByTagName'>,
  tagsNames: string[],
): AuditResultLog[] {
  return tagsNames.reduce<AuditResultLog[]>((emptyElements, tag) => {
    const foundEmptyElements = document.getEmptyElementsByTagName(tag);
    if (foundEmptyElements.length > 0) {
      emptyElements.push([
        `Empty "${tag}" elements count in dom`,
        foundEmptyElements,
      ]);
    }
    return emptyElements;
  }, []);
}
