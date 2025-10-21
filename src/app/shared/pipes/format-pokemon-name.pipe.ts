import { Pipe, PipeTransform } from '@angular/core';
import { formatPokemonName } from '@app/core';

/**
 * Formats Pokemon name for display (capitalizes and handles hyphens)
 */
@Pipe({
  name: 'formatPokemonName',
  standalone: true,
  pure: true,
})
export class FormatPokemonNamePipe implements PipeTransform {
  transform(name: string | null | undefined): string {
    if (!name) {
      return '';
    }
    return formatPokemonName(name);
  }
}
