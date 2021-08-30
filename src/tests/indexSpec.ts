import fs, { promises as fsP } from 'fs';
import supertest from 'supertest';
import sharp from 'sharp';

import app from '../index';
import { imagesDir } from '../constants/directories';
import { getCacheFilePath } from '../utils/helpers';
import { uploadPage } from '../utils/html';
import { formatNotSupported, success } from '../constants/messages';

const request = supertest(app);

describe('Endpoints responses', async () => {
  const testImgStorage = `${__dirname}/mocks`;
  if (!fs.existsSync(testImgStorage)) {
    await fsP.mkdir(testImgStorage);
  }
  const mockSharp = sharp({
    create: {
      width: 1,
      height: 1,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  }).png();

  it('server responds correctly', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
  });

  it('images responds 400 with all the parameters but unexistent file', async () => {
    const response = await request.get('/api/images?fileName=nonexistent.png&width=200&height=200');
    expect(response.status).toBe(400);
  });

  it('images responds 200 with all the parameters and existent file', async () => {
    const fileName = `${Date.now()}.png`;
    const filePath = `${imagesDir}/${fileName}`;
    await fsP.writeFile(filePath, await mockSharp.toBuffer());

    const response = await request.get(`/api/images?fileName=${fileName}&width=200&height=200`);
    expect(response.status).toBe(200);
    await fsP.rm(filePath);
    await fsP.rm(getCacheFilePath(fileName, '200', '200'));
  });

  it('images responds 400 when requesting nonexistent file', async () => {
    const response = await request.get('/api/images?fileName=nonexistent.png');
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
    expect(response.text).toBe(uploadPage());
  });

  it('upload POST responds with success html when the file is attached & uploaded', async () => {
    const fileName = `${Date.now()}.png`;
    const filePath = `${__dirname}/mocks/${fileName}`;
    await fsP.writeFile(filePath, await mockSharp.toBuffer());
    const file = await fsP.readFile(filePath);

    const response = await request
      .post('/api/upload')
      .set('content-type', 'multipart/form-data')
      .attach('image', file, fileName);
    await fsP.rm(filePath);
    await fsP.rm(`${imagesDir}/${fileName}`);
    expect(response.text).toBe(uploadPage(success));
  });

  it('upload POST responds with failure html when no file is attached', async () => {
    const response = await request.post('/api/upload').set('content-type', 'multipart/form-data');
    expect(response.text).toBe(uploadPage(formatNotSupported));
  });

  it('upload POST responds with failure html when file is not an image', async () => {
    const filePath = `${__dirname}/mocks/report.pdf`;
    await fsP.writeFile(filePath, await mockSharp.toBuffer());
    const file = await fsP.readFile(filePath);

    const response = await request
      .post('/api/upload')
      .set('content-type', 'multipart/form-data')
      .attach('image', file, 'report.pdf');
    await fsP.rm(filePath);
    expect(response.text).toBe(uploadPage(formatNotSupported));
  });
});
