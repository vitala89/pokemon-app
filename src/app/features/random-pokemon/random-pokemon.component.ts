import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { LoadingSpinnerComponent, ErrorMessageComponent } from '@app/shared';
import {
  FormatPokemonNamePipe,
  PokemonImagePipe,
  PokemonTypeColorPipe,
  PokemonHeightPipe,
  PokemonWeightPipe,
  PokemonStatNamePipe,
  PokemonStatPercentagePipe,
} from '@app/shared';
import { ImageFallbackDirective } from '@app/shared';
import { PokemonApiService } from '@app/core';
import { Pokemon } from '@app/core';
import { ROUTE_PATHS } from '@app/core';
import { getRandomPokemonId } from '@app/core';

@Component({
  selector: 'app-random-pokemon',
  standalone: true,
  imports: [
    CommonModule,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    FormatPokemonNamePipe,
    PokemonImagePipe,
    PokemonTypeColorPipe,
    PokemonHeightPipe,
    PokemonWeightPipe,
    PokemonStatNamePipe,
    PokemonStatPercentagePipe,
    ImageFallbackDirective,
    NgOptimizedImage,
  ],
  templateUrl: './random-pokemon.component.html',
  styleUrls: ['./random-pokemon.component.scss'],
})
export class RandomPokemonComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly pokemonService = inject(PokemonApiService);

  pokemon = signal<Pokemon | null>(null);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  isGenerating = signal<boolean>(false);

  hasData = computed(() => this.pokemon() !== null);

  readonly routes = ROUTE_PATHS;
  readonly maxPokemon = 1025;

  ngOnInit(): void {
    this.generateRandomPokemon();
  }

  generateRandomPokemon(): void {
    if (this.isLoading()) return;

    this.isGenerating.set(true);
    const randomId = getRandomPokemonId(this.maxPokemon);

    setTimeout(() => {
      this.loadPokemon(randomId);
    }, 300);
  }

  private loadPokemon(id: number): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.pokemonService.getPokemonDetails(id).subscribe({
      next: (data) => {
        this.pokemon.set(data);
        this.isLoading.set(false);
        this.isGenerating.set(false);
      },
      error: (err: { message?: string }) => {
        this.error.set(err.message ?? 'Failed to load random Pokemon. Please try again.');
        this.isLoading.set(false);
        this.isGenerating.set(false);
      },
    });
  }

  retryLoad(): void {
    this.generateRandomPokemon();
  }

  viewFullDetails(): void {
    const pokemon = this.pokemon();
    if (pokemon) {
      void this.router.navigate([this.routes.POKEMON_DETAILS(pokemon.id)]);
    }
  }

  goToList(): void {
    void this.router.navigate([this.routes.POKEMON_LIST]);
  }

  getRandomEmoji(): string {
    const emojis = ['🎲', '✨', '🎯', '🎰', '🔮', '🎪'];
    return emojis[Math.floor(Math.random() * emojis.length)];
  }
}
