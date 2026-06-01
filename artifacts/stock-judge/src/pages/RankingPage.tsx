import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { defaultStocks, Stock } from "@/data/stocks";
import { getAllVotedStocks, getVoteData, VoteData } from "@/lib/storage";

type RankedStock = VoteData & { stock?: Stock; percent: number };

export default function RankingPage() {
  const [dislikedRanking, setDislikedRanking] = useState<RankedStock[]>([]);
  const [likedRanking, setLikedRanking] = useState<RankedStock[]>([]);

  useEffect(() => {
    // Seed data if none exists
    const existing = getAllVotedStocks();
    if (existing.length === 0) {
      defaultStocks.forEach((s) => {
        // Just calling getVoteData will seed it with random values
        getVoteData(s.ticker);
      });
    }

    const allVotes = getAllVotedStocks();
    
    // Sort logic
    const calcDislikePct = (v: VoteData) => v.dislikes / (v.likes + v.dislikes) * 100;
    const calcLikePct = (v: VoteData) => v.likes / (v.likes + v.dislikes) * 100;

    const mapWithStock = (v: VoteData, pct: number) => ({
      ...v,
      stock: defaultStocks.find(s => s.ticker === v.ticker),
      percent: pct
    });

    const disliked = [...allVotes]
      .filter(v => v.likes + v.dislikes >= 5)
      .map(v => mapWithStock(v, calcDislikePct(v)))
      .sort((a, b) => b.percent - a.percent);
      
    const liked = [...allVotes]
      .filter(v => v.likes + v.dislikes >= 5)
      .map(v => mapWithStock(v, calcLikePct(v)))
      .sort((a, b) => b.percent - a.percent);

    setDislikedRanking(disliked);
    setLikedRanking(liked);
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black mb-4 tracking-tighter">センチメント・ランキング</h1>
        <p className="text-muted-foreground">5票以上の銘柄のみ表示</p>
      </div>

      <Tabs defaultValue="disliked" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-14 mb-8 bg-card border border-border">
          <TabsTrigger value="disliked" className="text-lg font-bold data-[state=active]:bg-secondary/20 data-[state=active]:text-secondary transition-colors">
            嫌われ銘柄
          </TabsTrigger>
          <TabsTrigger value="liked" className="text-lg font-bold data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-colors">
            好かれ銘柄
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="disliked">
          <RankingList data={dislikedRanking} type="dislike" />
        </TabsContent>
        <TabsContent value="liked">
          <RankingList data={likedRanking} type="like" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RankingList({ data, type }: { data: RankedStock[], type: "like" | "dislike" }) {
  const isLike = type === "like";
  const colorClass = isLike ? "text-primary" : "text-secondary";
  const bgClass = isLike ? "bg-primary" : "bg-secondary";
  const hoverClass = isLike ? "hover:border-primary/50" : "hover:border-secondary/50";

  if (data.length === 0) {
    return <div className="text-center py-20 text-muted-foreground">データがありません。</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {data.map((item, index) => (
        <motion.div
          key={item.ticker}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Link href={`/stock/${item.ticker}`}>
            <div className={`flex items-center gap-4 bg-card p-4 md:p-6 rounded-lg border border-border transition-colors cursor-pointer group ${hoverClass}`}>
              <div className={`text-4xl md:text-5xl font-black text-muted-foreground opacity-30 group-hover:opacity-100 transition-opacity ${colorClass}`}>
                #{index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-mono text-sm text-muted-foreground">{item.ticker}</span>
                  <span className="font-bold text-lg md:text-xl truncate">{item.stock?.name || "不明な銘柄"}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">総票数: {item.likes + item.dislikes}</span>
                  <div className="flex-1 max-w-[200px] h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${bgClass}`} style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              </div>
              <div className="text-right pl-4">
                <div className={`text-3xl md:text-4xl font-black ${colorClass}`}>
                  {item.percent.toFixed(1)}%
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
