import { FormatPokemonNamePipe } from '@app/shared';

describe('FormatPokemonNamePipe', () => {
  let pipe: FormatPokemonNamePipe;

  beforeEach(() => {
    pipe = new FormatPokemonNamePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format simple Pokemon name', () => {
    expect(pipe.transform('pikachu')).toBe('Pikachu');
  });

  it('should format hyphenated Pokemon name', () => {
    expect(pipe.transform('mr-mime')).toBe('Mr Mime');
  });

  it('should format name with multiple hyphens', () => {
    expect(pipe.transform('tapu-koko')).toBe('Tapu Koko');
  });

  it('should handle null', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('should handle undefined', () => {
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should handle already capitalized name', () => {
    expect(pipe.transform('Bulbasaur')).toBe('Bulbasaur');
  });

  it('should handle empty string', () => {
    expect(pipe.transform('')).toBe('');
  });
});
