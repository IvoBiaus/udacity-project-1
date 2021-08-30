import { isValidMime } from '../../utils/validators';

describe('Utils - Validation functions', async () => {
  const validMimes = ['image/png', 'image/jpeg'];

  validMimes.forEach(mime => {
    it(`Mime ${mime} is valid`, async () => {
      expect(isValidMime(mime)).toBe(true);
    });
  });

  it('Empty mime is invalid', async () => {
    expect(isValidMime('')).toBe(false);
  });
});
