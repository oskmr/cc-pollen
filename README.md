# 🌸 cc-pollen

[![npm version](https://img.shields.io/npm/v/cc-pollen.svg)](https://www.npmjs.com/package/cc-pollen)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4%2B-blue.svg)](https://www.typescriptlang.org/)

Pollen info for Claude Code status line.
Powered by [Weathernews Pollnrobo Open Data](https://wxtech.weathernews.com/pollen/index.html) — **no API key required**.

```
🌸 🟠 ↗ Moderate 新宿区
```

## Install

```bash
# Install + set city in one command
npx cc-pollen@latest --city shinjuku

# Other cities
npx cc-pollen@latest --city osaka
npx cc-pollen@latest --city sapporo
npx cc-pollen@latest --city 13104    # raw citycode
```

That's it! Restart Claude Code to see pollen info in the status line.

## What the installer does

1. Saves config to `~/.config/cc-pollen/config.json`
2. Creates `~/.claude/cc-pollen-statusline.sh`
3. Updates `~/.claude/settings.json` (if `statusLine` is not already set)

## Commands

```
cc-pollen status        Status line output (default)
cc-pollen detail        Detailed info + hourly chart
cc-pollen setup         Interactive setup
cc-pollen cities        List city presets
cc-pollen config        Show current config
cc-pollen clear-cache   Clear cached data
```

## Options

```
--city <name|code>      Set city (preset name or 5-digit code)
--format <fmt>          Display format (see below)
--lang <ja|en>          Language
--no-color              Disable ANSI colors
```

## Display Formats

Combine tokens with `+`:

| Format | Example |
|--------|---------|
| `icon+level+city` | 🟠 ↗ Moderate 新宿区 |
| `icon+level+city+bar` | 🟠 ↗ Moderate 新宿区 ▓▓░░░ |
| `icon+level+count` | 🟠 ↗ Moderate 30/cm² |
| `icon+bar` | 🟠 ▓▓░░░ |

## Pollen Levels

| Lv | Icon | Label (EN) | Label (JA) | Count/cm² |
|----|------|------------|------------|-----------|
| 0 | 🟢 | ↓ None | なし | 0 |
| 1 | 🟡 | → Low | 少ない | 1–9 |
| 2 | 🟠 | ↗ Moderate | やや多い | 10–29 |
| 3 | 🔴 | ↑ High | 多い | 30–49 |
| 4 | 🟣 | ⇈ Very High | 非常に多い | 50–99 |
| 5 | 💀 | ⇑ Extreme | 極めて多い | 100+ |

## City Presets

```
chiyoda      千代田区      (13101)
shinjuku     新宿区        (13104)
shibuya      渋谷区        (13113)
minato       港区          (13103)
setagaya     世田谷区      (13112)
osaka        大阪市北区    (27127)
nagoya       名古屋市中区  (23109)
fukuoka      福岡市博多区  (40132)
sapporo      札幌市中央区  (01101)
...and more
```

Full list: `npx cc-pollen@latest cities`
All municipal codes: https://wxtech.weathernews.com/opendata/v1/pollen/citycode/

## Combining with existing status line

If you already use a status line tool, create a wrapper:

```bash
#!/bin/bash
# ~/.claude/statusline-wrapper.sh
input=$(cat)
pollen=$(npx --yes cc-pollen@latest status)
existing=$(echo "$input" | ~/.claude/your-existing-statusline.sh)
echo "$existing | $pollen"
```

## Architecture

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
├── package.json
└── tsconfig.json
```

## Data Source

Weathernews Pollnrobo Open Data API
- ~1,000 observation points across Japan
- Hourly real-time data
- Municipal-level granularity
- No API key required
- Non-commercial personal use: free (credit Weathernews)

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

- Report bugs or request features via [GitHub Issues](https://github.com/oskmr/cc-pollen/issues)
- Submit pull requests for improvements
- Add new city presets
- Improve documentation

## License

MIT - See [LICENSE](LICENSE) for details.
