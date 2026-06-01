import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { defaultStocks, Stock } from "@/data/stocks";
import { getAllVotedStocks, getVoteData, VoteData } from "@/lib/storage";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ThumbsDown, ThumbsUp } from "lucide-react";

export default function HomePage() {
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalDislikes, setTotalDislikes] = useState(0);
  const [topDisliked, setTopDisliked] = useState<(VoteData & { stock?: Stock })[]>([]);

  useEffect(() => {
    const allVotes = getAllVotedStocks();
    let likes = 0;
    let dislikes = 0;
    allVotes.forEach((v) => {
      likes += v.likes;
      dislikes += v.dislikes;
    });
    setTotalLikes(likes);
    setTotalDislikes(dislikes);

    const sortedDisliked = [...allVotes]
      .filter((v) => v.likes + v.dislikes >= 5)
      .sort((a, b) => {
        const aDislikePct = a.dislikes / (a.likes + a.dislikes);
        const bDislikePct = b.dislikes / (b.likes + b.dislikes);
        return bDislikePct - aDislikePct;
      })
      .slice(0, 5)
      .map((v) => ({
        ...v,
        stock: defaultStocks.find((s) => s.ticker === v.ticker),
      }));
    setTopDisliked(sortedDisliked);
  }, []);

  const total = totalLikes + totalDislikes;
  const likePct = total > 0 ? (totalLikes / total) * 100 : 50;
  const dislikePct = total > 0 ? (totalDislikes / total) * 100 : 50;

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="w-full py-20 bg-background flex flex-col items-center justify-center text-center px-4 border-b border-border">
        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">
          <span className="text-primary like-glow">好き</span> か <span className="text-secondary dislike-glow">嫌い</span> かで語る、
          <br className="md:hidden" />
          <span className="text-foreground mt-2 inline-block">日本株センチメント掲示板</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          「業績が～」「チャートが～」そんな御託はいい。お前はその銘柄を応援するのか？それとも売り叩くのか？
          完全匿名・ガチンコ対立型の株掲示板。
        </p>
      </section>

      {/* Global Sentiment */}
      <section className="w-full bg-card py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">現在の市場センチメント（全銘柄総計）</h2>
          <div className="flex w-full h-24 rounded-lg overflow-hidden border border-border shadow-2xl">
            <div
              className="bg-primary/20 flex flex-col items-center justify-center border-r border-primary/50 relative overflow-hidden group"
              style={{ width: `${likePct}%` }}
            >
              <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
              <ThumbsUp className="h-6 w-6 text-primary mb-1" />
              <span className="font-bold text-primary text-xl">{totalLikes.toLocaleString()}票</span>
            </div>
            <div
              className="bg-secondary/20 flex flex-col items-center justify-center relative overflow-hidden group"
              style={{ width: `${dislikePct}%` }}
            >
              <div className="absolute inset-0 bg-secondary/10 mix-blend-overlay"></div>
              <ThumbsDown className="h-6 w-6 text-secondary mb-1" />
              <span className="font-bold text-secondary text-xl">{totalDislikes.toLocaleString()}票</span>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Stocks Grid */}
      <section className="w-full py-16 container mx-auto px-4">
        <h2 className="text-3xl font-black mb-8 border-l-4 border-primary pl-4">人気銘柄</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {defaultStocks.map((stock, i) => {
            const v = getVoteData(stock.ticker);
            const tot = v.likes + v.dislikes;
            const lPct = tot > 0 ? (v.likes / tot) * 100 : 50;

            return (
              <motion.div
                key={stock.ticker}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Link href={`/stock/${stock.ticker}`}>
                  <Card className="hover:bg-accent transition-colors cursor-pointer h-full border-border hover:border-primary/50">
                    <CardContent className="p-5 flex flex-col h-full justify-between gap-4">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-mono text-muted-foreground text-sm">{stock.ticker}</span>
                          <span className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground">{stock.sector}</span>
                        </div>
                        <h3 className="font-bold text-lg truncate" title={stock.name}>
                          {stock.name}
                        </h3>
                      </div>
                      <div className="w-full">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-primary">{v.likes}</span>
                          <span className="text-secondary">{v.dislikes}</span>
                        </div>
                        <div className="w-full h-2 rounded-full overflow-hidden flex">
                          <div className="bg-primary h-full" style={{ width: `${lPct}%` }} />
                          <div className="bg-secondary h-full flex-1" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Top Disliked */}
      <section className="w-full py-16 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-black mb-8 border-l-4 border-secondary pl-4 text-secondary">
            嫌われ銘柄TOP5（ヘイト・ランキング）
          </h2>
          <div className="flex flex-col gap-4">
            {topDisliked.map((v, i) => {
              const dPct = (v.dislikes / (v.likes + v.dislikes)) * 100;
              return (
                <motion.div
                  key={v.ticker}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                >
                  <Link href={`/stock/${v.ticker}`}>
                    <div className="flex items-center gap-4 bg-background p-4 rounded-lg border border-border hover:border-secondary/50 transition-colors cursor-pointer group">
                      <div className="text-4xl font-black text-muted-foreground opacity-50 group-hover:text-secondary group-hover:opacity-100 transition-colors">
                        #{i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-mono text-sm text-muted-foreground">{v.ticker}</span>
                          <span className="font-bold text-lg">{v.stock?.name || "不明な銘柄"}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          総投票数: {v.likes + v.dislikes}票
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-black text-secondary">{dPct.toFixed(1)}%</div>
                        <div className="text-xs text-muted-foreground">嫌い率</div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
            {topDisliked.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                まだデータがありません。
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
