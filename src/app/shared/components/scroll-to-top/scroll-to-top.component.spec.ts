import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScrollToTopComponent } from '@app/shared';
import { DebugElement, provideZonelessChangeDetection } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('ScrollToTopComponent', () => {
  let component: ScrollToTopComponent;
  let fixture: ComponentFixture<ScrollToTopComponent>;
  let compiled: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollToTopComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ScrollToTopComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be hidden by default', () => {
    expect(component.isVisible()).toBe(false);
    const button = compiled.query(By.css('.scroll-to-top'));
    expect(button).toBeFalsy();
  });

  it('should show button when scrolled down more than 300px', () => {
    spyOnProperty(window, 'pageYOffset', 'get').and.returnValue(400);

    component.onWindowScroll();
    fixture.detectChanges();

    expect(component.isVisible()).toBe(true);
    const button = compiled.query(By.css('.scroll-to-top'));
    expect(button).toBeTruthy();
  });

  it('should hide button when scrolled less than 300px', () => {
    component.isVisible.set(true);
    fixture.detectChanges();

    spyOnProperty(window, 'pageYOffset', 'get').and.returnValue(200);

    component.onWindowScroll();
    fixture.detectChanges();

    expect(component.isVisible()).toBe(false);
  });

  it('should scroll to top when button clicked', () => {
    const scrollToSpy = spyOn(window as any, 'scrollTo');

    component.isVisible.set(true);
    fixture.detectChanges();

    const button = compiled.query(By.css('.scroll-to-top'));
    button.nativeElement.click();

    expect(scrollToSpy).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });

  it('should use document.documentElement.scrollTop if pageYOffset is 0', () => {
    spyOnProperty(window, 'pageYOffset', 'get').and.returnValue(0);
    spyOnProperty(document.documentElement, 'scrollTop', 'get').and.returnValue(400);

    component.onWindowScroll();
    fixture.detectChanges();

    expect(component.isVisible()).toBe(true);
  });

  it('should use document.body.scrollTop as fallback', () => {
    spyOnProperty(window, 'pageYOffset', 'get').and.returnValue(0);
    spyOnProperty(document.documentElement, 'scrollTop', 'get').and.returnValue(0);
    spyOnProperty(document.body, 'scrollTop', 'get').and.returnValue(400);

    component.onWindowScroll();
    fixture.detectChanges();

    expect(component.isVisible()).toBe(true);
  });

  it('should toggle visibility at exactly 300px threshold', () => {
    const pageYOffsetSpy = spyOnProperty(window, 'pageYOffset', 'get');

    pageYOffsetSpy.and.returnValue(300);
    component.onWindowScroll();
    expect(component.isVisible()).toBe(false);

    pageYOffsetSpy.and.returnValue(301);
    component.onWindowScroll();
    expect(component.isVisible()).toBe(true);
  });

  it('should have proper accessibility attributes', () => {
    component.isVisible.set(true);
    fixture.detectChanges();

    const button = compiled.query(By.css('.scroll-to-top'));
    expect(button.nativeElement.getAttribute('aria-label')).toBe('Scroll to top');
    expect(button.nativeElement.getAttribute('title')).toBe('Back to top');
  });
});
