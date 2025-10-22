import { Component } from '@angular/core';
import { LoadingSpinnerComponent } from '@shared/components';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [LoadingSpinnerComponent],
  template: `
    <div class="pokemon-list">
      <h1>Pokemon List</h1>

      <div class="demo-section">
        <h3>Loading spinner small</h3>
        <app-loading-spinner size="small" message="Loading small..." />
      </div>

      <div class="demo-section">
        <h3>Loading spinner medium</h3>
        <app-loading-spinner message="Loading Pokemon..." />
      </div>

      <div class="demo-section">
        <h3>Loading spinner large</h3>
        <app-loading-spinner size="large" message="Fetching data..." />
      </div>

      <div class="demo-section">
        <h3>Loading spinner without message</h3>
        <app-loading-spinner size="medium" />
      </div>
    </div>
  `,
  styleUrl: './pokemon-list.component.scss',
})
export class PokemonListComponent {}
