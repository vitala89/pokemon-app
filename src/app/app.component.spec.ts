import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { AppComponent } from './app.component';
import { provideRouter } from '@angular/router';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { provideLocationMocks } from '@angular/common/testing';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let compiled: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideZonelessChangeDetection(), provideRouter([]), provideLocationMocks()],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct app version', () => {
    expect(component.appVersion).toBe('1.0.0');
  });

  it('should have current year', () => {
    const currentYear = new Date().getFullYear();
    expect(component.currentYear).toBe(currentYear);
  });

  describe('Header', () => {
    it('should render header', () => {
      const header = compiled.query(By.css('.app__header'));
      expect(header).toBeTruthy();
    });

    it('should render logo', () => {
      const logo = compiled.query(By.css('.app__logo'));
      expect(logo).toBeTruthy();
    });

    it('should have logo text', () => {
      const logoText = compiled.query(By.css('.app__logo-text'));
      expect(logoText.nativeElement.textContent.trim()).toBe('Pokemon');
    });

    it('should have navigation menu', () => {
      const menu = compiled.query(By.css('.app__menu'));
      expect(menu).toBeTruthy();
    });

    it('should have two menu items', () => {
      const menuItems = compiled.queryAll(By.css('.app__menu-item'));
      expect(menuItems.length).toBe(2);
    });

    it('should have "All Pokemon" link', () => {
      const links = compiled.queryAll(By.css('.app__menu-link'));
      const allPokemonLink = links.find((link) =>
        link.nativeElement.textContent.includes('All Pokemon'),
      );
      expect(allPokemonLink).toBeTruthy();
    });

    it('should have "Random" link', () => {
      const links = compiled.queryAll(By.css('.app__menu-link'));
      const randomLink = links.find((link) => link.nativeElement.textContent.includes('Random'));
      expect(randomLink).toBeTruthy();
    });
  });

  describe('Main Content', () => {
    it('should render main content area', () => {
      const main = compiled.query(By.css('.app__main'));
      expect(main).toBeTruthy();
    });

    it('should have router outlet', () => {
      const routerOutlet = compiled.query(By.css('router-outlet'));
      expect(routerOutlet).toBeTruthy();
    });

    it('should have proper ARIA role', () => {
      const main = compiled.query(By.css('.app__main'));
      expect(main.nativeElement.getAttribute('role')).toBe('main');
    });

    it('should have id for skip link', () => {
      const main = compiled.query(By.css('.app__main'));
      expect(main.nativeElement.getAttribute('id')).toBe('main-content');
    });
  });

  describe('Footer', () => {
    it('should render footer', () => {
      const footer = compiled.query(By.css('.app__footer'));
      expect(footer).toBeTruthy();
    });

    it('should have About section', () => {
      const aboutTitle = compiled.queryAll(By.css('.app__footer-title')).find((el) => {
        return el.nativeElement.textContent.includes('About');
      });
      expect(aboutTitle).toBeTruthy();
    });

    it('should have Quick Links section', () => {
      const quickLinksTitle = compiled.queryAll(By.css('.app__footer-title')).find((el) => {
        return el.nativeElement.textContent.includes('Quick Links');
      });
      expect(quickLinksTitle).toBeTruthy();
    });

    it('should have Resources section', () => {
      const resourcesTitle = compiled.queryAll(By.css('.app__footer-title')).find((el) => {
        return el.nativeElement.textContent.includes('Resources');
      });
      expect(resourcesTitle).toBeTruthy();
    });

    it('should have copyright with current year', () => {
      const copyright = compiled.query(By.css('.app__footer-copyright'));
      expect(copyright.nativeElement.textContent).toContain(component.currentYear.toString());
    });

    it('should have PokeAPI link', () => {
      const links = compiled.queryAll(By.css('.app__footer-link'));
      const pokeApiLink = links.find((link) => link.nativeElement.textContent.includes('PokeAPI'));
      expect(pokeApiLink).toBeTruthy();
    });

    it('should have Angular link', () => {
      const links = compiled.queryAll(By.css('.app__footer-link'));
      const angularLink = links.find((link) => link.nativeElement.textContent.includes('Angular'));
      expect(angularLink).toBeTruthy();
    });

    it('should have external links with proper attributes', () => {
      const externalLinks = compiled.queryAll(By.css('a[target="_blank"]'));
      externalLinks.forEach((link) => {
        expect(link.nativeElement.getAttribute('rel')).toBe('noopener noreferrer');
      });
    });
  });

  describe('scrollToTop method', () => {
    it('should scroll to top when called', () => {
      const scrollToSpy = spyOn(window as any, 'scrollTo');

      component.scrollToTop();

      expect(scrollToSpy).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      });
    });

    it('should be called when logo is clicked', () => {
      const scrollToSpy = spyOn(component, 'scrollToTop');

      const logo = compiled.query(By.css('.app__logo'));
      logo.nativeElement.click();

      expect(scrollToSpy).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper navigation role', () => {
      const nav = compiled.query(By.css('.app__nav'));
      expect(nav.nativeElement.getAttribute('role')).toBe('navigation');
    });

    it('should have navigation aria-label', () => {
      const nav = compiled.query(By.css('.app__nav'));
      expect(nav.nativeElement.getAttribute('aria-label')).toBe('Main navigation');
    });

    it('should have menu role', () => {
      const menu = compiled.query(By.css('.app__menu'));
      expect(menu.nativeElement.getAttribute('role')).toBe('menubar');
    });

    it('should have menuitem roles', () => {
      const menuLinks = compiled.queryAll(By.css('.app__menu-link'));
      menuLinks.forEach((link) => {
        expect(link.nativeElement.getAttribute('role')).toBe('menuitem');
      });
    });

    it('should have footer contentinfo role', () => {
      const footer = compiled.query(By.css('.app__footer'));
      expect(footer.nativeElement.getAttribute('role')).toBe('contentinfo');
    });

    it('should have aria-hidden on decorative icons', () => {
      const decorativeIcons = compiled.queryAll(By.css('.app__menu-icon, .app__footer-link-icon'));
      decorativeIcons.forEach((icon) => {
        expect(icon.nativeElement.getAttribute('aria-hidden')).toBe('true');
      });
    });
  });

  describe('Responsive Design', () => {
    it('should have proper layout structure', () => {
      const app = compiled.query(By.css('.app'));
      expect(app).toBeTruthy();

      const header = compiled.query(By.css('.app__header'));
      const main = compiled.query(By.css('.app__main'));
      const footer = compiled.query(By.css('.app__footer'));

      expect(header).toBeTruthy();
      expect(main).toBeTruthy();
      expect(footer).toBeTruthy();
    });
  });
});
