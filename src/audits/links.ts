import { AuditResult, WebDocument } from '../web-audit'
import { getEmptyElementsLiveCollections } from './utils'

export function auditLinks (document: Pick<WebDocument, 'getEmptyElementsByTagName' | 'getElementsByTagNameCount'>): AuditResult {
  const linksElements = {
    a: document.getElementsByTagNameCount('a')
  }
  const logs: string[] = [`Document has ${linksElements.a} links`]
  const warnings: string[] = []

  const emptyElementsLiveCollections = getEmptyElementsLiveCollections(document, ['a'])
  if (emptyElementsLiveCollections.length > 0) {
    warnings.push('Document has empty links')
  }

  return {
    logs,
    warnings,
    liveCollections: emptyElementsLiveCollections,
    name: 'links in dom',
    tables: []
  }
}
