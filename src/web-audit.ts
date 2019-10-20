import { auditCommonSemantics, auditHeaderSemantics, auditTextSemantics } from './audits/semantic'

export type WebDocument = {
  getElementsByTagNameCount (tag: string): number;
};

type AuditSectionResult = {
  name: string;
  auditResults: AuditResult[];
};

export type AuditResult = {
  name?: string;
  tables: (AuditResultTable)[];
  liveCollections?: (AuditResultLiveCollection)[];
  logs?: string[];
  warnings?: string[];
  errors?: string[];
};

type AuditResultTable = { name?: string } & { [key: string]: string | number };
type AuditResultLiveCollection = { name: string, collection: object };

export class WebAudit {

  private readonly blockTagsNames: string[] = ['div', 'section', 'article']
  private readonly webDocument: WebDocument

  constructor (webDocument: WebDocument) {
    this.webDocument = webDocument
  }

  audit () {
    const auditSemanticsResult = this.auditSemantics()
    // const auditLinksResult = this.auditLinks()
    console.group('web audit')
    WebAudit.renderAuditSectionResult(auditSemanticsResult)
    // WebAudit.renderAuditResult(auditLinksResult)
    console.groupEnd()
  }

  // private auditLinks (): AuditSectionResult {
  //   const liveCollections: AuditResultLiveCollection[] = []
  //   const emptyLinks = document.querySelectorAll('a:empty')
  //
  //   const warnings: string[] = []
  //   if (emptyLinks.length > 0) {
  //     warnings.push('Document has empty links')
  //     liveCollections.push({
  //       name: 'empty links',
  //       collection: emptyLinks
  //     })
  //   }
  //   return {
  //     name: 'links',
  //     tables: [],
  //     liveCollections,
  //     warnings
  //   }
  // }

  private auditSemantics (): AuditSectionResult {

    return {
      name: 'semantics',
      auditResults: [auditCommonSemantics(this.webDocument),
        auditHeaderSemantics(this.webDocument),
        auditTextSemantics(this.webDocument)]
      // ...WebAudit.mergeAuditResult(this.auditCommonSemantics(),
      //   this.auditHeaderSemantics(),
      //   this.auditTextSemantics(),
      //   this.auditBlockSemantics())
    }
  }

  private auditBlockSemantics (): AuditResult {
    const blockElements = Object.fromEntries(
      this.blockTagsNames.map(tag => [
        tag,
        WebAudit.getElementsByTagNameCount(tag)
      ])
    )
    const warnings: string[] = []
    const divCount = blockElements['div']
    const articlePart = (100 * blockElements['article']) / divCount
    const sectionPart = (100 * blockElements['section']) / divCount
    if (articlePart + sectionPart < 90) {
      warnings.push('Document has much div')
    }

    const emptyElementsLiveCollections = this.blockTagsNames.reduce<AuditResultLiveCollection[]>((liveCollections, tag) => {
      const emptyElements = document.querySelectorAll(`${tag}:empty`)
      if (emptyElements.length > 0) {
        liveCollections.push({
          name: `Empty "${tag}" elements count in dom`,
          collection: emptyElements
        })
      }
      return liveCollections
    }, [])
    if (emptyElementsLiveCollections.length > 0) {
      warnings.push('Document has empty blocks')
    }

    return {
      warnings,
      liveCollections: emptyElementsLiveCollections,
      tables: [{
        name: 'block elements count in dom',
        ...blockElements
      }
      ]
    }
  }

  static getElementsByTagNameCount (tag: string): number {
    return document.getElementsByTagName(tag).length
  }

  static renderAuditSectionResult (auditSectionResult: AuditSectionResult) {
    const { name, auditResults } = auditSectionResult
    const details = {
      errorsCount: 0,
      warningsCount: 0
    }
    auditResults.forEach(auditResult => {
      const errorsCount = WebAudit.getAuditResultMessagesCount(auditResult, 'errors')
      const warningsCount = WebAudit.getAuditResultMessagesCount(auditResult, 'warnings')
      details.errorsCount += errorsCount
      details.warningsCount += warningsCount
    })
    console.group(`${name}, (errors="${details.errorsCount}", warnings="${details.warningsCount}")`)
    auditResults.forEach(auditResult => WebAudit.renderAuditResult(auditResult))
    console.groupEnd()
  }

  static renderAuditResult (auditResult: AuditResult) {
    const { name, tables, errors = [], warnings = [], liveCollections = [], logs = [] } = auditResult
    const errorsCount = WebAudit.getAuditResultMessagesCount(auditResult, 'errors')
    const warningsCount = WebAudit.getAuditResultMessagesCount(auditResult, 'warnings')
    console.group(`${name}, (errors="${errorsCount}", warnings="${warningsCount}")`)
    tables.forEach(({ name, nodes, ...tableDataSet }) => {
      console.log(name)
      console.table(tableDataSet)
    })
    liveCollections.forEach(({ name, collection }) => {
      console.log(name)
      console.log(collection)
    })
    logs.forEach(message => console.log(message))
    console.log('Summary')
    if (errorsCount > 0 || warningsCount > 0) {
      errors.forEach(message => console.error(message))
      warnings.forEach(message => console.warn(message))
    } else {
      console.log('It is OK')
    }

    console.groupEnd()
  }

  static getAuditResultMessagesCount (auditResult: AuditResult, key: keyof AuditResult): number {
    let property = auditResult[key]
    if (property === null || property === undefined) {
      property = []
    }
    if (Array.isArray(property)) {
      return property.length
    }
    throw new Error('Property type must be array')
  }
}

