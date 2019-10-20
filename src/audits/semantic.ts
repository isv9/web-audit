import { AuditResult, WebDocument } from '../web-audit'

const commonTagsNames: string[] = [
  'nav',
  'header',
  'main',
  'footer'
]

const textTagsNames: string[] = ['label', 'span', 'p']
const headerTagsNames: string[] = Array.from(new Array(6)).map(
  (_, index) => `h${index + 1}`
)

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
  if (commonElements.header !== 1) {
    warnings.push('Document does not have header tag')
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

export function auditHeaderSemantics (document: WebDocument): AuditResult {
  const headerElements = Object.fromEntries(
    headerTagsNames.map(tag => [
      tag,
      document.getElementsByTagNameCount(tag)
    ])
  )
  const errors: string[] = []
  if (headerElements['h1'] !== 1) {
    errors.push('Document must have one h1')
  }
  return {
    errors,
    name: 'header elements count in dom',
    tables: [{
      ...headerElements
    },]
  }
}
