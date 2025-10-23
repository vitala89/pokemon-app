import { Pipe, PipeTransform } from '@angular/core';
import { formatPokemonWeight } from '@app/core';

@Pipe({
  name: 'pokemonWeight',
  standalone: true,
  pure: true,
})
export class PokemonWeightPipe implements PipeTransform {
  transform(weightHectograms: number | null | undefined): string {
    return formatPokemonWeight(weightHectograms);
  }
}
