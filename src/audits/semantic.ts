import {AuditResult, AuditResultLog, WebDocument} from '../web-audit';
import { getEmptyElementsLiveCollections } from './utils';

const commonTagsNames: string[] = ['nav', 'header', 'main', 'footer'];

const textTagsNames: string[] = ['blockquote', 'dd', 'dl', 'dt', 'pre'];

const textSemanticTagsNames: string[] = [
  'span',
  'p',
  'b',
  'i',
  'small',
  'code',
  'strong',
  'time',
  'em',
  'abbr',
  'cite',
];

const headerTagsNames: string[] = Array.from(new Array(6)).map((_, index) => `h${index + 1}`);
const blockTagsNames: string[] = [
  'div',
  'section',
  'article',
  'address',
  'li',
  'ul',
  'details',
  'summary',
  'form',
  'button',
];

export function auditCommonSemantics(
  document: Pick<WebDocument, 'getElementsByTagNameCount'>,
): AuditResult {
  const commonElements = Object.fromEntries(
    commonTagsNames.map(tag => [tag, document.getElementsByTagNameCount(tag)]),
  );
  const errors: string[] = [];
  const warnings: string[] = [];
  if (commonElements.main !== 1) {
    if (commonElements.main > 1) {
      errors.push('Document must have one main tag');
    } else {
      warnings.push('Document does not have main tag');
    }
  }
  if (commonElements.header < 1) {
    warnings.push('Document does not have header tag');
  }
  if (commonElements.nav < 1) {
    warnings.push('Document does not have nav tag');
  }
  return {
    name: 'common elements count in dom',
    tables: [commonElements],
    warnings,
    errors,
  };
}

export function auditTextSemantics(
  document: Pick<WebDocument, 'getElementsByTagNameCount'>,
): AuditResult {
  const textElements = Object.fromEntries(
    textTagsNames.map(tag => [tag, document.getElementsByTagNameCount(tag)]),
  );
  const textSemanticElements = Object.fromEntries(
    textSemanticTagsNames.map(tag => [tag, document.getElementsByTagNameCount(tag)]),
  );

  const isExistSomeTextOrTextSemanticTag = Object.values({
    ...textElements,
    ...textSemanticElements,
  }).some(tagsAmount => tagsAmount > 0);
  const errors: string[] = [];
  if (!isExistSomeTextOrTextSemanticTag) {
    errors.push('Document does not any text tag');
  }

  return {
    name: 'text elements count in dom',
    errors,
    tables: [
      {
        name: 'text elements',
        ...textElements,
      },
      {
        name: 'text semantic elements',
        ...textSemanticElements,
      },
    ],
  };
}

export function auditHeaderSemantics(
  document: Pick<WebDocument, 'getElementsByTagNameCount'>,
): AuditResult {
  const headerElements = Object.fromEntries(
    headerTagsNames.map(tag => [tag, document.getElementsByTagNameCount(tag)]),
  );
  const errors: string[] = [];
  if (headerElements['h1'] !== 1) {
    errors.push('Document must have one h1');
  }
  return {
    errors,
    name: 'header elements count in dom',
    tables: [
      {
        ...headerElements,
      },
    ],
  };
}

export function auditBlockSemantics(
  document: Pick<WebDocument, 'getEmptyElementsByTagName' | 'getElementsByTagName' | 'getElementsByTagNameCount'>,
): AuditResult {
  const blockElements = Object.fromEntries(
    blockTagsNames.map(tag => [tag, document.getElementsByTagNameCount(tag)]),
  );
  const warnings: string[] = [];
  if (checkDivatos(blockElements)) {
    warnings.push('Document has much div');
  }

  const emptyElementsLiveCollections = getEmptyElementsLiveCollections(document, blockTagsNames);
  if (emptyElementsLiveCollections.length > 0) {
    warnings.push('Document has empty blocks');
  }

  const logs: AuditResultLog[] = [];
  if(blockElements.button > 0){
    logs.push(['buttons', document.getElementsByTagName('button')]);
  }

  return {
    warnings,
    logs,
    liveCollections: emptyElementsLiveCollections,
    name: 'block elements count in dom',
    tables: [
      {
        ...blockElements,
      },
    ],
  };
}

function checkDivatos(blockElements: { [tag: string]: number }): boolean {
  const divCount = blockElements['div'];
  const articlePart = (100 * blockElements['article']) / divCount;
  const sectionPart = (100 * blockElements['section']) / divCount;
  return articlePart + sectionPart < 90;
}
