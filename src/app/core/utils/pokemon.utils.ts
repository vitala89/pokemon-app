const STAT_NAME_MAP: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'special-attack': 'Sp. Attack',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'special-defense': 'Sp. Defense',
  speed: 'Speed',
};

const MAX_POKEMON_STAT = 255;

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

/**
 * Formats Pokemon height from decimeters to meters
 * @param heightDecimeters - Height value in decimeters
 * @returns Formatted height string (e.g., "1.7 m")
 */
export function formatPokemonHeight(heightDecimeters: number | null | undefined): string {
  if (heightDecimeters == null) {
    return '';
  }

  return `${(heightDecimeters / 10).toFixed(1)} m`;
}

/**
 * Formats Pokemon weight from hectograms to kilograms
 * @param weightHectograms - Weight value in hectograms
 * @returns Formatted weight string (e.g., "60.0 kg")
 */
export function formatPokemonWeight(weightHectograms: number | null | undefined): string {
  if (weightHectograms == null) {
    return '';
  }

  return `${(weightHectograms / 10).toFixed(1)} kg`;
}

/**
 * Returns human-readable stat label for a Pokemon stat key
 * @param statName - Stat name from API
 * @returns Display-ready stat label
 */
export function getPokemonStatLabel(statName: string | null | undefined): string {
  if (!statName) {
    return '';
  }

  return STAT_NAME_MAP[statName] ?? statName;
}

/**
 * Calculates stat percentage relative to the maximum possible base stat value
 * @param baseStat - Pokemon base stat value
 * @returns Percentage (0-100)
 */
export function calculatePokemonStatPercentage(baseStat: number | null | undefined): number {
  if (!baseStat || baseStat <= 0) {
    return 0;
  }

  const percentage = (baseStat / MAX_POKEMON_STAT) * 100;
  return Math.min(100, Math.round(percentage));
}

/**
 * Returns default fallback image URL for Pokemon artwork
 */
export function getPokemonPlaceholderImage(): string {
  return '/assets/images/pokemon-placeholder.svg';
}
