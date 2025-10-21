import { PokemonImagePipe } from '@app/shared';

describe('PokemonImagePipe', () => {
  let pipe: PokemonImagePipe;

  beforeEach(() => {
    pipe = new PokemonImagePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform numeric ID to image URL', () => {
    const result = pipe.transform(25);
    expect(result).toContain('official-artwork/25.png');
  });

  it('should transform string ID to image URL', () => {
    const result = pipe.transform('150');
    expect(result).toContain('official-artwork/150.png');
  });

  it('should return placeholder for null', () => {
    const result = pipe.transform(null);
    expect(result).toContain('pokemon-placeholder.svg');
  });

  it('should return placeholder for undefined', () => {
    const result = pipe.transform(undefined);
    expect(result).toContain('pokemon-placeholder.svg');
  });

  it('should return custom fallback when provided', () => {
    const fallback = '/custom-placeholder.png';
    const result = pipe.transform(null, fallback);
    expect(result).toBe(fallback);
  });

  it('should return placeholder for invalid string ID', () => {
    const result = pipe.transform('invalid');
    expect(result).toContain('pokemon-placeholder.svg');
  });

  it('should return placeholder for negative ID', () => {
    const result = pipe.transform(-5);
    expect(result).toContain('pokemon-placeholder.svg');
  });

  it('should return placeholder for zero ID', () => {
    const result = pipe.transform(0);
    expect(result).toContain('pokemon-placeholder.svg');
  });
});
