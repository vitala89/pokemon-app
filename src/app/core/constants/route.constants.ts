export const ROUTES = {
  HOME: '',
  POKEMON_LIST: 'pokemon',
  POKEMON_DETAILS: 'pokemon/:id',
  RANDOM: 'random',
  NOT_FOUND: '**',
} as const;

export const ROUTE_PATHS = {
  HOME: '/',
  POKEMON_LIST: '/pokemon',
  POKEMON_DETAILS: (id: number | string) => `/pokemon/${id}`,
  RANDOM: '/random',
} as const;
