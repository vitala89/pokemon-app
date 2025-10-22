import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingSpinnerComponent } from '@shared/components';
import { DebugElement, provideZonelessChangeDetection } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('LoadingSpinnerComponent', () => {
  let component: LoadingSpinnerComponent;
  let fixture: ComponentFixture<LoadingSpinnerComponent>;
  let compiled: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingSpinnerComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingSpinnerComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default size of medium', () => {
    expect(component.size()).toBe('medium');
  });

  it('should apply small size class', () => {
    fixture.componentRef.setInput('size', 'small');
    fixture.detectChanges();

    const spinner = compiled.query(By.css('.loading-spinner'));
    expect(
      (spinner.nativeElement as HTMLElement).classList.contains('loading-spinner--small'),
    ).toBe(true);
  });

  it('should apply medium size class', () => {
    fixture.componentRef.setInput('size', 'medium');
    fixture.detectChanges();

    const spinner = compiled.query(By.css('.loading-spinner'));
    expect(
      (spinner.nativeElement as HTMLElement).classList.contains('loading-spinner--medium'),
    ).toBe(true);
  });

  it('should apply large size class', () => {
    fixture.componentRef.setInput('size', 'large');
    fixture.detectChanges();

    const spinner = compiled.query(By.css('.loading-spinner'));
    expect(
      (spinner.nativeElement as HTMLElement).classList.contains('loading-spinner--large'),
    ).toBe(true);
  });

  it('should display message when provided', () => {
    fixture.componentRef.setInput('message', 'Loading Pokemon...');
    fixture.detectChanges();

    const message = compiled.query(By.css('.loading-spinner__message'));
    expect(message).toBeTruthy();
    expect((message.nativeElement as HTMLElement).textContent).toContain('Loading Pokemon...');
  });

  it('should not display message when not provided', () => {
    const message = compiled.query(By.css('.loading-spinner__message'));
    expect(message).toBeFalsy();
  });

  it('should have correct aria-label', () => {
    fixture.componentRef.setInput('ariaLabel', 'Loading data');
    fixture.detectChanges();

    const spinner = compiled.query(By.css('.loading-spinner'));
    expect((spinner.nativeElement as HTMLElement).getAttribute('aria-label')).toBe('Loading data');
  });

  it('should have default aria-label', () => {
    const spinner = compiled.query(By.css('.loading-spinner'));
    expect((spinner.nativeElement as HTMLElement).getAttribute('aria-label')).toBe('Loading...');
  });

  it('should render spinner circle', () => {
    const circle = compiled.query(By.css('.loading-spinner__circle'));
    expect(circle).toBeTruthy();
  });

  it('should have animation on spinner circle', () => {
    const circle = compiled.query(By.css('.loading-spinner__circle'));
    const styles = window.getComputedStyle(circle.nativeElement as Element);
    expect(styles.animation).toBeTruthy();
  });
});
