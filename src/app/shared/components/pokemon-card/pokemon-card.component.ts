import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatPokemonNamePipe } from '../../pipes';

export interface PokemonCardData {
  id: number;
  name: string;
  imageUrl: string;
}

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [CommonModule, FormatPokemonNamePipe],
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss'],
})
export class PokemonCardComponent {
  pokemon = input.required<PokemonCardData>();
  loading = input<boolean>(false);
  showId = input<boolean>(true);
  cardClick = output<PokemonCardData>();

  onCardClick(): void {
    if (!this.loading()) {
      this.cardClick.emit(this.pokemon());
    }
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/images/pokemon-placeholder.svg';
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onCardClick();
    }
  }
}
