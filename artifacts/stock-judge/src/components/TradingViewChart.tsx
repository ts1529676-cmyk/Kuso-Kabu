import { useEffect, useRef } from "react";

declare global {
  interface Window {
    TradingView: any;
  }
}

interface Props {
  ticker: string;
  height?: number;
}

export function TradingViewChart({ ticker, height = 450 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";
    
    const scriptId = "tradingview-widget-script";
    
    const renderWidget = () => {
      if (window.TradingView && containerRef.current) {
        new window.TradingView.widget({
          autosize: true,
          symbol: `TSE:${ticker}`,
          interval: "D",
          timezone: "Asia/Tokyo",
          theme: "dark",
          style: "1",
          locale: "ja",
          enable_publishing: false,
          backgroundColor: "rgba(10, 10, 12, 1)",
          hide_side_toolbar: true,
          container_id: containerRef.current.id,
        });
      }
    };

    if (document.getElementById(scriptId)) {
      renderWidget();
    } else {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;
      script.onload = renderWidget;
      document.head.appendChild(script);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [ticker]);

  const uniqueId = `tv_chart_${ticker}_${Math.random().toString(36).substring(2,9)}`;

  return (
    <div className="w-full rounded-md overflow-hidden border border-border" style={{ height }}>
      <div id={uniqueId} ref={containerRef} className="w-full h-full" />
    </div>
  );
}
