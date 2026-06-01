import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { motion } from "framer-motion";
import { getStockByTicker } from "../data/stocks";
import { BBSSection } from "../components/BBSSection";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function StockPage() {
  const params = useParams<{ ticker: string }>();
  const stock = getStockByTicker(params.ticker || "");

  if (!stock) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl text-destructive font-black mb-4 crt-glow-destructive">404 NOT FOUND</h1>
        <p className="text-muted-foreground">お探しのクソ株は上場廃止になったか、存在しません。</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="border border-border bg-card p-6 md:p-8 rounded-sm mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-8xl text-primary pointer-events-none">
            {stock.ticker}
          </div>
          
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-sm font-bold text-primary border border-primary px-2 py-0.5 bg-primary/10">
              {stock.rankLabel}
            </span>
            <Badge
              variant="outline"
              className={`text-sm px-2 py-0.5
                ${stock.statusColor === "red" ? "border-destructive text-destructive bg-destructive/10" : ""}
                ${stock.statusColor === "orange" ? "border-accent text-accent bg-accent/10" : ""}
                ${stock.statusColor === "purple" ? "border-secondary text-secondary bg-secondary/10" : ""}
              `}
            >
              {stock.status}
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
            {stock.company}
          </h1>
          <div className="text-xl text-muted-foreground font-mono mb-8">
            Code: {stock.ticker}
          </div>

          {stock.marginAlert && (
            <div className="bg-destructive/10 border border-destructive p-4 mb-8 rounded-sm flex items-start gap-3">
              <span className="text-destructive text-xl shrink-0 mt-0.5">☢</span>
              <div>
                <h4 className="font-bold text-destructive mb-1">追証アラート</h4>
                <p className="text-sm text-destructive/80">{stock.marginAlert}</p>
              </div>
            </div>
          )}

          <div className="mb-10">
            <h3 className="text-xl font-bold text-primary mb-4 crt-glow border-b border-border pb-2">
              なぜクソ株なのか？
            </h3>
            <p className="text-card-foreground leading-loose text-justify">
              {stock.roast}
            </p>
          </div>

          <div className="mb-10">
            <h3 className="text-xl font-bold text-accent mb-4 crt-glow border-b border-border pb-2">
              やらかし指数
            </h3>
            <div className="space-y-4">
              {stock.devastationMetrics.map((metric, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{metric.label}</span>
                    <span className="font-mono text-white">{metric.value} / {metric.maxValue}</span>
                  </div>
                  <Progress value={metric.value} className="h-2" indicatorClassName={
                    metric.value > 80 ? "bg-destructive" : metric.value > 50 ? "bg-accent" : "bg-primary"
                  } />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-3">公式やらかし開示資料リンク</h3>
            <ul className="space-y-2">
              {stock.disclosureLinks.map((link, i) => (
                <li key={i}>
                  <a href={link.href} className="text-sm text-primary hover:underline hover:text-white transition-colors flex items-center gap-2">
                    <span className="opacity-50">&gt;</span> {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <BBSSection ticker={stock.ticker} />
      </motion.div>
    </div>
  );
}
