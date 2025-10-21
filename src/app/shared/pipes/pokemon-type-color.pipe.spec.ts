import { PokemonTypeColorPipe } from '@app/shared';

describe('PokemonTypeColorPipe', () => {
  let pipe: PokemonTypeColorPipe;

  beforeEach(() => {
    pipe = new PokemonTypeColorPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return correct color for fire type', () => {
    expect(pipe.transform('fire')).toBe('#F08030');
  });

  it('should return correct color for water type', () => {
    expect(pipe.transform('water')).toBe('#6890F0');
  });

  it('should return correct color for grass type', () => {
    expect(pipe.transform('grass')).toBe('#78C850');
  });

  it('should handle uppercase type names', () => {
    expect(pipe.transform('FIRE')).toBe('#F08030');
  });

  it('should handle mixed case type names', () => {
    expect(pipe.transform('FiRe')).toBe('#F08030');
  });

  it('should return default color for unknown type', () => {
    expect(pipe.transform('unknown')).toBe('#777777');
  });

  it('should return default color for null', () => {
    expect(pipe.transform(null as unknown as string)).toBe('#777777');
  });

  it('should return default color for undefined', () => {
    expect(pipe.transform(undefined as unknown as string)).toBe('#777777');
  });

  it('should return correct color for all 18 types', () => {
    const types = [
      'normal',
      'fire',
      'water',
      'electric',
      'grass',
      'ice',
      'fighting',
      'poison',
      'ground',
      'flying',
      'psychic',
      'bug',
      'rock',
      'ghost',
      'dragon',
      'dark',
      'steel',
      'fairy',
    ];

    types.forEach((type) => {
      const color = pipe.transform(type);
      expect(color).toMatch(/^#[0-9A-F]{6}$/i);
    });
  });
});
