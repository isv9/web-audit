import { AuditResult, AuditResultLog, WebDocument } from '../web-audit';
import { getLogsForEmptyElements } from './utils';

export function auditLinks(
  document: Pick<WebDocument, 'getEmptyElementsByTagName' | 'getElementsByTagName'>,
): AuditResult {
  const linksElements = document.getElementsByTagName('a');
  const logs: AuditResultLog[] = [];
  if (linksElements.length > 0) {
    logs.push([`Document has ${linksElements.length} links`, linksElements]);
  }
  const warnings: string[] = [];

  const logsForEmptyLinks = getLogsForEmptyElements(document, ['a']);
  if (logsForEmptyLinks.length > 0) {
    warnings.push('Document has empty links');
    logs.push(logsForEmptyLinks);
  }

  return {
    logs,
    warnings,
    name: 'links in dom',
    tables: [],
  };
}
