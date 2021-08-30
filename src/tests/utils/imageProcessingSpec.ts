import fs, { promises as fsP } from 'fs';

import { getMockBuffer, resize } from '../../utils/imageProcessing';

describe('Utils - Image Processing', async () => {
  const testImgStorage = `${__dirname}/mocks`;
  if (!fs.existsSync(testImgStorage)) {
    await fsP.mkdir(testImgStorage);
  }

  it('Original buffer and resized buffer must be different', async () => {
    const fileBuffer = await getMockBuffer();
    const resizedBuffer = await resize(fileBuffer, '200', '200');

    expect(resizedBuffer.equals(fileBuffer)).toBe(false);
  });

  it('Original buffer resized to the same width and height, should be the same', async () => {
    const fileBuffer = await getMockBuffer();
    const resizedBuffer = await resize(fileBuffer, '1', '1');

    expect(resizedBuffer.equals(fileBuffer)).toBe(true);
  });

  it('Original buffer resized to the same width and height with different fit, should be the same', async () => {
    const fileBuffer = await getMockBuffer();
    const resizedBuffer = await resize(fileBuffer, '1', '1', 'contain');

    expect(resizedBuffer.equals(fileBuffer)).toBe(true);
  });

  it('Buffers from the same parent, with different fit and same size, should be different', async () => {
    const fileBuffer = await getMockBuffer();

    const containBuffer = await resize(fileBuffer, '10', '20', 'contain');
    const fillBuffer = await resize(fileBuffer, '10', '20', 'fill');

    expect(containBuffer.equals(fillBuffer)).toBe(false);
  });
});
