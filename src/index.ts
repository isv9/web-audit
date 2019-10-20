import { WebAudit } from './web-audit'

console.clear()
const webAudit = new WebAudit({
  getElementsByTagNameCount (tag: string): number {
    return document.getElementsByTagName(tag).length
  }
})
webAudit.audit()
