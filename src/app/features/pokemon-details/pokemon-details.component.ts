import { Component } from '@angular/core';

@Component({
  selector: 'app-pokemon-details',
  standalone: true,
  template: `
    <div class="pokemon-details">
      <h1>Pokemon Details</h1>
      <p>Coming soon...</p>
    </div>
  `,
  styles: [
    `
      .pokemon-details {
        padding: 2rem;
        text-align: center;
      }
    `,
  ],
})
export class PokemonDetailsComponent {}
