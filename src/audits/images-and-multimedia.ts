import { AuditResult, TagAmountMap, WebDocument } from '../web-audit';

const imagesAndMultimediaTagsNames: string[] = [
  'picture',
  'source',
  'img',
  'image',
  'video',
  'map',
  'canvas',
];

export function auditImagesAndMultimedia(
  document: Pick<WebDocument, 'querySelectorAll' | 'getTagAmountMap'>,
): AuditResult {
  const imagesAndMultimediaAmountMap = document.getTagAmountMap(
    imagesAndMultimediaTagsNames,
  );
  const imagesWithSrcsetTagAmount = document.querySelectorAll('img[srcset]')
    .length;

  const logs: string[] = [
    `Document has ${imagesWithSrcsetTagAmount} img with srcset attribute`,
  ];
  const errors: string[] = [];
  if (imagesAndMultimediaAmountMap.image > 0) {
    errors.push('Tag image is deprecated');
  }

  if (imagesAndMultimediaAmountMap.img > 0) {
    if (
      checkExistFlexibleImages(
        imagesWithSrcsetTagAmount,
        imagesAndMultimediaAmountMap,
      )
    ) {
      logs.push('Document has some flexible images');
    } else {
      errors.push('Document does not have any flexible images');
    }
  }

  return {
    logs,
    errors,
    name: 'images and multimedia in dom',
    tables: [{ content: imagesAndMultimediaAmountMap }],
  };
}

function checkExistFlexibleImages(
  imagesWithSrcsetTagAmount: number,
  imagesAndMultimediaAmountMap: TagAmountMap,
): boolean {
  const {
    picture: pictureTagAmount,
    source: sourceTagAmount,
  } = imagesAndMultimediaAmountMap;
  return [pictureTagAmount, sourceTagAmount, imagesWithSrcsetTagAmount].some(
    (count) => count > 0,
  );
}
