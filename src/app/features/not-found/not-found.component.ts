import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ROUTE_PATHS } from '@app/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found">
      <div class="not-found__content">
        <h1 class="not-found__title">404</h1>
        <p class="not-found__message">Oops! This page doesn't exist.</p>
        <p class="not-found__submessage">The Pokémon you're looking for might have fled!</p>
        <a [routerLink]="routes.HOME" class="not-found__link">Go back to Pokédex</a>
      </div>
    </div>
  `,
  styles: [
    `
      .not-found {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 80vh;
        padding: 2rem;
        text-align: center;
      }

      .not-found__content {
        max-width: 500px;
      }

      .not-found__title {
        font-size: 6rem;
        font-weight: bold;
        color: #dc2626;
        margin: 0 0 1rem;
        line-height: 1;
      }

      .not-found__message {
        font-size: 1.5rem;
        font-weight: 600;
        color: #1f2937;
        margin: 0 0 0.5rem;
      }

      .not-found__submessage {
        font-size: 1rem;
        color: #6b7280;
        margin: 0 0 2rem;
      }

      .not-found__link {
        display: inline-block;
        padding: 0.75rem 2rem;
        background-color: #3b82f6;
        color: white;
        text-decoration: none;
        border-radius: 0.5rem;
        font-weight: 500;
        transition: background-color 0.2s;
      }

      .not-found__link:hover {
        background-color: #2563eb;
      }
    `,
  ],
})
export class NotFoundComponent {
  readonly routes = ROUTE_PATHS;
}
