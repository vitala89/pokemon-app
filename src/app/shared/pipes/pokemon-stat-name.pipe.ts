import { Pipe, PipeTransform } from '@angular/core';
import { getPokemonStatLabel } from '@app/core';

@Pipe({
  name: 'pokemonStatName',
  standalone: true,
  pure: true,
})
export class PokemonStatNamePipe implements PipeTransform {
  transform(statName: string | null | undefined): string {
    return getPokemonStatLabel(statName);
  }
}
