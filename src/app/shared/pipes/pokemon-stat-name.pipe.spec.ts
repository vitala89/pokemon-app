import { PokemonStatNamePipe } from '@app/shared';

describe('PokemonStatNamePipe', () => {
  const pipe = new PokemonStatNamePipe();

  it('should map known stat names', () => {
    expect(pipe.transform('hp')).toBe('HP');
    expect(pipe.transform('special-attack')).toBe('Sp. Attack');
    expect(pipe.transform('special-defense')).toBe('Sp. Defense');
  });

  it('should return original value for unknown stats', () => {
    expect(pipe.transform('accuracy')).toBe('accuracy');
  });

  it('should return empty string for nullish values', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });
});
