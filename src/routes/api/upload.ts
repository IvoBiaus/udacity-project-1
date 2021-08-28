import express from 'express';
import fileUpload from 'express-fileupload';
import { promises as fs } from 'fs';
import { failedUpload, successUpload, uploadPage } from '../../constants/html';
import { isValidMime } from '../../utils/validators';

const upload = express.Router();
upload.use(fileUpload());

upload.get('/', (req, res) => res.send(uploadPage));

upload.post('/', async (req, res) => {
  const file = req.files?.image as fileUpload.UploadedFile | undefined;
  const root = `${process.cwd()}/build`;

  if (file && isValidMime(file.mimetype)) {
    const imagesPath = `${root}/images/${file.name}`;
    try {
      await fs.writeFile(imagesPath, file.data);
      return res.send(successUpload);
    } catch (error) {
      return res.sendStatus(500);
    }
  }
  return res.send(failedUpload);
});

export default upload;
