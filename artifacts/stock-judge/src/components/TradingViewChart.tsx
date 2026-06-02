import { useEffect, useRef, useState } from "react";
import { createChart, ColorType, CandlestickSeries } from "lightweight-charts";

interface Props {
  ticker: string;
  height?: number;
}

interface OHLCBar {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

async function fetchStockData(ticker: string): Promise<OHLCBar[]> {
  const symbol = `${ticker}.T`;
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=6mo`;
  const proxy = `https://corsproxy.io/?url=${encodeURIComponent(url)}`;

  const res = await fetch(proxy);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();

  const result = json?.chart?.result?.[0];
  if (!result) throw new Error("No data");

  const timestamps: number[] = result.timestamp;
  const quote = result.indicators.quote[0];
  const { open, high, low, close } = quote;

  return timestamps
    .map((ts, i) => {
      if (open[i] == null || high[i] == null || low[i] == null || close[i] == null) return null;
      const date = new Date(ts * 1000);
      const y = date.getUTCFullYear();
      const m = String(date.getUTCMonth() + 1).padStart(2, "0");
      const d = String(date.getUTCDate()).padStart(2, "0");
      return {
        time: `${y}-${m}-${d}` as string,
        open: open[i],
        high: high[i],
        low: low[i],
        close: close[i],
      };
    })
    .filter(Boolean) as OHLCBar[];
}

export function TradingViewChart({ ticker, height = 450 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    setLoading(true);
    setError(null);

    // Create chart
    const chart = createChart(el, {
      layout: {
        background: { type: ColorType.Solid, color: "#0a0a0c" },
        textColor: "#9ca3af",
      },
      grid: {
        vertLines: { color: "#1f2937" },
        horzLines: { color: "#1f2937" },
      },
      width: el.clientWidth,
      height,
      timeScale: {
        borderColor: "#374151",
        timeVisible: true,
      },
      rightPriceScale: {
        borderColor: "#374151",
      },
      crosshair: {
        vertLine: { color: "#6b7280" },
        horzLine: { color: "#6b7280" },
      },
    });

    chartRef.current = chart;

    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#00f0ff",
      downColor: "#ff003c",
      borderUpColor: "#00f0ff",
      borderDownColor: "#ff003c",
      wickUpColor: "#00f0ff",
      wickDownColor: "#ff003c",
    });

    // Responsive resize
    const ro = new ResizeObserver(() => {
      chart.applyOptions({ width: el.clientWidth });
    });
    ro.observe(el);

    fetchStockData(ticker)
      .then((data) => {
        series.setData(data);
        chart.timeScale().fitContent();
        setLoading(false);
      })
      .catch((e) => {
        setError("チャートデータを取得できませんでした");
        setLoading(false);
      });

    return () => {
      ro.disconnect();
      chart.remove();
      chartRef.current = null;
    };
  }, [ticker, height]);

  return (
    <div
      className="w-full rounded-md overflow-hidden border border-border relative"
      style={{ height }}
    >
      <div ref={containerRef} className="w-full h-full" />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-card/80">
          <span className="text-muted-foreground text-sm animate-pulse">チャート読み込み中...</span>
        </div>
      )}
      {error && !loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-card/80">
          <span className="text-muted-foreground text-sm">{error}</span>
        </div>
      )}
    </div>
  );
}
