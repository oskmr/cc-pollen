# Contributing to cc-pollen

Thank you for your interest in contributing to cc-pollen!

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/cc-pollen.git
   cd cc-pollen
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Test locally**
   ```bash
   node ./dist/cli.js --help
   ```

## Project Structure

```
cc-pollen/
├── src/
│   ├── cli.ts        # Entry point, arg parser, command routing
│   ├── cities.ts     # City preset definitions
│   ├── config.ts     # Config & cache management
│   ├── fetch.ts      # Weathernews API client
│   ├── format.ts     # Output formatting
│   ├── install.ts    # Installer (config, script, settings.json)
│   └── levels.ts     # Pollen level thresholds, colors
├── scripts/
│   └── add-shebang.mjs
└── README.md
```

## Coding Standards

This project follows modern TypeScript best practices:

- **TypeScript strict mode** enabled
- **ES Modules** (not CommonJS)
- **Functional programming style** preferred
- **No `any` types** - use generics or `unknown`
- **No `null`** - use `undefined` for optional values
- **`as const satisfies`** for immutable constants
- **Node.js 18+** features (native `fetch`, `readline/promises`)

## Making Changes

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the existing code style
   - Add tests if applicable
   - Update documentation as needed

3. **Build and test**
   ```bash
   npm run build
   # Test the CLI commands
   node ./dist/cli.js cities
   node ./dist/cli.js config
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "Brief description of your changes"
   ```

5. **Push and create a PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## Adding New Cities

To add city presets, edit `src/cities.ts`:

```typescript
export const CITIES = {
  // ...existing cities
  yourcity: { code: "12345", name: "Your City" },
} as const satisfies Record<string, CityDef>;
```

City codes can be found at: https://wxtech.weathernews.com/opendata/v1/pollen/citycode/

## Reporting Issues

- Check existing issues before creating a new one
- Include steps to reproduce the problem
- Mention your Node.js version and OS
- Provide relevant error messages or logs

## Pull Request Guidelines

- Keep PRs focused on a single feature or fix
- Write clear, descriptive commit messages
- Update README.md if you're adding features
- Ensure the build passes (`npm run build`)
- Reference related issues in your PR description

## Code of Conduct

Be respectful and inclusive. We're all here to make cc-pollen better.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
