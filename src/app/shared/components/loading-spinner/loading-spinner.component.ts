import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SpinnerSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="loading-spinner"
      [class]="'loading-spinner--' + size()"
      [attr.aria-label]="ariaLabel()"
    >
      <div class="loading-spinner__circle"></div>
      @if (message()) {
        <p class="loading-spinner__message">{{ message() }}</p>
      }
    </div>
  `,
  styleUrls: ['./loading-spinner.component.scss'],
})
export class LoadingSpinnerComponent {
  size = input<SpinnerSize>('medium');
  message = input<string>('');
  ariaLabel = input<string>('Loading...');
}
