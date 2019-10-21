import { WebAudit } from './web-audit';

console.clear();
const webAudit = new WebAudit({
  getElementsByTagNameCount(tag: string): number {
    return document.getElementsByTagName(tag).length;
  },
  querySelectorAll(query: string): { length: number } {
    return document.querySelectorAll(query);
  },
  getEmptyElementsByTagName(tag: string): { length: number } {
    return document.querySelectorAll(`${tag}:empty`);
  },
});
webAudit.audit();
