import fs from "fs";
import readline from "readline/promises";
import path from "path";
import os from "os";
import { CITIES } from "./cities.js";
import { getConfig, saveConfig, saveJSON, mkdirp, CACHE_FILE, CFG_FILE, type Config } from "./config.js";
import { fetchPollen } from "./fetch.js";
import { formatStatusLine, printDetail } from "./format.js";
import { install } from "./install.js";

// ── Sub-commands ──

async function cmdStatus(config: Config): Promise<void> {
  // Drain stdin (Claude Code pipes JSON session data)
  if (!process.stdin.isTTY) {
    await new Promise<void>((r) => {
      process.stdin.resume();
      process.stdin.on("end", r);
      setTimeout(r, 100);
    });
  }
  const data = await fetchPollen(config);
  process.stdout.write(formatStatusLine(data, config) + "\n");
}

async function cmdDetail(config: Config): Promise<void> {
  const data = await fetchPollen(config);
  printDetail(data, config);
}

function cmdCities(config: Config): void {
  console.log("\n🌸 cc-pollen — City Presets:");
  console.log("━".repeat(40));
  for (const [k, v] of Object.entries(CITIES)) {
    const mark = k === config.cityPreset ? " ◀" : "";
    console.log(`  ${k.padEnd(15)} ${v.name.padEnd(12)} (${v.code})${mark}`);
  }
  console.log(`\nAll codes: https://wxtech.weathernews.com/opendata/v1/pollen/citycode/\n`);
}

function cmdConfig(config: Config): void {
  console.log(JSON.stringify(config, null, 2));
}

function cmdClearCache(): void {
  try {
    fs.unlinkSync(CACHE_FILE);
    console.log("✅ Cache cleared");
  } catch (error) {
    if (process.env.DEBUG) {
      console.error("[cmdClearCache] Failed to clear cache:", error);
    }
    console.log("No cache file");
  }
}

async function ask(q: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const answer = await rl.question(q);
  rl.close();
  return answer.trim();
}

async function cmdSetup(config: Config): Promise<void> {
  console.log("\n🌸 cc-pollen — Setup");
  console.log("━".repeat(40));

  const ps = Object.entries(CITIES);
  console.log("\nSelect area:");
  ps.forEach(([, v], i) =>
    console.log(`  ${String(i + 1).padStart(2).padStart(2)}. ${v.name} (${v.code})`)
  );
  console.log(`  ${ps.length + 1}. Enter citycode manually`);

  const ch = (await ask("\nNumber [2]: ")) || "2";
  const idx = parseInt(ch, 10);
  if (idx >= 1 && idx <= ps.length) {
    const [k, v] = ps[idx - 1];
    config.cityPreset = k;
    config.citycode = v.code;
    config.cityName = v.name;
  } else if (idx === ps.length + 1) {
    config.citycode = await ask("Citycode (5 digits): ");
    config.cityName = (await ask("Area name: ")) || config.citycode;
  }

  console.log("\nDisplay format:");
  console.log("  1. icon+level+city       (default)");
  console.log("  2. icon+level+city+bar");
  console.log("  3. icon+level+count");
  console.log("  4. icon+bar");
  const fc = (await ask("Number [1]: ")) || "1";
  const formatOptions = {
    "1": "icon+level+city",
    "2": "icon+level+city+bar",
    "3": "icon+level+count",
    "4": "icon+bar",
  } as const;
  config.format = formatOptions[fc as keyof typeof formatOptions] ?? "icon+level+city";

  saveConfig(config);

  const slPath = path.join(os.homedir(), ".claude", "cc-pollen-statusline.sh");
  mkdirp(path.dirname(slPath));
  fs.writeFileSync(slPath, "#!/bin/bash\ncat > /dev/null\nnpx --yes cc-pollen@latest status\n", { mode: 0o755 });

  console.log(`\n✅ Config: ${CFG_FILE}`);
  console.log(`✅ Script: ${slPath}`);
  console.log("\nAdd to ~/.claude/settings.json:");
  console.log(JSON.stringify({ statusLine: { type: "command", command: slPath, padding: 0 } }, null, 2));

  const data = await fetchPollen(config);
  console.log(`\nTest: ${formatStatusLine(data, config)}\n`);
}

function printHelp(): void {
  console.log(`
🌸 cc-pollen — Pollen info for Claude Code status line
  Weathernews Pollnrobo Open Data (no API key)

Install:
  npx cc-pollen@latest --city shinjuku
  npx cc-pollen@latest --city osaka
  npx cc-pollen@latest --city 13104    (raw citycode)

Commands:
  cc-pollen status        Status line output (default)
  cc-pollen detail        Detailed info + chart
  cc-pollen setup         Interactive setup
  cc-pollen cities        List city presets
  cc-pollen config        Show config
  cc-pollen clear-cache   Clear cache

Options:
  --city <name|code>      Set city (preset name or 5-digit code)
  --format <fmt>          icon+level+city, icon+bar, etc.
  --lang <ja|en>          Language
  --no-color              Disable ANSI colors
`);
}

// ── Main ──

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const config = getConfig();

  let city: string | undefined;
  let command: string | undefined;

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--city" && args[i + 1]) { city = args[++i]; }
    else if (a.startsWith("--city=")) { city = a.split("=")[1]; }
    else if (a === "--format" && args[i + 1]) { config.format = args[++i]; }
    else if (a.startsWith("--format=")) { config.format = a.split("=")[1]; }
    else if (a === "--lang" && args[i + 1]) { config.lang = args[++i]; }
    else if (a === "--no-color") { config.color = false; }
    else if (a === "--help" || a === "-h") { command = "help"; }
    else if (!a.startsWith("-")) { command = a; }
  }

  // --city without command = install mode
  if (city && !command) command = "install";

  switch (command) {
    case "status":      return cmdStatus(config);
    case "detail":      return cmdDetail(config);
    case "setup":       return cmdSetup(config);
    case "cities":      return cmdCities(config);
    case "config":      return cmdConfig(config);
    case "clear-cache": return cmdClearCache();
    case "install":     return install(config, city);
    case "help":        return printHelp();
    default:            return install(config, city);
  }
}

main().catch((e: Error) => {
  console.error(`cc-pollen: ${e.message}`);
  if (process.env.DEBUG) {
    console.error("\nStack trace:");
    console.error(e.stack);
  }
  process.exit(1);
});

