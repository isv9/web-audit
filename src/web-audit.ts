type AuditSectionResult = {
  name: string;
} & AuditResult;

type AuditResult = {
  tables: (AuditResultTable)[];
  liveCollections?: (AuditResultLiveCollection)[];
  warnings?: string[];
  errors?: string[];
};

type AuditResultTable = { name: string } & { [key: string]: string | number };
type AuditResultLiveCollection = { name: string, collection: NodeListOf<Node> };

export class WebAudit {
  private readonly commonTagsNames: string[] = [
    'nav',
    'header',
    'main',
    'footer'
  ]
  private readonly headerTagsNames: string[] = Array.from(new Array(6)).map(
    (_, index) => `h${index + 1}`
  )
  private readonly blockTagsNames: string[] = ['div', 'section', 'article']
  private readonly textTagsNames: string[] = ['label', 'span', 'p']

  audit () {
    const auditSemanticsResult = this.auditSemantics()
    const auditLinksResult = this.auditLinks()
    console.group('web audit')
    WebAudit.renderAuditResult(auditSemanticsResult)
    WebAudit.renderAuditResult(auditLinksResult)
    console.groupEnd()
  }

  private auditLinks (): AuditSectionResult {
    const liveCollections: AuditResultLiveCollection[] = []
    const emptyLinks = document.querySelectorAll('a:empty')

    const warnings: string[] = []
    if (emptyLinks.length > 0) {
      warnings.push('Document has empty links')
      liveCollections.push({
        name: 'empty links',
        collection: emptyLinks
      })
    }
    return {
      name: 'links',
      tables: [],
      liveCollections,
      warnings
    }
  }

  private auditSemantics (): AuditSectionResult {

    return {
      name: 'semantics',
      ...WebAudit.mergeAuditResult(this.auditCommonSemantics(),
        this.auditHeaderSemantics(),
        this.auditTextSemantics(),
        this.auditBlockSemantics())
    }
  }

  private auditCommonSemantics (): AuditResult {
    const commonElements = Object.fromEntries(
      this.commonTagsNames.map(tag => [
        tag,
        WebAudit.getElementsByTagNameCount(tag)
      ])
    )
    return {
      tables: [{
        name: 'common elements count in dom',
        ...commonElements
      }]
    }
  }

  private auditHeaderSemantics (): AuditResult {
    const headerElements = Object.fromEntries(
      this.headerTagsNames.map(tag => [
        tag,
        WebAudit.getElementsByTagNameCount(tag)
      ])
    )
    const errors: string[] = []
    if (headerElements['h1'] !== 1) {
      errors.push('Document must have one h1')
    }
    return {
      errors,
      tables: [{
        name: 'header elements count in dom',
        ...headerElements
      },]
    }
  }

  private auditTextSemantics (): AuditResult {
    const textElements = Object.fromEntries(
      this.textTagsNames.map(tag => [
        tag,
        WebAudit.getElementsByTagNameCount(tag)
      ])
    )
    return {
      tables: [{
        name: 'text elements count in dom',
        ...textElements
      },]
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

  static renderAuditResult (auditSectionResult: AuditSectionResult) {
    const { name, tables, errors = [], warnings = [], liveCollections = [] } = auditSectionResult
    console.group(name)
    tables.forEach(({ name, nodes, ...tableDataSet }) => {
      console.log(name)
      console.table(tableDataSet)
    })
    liveCollections.forEach(({ name, collection }) => {
      console.log(name)
      console.log(collection)
    })
    console.log('Summary')
    if (errors.length > 0 || warnings.length > 0) {
      errors.forEach(message => console.error(message))
      warnings.forEach(message => console.warn(message))
    } else {
      console.log('It is OK')
    }

    console.groupEnd()
  }

  static mergeAuditResult (...auditResults: AuditResult[]): AuditResult {
    return auditResults.reduce<AuditResult>((result, auditResult) => {
      const {
        warnings = [],
        errors = [],
        tables,
        liveCollections = []
      } = auditResult
      return {
        tables: result.tables.concat(tables),
        errors: (result.errors || []).concat(errors),
        warnings: (result.warnings || []).concat(warnings),
        liveCollections: (result.liveCollections || []).concat(liveCollections),
      }
    }, {
      tables: [],
      errors: [],
      warnings: [],
      liveCollections: []
    })
  }
}

