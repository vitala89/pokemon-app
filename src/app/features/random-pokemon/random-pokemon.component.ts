import { Component } from '@angular/core';

@Component({
  selector: 'app-random-pokemon',
  standalone: true,
  template: `
    <div class="random-pokemon">
      <h1>Random Pokemon</h1>
      <p>Coming soon...</p>
    </div>
  `,
  styles: [
    `
      .random-pokemon {
        padding: 2rem;
        text-align: center;
      }
    `,
  ],
})
export class RandomPokemonComponent {}
