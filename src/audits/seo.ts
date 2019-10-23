import { AuditResult, AuditResultLog, WebDocument } from '../web-audit';

type BaseOpenGraphMetaPropertyName = 'title' | 'description' | 'url';
type OpenGraphMetaPropertyName = BaseOpenGraphMetaPropertyName;
type CheckedOpenGraphMetaTag = { propertyName: OpenGraphMetaPropertyName; isExisted: boolean };

export function auditOpenGraph(document: Pick<WebDocument, 'querySelectorAll'>): AuditResult {
  const baseOgMetaPropertiesNames: BaseOpenGraphMetaPropertyName[] = ['title', 'description', 'url'];
  const checkedBaseOpenGraphMetaTags: CheckedOpenGraphMetaTag[] = baseOgMetaPropertiesNames.map(
    (propertyName): CheckedOpenGraphMetaTag => ({
      propertyName,
      isExisted: checkExistOpenGraphMetaTag(document, propertyName),
    }),
  );
  const warnings: string[] = [];
  if (checkedBaseOpenGraphMetaTags.some(({ isExisted }) => !isExisted)) {
    checkedBaseOpenGraphMetaTags.forEach(({ isExisted, propertyName }) => {
      if (!isExisted) {
        warnings.push(`Document does not have a base meta tag 'og:${propertyName}'`);
      }
    });
  }

  const logs: AuditResultLog[] = [];
  if (checkedBaseOpenGraphMetaTags.some(({ isExisted }) => isExisted)) {
    const existedOpenGraphBaseMetaPropertiesNames = checkedBaseOpenGraphMetaTags
      .filter(({ isExisted }) => isExisted)
      .map(({ propertyName }) => propertyName);
    logs.push(`Document has some base meta tags: '${existedOpenGraphBaseMetaPropertiesNames.join(', ')}'`);
  }

  return {
    warnings,
    logs,
    name: 'Open Graph',
    tables: [],
  };
}

function checkExistOpenGraphMetaTag(
  document: Pick<WebDocument, 'querySelectorAll'>,
  ogMetaPropertyName: OpenGraphMetaPropertyName,
): boolean {
  return document.querySelectorAll(createOpenGraphMetaPropertyQuerySelector(ogMetaPropertyName)).length > 0;
}

export function createOpenGraphMetaPropertyQuerySelector(ogMetaPropertyName: OpenGraphMetaPropertyName): string {
  return `meta[property="og:${ogMetaPropertyName}"]`;
}
