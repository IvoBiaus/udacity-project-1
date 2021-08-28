import express from 'express';
import routes from './routes';
import fs from 'fs';

const imgStorage = `${__dirname}/images`;
if (!fs.existsSync(imgStorage)) {
  fs.mkdirSync(imgStorage);
}

const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Server has started at: http://localhost:${port}`);
});

app.use('/', routes);

export default app;
