import sharp from 'sharp';

export const resize = async (
  file: Buffer,
  width: string,
  height: string,
  fit = 'cover',
): Promise<Buffer> => {
  const fitKey = sharp.fit[fit as keyof sharp.FitEnum] || 'cover';

  return await sharp(file)
    .resize(parseInt(`${width}`), parseInt(`${height}`), {
      fit: fitKey,
    })
    .toBuffer();
};

/// The returned buffer has a PNG type
export const getMockBuffer = async (): Promise<Buffer> =>
  await sharp({
    create: {
      width: 1,
      height: 1,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .png()
    .toBuffer();

export default { resize, getMockBuffer };
