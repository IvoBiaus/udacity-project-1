import express from 'express';
import fs, { promises as fsP } from 'fs';
import sharp from 'sharp';
import FileType from 'file-type';

import { imagesDir } from '../../constants/directories';
import { getCacheFilePath } from '../../utils/helpers';
import { getGallery, getImg } from '../../utils/html';

const images = express.Router();

images.get('/', async (req, res) => {
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
    return res.status(400).send('Parameters must be strings');
  }

  // Get original image
  const getOriginalFile = !width && !height;
  if (getOriginalFile) {
    const originalPath = `${imagesDir}/${fileName}`;
    const mime = (await FileType.fromFile(originalPath))?.mime ?? '';
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
    const mime = (await FileType.fromFile(cachePath))?.mime ?? '';
    res.contentType(mime);
    return res.sendFile(cachePath);
  }

  // Create and save a new cache file
  try {
    const file = await fsP.readFile(`${imagesDir}/${fileName}`);
    const resizedFile = await sharp(file)
      .resize(parseInt(`${width}`), parseInt(`${height}`), {
        fit: sharp.fit[fit as keyof sharp.FitEnum] || 'cover',
      })
      .toBuffer();
    await fsP.writeFile(cachePath, resizedFile);
    const mime = (await FileType.fromFile(cachePath))?.mime ?? '';
    res.contentType(mime);
    return res.sendFile(cachePath);
  } catch (error) {
    return res.status(500).send('Error when creating the resized image. Contact the developer.');
  }
});

export default images;
