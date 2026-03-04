// City presets (5-digit municipal codes)
export interface CityDef {
  code: string;
  name: string;
}

export const CITIES = {
  chiyoda:   { code: "13101", name: "千代田区" },
  shinjuku:  { code: "13104", name: "新宿区" },
  shibuya:   { code: "13113", name: "渋谷区" },
  minato:    { code: "13103", name: "港区" },
  setagaya:  { code: "13112", name: "世田谷区" },
  shinagawa: { code: "13109", name: "品川区" },
  suginami:  { code: "13115", name: "杉並区" },
  nerima:    { code: "13120", name: "練馬区" },
  hachioji:  { code: "13201", name: "八王子市" },
  yokohama:  { code: "14103", name: "横浜市西区" },
  kawasaki:  { code: "14131", name: "川崎市川崎区" },
  saitama:   { code: "11101", name: "さいたま市西区" },
  chiba:     { code: "12101", name: "千葉市中央区" },
  osaka:     { code: "27127", name: "大阪市北区" },
  nagoya:    { code: "23109", name: "名古屋市中区" },
  fukuoka:   { code: "40132", name: "福岡市博多区" },
  sapporo:   { code: "01101", name: "札幌市中央区" },
  sendai:    { code: "04101", name: "仙台市青葉区" },
  hiroshima: { code: "34101", name: "広島市中区" },
  kyoto:     { code: "26104", name: "京都市中京区" },
  kobe:      { code: "28110", name: "神戸市中央区" },
} as const satisfies Record<string, CityDef>;

// Type guard to check if a string is a valid city key
export function isCityKey(key: string): key is keyof typeof CITIES {
  return key in CITIES;
}

