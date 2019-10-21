import { AuditResult, WebAudit } from '../web-audit';

describe('web-audit', () => {
  const auditResult: AuditResult = {
    name: 'test audit result name',
    errors: ['e1'],
    warnings: ['w1', 'w2'],
    logs: ['l1', 'l2', 'l3'],
    tables: [],
  };
  it('getAuditResultMessagesCount', () => {
    expect(WebAudit.getAuditResultMessagesCount(auditResult, 'warnings')).toBe(2);
    expect(WebAudit.getAuditResultMessagesCount(auditResult, 'errors')).toBe(1);
    expect(WebAudit.getAuditResultMessagesCount(auditResult, 'logs')).toBe(3);
    expect(() => WebAudit.getAuditResultMessagesCount(auditResult, 'name')).toThrow(Error);
  });

  it('renderAuditResult', () => {
    expect(WebAudit.renderAuditResult(auditResult));
  });

  it('renderAuditSectionResult', () => {
    expect(
      WebAudit.renderAuditSectionResult({
        name: 'test section name',
        auditResults: [auditResult, auditResult],
      }),
    );
  });
});
