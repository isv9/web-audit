import { AuditResult, WebDocument } from '../web-audit'

const imagesTagsNames: string[] = [
  'picture',
  'source',
  'img',
  'image',
  'video',
  'map'
]

export function auditImages (document: Pick<WebDocument, 'querySelectorAll' | 'getElementsByTagNameCount'>): AuditResult {
  const linksElements = Object.fromEntries(
    imagesTagsNames.map(tag => [
      tag,
      document.getElementsByTagNameCount(tag)
    ])
  )
  const imagesWithSrcsetTagCount = document.querySelectorAll('img[srcset]').length
  const logs: string[] = [`Document has ${imagesWithSrcsetTagCount} img with srcset attribute`]
  const errors: string[] = []
  if(linksElements.image > 0){
    errors.push('Tag image is deprecated')
  }

  if (checkExistFlexibleImages(imagesWithSrcsetTagCount, linksElements)) {
    logs.push('Document has some flexible images')
  } else {
    errors.push('Document does not have any flexible images')
  }

  return {
    logs,
    errors,
    name: 'images in dom',
    tables: [linksElements]
  }
}

function checkExistFlexibleImages (imagesWithSrcsetTagCount: number, linksElements: { [tag: string]: number }): boolean {
  const pictureTagCount = linksElements['picture']
  const sourceTagCount = linksElements['source']
  return [pictureTagCount, sourceTagCount, imagesWithSrcsetTagCount].some(count => count > 0)
}
