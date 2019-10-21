import { AuditResult, AuditResultLog, WebDocument } from '../web-audit';
import { getEmptyElementsLiveCollections } from './utils';

export function auditLinks(
  document: Pick<WebDocument, 'getEmptyElementsByTagName' | 'getElementsByTagName'>,
): AuditResult {
  const linksElements = document.getElementsByTagName('a');
  const logs: AuditResultLog[] = [];
  if (linksElements.length > 0) {
    logs.push([`Document has ${linksElements.length} links`, linksElements]);
  }
  const warnings: string[] = [];

  const emptyElementsLogs = getEmptyElementsLiveCollections(document, ['a']);
  if (emptyElementsLogs.length > 0) {
    warnings.push('Document has empty links');
    logs.push(emptyElementsLogs);
  }

  return {
    logs,
    warnings,
    name: 'links in dom',
    tables: [],
  };
}
