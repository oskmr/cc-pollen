# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-03-04

### Changed
- Default language changed from Japanese to English
- English labels now include directional arrows (↓ None, → Low, ↗ Moderate, ↑ High, ⇈ Very High, ⇑ Extreme)
- More stylish and modern display format

## [1.0.0] - 2026-03-04

### Added
- Initial release of cc-pollen
- Pollen info display for Claude Code status line
- Support for ~1,000 observation points across Japan via Weathernews API
- 21 city presets (Tokyo wards, Osaka, Nagoya, Fukuoka, Sapporo, etc.)
- Interactive setup command (`cc-pollen setup`)
- Multiple display formats (`icon+level+city`, `icon+bar`, etc.)
- Detailed hourly chart view (`cc-pollen detail`)
- Caching with configurable TTL (default 30 minutes)
- Bilingual support (Japanese/English)
- Color-coded output based on pollen levels

### Technical Highlights
- Modern TypeScript with strict mode
- Node.js 18+ native `fetch` API
- ES Modules (not CommonJS)
- Functional programming style
- Type-safe with no `any` types
- `as const satisfies` for immutable constants
- `readline/promises` for async user input
- Enhanced error handling with DEBUG mode
- Zero external dependencies (except dev dependencies)

### Commands
- `cc-pollen status` - Status line output (default)
- `cc-pollen detail` - Detailed info + hourly chart
- `cc-pollen setup` - Interactive setup
- `cc-pollen cities` - List city presets
- `cc-pollen config` - Show current config
- `cc-pollen clear-cache` - Clear cached data
- `cc-pollen install` - Quick install with `--city` flag

### Data Source
- Weathernews Pollnrobo Open Data API
- No API key required
- Hourly real-time data
- Municipal-level granularity

## [Unreleased]

### Planned
- Additional city presets
- Custom pollen threshold configuration
- Weekly forecast view
- Export data to JSON/CSV

---

For upgrade instructions and breaking changes, see [UPGRADING.md](UPGRADING.md).
