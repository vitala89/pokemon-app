import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PokemonListComponent } from './pokemon-list.component';
import { PokemonApiService } from '@app/core';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { DebugElement, provideZonelessChangeDetection } from '@angular/core';
import { By } from '@angular/platform-browser';
import { PokemonCard } from '@app/core';

describe('PokemonListComponent', () => {
  let component: PokemonListComponent;
  let fixture: ComponentFixture<PokemonListComponent>;
  let compiled: DebugElement;
  let mockPokemonService: jasmine.SpyObj<PokemonApiService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockPokemonList: PokemonCard[] = [
    { id: 1, name: 'bulbasaur', imageUrl: 'https://example.com/1.png' },
    { id: 2, name: 'ivysaur', imageUrl: 'https://example.com/2.png' },
    { id: 3, name: 'venusaur', imageUrl: 'https://example.com/3.png' },
  ];

  beforeEach(async () => {
    mockPokemonService = jasmine.createSpyObj<PokemonApiService>('PokemonApiService', [
      'getPokemonList',
    ]);
    mockRouter = jasmine.createSpyObj<Router>('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [PokemonListComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: PokemonApiService, useValue: mockPokemonService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonListComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load Pokemon on init', () => {
    const getPokemonListSpy = mockPokemonService.getPokemonList;
    getPokemonListSpy.and.returnValue(of(mockPokemonList));

    fixture.detectChanges(); // triggers ngOnInit

    expect(getPokemonListSpy).toHaveBeenCalledWith(20, 0);
    expect(component.pokemonList().length).toBe(3);
    expect(component.isLoading()).toBe(false);
  });

  it('should display loading spinner initially', () => {
    mockPokemonService.getPokemonList.and.returnValue(of(mockPokemonList));

    component.isLoading.set(true);
    fixture.detectChanges();

    const spinner = compiled.query(By.css('app-loading-spinner'));
    expect(spinner).toBeTruthy();
  });

  it('should display Pokemon cards after loading', () => {
    mockPokemonService.getPokemonList.and.returnValue(of(mockPokemonList));

    fixture.detectChanges();

    const cards = compiled.queryAll(By.css('app-pokemon-card'));
    expect(cards.length).toBe(3);
  });

  it('should handle error state', () => {
    const errorMessage = 'Network error';
    mockPokemonService.getPokemonList.and.returnValue(
      throwError(() => ({ message: errorMessage })),
    );

    fixture.detectChanges();

    expect(component.error()).toBe(errorMessage);
    expect(component.isLoading()).toBe(false);
  });

  it('should display error message on error', () => {
    mockPokemonService.getPokemonList.and.returnValue(
      throwError(() => ({ message: 'Failed to load' })),
    );

    fixture.detectChanges();

    const errorComponent = compiled.query(By.css('app-error-message'));
    expect(errorComponent).toBeTruthy();
  });

  it('should retry loading on error retry', () => {
    mockPokemonService.getPokemonList.and.returnValue(throwError(() => ({ message: 'Error' })));

    fixture.detectChanges();

    const getPokemonListSpy = mockPokemonService.getPokemonList;
    getPokemonListSpy.calls.reset();
    getPokemonListSpy.and.returnValue(of(mockPokemonList));

    component.retryLoad();
    fixture.detectChanges();

    expect(getPokemonListSpy).toHaveBeenCalled();
    expect(component.error()).toBeNull();
  });

  it('should load more Pokemon when load more button is clicked', () => {
    const getPokemonListSpy = mockPokemonService.getPokemonList;
    getPokemonListSpy.and.returnValue(of(mockPokemonList));

    fixture.detectChanges();

    getPokemonListSpy.and.returnValue(
      of([{ id: 4, name: 'charmander', imageUrl: 'https://example.com/4.png' }]),
    );

    component.loadMore();
    fixture.detectChanges();

    expect(component.pokemonList().length).toBe(4);
    expect(getPokemonListSpy).toHaveBeenCalledWith(20, 20);
  });

  it('should navigate to details when card is clicked', () => {
    mockPokemonService.getPokemonList.and.returnValue(of(mockPokemonList));

    fixture.detectChanges();

    const pokemon = mockPokemonList[0];
    const navigateSpy = mockRouter.navigate;
    component.viewPokemonDetails(pokemon);

    expect(navigateSpy).toHaveBeenCalledWith(['/pokemon/1']);
  });

  it('should show load more button when has more data', () => {
    mockPokemonService.getPokemonList.and.returnValue(of(mockPokemonList));
    component.useInfiniteScroll.set(false);

    fixture.detectChanges();

    expect(component.showLoadMore()).toBe(true);
    expect(component.hasMore()).toBe(true);
  });

  it('should hide load more button when no more data', () => {
    mockPokemonService.getPokemonList.and.returnValue(of(mockPokemonList));

    fixture.detectChanges();

    component.currentPage.set(52);
    component.hasMore.set(false);
    fixture.detectChanges();

    expect(component.showLoadMore()).toBe(false);
  });

  it('should display end message when all Pokemon loaded', () => {
    mockPokemonService.getPokemonList.and.returnValue(of(mockPokemonList));

    fixture.detectChanges();

    component.hasMore.set(false);
    component.isLoading.set(false);
    fixture.detectChanges();

    const endMessage = compiled.query(By.css('.pokemon-list__end-message'));
    expect(endMessage).toBeTruthy();
    expect((endMessage.nativeElement as HTMLElement).textContent).toContain(
      "You've seen all Pokemon!",
    );
  });

  it('should display empty state when no Pokemon', () => {
    mockPokemonService.getPokemonList.and.returnValue(of([]));

    fixture.detectChanges();

    expect(component.isEmpty()).toBe(true);

    const emptyState = compiled.query(By.css('.pokemon-list__empty'));
    expect(emptyState).toBeTruthy();
  });

  it('should track Pokemon by ID', () => {
    const pokemon = mockPokemonList[0];
    const result = component.trackByPokemonId(0, pokemon);

    expect(result).toBe(1);
  });

  it('should not load more if already loading', () => {
    const getPokemonListSpy = mockPokemonService.getPokemonList;
    getPokemonListSpy.and.returnValue(of(mockPokemonList));

    fixture.detectChanges();

    component.isLoading.set(true);
    getPokemonListSpy.calls.reset();

    component.loadMore();

    expect(getPokemonListSpy).not.toHaveBeenCalled();
  });

  it('should increment page number after successful load', () => {
    mockPokemonService.getPokemonList.and.returnValue(of(mockPokemonList));

    expect(component.currentPage()).toBe(0);

    fixture.detectChanges();

    expect(component.currentPage()).toBe(1);
  });

  it('should append new Pokemon to existing list', () => {
    mockPokemonService.getPokemonList.and.returnValue(of(mockPokemonList));

    fixture.detectChanges();

    const initialLength = component.pokemonList().length;

    mockPokemonService.getPokemonList.and.returnValue(
      of([
        { id: 4, name: 'charmander', imageUrl: 'https://example.com/4.png' },
        { id: 5, name: 'charmeleon', imageUrl: 'https://example.com/5.png' },
      ]),
    );

    component.loadMore();
    fixture.detectChanges();

    expect(component.pokemonList().length).toBe(initialLength + 2);
  });

  it('should have correct initial state', () => {
    expect(component.pokemonList()).toEqual([]);
    expect(component.isLoading()).toBe(false);
    expect(component.error()).toBeNull();
    expect(component.currentPage()).toBe(0);
    expect(component.hasMore()).toBe(true);
  });

  it('should clear error on successful retry', () => {
    mockPokemonService.getPokemonList.and.returnValue(throwError(() => ({ message: 'Error' })));

    fixture.detectChanges();

    expect(component.error()).toBe('Error');

    mockPokemonService.getPokemonList.and.returnValue(of(mockPokemonList));

    component.retryLoad();
    fixture.detectChanges();

    expect(component.error()).toBeNull();
  });
});
