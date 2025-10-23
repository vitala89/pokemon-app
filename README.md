# Pokemon App

A modern, feature-rich Pokemon application built with Angular 20, showcasing best practices in component architecture, state management, and testing.

![Angular](https://img.shields.io/badge/Angular-20.3-DD0031?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Tests](https://img.shields.io/badge/tests-232%20passing-success)

## Features

### Core Functionality
- **Pokemon List**: Browse through all Pokemon with infinite scroll and pagination
- **Pokemon Details**: View comprehensive information about individual Pokemon including stats, abilities, and types
- **Random Pokemon**: Discover random Pokemon with an engaging interface
- **Search & Filter**: Quick navigation and filtering capabilities
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Technical Highlights
- **Angular 20** with Zoneless change detection for optimal performance
- **Standalone Components** for better modularity and tree-shaking
- **Signal-based State Management** using Angular's new reactive primitives
- **Comprehensive Testing**: 232 unit tests with full coverage
- **Lazy Loading**: Optimized bundle sizes with route-based code splitting
- **Image Optimization**: Using Angular's NgOptimizedImage directive
- **Caching Strategy**: Client-side caching for improved performance
- **Error Handling**: Robust error handling with user-friendly messages
- **Accessibility**: ARIA labels, keyboard navigation, and semantic HTML

## Project Structure

```
src/app/
├── core/                      # Singleton services and core functionality
│   ├── constants/            # Application-wide constants
│   ├── models/               # TypeScript interfaces and types
│   ├── services/             # API services, caching, logging
│   └── utils/                # Utility functions
├── features/                  # Feature modules (lazy-loaded)
│   ├── pokemon-list/         # Pokemon listing with pagination
│   ├── pokemon-details/      # Individual Pokemon details
│   ├── random-pokemon/       # Random Pokemon generator
│   └── not-found/            # 404 page
├── shared/                    # Shared components, pipes, and directives
│   ├── components/           # Reusable UI components
│   ├── pipes/                # Custom pipes for data transformation
│   └── directives/           # Custom directives
└── app.component.ts          # Root component
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Angular CLI 20.3.6 or higher

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pokemon-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:4200/`

## Available Scripts

### Development
```bash
npm start                    # Start development server
npm run watch               # Build with watch mode
```

### Testing
```bash
npm test                    # Run tests in watch mode
npm run test:ci            # Run tests once (CI mode)
npm run test:coverage      # Generate coverage report
```

### Code Quality
```bash
npm run lint               # Lint TypeScript and HTML files
npm run lint:fix           # Auto-fix linting issues
npm run format             # Format code with Prettier
npm run format:check       # Check code formatting
```

### Building
```bash
npm run build              # Production build
ng build --configuration development  # Development build
```

## Code Quality & Standards

### Linting & Formatting
- **ESLint** with Angular-specific rules
- **Prettier** for consistent code formatting
- **Husky** for pre-commit hooks
- **lint-staged** for staged files validation

### Testing
- **Jasmine** testing framework
- **Karma** test runner
- **232 unit tests** covering components, services, pipes, and directives
- Test-driven development approach

### Code Style
- Strict TypeScript configuration
- Angular style guide compliance
- Component naming conventions: `*.component.ts`, `*.service.ts`
- Organized imports and consistent file structure

## Architecture Decisions

### State Management
- **Signals**: Angular's built-in reactive state management
- **Computed Signals**: For derived state
- **Services**: For shared state across components

### API Integration
- **PokemonApiService**: Centralized API communication
- **CacheService**: In-memory caching with TTL support
- **Error Handling**: HTTP interceptor for global error handling

### Component Design
- **Standalone Components**: No NgModules
- **Input/Output Signals**: Modern Angular 20 API
- **Smart/Presentational Pattern**: Clear separation of concerns

### Performance Optimizations
- Zoneless change detection
- Lazy loading of feature modules
- Image optimization with NgOptimizedImage
- Virtual scrolling for large lists
- OnPush change detection strategy
- TrackBy functions for *ngFor loops

## API

This application uses the [PokéAPI](https://pokeapi.co/) - a free RESTful Pokemon API.

**Base URL**: `https://pokeapi.co/api/v2/`

**Endpoints Used**:
- `GET /pokemon` - List Pokemon
- `GET /pokemon/{id}` - Get Pokemon details
- `GET /pokemon/{name}` - Get Pokemon by name

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Commit Message Convention

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Test updates
- `chore:` - Build process or auxiliary tool changes

## Troubleshooting

### Common Issues

**Issue**: Tests failing with circular dependency errors
**Solution**: Ensure components don't import from `@app/shared` barrel exports if they're exported through those same barrels. Use relative imports instead.

**Issue**: Images not loading
**Solution**: Check that the API is accessible and CORS is configured correctly.

**Issue**: Build fails with memory errors
**Solution**: Increase Node.js memory limit:
```bash
export NODE_OPTIONS="--max_old_space_size=4096"
```

## Performance

- **Lighthouse Score**: 95+ (Performance)
- **Bundle Size**: ~200KB (gzipped)
- **First Contentful Paint**: <1s
- **Time to Interactive**: <2s

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [PokéAPI](https://pokeapi.co/) for providing the Pokemon data
- Angular team for the amazing framework
- All contributors who have helped improve this project

## Learn More

- [Angular Documentation](https://angular.dev)
- [Angular CLI Documentation](https://angular.dev/tools/cli)
- [PokéAPI Documentation](https://pokeapi.co/docs/v2)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

**Built with Angular 20**
