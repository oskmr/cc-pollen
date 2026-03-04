import fs from "fs";
import path from "path";
import os from "os";
import { CITIES, isCityKey } from "./cities.js";
import { type Config, saveConfig, mkdirp, saveJSON, loadJSON } from "./config.js";
import { fetchPollen } from "./fetch.js";
import { formatStatusLine } from "./format.js";

export async function install(config: Config, cityKey: string | undefined): Promise<void> {
  console.log("\n🌸 cc-pollen installer");
  console.log("━".repeat(40));

  // Resolve city
  if (cityKey && isCityKey(cityKey)) {
    const v = CITIES[cityKey];
    config.cityPreset = cityKey;
    config.citycode = v.code;
    config.cityName = v.name;
    console.log(`\n✅ Area: ${v.name} (${v.code})`);
  } else if (cityKey) {
    config.citycode = cityKey;
    config.cityName = cityKey;
    console.log(`\n✅ Citycode: ${cityKey}`);
  } else {
    const v = CITIES.shinjuku;
    config.cityPreset = "shinjuku";
    config.citycode = v.code;
    config.cityName = v.name;
    console.log(`\n✅ Area: ${v.name} (default)`);
  }

  // Save config
  saveConfig(config);
  console.log(`✅ Config saved`);

  // Generate statusline script
  const slPath = path.join(os.homedir(), ".claude", "cc-pollen-statusline.sh");
  mkdirp(path.dirname(slPath));
  fs.writeFileSync(
    slPath,
    "#!/bin/bash\ncat > /dev/null\nnpx --yes cc-pollen@latest status\n",
    { mode: 0o755 },
  );
  console.log(`✅ Script: ${slPath}`);

  // Patch settings.json
  const settingsPath = path.join(os.homedir(), ".claude", "settings.json");
  const settings = loadJSON<Record<string, unknown>>(settingsPath) || {};
  const slCfg = { type: "command", command: slPath, padding: 0 };

  if (!settings.statusLine) {
    settings.statusLine = slCfg;
    saveJSON(settingsPath, settings);
    console.log(`✅ Updated: ${settingsPath}`);
  } else {
    console.log(`\n⚠  statusLine already set in settings.json`);
    console.log(`  Current: ${JSON.stringify(settings.statusLine)}`);
    console.log(`\n  To use cc-pollen, replace statusLine with:`);
    console.log(JSON.stringify({ statusLine: slCfg }, null, 2));
    console.log(`\n  Or combine with a wrapper script (see README).`);
  }

  // Preview
  const data = await fetchPollen(config);
  console.log(`\n🌸 Preview: ${formatStatusLine(data, config)}`);

  console.log(`\n${"━".repeat(40)}`);
  console.log(`✅ Done! Restart Claude Code to see pollen info.`);
  console.log(`\n💡 Change city:  npx cc-pollen@latest --city osaka`);
  console.log(`   All presets:  npx cc-pollen@latest cities`);
  console.log(`   All codes:    https://wxtech.weathernews.com/opendata/v1/pollen/citycode/\n`);
}

