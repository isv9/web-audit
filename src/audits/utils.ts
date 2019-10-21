import { AuditResultLiveCollection, WebDocument } from '../web-audit'

export function getEmptyElementsLiveCollections (document: Pick<WebDocument, 'getEmptyElementsByTagName'>,
                                                 tagsNames: string[]): AuditResultLiveCollection[] {
  return tagsNames.reduce<AuditResultLiveCollection[]>((liveCollections, tag) => {
    const emptyElements = document.getEmptyElementsByTagName(tag)
    if (emptyElements.length > 0) {
      liveCollections.push({
        name: `Empty "${tag}" elements count in dom`,
        collection: emptyElements
      })
    }
    return liveCollections
  }, [])
}
