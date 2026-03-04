import fs from "fs";
import path from "path";
import os from "os";
import type { PollenData } from "./fetch.js";

const APP = "cc-pollen";
export const CFG_DIR = path.join(os.homedir(), ".config", APP);
export const CFG_FILE = path.join(CFG_DIR, "config.json");
export const CACHE_FILE = path.join(CFG_DIR, "cache.json");
const DEFAULT_TTL = 1800; // 30 min

export interface Config {
  cityPreset: string;
  citycode: string;
  cityName: string;
  lang: string;
  format: string;
  cacheTtl: number;
  color: boolean;
}

const DEFAULTS: Config = {
  cityPreset: "shinjuku",
  citycode: "13104",
  cityName: "新宿区",
  lang: "ja",
  format: "icon+level+city",
  cacheTtl: DEFAULT_TTL,
  color: true,
};

export function mkdirp(dir: string): void {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export function loadJSON<T = unknown>(p: string): T | undefined {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8")) as T;
  } catch (error) {
    if (process.env.DEBUG) {
      console.error(`[loadJSON] Failed to load ${p}:`, error);
    }
    return undefined;
  }
}

export function saveJSON<T>(p: string, data: T): void {
  mkdirp(path.dirname(p));
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
}

export function getConfig(): Config {
  const saved = loadJSON<Partial<Config>>(CFG_FILE);
  return saved ? { ...DEFAULTS, ...saved } : { ...DEFAULTS };
}

export function saveConfig(config: Config): void {
  saveJSON(CFG_FILE, config);
}

export interface CacheData {
  pollen?: PollenData;
  ts?: number;
}

export function getCache(): CacheData | undefined {
  const c = loadJSON<CacheData>(CACHE_FILE);
  if (!c || !c.ts) return undefined;
  const cfg = getConfig();
  if (Date.now() / 1000 - c.ts > (cfg.cacheTtl || DEFAULT_TTL)) return undefined;
  return c;
}

export function saveCache(data: { pollen: PollenData }): void {
  saveJSON<CacheData>(CACHE_FILE, { ...data, ts: Date.now() / 1000 });
}

