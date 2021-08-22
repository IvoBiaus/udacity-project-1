import express from 'express';
import fileUpload from 'express-fileupload';

const upload = express.Router();
upload.use(fileUpload());

upload.get('/', (req, res) => res.send(uploadHtml));

upload.post('/', (req, res) => {
  const file = req.files?.image;

  if (file) {
    return res.send(successUpload);
  }
  return res.send(failedUpload);
});

export const successUpload = '<body><span>Success!</span></body>';
export const failedUpload = '<body><span>Failed</span></body>';
export const uploadHtml = `
  <body>
    <form
      method="POST"
      action="upload"
      style="display: flex;flex-direction: column;width: fit-content"
      encType="multipart/form-data"
    >
      <input type="file" accept="image/*" id="imageInput" name="image" />
      <input style="margin-top: 15px" type="submit">
    </form>
  </body>`;
export default upload;
