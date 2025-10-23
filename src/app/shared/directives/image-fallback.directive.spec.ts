import { ImageFallbackDirective } from './image-fallback.directive';

describe('ImageFallbackDirective', () => {
  let directive: ImageFallbackDirective;
  let img: HTMLImageElement;

  const triggerError = () => {
    const event = new Event('error');
    Object.defineProperty(event, 'target', { value: img, enumerable: true });
    directive.onError(event);
  };

  beforeEach(() => {
    directive = new ImageFallbackDirective();
    img = document.createElement('img');
  });

  it('should apply default fallback on error', () => {
    img.src = 'https://example.com/missing.png';

    triggerError();

    expect(img.src).toContain('pokemon-placeholder.svg');
  });

  it('should respect custom fallback src', () => {
    directive.fallbackSrc = '/custom-placeholder.png';
    img.src = 'https://example.com/missing.png';

    triggerError();

    expect(img.src).toContain('/custom-placeholder.png');
  });

  it('should only apply fallback once when placeholder also fails', () => {
    img.src = 'https://example.com/missing.png';

    triggerError();
    const placeholderSrc = img.src;

    triggerError();

    expect(img.src).toBe(placeholderSrc);
  });
});
