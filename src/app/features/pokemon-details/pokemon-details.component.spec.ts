import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PokemonDetailsComponent } from './pokemon-details.component';
import { PokemonApiService } from '@app/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { DebugElement, provideZonelessChangeDetection } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Pokemon } from '@app/core';

describe('PokemonDetailsComponent', () => {
  let component: PokemonDetailsComponent;
  let fixture: ComponentFixture<PokemonDetailsComponent>;
  let compiled: DebugElement;
  let mockPokemonService: jasmine.SpyObj<PokemonApiService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: { params: any };

  const mockPokemon: Pokemon = {
    id: 25,
    name: 'pikachu',
    height: 4,
    weight: 60,
    types: [{ slot: 1, type: { name: 'electric', url: 'https://pokeapi.co/api/v2/type/13/' } }],
    sprites: {
      front_default: 'https://example.com/pikachu.png',
      other: {
        'official-artwork': {
          front_default: 'https://example.com/pikachu-artwork.png',
        },
      },
    },
    stats: [
      { base_stat: 35, effort: 0, stat: { name: 'hp', url: 'https://pokeapi.co/api/v2/stat/1/' } },
      {
        base_stat: 55,
        effort: 0,
        stat: { name: 'attack', url: 'https://pokeapi.co/api/v2/stat/2/' },
      },
      {
        base_stat: 40,
        effort: 0,
        stat: { name: 'defense', url: 'https://pokeapi.co/api/v2/stat/3/' },
      },
      {
        base_stat: 50,
        effort: 0,
        stat: { name: 'special-attack', url: 'https://pokeapi.co/api/v2/stat/4/' },
      },
      {
        base_stat: 50,
        effort: 0,
        stat: { name: 'special-defense', url: 'https://pokeapi.co/api/v2/stat/5/' },
      },
      {
        base_stat: 90,
        effort: 2,
        stat: { name: 'speed', url: 'https://pokeapi.co/api/v2/stat/6/' },
      },
    ],
    abilities: [
      {
        ability: { name: 'static', url: 'https://pokeapi.co/api/v2/ability/9/' },
        is_hidden: false,
        slot: 1,
      },
      {
        ability: { name: 'lightning-rod', url: 'https://pokeapi.co/api/v2/ability/31/' },
        is_hidden: true,
        slot: 3,
      },
    ],
  };

  beforeEach(async () => {
    mockPokemonService = jasmine.createSpyObj('PokemonApiService', ['getPokemonDetails']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      params: of({ id: '25' }),
    };

    await TestBed.configureTestingModule({
      imports: [PokemonDetailsComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: PokemonApiService, useValue: mockPokemonService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonDetailsComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load Pokemon on init', () => {
    mockPokemonService.getPokemonDetails.and.returnValue(of(mockPokemon));

    fixture.detectChanges();

    expect(mockPokemonService.getPokemonDetails).toHaveBeenCalledWith('25');
    expect(component.pokemon()).toEqual(mockPokemon);
    expect(component.isLoading()).toBe(false);
  });

  it('should display loading spinner while loading', () => {
    mockPokemonService.getPokemonDetails.and.returnValue(
      new Observable((observer) => {
        setTimeout(() => observer.next(mockPokemon), 100);
      }),
    );

    fixture.detectChanges();

    const spinner = compiled.query(By.css('app-loading-spinner'));
    expect(spinner).toBeTruthy();
  });

  it('should display Pokemon details after loading', () => {
    mockPokemonService.getPokemonDetails.and.returnValue(of(mockPokemon));

    fixture.detectChanges();

    const name = compiled.query(By.css('.pokemon-details__name'));
    expect(name.nativeElement.textContent).toContain('Pikachu');
  });

  it('should handle error state', () => {
    const errorMessage = 'Network error';
    mockPokemonService.getPokemonDetails.and.returnValue(
      throwError(() => ({ message: errorMessage })),
    );

    fixture.detectChanges();

    expect(component.error()).toBe(errorMessage);
    expect(component.isLoading()).toBe(false);
  });

  it('should display error message on error', () => {
    mockPokemonService.getPokemonDetails.and.returnValue(
      throwError(() => ({ message: 'Failed to load' })),
    );

    fixture.detectChanges();

    const errorComponent = compiled.query(By.css('app-error-message'));
    expect(errorComponent).toBeTruthy();
  });

  it('should retry loading on error retry', () => {
    mockPokemonService.getPokemonDetails.and.returnValue(throwError(() => ({ message: 'Error' })));

    fixture.detectChanges();

    mockPokemonService.getPokemonDetails.calls.reset();
    mockPokemonService.getPokemonDetails.and.returnValue(of(mockPokemon));

    component.retryLoad();
    fixture.detectChanges();

    expect(mockPokemonService.getPokemonDetails).toHaveBeenCalled();
    expect(component.error()).toBeNull();
  });

  it('should navigate to previous Pokemon', () => {
    mockPokemonService.getPokemonDetails.and.returnValue(of(mockPokemon));
    fixture.detectChanges();

    component.goToPrevious();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/pokemon/24']);
  });

  it('should navigate to next Pokemon', () => {
    mockPokemonService.getPokemonDetails.and.returnValue(of(mockPokemon));
    fixture.detectChanges();

    component.goToNext();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/pokemon/26']);
  });

  it('should navigate back to list', () => {
    component.goBack();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/pokemon']);
  });

  it('should disable previous button on first Pokemon', () => {
    mockActivatedRoute.params = of({ id: '1' });
    mockPokemonService.getPokemonDetails.and.returnValue(of({ ...mockPokemon, id: 1 }));

    fixture.detectChanges();

    expect(component.previousId()).toBeNull();
  });

  it('should disable next button on last Pokemon', () => {
    mockActivatedRoute.params = of({ id: '1025' });
    mockPokemonService.getPokemonDetails.and.returnValue(of({ ...mockPokemon, id: 1025 }));

    fixture.detectChanges();

    expect(component.nextId()).toBeNull();
  });

  it('should display Pokemon types', () => {
    mockPokemonService.getPokemonDetails.and.returnValue(of(mockPokemon));

    fixture.detectChanges();

    const typeBadges = compiled.queryAll(By.css('.pokemon-details__type-badge'));
    expect(typeBadges.length).toBe(1);
    expect(typeBadges[0].nativeElement.textContent.trim()).toBe('electric');
  });

  it('should display stats with bars', () => {
    mockPokemonService.getPokemonDetails.and.returnValue(of(mockPokemon));

    fixture.detectChanges();

    const stats = compiled.queryAll(By.css('.pokemon-details__stat'));
    expect(stats.length).toBe(6);
  });

  it('should display abilities', () => {
    mockPokemonService.getPokemonDetails.and.returnValue(of(mockPokemon));

    fixture.detectChanges();

    const abilities = compiled.queryAll(By.css('.pokemon-details__ability-badge'));
    expect(abilities.length).toBe(2);
  });

  it('should mark hidden abilities', () => {
    mockPokemonService.getPokemonDetails.and.returnValue(of(mockPokemon));

    fixture.detectChanges();

    const hiddenAbility = compiled.queryAll(By.css('.pokemon-details__ability-badge--hidden'));
    expect(hiddenAbility.length).toBe(1);
  });

  it('should set Pokemon ID from route params', () => {
    mockPokemonService.getPokemonDetails.and.returnValue(of(mockPokemon));

    fixture.detectChanges();

    expect(component.pokemonId()).toBe(25);
  });

  it('should have correct initial state', () => {
    expect(component.pokemon()).toBeNull();
    expect(component.isLoading()).toBe(false);
    expect(component.error()).toBeNull();
    expect(component.pokemonId()).toBe(0);
  });

  it('should compute hasData correctly', () => {
    expect(component.hasData()).toBe(false);

    component.pokemon.set(mockPokemon);

    expect(component.hasData()).toBe(true);
  });

  it('should reload Pokemon when route params change', () => {
    mockPokemonService.getPokemonDetails.and.returnValue(of(mockPokemon));
    fixture.detectChanges();

    mockPokemonService.getPokemonDetails.calls.reset();
    mockActivatedRoute.params = of({ id: '150' });

    component.ngOnInit();

    expect(mockPokemonService.getPokemonDetails).toHaveBeenCalledWith('150');
  });
});
