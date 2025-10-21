import { Component } from '@angular/core';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  template: `
    <div class="pokemon-list">
      <h1>Pokémon List</h1>
      <p>Coming soon...</p>
    </div>
  `,
  styles: [
    `
      .pokemon-list {
        padding: 2rem;
        text-align: center;
      }
    `,
  ],
})
export class PokemonListComponent {}
