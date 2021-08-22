import express from 'express';
import routes from './routes';

const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Server has started at: http://localhost:${port}`);
});

app.use('/', routes);

export default app;
