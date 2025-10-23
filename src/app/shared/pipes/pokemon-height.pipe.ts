import { Pipe, PipeTransform } from '@angular/core';
import { formatPokemonHeight } from '@app/core';

@Pipe({
  name: 'pokemonHeight',
  standalone: true,
  pure: true,
})
export class PokemonHeightPipe implements PipeTransform {
  transform(heightDecimeters: number | null | undefined): string {
    return formatPokemonHeight(heightDecimeters);
  }
}
