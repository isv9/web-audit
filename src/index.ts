type AuditSemanticsResult = {
    commonElements: { [key: string]: number };
    headerElements: { [key: string]: number };
    blockElements: { [key: string]: number };
    textElements: { [key: string]: number };
}

class WebAudit {

    private readonly commonTagsNames: string[] = ['nav', 'header', 'main', 'footer'];
    private readonly headerTagsNames: string[] = Array.from(new Array(6)).map((_, index) => `h${index + 1}`);
    private readonly blockTagsNames: string[] = ['div', 'section', 'article'];
    private readonly textTagsNames: string[] = ['label', 'span', 'p'];

    audit() {
        const auditSemanticsResult = this.auditSemantics();
        console.group('web audit');
        WebAudit.renderAuditSemanticsResult(auditSemanticsResult);
        console.groupEnd();
    }

    private auditSemantics(): AuditSemanticsResult {
        return {
            commonElements: Object.fromEntries(this.commonTagsNames.map(tag => ([tag,
                WebAudit.getElementsByTagNameCount(tag)]))),
            headerElements: Object.fromEntries(this.headerTagsNames.map(tag => ([tag,
                WebAudit.getElementsByTagNameCount(tag)]))),
            blockElements: Object.fromEntries(this.blockTagsNames.map(tag => ([tag,
                WebAudit.getElementsByTagNameCount(tag)]))),
            textElements: Object.fromEntries(this.textTagsNames.map(tag => ([tag,
                WebAudit.getElementsByTagNameCount(tag)]))),
        }
    }

    static getElementsByTagNameCount(tag: string): number {
        return document.getElementsByTagName(tag).length;
    }

    static renderAuditSemanticsResult(auditSemanticsResult: AuditSemanticsResult) {
        const {
            commonElements,
            headerElements,
            blockElements,
            textElements
        } = auditSemanticsResult;
        console.group('semantics');
        console.log('common elements count in dom');
        console.table(commonElements);
        console.log('header elements count in dom');
        console.table(headerElements);
        console.log('block elements count in dom');
        console.table(blockElements);
        console.log('text elements count in dom');
        console.table(textElements);
        console.log('Summary');
        if (headerElements['h1'] !== 1) {
            console.error('Document must have one h1');
        }
        const divCount = blockElements['div'];
        const articlePart = (100 * blockElements['article']) / divCount;
        const sectionPart = (100 * blockElements['section']) / divCount;
        if((articlePart + sectionPart) < 70){
            console.warn('Document has much div');
        }
        console.groupEnd();
    }
}

(new WebAudit()).audit();