import { isValidMime } from '../../utils/validators';

describe('Utils - Validation functions', () => {
  const validMimes = ['image/png', 'image/jpeg'];

  validMimes.forEach(mime => {
    it(`Mime ${mime} is valid`, () => {
      expect(isValidMime(mime)).toBe(true);
    });
  });

  it('Empty mime is invalid', () => {
    expect(isValidMime('')).toBe(false);
  });
});
