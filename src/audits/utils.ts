import { AuditResultLog, WebDocument } from '../web-audit';

export function getEmptyElementsLiveCollections(
  document: Pick<WebDocument, 'getEmptyElementsByTagName'>,
  tagsNames: string[],
): AuditResultLog[] {
  return tagsNames.reduce<AuditResultLog[]>((liveCollections, tag) => {
    const emptyElements = document.getEmptyElementsByTagName(tag);
    if (emptyElements.length > 0) {
      liveCollections.push([`Empty "${tag}" elements count in dom`, emptyElements]);
    }
    return liveCollections;
  }, []);
}
