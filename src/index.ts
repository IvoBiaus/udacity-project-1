import express from 'express';
import routes from './routes';
import fs from 'fs';
import { cacheDir, imagesDir } from './constants/directories';

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir);
}
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir);
}

const app = express();
const port = 3000;

app.listen(port, (): void => {
  console.log(`Server has started at: http://localhost:${port}`);
});

app.use('/', routes);

export default app;
