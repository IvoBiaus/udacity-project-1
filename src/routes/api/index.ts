import express from 'express';
import images from './images';
import upload from './upload';

const api = express.Router();

api.use('/images', images);
api.use('/upload', upload);

export default api;
