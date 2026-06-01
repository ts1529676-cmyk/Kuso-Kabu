import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { defaultStocks, Stock } from "@/data/stocks";
import { getAllVotedStocks, getVoteData, getFeaturedStock, VoteData } from "@/lib/storage";
import { Card, CardContent } from "@/components/ui/card";
import { ThumbsDown, ThumbsUp, Flame, ArrowRight, TrendingUp, TrendingDown } from "lucide-react";

interface FeaturedStock {
  vote: VoteData;
  stock?: Stock;
}

export default function HomePage() {
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalDislikes, setTotalDislikes] = useState(0);
  const [topDisliked, setTopDisliked] = useState<(VoteData & { stock?: Stock })[]>([]);
  const [featured, setFeatured] = useState<FeaturedStock | null>(null);

  useEffect(() => {
    // Ensure all default stocks have vote data in localStorage before reading aggregates
    defaultStocks.forEach((s) => getVoteData(s.ticker));

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

    const featuredVote = getFeaturedStock();
    if (featuredVote) {
      setFeatured({
        vote: featuredVote,
        stock: defaultStocks.find((s) => s.ticker === featuredVote.ticker),
      });
    }
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

      {/* Today's Featured Stock */}
      {featured && (
        <section className="w-full py-12 border-b border-border bg-background">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 mb-6">
              <Flame className="h-6 w-6 text-accent" style={{ color: "#ff8c00" }} />
              <h2 className="text-2xl font-black tracking-tight" style={{ color: "#ff8c00" }}>
                今日の注目銘柄
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full border font-mono ml-1"
                style={{ borderColor: "#ff8c00", color: "#ff8c00", background: "rgba(255,140,0,0.08)" }}>
                24h アクティブ
              </span>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Link href={`/stock/${featured.vote.ticker}`}>
                <div className="group relative rounded-xl border overflow-hidden cursor-pointer transition-all duration-200 hover:scale-[1.01]"
                  style={{ borderColor: "rgba(255,140,0,0.4)", background: "rgba(255,140,0,0.04)" }}>
                  {/* Animated glow bar at top */}
                  <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #00f0ff, #ff8c00, #ff003c)" }} />
                  <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
                    {/* Stock identity */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-sm px-2 py-1 rounded bg-muted text-muted-foreground">
                          {featured.vote.ticker}
                        </span>
                        {featured.stock?.sector && (
                          <span className="text-xs text-muted-foreground">{featured.stock.sector}</span>
                        )}
                      </div>
                      <h3 className="text-3xl font-black truncate mb-1">
                        {featured.stock?.name ?? featured.vote.ticker}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {featured.vote.voteCount24h
                          ? `過去24時間で ${featured.vote.voteCount24h} 票の動き — 今最も盛り上がっている銘柄`
                          : `現在最も投票数が多い注目銘柄`}
                      </p>
                    </div>

                    {/* Sentiment display */}
                    <div className="flex flex-col gap-3 min-w-[220px]">
                      {(() => {
                        const tot = featured.vote.likes + featured.vote.dislikes;
                        const lPct = tot > 0 ? (featured.vote.likes / tot) * 100 : 50;
                        const dPct = 100 - lPct;
                        const sentiment = lPct >= 50 ? "like" : "dislike";
                        return (
                          <>
                            <div className="flex items-center justify-between text-sm font-bold mb-1">
                              <span className="flex items-center gap-1 text-primary">
                                <TrendingUp className="h-4 w-4" />
                                好き {lPct.toFixed(1)}%
                              </span>
                              <span className="flex items-center gap-1 text-secondary">
                                嫌い {dPct.toFixed(1)}%
                                <TrendingDown className="h-4 w-4" />
                              </span>
                            </div>
                            <div className="w-full h-4 rounded-full overflow-hidden flex">
                              <div className="h-full transition-all duration-700"
                                style={{ width: `${lPct}%`, background: "hsl(186 100% 50%)" }} />
                              <div className="h-full flex-1"
                                style={{ background: "hsl(347 100% 50%)" }} />
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{featured.vote.likes.toLocaleString()} 票</span>
                              <span className="font-mono">{tot.toLocaleString()} 総票数</span>
                              <span>{featured.vote.dislikes.toLocaleString()} 票</span>
                            </div>
                            <div className="mt-1 text-center">
                              <span className="text-xs font-bold px-3 py-1 rounded-full"
                                style={sentiment === "like"
                                  ? { background: "rgba(0,240,255,0.12)", color: "#00f0ff", border: "1px solid rgba(0,240,255,0.3)" }
                                  : { background: "rgba(255,0,60,0.12)", color: "#ff003c", border: "1px solid rgba(255,0,60,0.3)" }}>
                                {sentiment === "like" ? "好き派優勢" : "嫌い派優勢"}
                              </span>
                            </div>
                          </>
                        );
                      })()}
                    </div>

                    {/* CTA arrow */}
                    <div className="flex items-center self-center">
                      <ArrowRight className="h-8 w-8 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

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
