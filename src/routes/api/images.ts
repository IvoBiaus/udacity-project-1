import express from 'express';
import fs, { promises as fsP } from 'fs';
import sharp from 'sharp';
import { imagesDir } from '../../constants/directories';
import { getCacheFilePath, getGallery, getImg } from '../../utils/helpers';

const images = express.Router();

images.get('/', async (req, res) => {
  const { fileName, width, height } = req.query;
  const hasNoParams = [fileName, width, height].every(value => !value);

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
  const notStrings = [fileName, width, height].some(value => value && typeof value != 'string');
  if (notStrings || !fileName || !width != !height) {
    return res.sendStatus(400);
  }

  // Get original image
  const getOriginalFile = !!fileName && !width && !height;
  if (getOriginalFile) {
    return res.sendFile(`${imagesDir}/${fileName}`);
  }

  // Return existent cached file
  const cachePath = getCacheFilePath(`${fileName}`, `${width}`, `${height}`);
  if (fs.existsSync(cachePath)) {
    return res.sendFile(cachePath);
  }

  // Create and save a new cache file
  try {
    const file = await fsP.readFile(`${imagesDir}/${fileName}`);
    const resizedFile = await sharp(file)
      .resize(parseInt(`${width}`), parseInt(`${height}`))
      .toBuffer();
    await fsP.writeFile(cachePath, resizedFile);
    return res.sendFile(cachePath);
  } catch (error) {
    return res.sendStatus(400);
  }
});

export default images;
