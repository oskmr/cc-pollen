import { LEVELS, COLORS, RESET, countToLevel } from "./levels.js";
import type { PollenData } from "./fetch.js";
import type { Config } from "./config.js";

export function formatStatusLine(data: PollenData, config: Config): string {
  const lv = data.level || 0;
  const info = LEVELS[lv];
  const lang = config.lang || "ja";
  const fmt = config.format || "icon+level+city";

  const formatToken = (token: string): string | undefined => {
    const t = token.trim();
    if (t === "icon") return info.icon;
    if (t === "level") return lang === "ja" ? info.ja : info.en;
    if (t === "city") return config.cityName || "";
    if (t === "bar") return info.bar;
    if (t === "count" && data.latestPollen >= 0) return `${data.latestPollen}/cm²`;
    if (t === "time" && data.latestTime) {
      try {
        const date = new Date(data.latestTime);
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const time = date.toTimeString().slice(0, 5);
        return `${month}/${day} ${time}`;
      } catch {
        return data.latestTime;
      }
    }
    return undefined;
  };

  const parts = fmt
    .split("+")
    .map(formatToken)
    .filter((part): part is string => part !== undefined);

  const txt = parts.join(" ");
  if (config.color !== false) return `${COLORS[lv]}${txt}${RESET}`;
  return txt;
}

export function printDetail(data: PollenData, config: Config): void {
  const lv = data.level || 0;
  const info = LEVELS[lv];

  console.log(`\n🌸 cc-pollen — ${config.cityName} (${config.citycode})`);
  console.log("━".repeat(40));
  console.log(`  Level:  ${info.icon} ${info.ja} (${lv}/5)`);
  console.log(`  Bar:    ${info.bar}`);
  if (data.latestPollen >= 0) {
    console.log(`  Latest: ${data.latestPollen} /cm²`);
    console.log(`  Max:    ${data.maxRecent} /cm²`);
    console.log(`  Avg:    ${data.avgRecent} /cm²`);
  }
  console.log();

  if (data.hourly && data.hourly.length > 0) {
    console.log("  📊 Today:");
    const maxPollen = Math.max(...data.hourly.map(h => h[1])) || 1;

    const formatHourlyRow = ([dateTime, pollen]: [string, number]): string => {
      const time = (() => {
        try {
          return new Date(dateTime).toTimeString().slice(0, 5);
        } catch {
          return dateTime;
        }
      })();
      const barLength = Math.round((pollen / maxPollen) * 20);
      const icon = LEVELS[countToLevel(pollen)].icon;
      return `  ${time} ${icon} ${"█".repeat(barLength)} ${pollen}`;
    };

    data.hourly.forEach(row => console.log(formatHourlyRow(row)));
    console.log();
  }

  console.log("  ✅ Weathernews Pollnrobo data");
  console.log(`  ${new Date().toISOString().slice(0, 16).replace("T", " ")}\n`);
}

