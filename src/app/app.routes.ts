import { Routes } from '@angular/router';
import { ROUTES } from '@app/core';

export const routes: Routes = [
  {
    path: ROUTES.HOME,
    redirectTo: ROUTES.POKEMON_LIST,
    pathMatch: 'full',
  },
  {
    path: 'pokemon',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/pokemon-list/pokemon-list.component').then(
            (m) => m.PokemonListComponent,
          ),
        title: 'Pokedex - All Pokemon',
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./features/pokemon-details/pokemon-details.component').then(
            (m) => m.PokemonDetailsComponent,
          ),
        title: 'Pokemon Details',
      },
    ],
  },
  {
    path: 'random',
    loadComponent: () =>
      import('./features/random-pokemon/random-pokemon.component').then(
        (m) => m.RandomPokemonComponent,
      ),
    title: 'Random Pokemon',
  },
  {
    path: ROUTES.NOT_FOUND,
    loadComponent: () =>
      import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
    title: '404 - Page Not Found',
  },
];
