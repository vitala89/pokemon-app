import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { RandomPokemonComponent } from './random-pokemon.component';
import { PokemonApiService } from '@app/core';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Pokemon } from '@app/core';

describe('RandomPokemonComponent', () => {
  let component: RandomPokemonComponent;
  let fixture: ComponentFixture<RandomPokemonComponent>;
  let mockPokemonService: jasmine.SpyObj<PokemonApiService>;
  let mockRouter: jasmine.SpyObj<Router>;

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
    ],
    abilities: [
      {
        ability: { name: 'static', url: 'https://pokeapi.co/api/v2/ability/9/' },
        is_hidden: false,
        slot: 1,
      },
    ],
  };

  beforeEach(async () => {
    mockPokemonService = jasmine.createSpyObj('PokemonApiService', ['getPokemonDetails']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RandomPokemonComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: PokemonApiService, useValue: mockPokemonService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RandomPokemonComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load random Pokemon on init', (done) => {
    mockPokemonService.getPokemonDetails.and.returnValue(of(mockPokemon));
    spyOn(component, 'getRandomEmoji').and.returnValue('🎲');

    fixture.detectChanges();

    setTimeout(() => {
      expect(mockPokemonService.getPokemonDetails).toHaveBeenCalled();
      expect(component.pokemon()).toEqual(mockPokemon);
      done();
    }, 400);
  });

  it('should generate new random Pokemon when button clicked', (done) => {
    mockPokemonService.getPokemonDetails.and.returnValue(of(mockPokemon));
    spyOn(component, 'getRandomEmoji').and.returnValue('🎲');
    fixture.detectChanges();

    setTimeout(() => {
      mockPokemonService.getPokemonDetails.calls.reset();

      component.generateRandomPokemon();

      expect(component.isGenerating()).toBe(true);
      done();
    }, 400);
  });

  it('should handle error state', (done) => {
    mockPokemonService.getPokemonDetails.and.returnValue(throwError(() => ({ message: 'Error' })));
    spyOn(component, 'getRandomEmoji').and.returnValue('🎲');

    fixture.detectChanges();

    setTimeout(() => {
      expect(component.error()).toBe('Error');
      done();
    }, 400);
  });

  it('should navigate to full details', () => {
    component.pokemon.set(mockPokemon);

    component.viewFullDetails();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/pokemon/25']);
  });

  it('should navigate to list', () => {
    component.goToList();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/pokemon']);
  });

  it('should format height correctly', () => {
    expect(component.formatHeight(4)).toBe('0.4 m');
  });

  it('should format weight correctly', () => {
    expect(component.formatWeight(60)).toBe('6.0 kg');
  });

  it('should get random emoji', () => {
    const emoji = component.getRandomEmoji();
    expect(['🎲', '✨', '🎯', '🎰', '🔮', '🎪']).toContain(emoji);
  });

  it('should retry on error', (done) => {
    mockPokemonService.getPokemonDetails.and.returnValue(throwError(() => ({ message: 'Error' })));
    spyOn(component, 'getRandomEmoji').and.returnValue('🎲');
    fixture.detectChanges();

    setTimeout(() => {
      mockPokemonService.getPokemonDetails.calls.reset();
      mockPokemonService.getPokemonDetails.and.returnValue(of(mockPokemon));

      component.retryLoad();

      expect(component.isGenerating()).toBe(true);
      done();
    }, 400);
  });

  it('should have correct initial state', () => {
    expect(component.pokemon()).toBeNull();
    expect(component.isLoading()).toBe(false);
    expect(component.error()).toBeNull();
    expect(component.isGenerating()).toBe(false);
  });
});
