export interface Stock {
  ticker: string;
  name: string;
  sector: string;
}

export const defaultStocks: Stock[] = [
  { ticker: "3350", name: "メタプラネット", sector: "情報・通信業" },
  { ticker: "3681", name: "ブイキューブ", sector: "情報・通信業" },
  { ticker: "9229", name: "サンウェルズ", sector: "サービス業" },
  { ticker: "205A", name: "ロゴスホールディングス", sector: "不動産業" },
  { ticker: "3778", name: "さくらインターネット", sector: "情報・通信業" },
  { ticker: "7203", name: "トヨタ自動車", sector: "輸送用機器" },
  { ticker: "6758", name: "ソニーグループ", sector: "電気機器" },
  { ticker: "9984", name: "ソフトバンクグループ", sector: "情報・通信業" },
  { ticker: "4258", name: "網屋", sector: "情報・通信業" },
  { ticker: "6501", name: "日立製作所", sector: "電気機器" },
  { ticker: "8306", name: "三菱UFJフィナンシャル", sector: "銀行業" },
  { ticker: "9432", name: "日本電信電話", sector: "情報・通信業" },
  { ticker: "4755", name: "楽天グループ", sector: "サービス業" },
  { ticker: "2413", name: "エムスリー", sector: "サービス業" },
  { ticker: "6098", name: "リクルートホールディングス", sector: "サービス業" },
  { ticker: "7974", name: "任天堂", sector: "その他製品" },
  { ticker: "6702", name: "富士通", sector: "電気機器" },
  { ticker: "8035", name: "東京エレクトロン", sector: "電気機器" },
  { ticker: "4523", name: "エーザイ", sector: "医薬品" },
  { ticker: "3994", name: "マネーフォワード", sector: "情報・通信業" },
];

export function getStockByTicker(ticker: string): Stock | undefined {
  return defaultStocks.find(s => s.ticker === ticker);
}

export function searchStocks(query: string): Stock[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];
  
  return defaultStocks
    .filter(s => s.ticker.toLowerCase().includes(normalized) || s.name.toLowerCase().includes(normalized))
    .slice(0, 8);
}
