import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorMessageComponent } from '@shared/components';
import { DebugElement, provideZonelessChangeDetection } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('ErrorMessageComponent', () => {
  let component: ErrorMessageComponent;
  let fixture: ComponentFixture<ErrorMessageComponent>;
  let compiled: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorMessageComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorMessageComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default error title', () => {
    const title = compiled.query(By.css('.error-message__title'));
    expect((title.nativeElement as HTMLElement).textContent).toContain('Error');
  });

  it('should display custom error title', () => {
    fixture.componentRef.setInput('title', 'Custom Error');
    fixture.detectChanges();

    const title = compiled.query(By.css('.error-message__title'));
    expect((title.nativeElement as HTMLElement).textContent).toContain('Custom Error');
  });

  it('should display default error message', () => {
    const message = compiled.query(By.css('.error-message__text'));
    expect((message.nativeElement as HTMLElement).textContent).toContain(
      'An error occurred. Please try again.',
    );
  });

  it('should display custom error message', () => {
    fixture.componentRef.setInput('message', 'Failed to load Pokemon');
    fixture.detectChanges();

    const message = compiled.query(By.css('.error-message__text'));
    expect((message.nativeElement as HTMLElement).textContent).toContain('Failed to load Pokemon');
  });

  it('should show retry button by default', () => {
    const retryButton = compiled.query(By.css('.error-message__button--primary'));
    expect(retryButton).toBeTruthy();
  });

  it('should hide retry button when showRetry is false', () => {
    fixture.componentRef.setInput('showRetry', false);
    fixture.detectChanges();

    const retryButton = compiled.query(By.css('.error-message__button--primary'));
    expect(retryButton).toBeFalsy();
  });

  it('should emit retry event when retry button is clicked', () => {
    const retrySpy = jasmine.createSpy('retry');
    component.retry.subscribe(retrySpy);

    const retryButton = compiled.query(By.css('.error-message__button--primary'));
    (retryButton.nativeElement as HTMLElement).click();

    expect(retrySpy).toHaveBeenCalled();
  });

  it('should display custom retry button text', () => {
    fixture.componentRef.setInput('retryText', 'Reload Data');
    fixture.detectChanges();

    const retryButton = compiled.query(By.css('.error-message__button--primary'));
    expect((retryButton.nativeElement as HTMLElement).textContent).toContain('Reload Data');
  });

  it('should not show close button by default', () => {
    const closeButton = compiled.query(By.css('.error-message__close'));
    expect(closeButton).toBeFalsy();
  });

  it('should show close button when showClose is true', () => {
    fixture.componentRef.setInput('showClose', true);
    fixture.detectChanges();

    const closeButton = compiled.query(By.css('.error-message__close'));
    expect(closeButton).toBeTruthy();
  });

  it('should emit close event when close button is clicked', () => {
    fixture.componentRef.setInput('showClose', true);
    fixture.detectChanges();

    const closeSpy = jasmine.createSpy('close');
    component.close.subscribe(closeSpy);

    const closeButton = compiled.query(By.css('.error-message__close'));
    (closeButton.nativeElement as HTMLElement).click();

    expect(closeSpy).toHaveBeenCalled();
  });

  it('should show secondary close button when showClose is true', () => {
    fixture.componentRef.setInput('showClose', true);
    fixture.detectChanges();

    const secondaryButton = compiled.query(By.css('.error-message__button--secondary'));
    expect(secondaryButton).toBeTruthy();
  });

  it('should have proper ARIA attributes', () => {
    const container = compiled.query(By.css('.error-message'));
    expect((container.nativeElement as HTMLElement).getAttribute('role')).toBe('alert');
    expect((container.nativeElement as HTMLElement).getAttribute('aria-live')).toBe('assertive');
  });

  it('should render error icon', () => {
    const icon = compiled.query(By.css('.error-message__icon-svg'));
    expect(icon).toBeTruthy();
  });
});
