import { AuditResult, AuditResultError, AuditResultLog, WebDocument } from '../web-audit';
import { getEmptyElementsLiveCollections } from './utils';

const deprecatedLinkAttributes: string[] = ['charset', 'coords', 'name', 'rev', 'shape'];

export function auditLinks(
  document: Pick<
    WebDocument,
    'getEmptyElementsByTagName' | 'getElementsByTagName' | 'getElementsWhichHasAttribute'
  >,
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
  const linksWithDeprecatedAttributeMap = getLinksWithDeprecatedAttributeMap(document);
  const errors: AuditResultError[] = [];
  if (linksWithDeprecatedAttributeMap.size > 0) {
    linksWithDeprecatedAttributeMap.forEach((links, deprecatedLinkAttribute) => {
      const error = {
        errorMessage: `Document has links which has deprecated "${deprecatedLinkAttribute}" attribute`,
        links,
      };
      errors.push(error);
    });
  }

  return {
    logs,
    errors,
    warnings,
    name: 'links in dom',
    tables: [],
  };
}

function getLinksWithDeprecatedAttributeMap(
  document: Pick<WebDocument, 'getElementsWhichHasAttribute'>,
): Map<string, { length: number }> {
  return deprecatedLinkAttributes.reduce(
    (linksWithDeprecatedAttributeMap, deprecatedLinkAttribute) => {
      const linksWithDeprecatedAttribute = document.getElementsWhichHasAttribute(
        'a',
        deprecatedLinkAttribute,
      );
      if (linksWithDeprecatedAttribute.length > 0) {
        linksWithDeprecatedAttributeMap.set(deprecatedLinkAttribute, linksWithDeprecatedAttribute);
      }
      return linksWithDeprecatedAttributeMap;
    },
    new Map(),
  );
}
