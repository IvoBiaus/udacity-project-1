import express from 'express';

const upload = express.Router();

upload.get('/', (req, res) => {
  return res.sendStatus(200);
});

export default upload;
