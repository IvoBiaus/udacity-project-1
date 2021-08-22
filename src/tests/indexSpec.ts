import fs from 'fs';
import supertest from 'supertest';
import app from '../index';
import { failedUpload, successUpload, uploadHtml } from '../routes/api/upload';

const request = supertest(app);

describe('Test endpoints responses', () => {
  it('server responds correctly', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
  });

  it('images responds 200 with all the parameters', async () => {
    const response = await request.get('/api/images?file=cat&width=200&height=200');
    expect(response.status).toBe(200);
  });

  it('images responds 400 when requesting nonexistent file', async () => {
    const response = await request.get('/api/images?file=nonexistent&width=200&height=200');
    expect(response.status).toBe(400);
  });

  it('images responds 400 with no params', async () => {
    const response = await request.get('/api/images');
    expect(response.status).toBe(400);
  });

  it('images responds 400 when missing file name', async () => {
    const response = await request.get('/api/images?width=200&height=200');
    expect(response.status).toBe(400);
  });

  it('images responds 400 when height is sent without width', async () => {
    const response = await request.get('/api/images?file=cat&height=200');
    expect(response.status).toBe(400);
  });

  it('images responds 400 when width is sent without height', async () => {
    const response = await request.get('/api/images?file=cat&width=200');
    expect(response.status).toBe(400);
  });

  it('upload GET responds with form', async () => {
    const response = await request.get('/api/upload').set('content-type', 'multipart/form-data');
    expect(response.text).toBe(uploadHtml);
  });

  it('upload POST responds with success html when the file is attached & uploaded', async () => {
    const filePath = `${__dirname}/image.png`;
    fs.writeFileSync(filePath, Buffer.from(''));
    const file = fs.readFileSync(filePath);

    const response = await request
      .post('/api/upload')
      .set('content-type', 'multipart/form-data')
      .attach('image', file, 'image.png');
    expect(response.text).toBe(successUpload);
  });

  it('upload POST responds with failure html when no file is attached', async () => {
    const response = await request.post('/api/upload').set('content-type', 'multipart/form-data');
    expect(response.text).toBe(failedUpload);
  });
});
