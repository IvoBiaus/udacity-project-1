import { cacheDir } from '../constants/directories';
import { header } from '../constants/html';

const getCacheName = (originalName: string, width: string, height: string, fit = ''): string =>
  `${width}-${height}-${fit}-${originalName}`;

export const getCacheFilePath = (
  originalName: string,
  width: string,
  height: string,
  fit = '',
): string => `${cacheDir}/${getCacheName(originalName, width, height, fit)}`;

export const getImg = (protocol: string, host: string, fileName: string): string => {
  const url = `${protocol}://${host}/api/images?fileName=${fileName}`;

  return `
  <a 
    style="display: flex;flex-direction: column;width: min-content;height: fit-content; margin: 10px;"
    href="${url}"
  >
    <b style="text-align: center; margin-bottom: 10px;">${fileName}</b>
    <img style="max-width: 200px;max-height: 200px;" src="${url}"/>
  </a>`;
};

export const getGallery = (images: string): string => `
  ${header}
  <div style="display: flex;flex-wrap: wrap;">
    ${images}
  </div>
`;
