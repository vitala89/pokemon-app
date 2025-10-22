import { Component } from '@angular/core';
import { LoadingSpinnerComponent, ErrorMessageComponent } from '@shared/components';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [LoadingSpinnerComponent, ErrorMessageComponent, ErrorMessageComponent],
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss'],
})
export class PokemonListComponent {
  handleRetry(): void {
    console.log('Retry clicked!');
  }

  handleClose(): void {
    console.log('Close clicked!');
  }
}
