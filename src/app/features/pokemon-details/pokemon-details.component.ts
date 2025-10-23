import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
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
    PokemonHeightPipe,
    PokemonWeightPipe,
    PokemonStatNamePipe,
    PokemonStatPercentagePipe,
    ImageFallbackDirective,
    NgOptimizedImage,
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
}
