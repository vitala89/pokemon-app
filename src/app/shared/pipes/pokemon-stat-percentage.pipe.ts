import { Pipe, PipeTransform } from '@angular/core';
import { calculatePokemonStatPercentage } from '@app/core';

@Pipe({
  name: 'pokemonStatPercentage',
  standalone: true,
  pure: true,
})
export class PokemonStatPercentagePipe implements PipeTransform {
  transform(baseStat: number | null | undefined): number {
    return calculatePokemonStatPercentage(baseStat);
  }
}
