export const API_CONFIG = {
  BASE_URL: 'https://pokeapi.co/api/v2',
  ENDPOINTS: {
    POKEMON: '/pokemon',
  },
  IMAGE_BASE_URL:
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork',
  PAGINATION: {
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },
  TOTAL_POKEMON_COUNT: 1025,
} as const;
