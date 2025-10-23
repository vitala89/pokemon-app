import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { PokemonApiService } from '@app/core';
import { CacheService } from '@app/core';
import { LoggerService } from '@app/core';
import { API_CONFIG } from '@app/core';
import { Pokemon, PokemonListResponse } from '../models';

describe('PokemonApiService', () => {
  let service: PokemonApiService;
  let httpMock: HttpTestingController;
  let cacheService: CacheService;
  let loggerService: LoggerService;

  const mockPokemonListResponse: PokemonListResponse = {
    count: 1302,
    next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
    previous: null,
    results: [
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
    ],
  };

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
    ],
    abilities: [
      {
        ability: { name: 'static', url: 'https://pokeapi.co/api/v2/ability/9/' },
        is_hidden: false,
        slot: 1,
      },
    ],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [provideZonelessChangeDetection(), PokemonApiService, CacheService, LoggerService],
    });

    service = TestBed.inject(PokemonApiService);
    httpMock = TestBed.inject(HttpTestingController);
    cacheService = TestBed.inject(CacheService);
    loggerService = TestBed.inject(LoggerService);

    spyOn(loggerService, 'log');
    spyOn(loggerService, 'error');
  });

  afterEach(() => {
    httpMock.verify();
    cacheService.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPokemonList', () => {
    it('should fetch Pokemon list from API', (done) => {
      service.getPokemonList(2, 0).subscribe((pokemonCards) => {
        expect(pokemonCards.length).toBe(2);
        expect(pokemonCards[0].id).toBe(1);
        expect(pokemonCards[0].name).toBe('bulbasaur');
        expect(pokemonCards[1].id).toBe(2);
        expect(pokemonCards[1].name).toBe('ivysaur');
        done();
      });

      const req = httpMock.expectOne(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.POKEMON}?limit=2&offset=0`,
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPokemonListResponse);
    });

    it('should use default limit and offset', (done) => {
      service.getPokemonList().subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.POKEMON}?limit=${API_CONFIG.PAGINATION.DEFAULT_LIMIT}&offset=0`,
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPokemonListResponse);
    });

    it('should cache Pokemon list', (done) => {
      const cacheKey = 'pokemon-list-20-0';
      spyOn(cacheService, 'get').and.returnValue(null);
      spyOn(cacheService, 'set');

      service.getPokemonList(20, 0).subscribe(() => {
        expect(cacheService.set).toHaveBeenCalledWith(cacheKey, jasmine.any(Array));
        done();
      });

      const req = httpMock.expectOne(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.POKEMON}?limit=20&offset=0`,
      );
      req.flush(mockPokemonListResponse);
    });

    it('should return cached data if available', (done) => {
      const cachedData = [
        { id: 1, name: 'bulbasaur', imageUrl: 'url1' },
        { id: 2, name: 'ivysaur', imageUrl: 'url2' },
      ];

      spyOn(cacheService, 'get').and.returnValue(cachedData);

      service.getPokemonList(20, 0).subscribe((result) => {
        expect(result).toEqual(cachedData);
        expect(loggerService.log).toHaveBeenCalled();
        done();
      });

      httpMock.expectNone(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.POKEMON}`);
    });

    it('should set loading state correctly', (done) => {
      expect(service.isLoading()).toBe(false);

      service.getPokemonList().subscribe(() => {
        expect(service.isLoading()).toBe(false);
        done();
      });

      expect(service.isLoading()).toBe(true);

      const req = httpMock.expectOne(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.POKEMON}?limit=20&offset=0`,
      );
      req.flush(mockPokemonListResponse);
    });

    it('should handle errors', (done) => {
      service.getPokemonList().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          expect(service.isLoading()).toBe(false);
          done();
        },
      });

      const req = httpMock.expectOne(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.POKEMON}?limit=20&offset=0`,
      );
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getPokemonDetails', () => {
    it('should fetch Pokemon details by ID', (done) => {
      service.getPokemonDetails(25).subscribe((pokemon) => {
        expect(pokemon).toEqual(mockPokemon);
        expect(pokemon.id).toBe(25);
        expect(pokemon.name).toBe('pikachu');
        done();
      });

      const req = httpMock.expectOne(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.POKEMON}/25`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPokemon);
    });

    it('should fetch Pokemon details by name', (done) => {
      service.getPokemonDetails('pikachu').subscribe((pokemon) => {
        expect(pokemon).toEqual(mockPokemon);
        done();
      });

      const req = httpMock.expectOne(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.POKEMON}/pikachu`,
      );
      req.flush(mockPokemon);
    });

    it('should cache Pokemon details', (done) => {
      const cacheKey = 'pokemon-details-25';
      spyOn(cacheService, 'get').and.returnValue(null);
      spyOn(cacheService, 'set');

      service.getPokemonDetails(25).subscribe(() => {
        expect(cacheService.set).toHaveBeenCalledWith(cacheKey, mockPokemon);
        done();
      });

      const req = httpMock.expectOne(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.POKEMON}/25`);
      req.flush(mockPokemon);
    });

    it('should return cached details if available', (done) => {
      spyOn(cacheService, 'get').and.returnValue(mockPokemon);

      service.getPokemonDetails(25).subscribe((result) => {
        expect(result).toEqual(mockPokemon);
        done();
      });

      httpMock.expectNone(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.POKEMON}/25`);
    });

    it('should handle errors', (done) => {
      service.getPokemonDetails(999999).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        },
      });

      const req = httpMock.expectOne(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.POKEMON}/999999`,
      );
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getRandomPokemon', () => {
    it('should fetch a random Pokemon', (done) => {
      service.getRandomPokemon().subscribe((pokemon) => {
        expect(pokemon).toBeTruthy();
        expect(pokemon.id).toBeGreaterThan(0);
        expect(pokemon.id).toBeLessThanOrEqual(1025);
        done();
      });

      const req = httpMock.expectOne((request) => {
        return request.url.includes(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.POKEMON}/`);
      });
      req.flush(mockPokemon);
    });
  });

  describe('clearCache', () => {
    it('should clear the cache', () => {
      spyOn(cacheService, 'clear');

      service.clearCache();

      expect(cacheService.clear).toHaveBeenCalled();
    });
  });

  describe('resetError', () => {
    it('should reset error state', () => {
      service.errorState.set('Some error');
      expect(service.error()).toBe('Some error');

      service.resetError();

      expect(service.error()).toBeNull();
    });
  });
});
