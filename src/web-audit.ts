import { auditBlockSemantics, auditCommonSemantics, auditHeaderSemantics, auditTextSemantics } from './audits/semantic'
import { auditLinks } from './audits/links'

export type WebDocument = {
  getElementsByTagNameCount (tag: string): number;
  querySelectorAll (query: string): { length: number };
  getEmptyElementsByTagName (tag: string): { length: number }
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
export type AuditResultLiveCollection = { name: string, collection: object };

export class WebAudit {

  private readonly webDocument: WebDocument

  constructor (webDocument: WebDocument) {
    this.webDocument = webDocument
  }

  audit () {
    const auditSemanticsResult = this.auditSemantics()
    const auditLinksResult = this.auditLinks()
    console.group('web audit')
    WebAudit.renderAuditSectionResult(auditSemanticsResult)
    WebAudit.renderAuditSectionResult(auditLinksResult)
    console.groupEnd()
  }

  private auditLinks (): AuditSectionResult {
    return {
      name: 'links',
      auditResults: [
        auditLinks(this.webDocument)]
    }
  }

  private auditSemantics (): AuditSectionResult {

    return {
      name: 'semantics',
      auditResults: [auditCommonSemantics(this.webDocument),
        auditHeaderSemantics(this.webDocument),
        auditTextSemantics(this.webDocument),
        auditBlockSemantics(this.webDocument)]
    }
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

