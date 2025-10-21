import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { Pokemon, PokemonCard, PokemonListItem, PokemonListResponse } from '../models';
import { API_CONFIG } from '@app/core';
import { extractPokemonId, getPokemonImageUrl } from '../utils';
import { CacheService } from '@app/core';
import { LoggerService } from '@app/core';

@Injectable({
  providedIn: 'root',
})
export class PokemonApiService {
  private readonly http = inject(HttpClient);
  private readonly cache = inject(CacheService);
  private readonly logger = inject(LoggerService);

  private readonly loadingState = signal<boolean>(false);
  private readonly errorState = signal<string | null>(null);

  readonly isLoading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  /**
   * Get list of Pokemon with pagination
   * @param limit - Number of Pokemon to fetch
   * @param offset - Offset for pagination
   * @returns Observable of Pokemon cards
   */
  getPokemonList(
    limit: number = API_CONFIG.PAGINATION.DEFAULT_LIMIT,
    offset = 0,
  ): Observable<PokemonCard[]> {
    const cacheKey = `pokemon-list-${limit}-${offset}`;

    const cachedData = this.cache.get<PokemonCard[]>(cacheKey);
    if (cachedData) {
      this.logger.log('Pokemon list loaded from cache', { limit, offset });
      return new Observable((observer) => {
        observer.next(cachedData);
        observer.complete();
      });
    }

    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.POKEMON}`;
    const params = { limit: limit.toString(), offset: offset.toString() };

    this.loadingState.set(true);
    this.errorState.set(null);

    return this.http.get<PokemonListResponse>(url, { params }).pipe(
      map((response) => this.transformPokemonList(response.results)),
      tap((pokemonCards) => {
        this.cache.set(cacheKey, pokemonCards);
        this.loadingState.set(false);
        this.logger.log('Pokemon list fetched successfully', { count: pokemonCards.length });
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error, 'fetching Pokemon list')),
    );
  }

  /**
   * Get Pokemon details by ID or name
   * @param idOrName - Pokemon ID or name
   * @returns Observable of Pokemon details
   */
  getPokemonDetails(idOrName: string | number): Observable<Pokemon> {
    const cacheKey = `pokemon-details-${idOrName}`;

    const cachedData = this.cache.get<Pokemon>(cacheKey);
    if (cachedData) {
      this.logger.log('Pokemon details loaded from cache', { idOrName });
      return new Observable((observer) => {
        observer.next(cachedData);
        observer.complete();
      });
    }

    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.POKEMON}/${idOrName}`;

    this.loadingState.set(true);
    this.errorState.set(null);

    return this.http.get<Pokemon>(url).pipe(
      tap((pokemon) => {
        this.cache.set(cacheKey, pokemon);
        this.loadingState.set(false);
        this.logger.log('Pokemon details fetched successfully', {
          id: pokemon.id,
          name: pokemon.name,
        });
      }),
      catchError((error: HttpErrorResponse) =>
        this.handleError(error, `fetching Pokemon details for ${idOrName}`),
      ),
    );
  }

  /**
   * Get random Pokemon
   * @returns Observable of random Pokemon details
   */
  getRandomPokemon(): Observable<Pokemon> {
    const randomId = Math.floor(Math.random() * API_CONFIG.TOTAL_POKEMON_COUNT) + 1;
    this.logger.log('Fetching random Pokemon', { id: randomId });
    return this.getPokemonDetails(randomId);
  }

  /**
   * Transform API list response to PokemonCard array
   * @param items - Pokemon list items from API
   * @returns Array of Pokemon cards
   */
  private transformPokemonList(items: PokemonListItem[]): PokemonCard[] {
    return items.map((item) => {
      const id = extractPokemonId(item.url);
      return {
        id,
        name: item.name,
        imageUrl: getPokemonImageUrl(id),
      };
    });
  }

  /**
   * Handle HTTP errors
   * @param error - HTTP error response
   * @param operation - Description of the operation
   * @returns Observable that throws error
   */
  private handleError(error: HttpErrorResponse, operation: string): Observable<never> {
    this.loadingState.set(false);

    const errorMessage =
      error.error instanceof ErrorEvent
        ? `Client error while ${operation}: ${error.error.message}`
        : `Server error while ${operation} (${error.status}): ${error.message}`;

    this.errorState.set(errorMessage);
    this.logger.error(errorMessage, error);

    return throwError(() => error);
  }

  clearCache(): void {
    this.cache.clear();
    this.logger.log('Pokemon cache cleared');
  }

  resetError(): void {
    this.errorState.set(null);
  }
}
