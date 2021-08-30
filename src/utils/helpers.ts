import { cacheDir } from '../constants/directories';

const getCacheName = (originalName: string, width: string, height: string, fit = ''): string =>
  `${width}-${height}-${fit}-${originalName}`;

export const getCacheFilePath = (
  originalName: string,
  width: string,
  height: string,
  fit = '',
): string => `${cacheDir}/${getCacheName(originalName, width, height, fit)}`;
