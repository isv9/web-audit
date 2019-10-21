import { AuditResult, WebDocument } from '../web-audit'
import { getEmptyElementsLiveCollections } from './utils'

const commonTagsNames: string[] = [
  'nav',
  'header',
  'main',
  'footer'
]

const textTagsNames: string[] = ['label', 'span', 'p', 'b', 'i', 'code', 'strong', 'time', 'em', 'blockquote', 'cite', 'dir', 'dd', 'dl', 'dt', 'pre']
const headerTagsNames: string[] = Array.from(new Array(6)).map(
  (_, index) => `h${index + 1}`
)
const blockTagsNames: string[] = ['div', 'section', 'article', 'address', 'li', 'ul', 'details', 'summary']

export function auditCommonSemantics (document: Pick<WebDocument, 'getElementsByTagNameCount'>): AuditResult {
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

export function auditTextSemantics (document: Pick<WebDocument, 'getElementsByTagNameCount'>): AuditResult {
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

export function auditHeaderSemantics (document: Pick<WebDocument, 'getElementsByTagNameCount'>): AuditResult {
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

export function auditBlockSemantics (document: Pick<WebDocument, 'getEmptyElementsByTagName' | 'getElementsByTagNameCount'>): AuditResult {
  const blockElements = Object.fromEntries(
    blockTagsNames.map(tag => [
      tag,
      document.getElementsByTagNameCount(tag)
    ])
  )
  const warnings: string[] = []
  if (checkDivatos(blockElements)) {
    warnings.push('Document has much div')
  }

  const emptyElementsLiveCollections = getEmptyElementsLiveCollections(document, blockTagsNames)
  if (emptyElementsLiveCollections.length > 0) {
    warnings.push('Document has empty blocks')
  }

  return {
    warnings,
    liveCollections: emptyElementsLiveCollections,
    name: 'block elements count in dom',
    tables: [{
      ...blockElements
    }
    ]
  }
}

function checkDivatos (blockElements: { [tag: string]: number }): boolean {
  const divCount = blockElements['div']
  const articlePart = (100 * blockElements['article']) / divCount
  const sectionPart = (100 * blockElements['section']) / divCount
  return articlePart + sectionPart < 90
}

