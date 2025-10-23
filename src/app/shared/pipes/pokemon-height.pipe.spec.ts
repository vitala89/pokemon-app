import { PokemonHeightPipe } from '@app/shared';

describe('PokemonHeightPipe', () => {
  const pipe = new PokemonHeightPipe();

  it('should format height in meters', () => {
    expect(pipe.transform(17)).toBe('1.7 m');
  });

  it('should return empty string for nullish values', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });
});
