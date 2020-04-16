import {
  AuditResult,
  AuditResultLog,
  TagAmountMap,
  WebDocument,
} from '../web-audit';
import { getLogsForEmptyElements } from './utils';

const commonTagsNames: string[] = ['nav', 'header', 'main', 'footer'];

const textTagsNames: string[] = ['span', 'b', 'i'];

const textSemanticTagsNames: string[] = [
  'p',
  'ul',
  'ol',
  'li',
  'blockquote',
  'small',
  'code',
  'strong',
  'time',
  'em',
  'abbr',
  'cite',
  'dd',
  'dl',
  'dt',
  'pre',
];

const headerTagsNames: string[] = Array.from(new Array(6)).map(
  (_, index) => `h${index + 1}`,
);
const blockTagsNames: string[] = [
  'div',
  'section',
  'article',
  'address',
  'details',
  'summary',
  'form',
  'button',
];

export function auditCommonSemantics(
  document: Pick<WebDocument, 'getTagAmountMap'>,
): AuditResult {
  const commonTagAmountMap = document.getTagAmountMap(commonTagsNames);
  const errors: string[] = [];
  const warnings: string[] = [];
  if (commonTagAmountMap.main !== 1) {
    if (commonTagAmountMap.main > 1) {
      errors.push('Document must have one main tag');
    } else {
      warnings.push('Document does not have main tag');
    }
  }
  if (commonTagAmountMap.header < 1) {
    warnings.push('Document does not have header tag');
  }
  if (commonTagAmountMap.nav < 1) {
    warnings.push('Document does not have nav tag');
  }
  return {
    name: 'common elements count in dom',
    tables: [{ content: commonTagAmountMap }],
    warnings,
    errors,
  };
}

export function auditTextSemantics(
  document: Pick<WebDocument, 'getTagAmountMap'>,
): AuditResult {
  const textTagAmountMap = document.getTagAmountMap(textTagsNames);
  const textSemanticTagAmountMap = document.getTagAmountMap(
    textSemanticTagsNames,
  );

  const isExistSomeTextOrTextSemanticTag = Object.values({
    ...textTagAmountMap,
    ...textSemanticTagAmountMap,
  }).some((tagsAmount) => tagsAmount > 0);
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
        content: textTagAmountMap,
      },
      {
        name: 'text semantic elements',
        content: textSemanticTagAmountMap,
      },
    ],
  };
}

export function auditHeaderSemantics(
  document: Pick<WebDocument, 'getTagAmountMap'>,
): AuditResult {
  const headerTagAmountMap = document.getTagAmountMap(headerTagsNames);
  const errors: string[] = [];
  if (headerTagAmountMap.h1 !== 1) {
    errors.push('Document must have one h1');
  }
  return {
    errors,
    name: 'header elements count in dom',
    tables: [
      {
        content: headerTagAmountMap,
      },
    ],
  };
}

export function auditBlockSemantics(
  document: Pick<
    WebDocument,
    'getEmptyElementsByTagName' | 'getElementsByTagName' | 'getTagAmountMap'
  >,
): AuditResult {
  const blockTagAmountMap = document.getTagAmountMap(blockTagsNames);
  const warnings: string[] = [];
  if (checkTooMuchDiv(blockTagAmountMap)) {
    warnings.push('Document has much div');
  }
  const logs: AuditResultLog[] = [];
  const LogsForEmptyBlockElements = getLogsForEmptyElements(
    document,
    blockTagsNames,
  );
  if (LogsForEmptyBlockElements.length > 0) {
    warnings.push('Document has empty blocks');
    logs.push(LogsForEmptyBlockElements);
  }
  if (blockTagAmountMap.button > 0) {
    logs.push(['buttons', document.getElementsByTagName('button')]);
  }

  return {
    warnings,
    logs,
    name: 'block elements count in dom',
    tables: [
      {
        content: blockTagAmountMap,
      },
    ],
  };
}

function checkTooMuchDiv(blockTagAmountMap: TagAmountMap): boolean {
  const {
    div: divAmount,
    article: articleAmount,
    section: sectionAmount,
  } = blockTagAmountMap;
  const articlePart = (100 * articleAmount) / divAmount;
  const sectionPart = (100 * sectionAmount) / divAmount;
  return articlePart + sectionPart < 90;
}
