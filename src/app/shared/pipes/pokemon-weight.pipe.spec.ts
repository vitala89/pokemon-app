import { PokemonWeightPipe } from '@app/shared';

describe('PokemonWeightPipe', () => {
  const pipe = new PokemonWeightPipe();

  it('should format weight in kilograms', () => {
    expect(pipe.transform(69)).toBe('6.9 kg');
  });

  it('should return empty string for nullish values', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });
});
