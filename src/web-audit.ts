import {
  auditBlockSemantics,
  auditCommonSemantics,
  auditHeaderSemantics,
  auditTextSemantics,
} from './audits/semantic';
import { auditLinks } from './audits/links';
import { auditImagesAndMultimedia } from './audits/imagesAndMultimedia';
import { auditDeprecatedTags } from './audits/deprecated-tags';

export type WebDocument = {
  getElementsByTagNameCount(tag: string): number;
  getElementsByTagName(tag: string): { length: number };
  querySelectorAll(query: string): { length: number };
  getEmptyElementsByTagName(tag: string): { length: number };
};

type AuditSectionResult = {
  name: string;
  auditResults: AuditResult[];
};

export type AuditResult = {
  name?: string;
  tables: (AuditResultTable)[];
  logs?: AuditResultLog[];
  warnings?: string[];
  errors?: string[];
};

export type AuditResultLog = string | any[];
type AuditResultTable = { name?: string } & { [key: string]: string | number };

export class WebAudit {
  private readonly webDocument: WebDocument;

  constructor(webDocument: WebDocument) {
    this.webDocument = webDocument;
  }

  audit() {
    const auditResults: AuditSectionResult[] = [
      this.auditSemantics(),
      this.auditLinks(),
      this.auditImages(),
      this.auditDeprecatedTags(),
    ];
    console.group('web audit');
    auditResults.forEach(WebAudit.renderAuditSectionResult);
    console.groupEnd();
  }

  private auditLinks(): AuditSectionResult {
    return {
      name: 'links',
      auditResults: [auditLinks(this.webDocument)],
    };
  }

  private auditImages(): AuditSectionResult {
    return {
      name: 'images and multimedia',
      auditResults: [auditImagesAndMultimedia(this.webDocument)],
    };
  }

  private auditDeprecatedTags(): AuditSectionResult {
    return {
      name: 'deprecated tags',
      auditResults: [auditDeprecatedTags(this.webDocument)],
    };
  }

  private auditSemantics(): AuditSectionResult {
    return {
      name: 'semantics',
      auditResults: [
        auditCommonSemantics(this.webDocument),
        auditHeaderSemantics(this.webDocument),
        auditTextSemantics(this.webDocument),
        auditBlockSemantics(this.webDocument),
      ],
    };
  }

  static renderAuditSectionResult(auditSectionResult: AuditSectionResult) {
    const { name, auditResults } = auditSectionResult;
    const details = {
      errorsCount: 0,
      warningsCount: 0,
    };
    auditResults.forEach(auditResult => {
      const errorsCount = WebAudit.getAuditResultMessagesCount(auditResult, 'errors');
      const warningsCount = WebAudit.getAuditResultMessagesCount(auditResult, 'warnings');
      details.errorsCount += errorsCount;
      details.warningsCount += warningsCount;
    });
    console.groupCollapsed(
      `${name}, (errors="${details.errorsCount}", warnings="${details.warningsCount}")`,
    );
    auditResults.forEach(auditResult => WebAudit.renderAuditResult(auditResult));
    console.groupEnd();
  }

  static renderAuditResult(auditResult: AuditResult) {
    const {
      name,
      tables,
      errors = [],
      warnings = [],
      logs = [],
    } = auditResult;
    const errorsCount = WebAudit.getAuditResultMessagesCount(auditResult, 'errors');
    const warningsCount = WebAudit.getAuditResultMessagesCount(auditResult, 'warnings');
    console.groupCollapsed(`${name}, (errors="${errorsCount}", warnings="${warningsCount}")`);
    tables.forEach(({ name, nodes, ...tableDataSet }) => {
      if (name) {
        console.log(name);
      }
      console.table(tableDataSet);
    });
    logs.forEach(log => (Array.isArray(log) ? console.log(...log) : console.log(log)));
    console.log('Summary');
    if (errorsCount > 0 || warningsCount > 0) {
      errors.forEach(message => console.error(message));
      warnings.forEach(message => console.warn(message));
    } else {
      console.log('It is OK');
    }

    console.groupEnd();
  }

  static getAuditResultMessagesCount(auditResult: AuditResult, key: keyof AuditResult): number {
    let property = auditResult[key];
    if (property === null || property === undefined) {
      property = [];
    }
    if (Array.isArray(property)) {
      return property.length;
    }
    throw new Error('Property type must be array');
  }
}
