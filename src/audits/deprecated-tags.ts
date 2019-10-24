import { AuditResult, AuditResultLog, TagAmountMap, WebDocument } from '../web-audit';

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
  const existedDeprecatedTag: TagAmountMap = Object.fromEntries(
    Object.entries(deprecatedTagAmountMap).filter(
      ([, deprecatedTagAmount]) => deprecatedTagAmount > 0,
    ),
  );

  const isExistDeprecatedTag = Object.values(existedDeprecatedTag).length > 0;
  const errors: string[] = [];
  const logs: AuditResultLog[] = [];
  if (isExistDeprecatedTag) {
    errors.push('Document has some deprecated tag');
  } else {
    logs.push('Document does not have deprecated tags');
  }

  return {
    name: 'deprecated elements in dom',
    errors,
    logs,
    tables: isExistDeprecatedTag
      ? [
          {
            content: existedDeprecatedTag,
          },
        ]
      : undefined,
  };
}
