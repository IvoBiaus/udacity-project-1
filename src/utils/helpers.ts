import FileType from 'file-type';

import { cacheDir } from '../constants/directories';

const getCacheName = (originalName: string, width: string, height: string, fit = ''): string =>
  `${width}-${height}-${fit}-${originalName}`;

export const getCacheFilePath = (
  originalName: string,
  width: string,
  height: string,
  fit = '',
): string => `${cacheDir}/${getCacheName(originalName, width, height, fit)}`;

export const getMime = async (path: string): Promise<string> =>
  (await FileType.fromFile(path))?.mime ?? '';
