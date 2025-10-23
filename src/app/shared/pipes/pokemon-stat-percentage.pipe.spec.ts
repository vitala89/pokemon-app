import { PokemonStatPercentagePipe } from '@app/shared';

describe('PokemonStatPercentagePipe', () => {
  const pipe = new PokemonStatPercentagePipe();

  it('should calculate percentage for base stat', () => {
    expect(pipe.transform(50)).toBe(20);
    expect(pipe.transform(255)).toBe(100);
  });

  it('should clamp values above max to 100', () => {
    expect(pipe.transform(400)).toBe(100);
  });

  it('should return 0 for nullish or non-positive values', () => {
    expect(pipe.transform(null)).toBe(0);
    expect(pipe.transform(undefined)).toBe(0);
    expect(pipe.transform(0)).toBe(0);
  });
});
