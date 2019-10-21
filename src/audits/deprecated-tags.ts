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

export function auditDeprecatedTags(
  document: Pick<WebDocument, 'getElementsByTagNameCount'>,
): AuditResult {
  const deprecatedElements = Object.fromEntries(
    deprecatedTagsNames.map(tag => [tag, document.getElementsByTagNameCount(tag)]),
  );

  const isExistDeprecatedTag = Object.values(deprecatedElements).some(tagsAmount => tagsAmount > 0);
  const errors: string[] = [];
  if (isExistDeprecatedTag) {
    errors.push('Document has some deprecated tag');
  }

  return {
    name: 'deprecated elements in dom',
    errors,
    tables: [
      {
        ...deprecatedElements,
      },
    ],
  };
}
