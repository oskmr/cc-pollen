import { countToLevel } from "./levels.js";
import { getCache, saveCache, type Config } from "./config.js";

const WN_API = "https://wxtech.weathernews.com/opendata/v1/pollen";

export interface PollenData {
  latestPollen: number;
  latestTime: string;
  maxRecent: number;
  avgRecent: number;
  level: number;
  hourly: [string, number][];
  source: "weathernews";
}

async function fetchURL(url: string): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "cc-pollen/1.0" },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.text();
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timeout (10s)");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

interface CSVRow {
  citycode: string;
  date: string;
  pollen: number;
}

function parseCSV(text: string): CSVRow[] | undefined {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return undefined;

  const headers = lines[0].split(",").map(h => h.trim());
  const rows = lines
    .slice(1)
    .map(line => {
      const values = line.split(",").map(v => v.trim());
      const row = Object.fromEntries(
        headers.map((header, index) => [header, values[index] || ""])
      );
      const pollen = parseInt(row.pollen, 10);

      if (isNaN(pollen) || pollen === -9999) return undefined;

      return { citycode: row.citycode, date: row.date, pollen };
    })
    .filter((row): row is CSVRow => row !== undefined);

  return rows.length > 0 ? rows : undefined;
}

function formatDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function calculateAverage(numbers: number[]): number {
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  const average = sum / numbers.length;
  return Math.round(average * 10) / 10;
}

function transformToPollenData(rows: CSVRow[]): PollenData {
  const latest = rows[rows.length - 1];
  const recent = rows.slice(-6);
  const recentPollen = recent.map(r => r.pollen);

  return {
    latestPollen: latest.pollen,
    latestTime: latest.date,
    maxRecent: Math.max(...recentPollen),
    avgRecent: calculateAverage(recentPollen),
    level: countToLevel(latest.pollen),
    hourly: rows.map(r => [r.date, r.pollen]),
    source: "weathernews",
  };
}

async function fetchWeathernews(citycode: string): Promise<PollenData | undefined> {
  const dateString = formatDateString(new Date());
  try {
    const text = await fetchURL(`${WN_API}?citycode=${citycode}&start=${dateString}&end=${dateString}`);
    const rows = parseCSV(text);
    if (!rows) {
      if (process.env.DEBUG) {
        console.error(`[fetchWeathernews] No valid data for citycode ${citycode}`);
      }
      return undefined;
    }
    return transformToPollenData(rows);
  } catch (error) {
    if (process.env.DEBUG) {
      console.error(`[fetchWeathernews] Failed to fetch data for citycode ${citycode}:`, error);
    }
    return undefined;
  }
}
export async function fetchPollen(config: Config): Promise<PollenData> {
  const c = getCache();
  if (c && c.pollen) return c.pollen;
  const data = await fetchWeathernews(config.citycode);
  if (!data) {
    throw new Error(
      `Failed to fetch pollen data for citycode ${config.citycode} (${config.cityName}). ` +
      `Check if the citycode is valid or try again later.`
    );
  }
  saveCache({ pollen: data });
  return data;
}

