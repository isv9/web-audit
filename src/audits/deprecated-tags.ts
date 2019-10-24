import { AuditResult, WebDocument } from '../web-audit';

const deprecatedTagsNames: string[] = [
  'acronym',
  'big',
  'command',
  'content',
  'dir',
  'element',
  'font',
  'menuitem',
];

export function auditDeprecatedTags(document: Pick<WebDocument, 'getTagAmountMap'>): AuditResult {
  const deprecatedTagAmountMap = document.getTagAmountMap(deprecatedTagsNames);

  const isExistDeprecatedTag = Object.values(deprecatedTagAmountMap).some(
    tagAmount => tagAmount > 0,
  );
  const errors: string[] = [];
  if (isExistDeprecatedTag) {
    errors.push('Document has some deprecated tag');
  }

  return {
    name: 'deprecated elements in dom',
    errors,
    tables: [
      {
        content: deprecatedTagAmountMap,
      },
    ],
  };
}
