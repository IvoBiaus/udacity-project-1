import fs, { promises as fsP } from 'fs';
import supertest from 'supertest';
import sharp from 'sharp';

import app from '../index';
import { failedUpload, successUpload, uploadPage } from '../constants/html';
import { imagesDir } from '../constants/directories';

const request = supertest(app);

describe('Test endpoints responses', async () => {
  const testImgStorage = `${__dirname}/mocks`;
  if (!fs.existsSync(testImgStorage)) {
    await fsP.mkdir(testImgStorage);
  }

  it('server responds correctly', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
  });

  it('images responds 400 with all the parameters but unexistent file', async () => {
    const response = await request.get('/api/images?fileName=nonexistent.png&width=200&height=200');
    expect(response.status).toBe(400);
  });

  it('images responds 200 with all the parameters and existent file', async () => {
    const buffer = await sharp({
      create: {
        width: 1,
        height: 1,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .png()
      .toBuffer();
    const filePath = `${imagesDir}/existent.png`;
    await fsP.writeFile(filePath, buffer);

    const response = await request.get('/api/images?fileName=existent.png&width=200&height=200');
    expect(response.status).toBe(200);
    await fsP.rm(filePath);
  });

  it('images responds 400 when requesting nonexistent file', async () => {
    const response = await request.get('/api/images?fileName=nonexistent.png&width=200&height=200');
    expect(response.status).toBe(400);
  });

  it('images returns all assets when called with no params', async () => {
    const response = await request.get('/api/images');
    expect([response.status, typeof response.text]).toEqual([200, 'string']);
  });

  it('images responds 400 when missing file name', async () => {
    const response = await request.get('/api/images?width=200&height=200');
    expect(response.status).toBe(400);
  });

  it('images responds 400 when height is sent without width', async () => {
    const response = await request.get('/api/images?fileName=cat.png&height=200');
    expect(response.status).toBe(400);
  });

  it('images responds 400 when width is sent without height', async () => {
    const response = await request.get('/api/images?fileName=cat.png&width=200');
    expect(response.status).toBe(400);
  });

  it('upload GET responds with form', async () => {
    const response = await request.get('/api/upload').set('content-type', 'multipart/form-data');
    expect(response.text).toBe(uploadPage);
  });

  it('upload POST responds with success html when the file is attached & uploaded', async () => {
    const filePath = `${__dirname}/mocks/image.png`;
    await fsP.writeFile(filePath, Buffer.from(''));
    const file = await fsP.readFile(filePath);

    const response = await request
      .post('/api/upload')
      .set('content-type', 'multipart/form-data')
      .attach('image', file, 'image.png');
    await fsP.rm(filePath);
    expect(response.text).toBe(successUpload);
  });

  it('upload POST responds with failure html when no file is attached', async () => {
    const response = await request.post('/api/upload').set('content-type', 'multipart/form-data');
    expect(response.text).toBe(failedUpload);
  });

  it('upload POST responds with failure html when file is not an image', async () => {
    const response = await request.post('/api/upload').set('content-type', 'multipart/form-data');
    expect(response.text).toBe(failedUpload);
  });

  it('upload POST responds with failure html when file is not an image', async () => {
    const filePath = `${__dirname}/mocks/report.pdf`;
    await fsP.writeFile(filePath, Buffer.from(''));
    const file = await fsP.readFile(filePath);

    const response = await request
      .post('/api/upload')
      .set('content-type', 'multipart/form-data')
      .attach('image', file, 'report.pdf');
    await fsP.rm(filePath);
    expect(response.text).toBe(failedUpload);
  });
});
