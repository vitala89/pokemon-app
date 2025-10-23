import { Component, DebugElement, provideZonelessChangeDetection } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { InfiniteScrollDirective } from '@app/shared';

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];

  readonly observe = jasmine.createSpy('observe');
  readonly disconnect = jasmine.createSpy('disconnect');
  readonly unobserve = jasmine.createSpy('unobserve');
  readonly callback: IntersectionObserverCallback;
  readonly options?: IntersectionObserverInit;

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback;
    this.options = options;
    MockIntersectionObserver.instances.push(this);
  }

  trigger(entries: Partial<IntersectionObserverEntry>[]): void {
    const normalized = entries.map((entry) => entry as IntersectionObserverEntry);
    this.callback(normalized, this as unknown as IntersectionObserver);
  }
}

@Component({
  template: `
    <div
      appInfiniteScroll
      [threshold]="threshold"
      [enabled]="enabled"
      (scrolled)="onScrolled()"
      style="height: 1000px;"
    >
      @for (item of items; track item) {
        <div>{{ item }}</div>
      }
    </div>
  `,
  standalone: true,
  imports: [CommonModule, InfiniteScrollDirective],
})
class TestComponent {
  threshold = 300;
  enabled = true;
  items = Array.from({ length: 10 }, (_, index) => `Item ${index}`);
  scrolledCount = 0;

  onScrolled(): void {
    this.scrolledCount++;
  }
}

describe('InfiniteScrollDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let directiveElement: DebugElement;
  let directive: InfiniteScrollDirective;
  let mockObserver: MockIntersectionObserver;

  const createComponent = (threshold = 300, enabled = true): void => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    component.threshold = threshold;
    component.enabled = enabled;

    fixture.detectChanges();

    directiveElement = fixture.debugElement.query(By.directive(InfiniteScrollDirective));
    directive = directiveElement.injector.get(InfiniteScrollDirective);
    mockObserver = MockIntersectionObserver.instances.at(-1)!;
  };

  let originalIntersectionObserver: typeof IntersectionObserver;

  beforeAll(() => {
    originalIntersectionObserver = (window as any).IntersectionObserver;
    (window as any).IntersectionObserver =
      MockIntersectionObserver as unknown as typeof IntersectionObserver;
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    MockIntersectionObserver.instances.length = 0;
  });

  afterEach(() => {
    fixture?.destroy();
    MockIntersectionObserver.instances.length = 0;
  });

  afterAll(() => {
    (window as any).IntersectionObserver = originalIntersectionObserver;
  });

  it('should create', () => {
    createComponent();
    expect(directive).toBeTruthy();
  });

  it('should have default threshold', () => {
    createComponent();
    expect(directive.threshold()).toBe(300);
  });

  it('should have default enabled state', () => {
    createComponent();
    expect(directive.enabled()).toBe(true);
  });

  it('should use custom threshold', () => {
    createComponent(500);
    expect(directive.threshold()).toBe(500);
  });

  it('should create sentinel element', () => {
    createComponent();
    const sentinel = (directiveElement.nativeElement as HTMLElement).querySelector(
      'div[style*="height: 1px"]',
    );
    expect(sentinel).toBeTruthy();
  });

  it('should emit scrolled event when sentinel is visible', () => {
    createComponent();
    const sentinel = (directive as any).sentinel as Element;

    mockObserver.trigger([
      {
        isIntersecting: true,
        target: sentinel,
      },
    ]);

    expect(component.scrolledCount).toBe(1);
  });

  it('should not emit when disabled', () => {
    createComponent(300, false);
    const sentinel = (directive as any).sentinel as Element;

    mockObserver.trigger([
      {
        isIntersecting: true,
        target: sentinel,
      },
    ]);

    expect(component.scrolledCount).toBe(0);
  });

  it('should not emit when intersection is false', () => {
    createComponent();
    const sentinel = (directive as any).sentinel as Element;

    mockObserver.trigger([
      {
        isIntersecting: false,
        target: sentinel,
      },
    ]);

    expect(component.scrolledCount).toBe(0);
  });

  it('should cleanup on destroy', () => {
    createComponent();
    const sentinel = (directive as any).sentinel;

    expect(sentinel).toBeTruthy();

    directive.ngOnDestroy();

    const sentinelAfterDestroy = (directiveElement.nativeElement as HTMLElement).querySelector(
      'div[style*="height: 1px"]',
    );
    expect(sentinelAfterDestroy).toBeFalsy();
    expect(mockObserver.disconnect).toHaveBeenCalled();
  });
});
