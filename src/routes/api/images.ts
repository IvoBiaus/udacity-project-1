import express from 'express';

const images = express.Router();

images.get('/', (req, res) => {
  const { file, width, height } = req.query;
  const fail = [file, width, height].some(value => !value);

  if (fail) return res.sendStatus(400);
  return res.sendStatus(200);
});

export default images;
