export const isValidMime = (mime: string): boolean => {
  const validMimes = ['image/png', 'image/jpeg'];
  return validMimes.includes(mime);
};
