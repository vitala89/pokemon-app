import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingSpinnerComponent, ErrorMessageComponent } from '@app/shared';
import { FormatPokemonNamePipe, PokemonImagePipe, PokemonTypeColorPipe } from '@app/shared';
import { PokemonApiService } from '@app/core';
import { Pokemon } from '@app/core';
import { ROUTE_PATHS } from '@app/core';

@Component({
  selector: 'app-pokemon-details',
  standalone: true,
  imports: [
    CommonModule,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    FormatPokemonNamePipe,
    PokemonImagePipe,
    PokemonTypeColorPipe,
  ],
  templateUrl: './pokemon-details.component.html',
  styleUrls: ['./pokemon-details.component.scss'],
})
export class PokemonDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly pokemonService = inject(PokemonApiService);

  pokemon = signal<Pokemon | null>(null);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  pokemonId = signal<number>(0);

  hasData = computed(() => this.pokemon() !== null);
  previousId = computed(() => {
    const id = this.pokemonId();
    return id > 1 ? id - 1 : null;
  });
  nextId = computed(() => {
    const id = this.pokemonId();
    return id < 1025 ? id + 1 : null;
  });

  readonly routes = ROUTE_PATHS;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'] as string | undefined;
      if (id) {
        this.pokemonId.set(Number(id));
        this.loadPokemon(id);
      }
    });
  }

  loadPokemon(id: string | number): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.pokemon.set(null);

    this.pokemonService.getPokemonDetails(id).subscribe({
      next: (data) => {
        this.pokemon.set(data);
        this.isLoading.set(false);
      },
      error: (err: { message?: string }) => {
        this.error.set(err.message ?? `Failed to load Pokemon #${id}. Please try again.`);
        this.isLoading.set(false);
      },
    });
  }

  retryLoad(): void {
    const id = this.pokemonId();
    if (id) {
      this.loadPokemon(id);
    }
  }

  goToPrevious(): void {
    const prevId = this.previousId();
    if (prevId) {
      void this.router.navigate([this.routes.POKEMON_DETAILS(prevId)]);
    }
  }

  goToNext(): void {
    const nextId = this.nextId();
    if (nextId) {
      void this.router.navigate([this.routes.POKEMON_DETAILS(nextId)]);
    }
  }

  goBack(): void {
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
}
