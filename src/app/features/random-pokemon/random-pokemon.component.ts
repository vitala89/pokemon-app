import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoadingSpinnerComponent, ErrorMessageComponent } from '@app/shared';
import { FormatPokemonNamePipe, PokemonImagePipe, PokemonTypeColorPipe } from '@app/shared';
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

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/images/pokemon-placeholder.svg';
  }

  formatHeight(height: number): string {
    return `${(height / 10).toFixed(1)} m`;
  }

  formatWeight(weight: number): string {
    return `${(weight / 10).toFixed(1)} kg`;
  }

  getStatName(name: string): string {
    const statNames: Record<string, string> = {
      hp: 'HP',
      attack: 'Attack',
      defense: 'Defense',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'special-attack': 'Sp. Attack',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'special-defense': 'Sp. Defense',
      speed: 'Speed',
    };
    return statNames[name] ?? name;
  }

  getStatPercentage(baseStat: number): number {
    const maxStat = 255;
    return Math.round((baseStat / maxStat) * 100);
  }

  getRandomEmoji(): string {
    const emojis = ['🎲', '✨', '🎯', '🎰', '🔮', '🎪'];
    return emojis[Math.floor(Math.random() * emojis.length)];
  }
}
