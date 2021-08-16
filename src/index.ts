import express from 'express';

const basicFn = (): number => 25;

const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Server has started at: http://localhost:${port}`);
});

app.get('/', (req, res) => {
  res.send('Root directory.');
});

export default basicFn;
