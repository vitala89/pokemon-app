import { Directive, HostListener, Input } from '@angular/core';
import { getPokemonPlaceholderImage } from '@app/core';

@Directive({
  selector: 'img[appImageFallback]',
  standalone: true,
})
export class ImageFallbackDirective {
  @Input('appImageFallback') fallbackSrc: string = getPokemonPlaceholderImage();

  private hasAppliedFallback = false;

  @HostListener('error', ['$event'])
  onError(event: Event): void {
    if (this.hasAppliedFallback) {
      return;
    }

    const element = event.target as HTMLImageElement | null;
    if (!element) {
      return;
    }

    this.hasAppliedFallback = true;
    element.src = this.fallbackSrc;
  }
}
