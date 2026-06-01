import { motion } from "framer-motion";
import { Link } from "wouter";
import { stocks } from "../data/stocks";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter text-primary crt-glow">
          ☢ KUSO-KABU GALAXY
        </h1>
        <h2 className="text-xl md:text-2xl font-bold text-muted-foreground mb-2">
          日本市場の地獄銘柄エンタメ格付けデータベース
        </h2>
        <div className="inline-block px-3 py-1 border border-primary/30 bg-primary/10 mt-4 rounded-sm animate-pulse">
          <span className="text-sm font-bold text-primary crt-glow">今月の地獄行き特急券</span>
        </div>
      </motion.div>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-16"
      >
        <div className="flex items-center gap-4 mb-8 border-b border-border pb-4">
          <div className="h-4 w-4 bg-primary rounded-sm animate-pulse" />
          <h3 className="text-2xl font-bold text-white tracking-widest crt-glow">月間クソ株ランキング</h3>
        </div>

        <div className="flex flex-col gap-4">
          {stocks.map((stock, i) => (
            <Link key={stock.ticker} href={`/stock/${stock.ticker}`}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="group relative bg-card border border-card-border p-4 md:p-6 rounded-sm hover:border-primary/50 transition-colors cursor-pointer"
              >
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 shrink-0 bg-black border border-primary flex items-center justify-center font-black text-xl text-primary crt-glow shadow-[0_0_10px_rgba(57,255,20,0.2)]">
                      {stock.rank}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-primary border border-primary px-1">
                          {stock.rankLabel}
                        </span>
                        <Badge
                          variant="outline"
                          className={`
                            ${stock.statusColor === "red" ? "border-destructive text-destructive" : ""}
                            ${stock.statusColor === "orange" ? "border-accent text-accent" : ""}
                            ${stock.statusColor === "purple" ? "border-secondary text-secondary" : ""}
                          `}
                        >
                          {stock.status}
                        </Badge>
                      </div>
                      <h4 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                        {stock.company} <span className="text-muted-foreground text-sm font-mono">{stock.ticker}</span>
                      </h4>
                    </div>
                  </div>
                  <div className="md:w-1/2">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {stock.summary}
                    </p>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-black border border-border p-6 rounded-sm"
      >
        <h3 className="text-lg font-bold text-white mb-2 crt-glow">このサイトについて</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          KUSO-KABU GALAXYは、日本市場において投資家に絶望と虚無を与えた銘柄を記録・保存するためのジョークサイトです。
          ここにある情報は事実に基づきつつも、エンターテインメントとして誇張されています。
          投資は自己責任ですが、笑うことは自由です。含み損を抱えた全ての同志に捧ぐ。
        </p>
      </motion.section>
    </div>
  );
}
