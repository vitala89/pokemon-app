import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  LoadingSpinnerComponent,
  ScrollToTopComponent,
  ErrorMessageComponent,
  PokemonCardComponent,
} from '@app/shared/components';
import { InfiniteScrollDirective } from '@app/shared/directives';
import { PokemonApiService } from '@app/core';
import { PokemonCard } from '@app/core';
import { ROUTE_PATHS } from '@app/core';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [
    CommonModule,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    PokemonCardComponent,
    ScrollToTopComponent,
    InfiniteScrollDirective,
  ],
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss'],
})
export class PokemonListComponent implements OnInit {
  private readonly pokemonService = inject(PokemonApiService);
  private readonly router = inject(Router);

  pokemonList = signal<PokemonCard[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  currentPage = signal<number>(0);
  hasMore = signal<boolean>(true);

  useInfiniteScroll = signal<boolean>(true);
  gridView = signal<'grid' | 'list'>('grid');

  isEmpty = computed(() => this.pokemonList().length === 0 && !this.isLoading() && !this.error());
  showLoadMore = computed(
    () =>
      !this.isLoading() &&
      this.hasMore() &&
      this.pokemonList().length > 0 &&
      !this.useInfiniteScroll(),
  );
  canLoadMore = computed(() => !this.isLoading() && this.hasMore());
  loadedPercentage = computed(() =>
    Math.round((this.pokemonList().length / this.totalPokemon) * 100),
  );

  readonly itemsPerPage = 20;
  readonly totalPokemon = 1025;
  readonly routes = ROUTE_PATHS;

  ngOnInit(): void {
    this.loadPokemon();
  }

  loadPokemon(): void {
    if (this.isLoading() || !this.hasMore()) return;

    this.isLoading.set(true);
    this.error.set(null);

    const offset = this.currentPage() * this.itemsPerPage;

    this.pokemonService.getPokemonList(this.itemsPerPage, offset).subscribe({
      next: (pokemon) => {
        this.pokemonList.update((current) => [...current, ...pokemon]);
        this.currentPage.update((page) => page + 1);

        if (offset + this.itemsPerPage >= this.totalPokemon) {
          this.hasMore.set(false);
        }

        this.isLoading.set(false);
      },
      error: (err: { message?: string }) => {
        this.error.set(err.message ?? 'Failed to load Pokemon. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  retryLoad(): void {
    this.error.set(null);
    this.loadPokemon();
  }

  loadMore(): void {
    this.loadPokemon();
  }

  onScrolled(): void {
    if (this.useInfiniteScroll() && this.canLoadMore()) {
      this.loadPokemon();
    }
  }

  viewPokemonDetails(pokemon: PokemonCard): void {
    void this.router.navigate([this.routes.POKEMON_DETAILS(pokemon.id)]);
  }

  toggleInfiniteScroll(): void {
    this.useInfiniteScroll.update((value) => !value);
  }

  toggleView(): void {
    this.gridView.update((view) => (view === 'grid' ? 'list' : 'grid'));
  }

  trackByPokemonId(index: number, pokemon: PokemonCard): number {
    return pokemon.id;
  }
}
