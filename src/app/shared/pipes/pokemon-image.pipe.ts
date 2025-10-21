import { Pipe, PipeTransform } from '@angular/core';
import { getPokemonImageUrl } from '@app/core';

@Pipe({
  name: 'pokemonImage',
  standalone: true,
  pure: true,
})
export class PokemonImagePipe implements PipeTransform {
  /**
   * Transform Pokemon ID to official artwork image URL
   * @param id - Pokemon ID
   * @param fallback - Optional fallback image URL
   * @returns Image URL string
   */
  transform(id: number | string | null | undefined, fallback?: string): string {
    if (id === null || id === undefined) {
      return fallback ?? '/assets/images/pokemon-placeholder.svg';
    }

    const pokemonId = typeof id === 'string' ? parseInt(id, 10) : id;

    if (isNaN(pokemonId) || pokemonId < 1) {
      return fallback ?? '/assets/images/pokemon-placeholder.svg';
    }

    return getPokemonImageUrl(pokemonId);
  }
}
