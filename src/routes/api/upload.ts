import express from 'express';
import fileUpload from 'express-fileupload';
import { promises as fs } from 'fs';

import { isValidMime } from '../../utils/validators';
import { root } from '../../constants/directories';
import { uploadPage } from '../../utils/html';

const upload = express.Router();
upload.use(fileUpload());

upload.get('/', (req, res) => res.send(uploadPage()));

upload.post('/', async (req, res) => {
  const file = req.files?.image as fileUpload.UploadedFile | undefined;

  if (file && isValidMime(file.mimetype)) {
    const imagesPath = `${root}/images/${file.name}`;
    try {
      await fs.writeFile(imagesPath, file.data);
      return res.send(uploadPage('Success!'));
    } catch (error) {
      return res.status(500).send(uploadPage('Failed'));
    }
  }
  return res.status(400).send(uploadPage('Failed'));
});

export default upload;
