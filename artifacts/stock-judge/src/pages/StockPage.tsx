import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { getStockByTicker, defaultStocks } from "@/data/stocks";
import { getVoteData, castVote, VoteData, getComments, addComment, reactToComment, BBSComment } from "@/lib/storage";
import { TradingViewChart } from "@/components/TradingViewChart";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export default function StockPage() {
  const { ticker } = useParams();
  const [stockInfo, setStockInfo] = useState<{ name: string; sector: string; ticker: string } | null>(null);
  const [voteData, setVoteData] = useState<VoteData | null>(null);
  const [comments, setComments] = useState<BBSComment[]>([]);

  const [nickname, setNickname] = useState("");
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (!ticker) return;
    
    // Find stock info
    const info = getStockByTicker(ticker);
    if (info) {
      setStockInfo(info);
    } else {
      // Fallback for custom search
      setStockInfo({ name: `銘柄 ${ticker}`, sector: "不明", ticker });
    }

    // Load data
    setVoteData(getVoteData(ticker));
    setComments(getComments(ticker));
    
  }, [ticker]);

  if (!ticker || !stockInfo || !voteData) return null;

  const totalVotes = voteData.likes + voteData.dislikes;
  const likePct = totalVotes > 0 ? (voteData.likes / totalVotes) * 100 : 50;
  const dislikePct = totalVotes > 0 ? (voteData.dislikes / totalVotes) * 100 : 50;

  const handleVote = (side: "like" | "dislike") => {
    const updated = castVote(ticker, side);
    setVoteData(updated);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !voteData.userVote) return;
    
    const updatedComments = addComment(ticker, voteData.userVote, nickname.trim(), commentText.trim());
    setComments(updatedComments);
    setCommentText("");
    // don't clear nickname so they can post again
  };

  const handleReaction = (commentId: string, reaction: "agree" | "disagree") => {
    const updatedComments = reactToComment(ticker, commentId, reaction);
    setComments(updatedComments);
  };

  const likeComments = comments.filter(c => c.side === "like");
  const dislikeComments = comments.filter(c => c.side === "dislike");

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end gap-4">
        <h1 className="text-4xl md:text-5xl font-black">{stockInfo.name}</h1>
        <div className="flex gap-2 items-center">
          <span className="font-mono text-xl text-muted-foreground bg-muted px-3 py-1 rounded-md">{stockInfo.ticker}</span>
          <span className="text-sm bg-card border border-border px-3 py-1 rounded-md">{stockInfo.sector}</span>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-12">
        <TradingViewChart ticker={ticker} />
      </div>

      {/* Voting Section */}
      <section className="mb-16">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <Button
            variant="outline"
            className={`flex-1 h-32 text-2xl font-black transition-all duration-300 border-2 ${
              voteData.userVote === "like" 
                ? "border-primary text-primary like-glow bg-primary/10" 
                : voteData.userVote === "dislike"
                  ? "opacity-50 grayscale"
                  : "hover:border-primary hover:text-primary hover:bg-primary/5"
            }`}
            onClick={() => handleVote("like")}
            data-testid="button-vote-like"
          >
            <div className="flex flex-col items-center gap-2">
              <ThumbsUp className="w-8 h-8" />
              <span>好き（応援・買い目線）</span>
              {voteData.userVote === "like" && <span className="text-xs font-normal opacity-70">クリックで取り消し</span>}
            </div>
          </Button>
          
          <Button
            variant="outline"
            className={`flex-1 h-32 text-2xl font-black transition-all duration-300 border-2 ${
              voteData.userVote === "dislike" 
                ? "border-secondary text-secondary dislike-glow bg-secondary/10" 
                : voteData.userVote === "like"
                  ? "opacity-50 grayscale"
                  : "hover:border-secondary hover:text-secondary hover:bg-secondary/5"
            }`}
            onClick={() => handleVote("dislike")}
            data-testid="button-vote-dislike"
          >
            <div className="flex flex-col items-center gap-2">
              <ThumbsDown className="w-8 h-8" />
              <span>嫌い（批判・売り目線）</span>
              {voteData.userVote === "dislike" && <span className="text-xs font-normal opacity-70">クリックで取り消し</span>}
            </div>
          </Button>
        </div>
        
        <div className="w-full bg-muted h-6 rounded-full overflow-hidden flex mb-2 relative">
          <div className="bg-primary h-full transition-all duration-500" style={{ width: `${likePct}%` }} />
          <div className="bg-secondary h-full transition-all duration-500 flex-1" />
          <div className="absolute inset-0 flex items-center justify-between px-4 font-mono text-xs font-bold pointer-events-none drop-shadow-md">
            <span>{likePct.toFixed(1)}%</span>
            <span>{dislikePct.toFixed(1)}%</span>
          </div>
        </div>
        
        <div className="text-center text-sm font-mono text-muted-foreground">
          好き: {voteData.likes}票　|　嫌い: {voteData.dislikes}票　|　合計: {totalVotes}票
        </div>
      </section>

      {/* BBS Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-black mb-8 text-center border-b border-border pb-4">
          対立掲示板：ガチンコ株論
        </h2>
        
        {!voteData.userVote ? (
          <div className="bg-card border border-border p-8 rounded-lg text-center max-w-md mx-auto">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-bold mb-2">投票してから書き込もう</h3>
            <p className="text-muted-foreground text-sm">
              書き込みや閲覧をする前に、まずはあなたのポジション（好き/嫌い）を明確にしてください。
            </p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* LIKE COLUMN */}
            <div className="flex-1 flex flex-col">
              <div className="bg-primary/10 border-b-2 border-primary p-4 mb-4 rounded-t-lg">
                <h3 className="text-xl font-black text-primary text-center">好き派の主張（ロング軍）</h3>
              </div>
              
              {voteData.userVote === "like" && (
                <form onSubmit={handlePostComment} className="mb-6 bg-card p-4 rounded-lg border border-border">
                  <Input 
                    placeholder="名無しのホルダー" 
                    className="mb-2" 
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  />
                  <Textarea 
                    placeholder="この銘柄の良さを語れ..." 
                    className="mb-2 resize-none" 
                    rows={3}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    required
                  />
                  <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">書き込む</Button>
                </form>
              )}
              
              <div className="flex flex-col gap-4">
                {likeComments.map(c => (
                  <CommentCard key={c.id} comment={c} onReaction={handleReaction} />
                ))}
                {likeComments.length === 0 && <p className="text-muted-foreground text-center py-8">まだ書き込みがありません</p>}
              </div>
            </div>

            {/* DISLIKE COLUMN */}
            <div className="flex-1 flex flex-col">
              <div className="bg-secondary/10 border-b-2 border-secondary p-4 mb-4 rounded-t-lg">
                <h3 className="text-xl font-black text-secondary text-center">嫌い派の主張（ショート軍）</h3>
              </div>
              
              {voteData.userVote === "dislike" && (
                <form onSubmit={handlePostComment} className="mb-6 bg-card p-4 rounded-lg border border-border">
                  <Input 
                    placeholder="名無しの売り豚" 
                    className="mb-2" 
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  />
                  <Textarea 
                    placeholder="この銘柄のダメなところを語れ..." 
                    className="mb-2 resize-none" 
                    rows={3}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    required
                  />
                  <Button type="submit" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">書き込む</Button>
                </form>
              )}
              
              <div className="flex flex-col gap-4">
                {dislikeComments.map(c => (
                  <CommentCard key={c.id} comment={c} onReaction={handleReaction} />
                ))}
                {dislikeComments.length === 0 && <p className="text-muted-foreground text-center py-8">まだ書き込みがありません</p>}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function CommentCard({ comment, onReaction }: { comment: BBSComment, onReaction: (id: string, r: "agree"|"disagree")=>void }) {
  const isLike = comment.side === "like";
  return (
    <div className={`bg-card p-4 rounded-lg border-l-4 border-y border-r border-border ${isLike ? "border-l-primary" : "border-l-secondary"}`}>
      <div className="flex justify-between items-baseline mb-2">
        <span className="font-bold text-sm text-foreground/90">{comment.nickname}</span>
        <span className="text-xs text-muted-foreground">{formatDistanceToNow(comment.timestamp, { addSuffix: true, locale: ja })}</span>
      </div>
      <p className="text-sm whitespace-pre-wrap mb-4 text-foreground/80">{comment.comment}</p>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" className="h-8 text-xs px-2" onClick={() => onReaction(comment.id, "agree")}>
          👍 {comment.agrees}
        </Button>
        <Button variant="ghost" size="sm" className="h-8 text-xs px-2" onClick={() => onReaction(comment.id, "disagree")}>
          👎 {comment.disagrees}
        </Button>
      </div>
    </div>
  );
}
