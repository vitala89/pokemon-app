import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PokemonCardComponent, PokemonCardData } from '@shared/components';
import { DebugElement, provideZonelessChangeDetection } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('PokemonCardComponent', () => {
  let component: PokemonCardComponent;
  let fixture: ComponentFixture<PokemonCardComponent>;
  let compiled: DebugElement;

  const mockPokemon: PokemonCardData = {
    id: 25,
    name: 'pikachu',
    imageUrl: 'https://example.com/pikachu.png',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonCardComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonCardComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement;
  });

  it('should create', () => {
    fixture.componentRef.setInput('pokemon', mockPokemon);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display pokemon name', () => {
    fixture.componentRef.setInput('pokemon', mockPokemon);
    fixture.detectChanges();

    const name = compiled.query(By.css('.pokemon-card__name'));
    expect((name.nativeElement as HTMLElement).textContent?.trim()).toBe('Pikachu');
  });

  it('should display pokemon ID with padding', () => {
    fixture.componentRef.setInput('pokemon', mockPokemon);
    fixture.detectChanges();

    const id = compiled.query(By.css('.pokemon-card__id'));
    expect((id.nativeElement as HTMLElement).textContent).toContain('#025');
  });

  it('should hide ID when showId is false', () => {
    fixture.componentRef.setInput('pokemon', mockPokemon);
    fixture.componentRef.setInput('showId', false);
    fixture.detectChanges();

    const id = compiled.query(By.css('.pokemon-card__id'));
    expect(id).toBeFalsy();
  });

  it('should display pokemon image', () => {
    fixture.componentRef.setInput('pokemon', mockPokemon);
    fixture.detectChanges();

    const image = compiled.query(By.css('.pokemon-card__image'));
    expect(image).toBeTruthy();
    expect((image.nativeElement as HTMLImageElement).src).toContain('pikachu.png');
  });

  it('should emit cardClick event when clicked', () => {
    fixture.componentRef.setInput('pokemon', mockPokemon);
    fixture.detectChanges();

    const clickSpy = jasmine.createSpy('cardClick');
    component.cardClick.subscribe(clickSpy);

    const card = compiled.query(By.css('.pokemon-card'));
    (card.nativeElement as HTMLElement).click();

    expect(clickSpy).toHaveBeenCalledWith(mockPokemon);
  });

  it('should not emit cardClick when loading', () => {
    fixture.componentRef.setInput('pokemon', mockPokemon);
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const clickSpy = jasmine.createSpy('cardClick');
    component.cardClick.subscribe(clickSpy);

    const card = compiled.query(By.css('.pokemon-card'));
    (card.nativeElement as HTMLElement).click();

    expect(clickSpy).not.toHaveBeenCalled();
  });

  it('should apply loading class when loading', () => {
    fixture.componentRef.setInput('pokemon', mockPokemon);
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const card = compiled.query(By.css('.pokemon-card'));
    expect((card.nativeElement as HTMLElement).classList.contains('pokemon-card--loading')).toBe(
      true,
    );
  });

  it('should show skeleton when loading', () => {
    fixture.componentRef.setInput('pokemon', mockPokemon);
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const skeleton = compiled.query(By.css('.pokemon-card__skeleton'));
    expect(skeleton).toBeTruthy();
  });

  it('should handle keyboard Enter key', () => {
    fixture.componentRef.setInput('pokemon', mockPokemon);
    fixture.detectChanges();

    const clickSpy = jasmine.createSpy('cardClick');
    component.cardClick.subscribe(clickSpy);

    const card = compiled.query(By.css('.pokemon-card'));
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    (card.nativeElement as HTMLElement).dispatchEvent(event);

    expect(clickSpy).toHaveBeenCalledWith(mockPokemon);
  });

  it('should handle keyboard Space key', () => {
    fixture.componentRef.setInput('pokemon', mockPokemon);
    fixture.detectChanges();

    const clickSpy = jasmine.createSpy('cardClick');
    component.cardClick.subscribe(clickSpy);

    const card = compiled.query(By.css('.pokemon-card'));
    const event = new KeyboardEvent('keydown', { key: ' ' });
    (card.nativeElement as HTMLElement).dispatchEvent(event);

    expect(clickSpy).toHaveBeenCalledWith(mockPokemon);
  });

  it('should have proper ARIA attributes', () => {
    fixture.componentRef.setInput('pokemon', mockPokemon);
    fixture.detectChanges();

    const card = compiled.query(By.css('.pokemon-card'));
    expect((card.nativeElement as HTMLElement).getAttribute('role')).toBe('button');
    expect((card.nativeElement as HTMLElement).getAttribute('tabindex')).toBe('0');
    expect((card.nativeElement as HTMLElement).getAttribute('aria-label')).toContain('Pikachu');
  });

  it('should have lazy loading on image', () => {
    fixture.componentRef.setInput('pokemon', mockPokemon);
    fixture.detectChanges();

    const image = compiled.query(By.css('.pokemon-card__image'));
    expect((image.nativeElement as HTMLImageElement).loading).toBe('lazy');
  });

  it('should format pokemon name with multiple words', () => {
    const mrMime: PokemonCardData = {
      id: 122,
      name: 'mr-mime',
      imageUrl: 'https://example.com/mr-mime.png',
    };

    fixture.componentRef.setInput('pokemon', mrMime);
    fixture.detectChanges();

    const name = compiled.query(By.css('.pokemon-card__name'));
    expect((name.nativeElement as HTMLElement).textContent?.trim()).toBe('Mr Mime');
  });
});
