import { AuditResult, WebDocument } from '../web-audit'

const commonTagsNames: string[] = [
  'nav',
  'header',
  'main',
  'footer'
]

const textTagsNames: string[] = ['label', 'span', 'p']

export function auditCommonSemantics (document: WebDocument): AuditResult {
  const commonElements = Object.fromEntries(
    commonTagsNames.map(tag => [
      tag,
      document.getElementsByTagNameCount(tag)
    ])
  )
  const errors: string[] = []
  const warnings: string[] = []
  if (commonElements.main !== 1) {
    if (commonElements.main > 1) {
      errors.push('Document must have one main tag')
    } else {
      warnings.push('Document does not have main tag')
    }
  }
  return {
    name: 'common elements count in dom',
    tables: [commonElements],
    warnings,
    errors
  }
}

export function auditTextSemantics (document: WebDocument): AuditResult {
  const textElements = Object.fromEntries(
    textTagsNames.map(tag => [
      tag,
      document.getElementsByTagNameCount(tag)
    ])
  )
  return {
    name: 'text elements count in dom',
    tables: [{
      ...textElements
    },]
  }
}
