import express, { Request, Response } from 'express';
import fs, { promises as fsP } from 'fs';

import { ImagesQuery } from '../../interfaces/imagesQuery';
import { ResponseReturn } from '../../interfaces/responseReturn';
import { fileNotFound, invalidParameters } from '../../constants/messages';
import { getCacheFilePath, getMime } from '../../utils/helpers';
import { getGallery, getImg } from '../../utils/html';
import { imagesDir } from '../../constants/directories';
import { resize } from '../../utils/imageProcessing';

const images = express.Router();

images.get(
  '/',
  async (
    req: Request<unknown, unknown, unknown, ImagesQuery>,
    res: Response,
  ): Promise<ResponseReturn | void> => {
    const { fileName, width, height, fit } = req.query;
    const hasNoParams = [fileName, width, height].every(value => !value);
    res.setHeader('Cache-Control', 'max-age=7884000, no-cache');
    res.vary('ETag, Content-Encoding');

    // Show all images
    if (hasNoParams) {
      const filesPaths = await (
        await fsP.readdir(imagesDir, { withFileTypes: true })
      ).filter(a => a.isFile());

      const imagesOptions = filesPaths.map(img => {
        return getImg(req.protocol, `${req.get('host')}`, img.name);
      });

      return res.send(getGallery(imagesOptions.join('')));
    }

    // Wrong parameters validation
    const notStrings = [fileName, width, height, fit].some(
      value => value && typeof value != 'string',
    );
    if (notStrings || !fileName || !width != !height) {
      return res.status(400).send(invalidParameters);
    }

    // Get original image
    const getOriginalFile = !width && !height;
    if (getOriginalFile) {
      const originalPath = `${imagesDir}/${fileName}`;
      if (!fs.existsSync(originalPath)) {
        return res.status(400).send(fileNotFound);
      }
      const mime = await getMime(originalPath);
      res.contentType(mime);
      return res.sendFile(originalPath);
    }

    // Return existent cached file
    const cachePath = getCacheFilePath(
      `${fileName}`,
      `${width}`,
      `${height}`,
      fit as string | undefined,
    );
    if (fs.existsSync(cachePath)) {
      const mime = await getMime(cachePath);
      res.contentType(mime);
      return res.sendFile(cachePath);
    }

    // Create and save a new cache file
    try {
      const file = await fsP.readFile(`${imagesDir}/${fileName}`);

      const resizedFile = await resize(file, `${width}`, `${height}`, `${fit}`);
      await fsP.writeFile(cachePath, resizedFile);
      const mime = await getMime(cachePath);
      res.contentType(mime);
      return res.sendFile(cachePath);
    } catch (error) {
      return res.status(400).send(fileNotFound);
    }
  },
);

export default images;
