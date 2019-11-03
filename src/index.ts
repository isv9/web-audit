import { TagAmountMap, WebAudit } from './web-audit';

console.clear();
const webAudit = new WebAudit({
  getTagAmount(tagName: string): number {
    return document.getElementsByTagName(tagName).length;
  },
  getTagAmountMap(tagsNames: string[]): TagAmountMap {
    return Object.fromEntries(
      tagsNames.map(tagName => [tagName, document.getElementsByTagName(tagName).length]),
    );
  },
  querySelectorAll(querySelector: string): { length: number } {
    return document.querySelectorAll(querySelector);
  },
  getEmptyElementsByTagName(tagName: string): { length: number } {
    return document.querySelectorAll(`${tagName}:empty`);
  },
  getElementsByTagName(tagName: string): { length: number } {
    return document.getElementsByTagName(tagName);
  },
  getElementsWhichHasAttribute(tagName: string, attribute: string): { length: number } {
    return document.querySelectorAll(`${tagName}[${attribute}]`);
  },
});
webAudit.audit();
