import {
  extractPokemonId,
  getPokemonImageUrl,
  capitalizeFirstLetter,
  formatPokemonName,
  getRandomPokemonId,
} from '@app/core';

describe('Pokemon Utils', () => {
  describe('extractPokemonId', () => {
    it('should extract ID from valid Pokemon URL', () => {
      const url = 'https://pokeapi.co/api/v2/pokemon/25/';
      expect(extractPokemonId(url)).toBe(25);
    });

    it('should extract ID from URL with different ID', () => {
      const url = 'https://pokeapi.co/api/v2/pokemon/150/';
      expect(extractPokemonId(url)).toBe(150);
    });

    it('should throw error for invalid URL', () => {
      const url = 'https://pokeapi.co/api/v2/invalid/';
      expect(() => extractPokemonId(url)).toThrow();
    });
  });

  describe('getPokemonImageUrl', () => {
    it('should generate correct image URL', () => {
      const id = 25;
      const expectedUrl =
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png';
      expect(getPokemonImageUrl(id)).toBe(expectedUrl);
    });
  });

  describe('capitalizeFirstLetter', () => {
    it('should capitalize first letter', () => {
      expect(capitalizeFirstLetter('pikachu')).toBe('Pikachu');
    });

    it('should handle empty string', () => {
      expect(capitalizeFirstLetter('')).toBe('');
    });

    it('should handle single character', () => {
      expect(capitalizeFirstLetter('a')).toBe('A');
    });
  });

  describe('formatPokemonName', () => {
    it('should format simple name', () => {
      expect(formatPokemonName('pikachu')).toBe('Pikachu');
    });

    it('should format hyphenated name', () => {
      expect(formatPokemonName('mr-mime')).toBe('Mr Mime');
    });

    it('should format name with multiple hyphens', () => {
      expect(formatPokemonName('tapu-koko')).toBe('Tapu Koko');
    });
  });

  describe('getRandomPokemonId', () => {
    it('should return ID between 1 and max', () => {
      const id = getRandomPokemonId(151);
      expect(id).toBeGreaterThanOrEqual(1);
      expect(id).toBeLessThanOrEqual(151);
    });

    it('should use default max value', () => {
      const id = getRandomPokemonId();
      expect(id).toBeGreaterThanOrEqual(1);
      expect(id).toBeLessThanOrEqual(1025);
    });
  });
});
