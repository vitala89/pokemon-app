import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss'],
})
export class ErrorMessageComponent {
  message = input<string>('An error occurred. Please try again.');
  title = input<string>('Error');
  showRetry = input<boolean>(true);
  retryText = input<string>('Try Again');
  showClose = input<boolean>(false);

  retry = output<void>();
  close = output<void>();

  onRetry(): void {
    this.retry.emit();
  }

  onClose(): void {
    this.close.emit();
  }
}
