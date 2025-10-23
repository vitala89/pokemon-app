import {
  Directive,
  ElementRef,
  EventEmitter,
  Output,
  OnInit,
  OnDestroy,
  input,
} from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]',
  standalone: true,
  host: {
    '[style.position]': `'relative'`,
    '[class.infinite-scroll-active]': 'enabled()',
  },
})
export class InfiniteScrollDirective implements OnInit, OnDestroy {
  threshold = input<number>(300);
  enabled = input<boolean>(true);

  @Output() scrolled = new EventEmitter<void>();

  private observer?: IntersectionObserver;
  private sentinel?: HTMLElement;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private setupIntersectionObserver(): void {
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: `${this.threshold()}px`,
      threshold: 0.1,
    };

    this.observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && this.enabled()) {
          this.scrolled.emit();
        }
      }
    }, options);

    this.sentinel = document.createElement('div');
    this.sentinel.style.height = '1px';
    const nativeElement = this.elementRef.nativeElement as HTMLElement;
    nativeElement.appendChild(this.sentinel);

    this.observer.observe(this.sentinel);
  }

  private cleanup(): void {
    this.observer?.disconnect();
    const parentNode = this.sentinel?.parentNode;
    if (parentNode && this.sentinel) {
      parentNode.removeChild(this.sentinel);
    }
  }
}
