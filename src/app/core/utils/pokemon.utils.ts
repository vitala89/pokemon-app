/**
 * Extracts Pokemon ID from PokeAPI URL
 * @param url - URL from PokeAPI (e.g., "https://pokeapi.co/api/v2/pokemon/1/")
 * @returns Pokemon ID as number
 */
export function extractPokemonId(url: string): number {
  const match = /\/pokemon\/(\d+)\//.exec(url);
  if (!match?.[1]) {
    throw new Error(`Invalid Pokemon URL: ${url}`);
  }
  return parseInt(match[1], 10);
}

/**
 * Generates official artwork image URL for Pokemon
 * @param id - Pokemon ID
 * @returns Image URL
 */
export function getPokemonImageUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

/**
 * Capitalizes first letter of a string
 * @param str - Input string
 * @returns Capitalized string
 */
export function capitalizeFirstLetter(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Formats Pokemon name for display
 * @param name - Pokemon name from API
 * @returns Formatted name
 */
export function formatPokemonName(name: string): string {
  return name
    .split('-')
    .map((part) => capitalizeFirstLetter(part))
    .join(' ');
}

/**
 * Generates a random Pokemon ID
 * @param max - Maximum Pokemon ID (default: 1025)
 * @returns Random Pokemon ID
 */
export function getRandomPokemonId(max = 1025): number {
  return Math.floor(Math.random() * max) + 1;
}
