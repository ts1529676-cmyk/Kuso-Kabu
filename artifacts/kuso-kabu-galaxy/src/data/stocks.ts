export interface Stock {
  ticker: string;
  company: string;
  status: string;
  statusColor: "red" | "orange" | "purple" | "yellow";
  rank: number;
  rankLabel: string;
  summary: string;
  roast: string;
  devastationMetrics: { label: string; value: number; maxValue: number }[];
  disclosureLinks: { label: string; href: string }[];
  marginAlert: string | null;
}

export const stocks: Stock[] = [
  {
    ticker: "205A",
    company: "ロゴスホールディングス",
    status: "爆速上場ゴール",
    statusColor: "red",
    rank: 1,
    rankLabel: "クソ株大賞",
    summary: "上場後わずか数ヶ月で「営業利益58%減」「配当3分の1へ減配」を達成した上場ゴール界のお手本。",
    roast: "2024年末に華々しく上場したかと思えば、わずか数ヶ月後の2025年1月に「営業利益58%減」「配当約3分の1へ減配」という、お手本のような爆速「上場ゴール」を達成。上場前に誰よりも早く逃げた創業者を讃えよ。個人投資家の期待値と株価を奈落の底へ突き落とした2024-25年度最優秀やらかし銘柄。「夢と資金を一緒に燃やす」新しい資産運用の形がここに。",
    devastationMetrics: [
      { label: "希薄化リスク", value: 55, maxValue: 100 },
      { label: "情報開示透明度（低いほど危険）", value: 15, maxValue: 100 },
      { label: "株価暴落率", value: 82, maxValue: 100 },
      { label: "上場ゴール疑惑度", value: 95, maxValue: 100 },
      { label: "個人投資家への被害度", value: 88, maxValue: 100 },
    ],
    disclosureLinks: [
      { label: "2025年1月 業績下方修正・配当修正リリース（EDINET）", href: "#" },
      { label: "IPO目論見書（金融庁EDINET）", href: "#" },
    ],
    marginAlert: "信用買い残が高水準。追証祭り発生リスク：高。信用取引は自己責任でどうぞ。",
  },
  {
    ticker: "3681",
    company: "ブイキューブ",
    status: "上場廃止確定",
    statusColor: "red",
    rank: 2,
    rankLabel: "準大賞",
    summary: "2026年6月26日上場廃止確定。取締役会無承認融資、意見不表明、最終スクイーズアウト価格1株10円。",
    roast: "取締役会無承認の融資トラブルという古典的かつ圧倒的な「なんでそんなことしたの？」案件を引き起こし、監査法人からの意見不表明（= ガチで決算信用できません宣言）、債務超過を経て、ついに2026年6月26日の上場廃止（整理銘柄）が確定。最終スクイーズアウト価格は驚愕の「1株10円」へ大幅減額。かつてウェブ会議SaaSとして輝いていた頃の面影は跡形もない。10円という数字が全てを語る。",
    devastationMetrics: [
      { label: "希薄化リスク", value: 10, maxValue: 100 },
      { label: "情報開示透明度（低いほど危険）", value: 5, maxValue: 100 },
      { label: "株価暴落率", value: 99, maxValue: 100 },
      { label: "経営陣ガバナンス崩壊度", value: 100, maxValue: 100 },
      { label: "個人投資家への被害度", value: 97, maxValue: 100 },
    ],
    disclosureLinks: [
      { label: "上場廃止決定開示（東証）", href: "#" },
      { label: "監査法人意見不表明 開示資料（EDINET）", href: "#" },
      { label: "スクイーズアウト価格修正プレスリリース", href: "#" },
    ],
    marginAlert: "整理銘柄指定済み。信用取引不可。現物のみ。祈りは自由です。",
  },
  {
    ticker: "9229",
    company: "サンウェルズ",
    status: "不正請求疑惑",
    statusColor: "orange",
    rank: 3,
    rankLabel: "殊勲賞（最速奈落転落）",
    summary: "介護・ヘルスケアの優等生から一転、不正請求疑惑で第三者委員会設置。株価は天空から地底へワープ。",
    roast: "介護・ヘルスケアセクターの優良株として機関投資家に愛されていた存在が、突突如として不正請求疑惑という爆弾を抱えて急落。第三者委員会の設置と決算発表延期を連発し、開示遅延という追加コンボを決める。株価チャートが「富士山の逆」を描いており、かつて高値を掴んだ投資家は今頃何を思うのか。ヘルスケア株という信頼を逆手に取った、ある意味で最も裏切り感の強い案件。",
    devastationMetrics: [
      { label: "希薄化リスク", value: 40, maxValue: 100 },
      { label: "情報開示透明度（低いほど危険）", value: 8, maxValue: 100 },
      { label: "株価暴落率", value: 78, maxValue: 100 },
      { label: "不正疑惑スコア", value: 90, maxValue: 100 },
      { label: "個人投資家への被害度", value: 75, maxValue: 100 },
    ],
    disclosureLinks: [
      { label: "第三者委員会設置プレスリリース", href: "#" },
      { label: "決算延期通知（EDINET）", href: "#" },
    ],
    marginAlert: null,
  },
  {
    ticker: "3350",
    company: "メタプラネット",
    status: "MSワラント砲炸裂",
    statusColor: "purple",
    rank: 4,
    rankLabel: "特別賞（希薄化創造大賞）",
    summary: "万年赤字ボロ株が「アジア版マイクロストラテジー」を自称しBTC爆買い。株価10倍も、その裏にMSワラントの深淵が。",
    roast: "万年赤字のボロ株から「アジア版マイクロストラテジー」を自称してビットコインを買い漁り、株価が140円台から3,000円超へ大暴騰という奇跡を演出。しかし光あるところに影あり。その裏では個人投資家への凄まじい「MSワラント（行使価額修正条項付新株予約権）」による大規模希薄化が着々と進行中。ビットコインを買うために個人株主の持分を削り続けるという、現代金融工学の賜物がここに。夢と希薄化を同時に提供するエンタメ銘柄。",
    devastationMetrics: [
      { label: "希薄化リスク", value: 98, maxValue: 100 },
      { label: "情報開示透明度（低いほど危険）", value: 35, maxValue: 100 },
      { label: "株価ボラティリティ", value: 95, maxValue: 100 },
      { label: "MSワラント爆弾度", value: 100, maxValue: 100 },
      { label: "個人投資家への被害度", value: 70, maxValue: 100 },
    ],
    disclosureLinks: [
      { label: "MSワラント発行プレスリリース（EDINET）", href: "#" },
      { label: "BTC購入関連開示資料", href: "#" },
    ],
    marginAlert: "MSワラント行使による希薄化継続中。保有株式の価値が静かに溶けていきます。",
  },
];

export const getStockByTicker = (ticker: string): Stock | undefined =>
  stocks.find((s) => s.ticker === ticker);
