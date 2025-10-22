import { Component } from '@angular/core';
import {
  LoadingSpinnerComponent,
  ErrorMessageComponent,
  PokemonCardComponent,
  PokemonCardData,
} from '@shared/components';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, ErrorMessageComponent, PokemonCardComponent],
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss'],
})
export class PokemonListComponent {
  // Demo Pokemon data
  mockPokemon = [
    {
      id: 1,
      name: 'bulbasaur',
      imageUrl:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
    },
    {
      id: 4,
      name: 'charmander',
      imageUrl:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png',
    },
    {
      id: 7,
      name: 'squirtle',
      imageUrl:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png',
    },
    {
      id: 25,
      name: 'pikachu',
      imageUrl:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
    },
    {
      id: 122,
      name: 'mr-mime',
      imageUrl:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/122.png',
    },
    {
      id: 150,
      name: 'mewtwo',
      imageUrl:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png',
    },
  ];

  loadingPokemon = { id: 0, name: 'loading', imageUrl: '' };

  handleRetry(): void {
    console.log('Retry clicked!');
  }

  handleClose(): void {
    console.log('Close clicked!');
  }

  handleCardClick(pokemon: PokemonCardData): void {
    console.log('Pokemon clicked:', pokemon);
  }
}
