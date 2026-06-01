export interface VoteData {
  ticker: string;
  likes: number;
  dislikes: number;
  userVote: "like" | "dislike" | null;
  lastVotedAt?: number; // unix ms — tracks most recent vote for activity ranking
  voteCount24h?: number; // rolling count of votes in the past 24h window
}

export interface BBSComment {
  id: string;
  ticker: string;
  side: "like" | "dislike";
  nickname: string;
  comment: string;
  timestamp: number;
  agrees: number;
  disagrees: number;
}

export function getVoteData(ticker: string): VoteData {
  const key = `sjvote_${ticker}`;
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      // ignore parse error
    }
  }
  
  // Seed random
  const defaultData: VoteData = {
    ticker,
    likes: Math.floor(Math.random() * 115) + 5,
    dislikes: Math.floor(Math.random() * 115) + 5,
    userVote: null
  };
  
  localStorage.setItem(key, JSON.stringify(defaultData));
  return defaultData;
}

export function castVote(ticker: string, vote: "like" | "dislike"): VoteData {
  const data = getVoteData(ticker);
  const now = Date.now();
  const window24h = 24 * 60 * 60 * 1000;

  if (data.userVote === vote) {
    // toggle off — remove vote, don't count as 24h activity
    data.userVote = null;
    if (vote === "like") data.likes = Math.max(0, data.likes - 1);
    else data.dislikes = Math.max(0, data.dislikes - 1);
  } else {
    // remove previous if switching sides
    if (data.userVote === "like") data.likes = Math.max(0, data.likes - 1);
    else if (data.userVote === "dislike") data.dislikes = Math.max(0, data.dislikes - 1);

    // add new vote
    data.userVote = vote;
    if (vote === "like") data.likes += 1;
    else data.dislikes += 1;

    // track 24h activity — bump counter and timestamp
    const isWithin24h = data.lastVotedAt && (now - data.lastVotedAt) < window24h;
    data.voteCount24h = isWithin24h ? (data.voteCount24h ?? 0) + 1 : 1;
    data.lastVotedAt = now;
  }

  localStorage.setItem(`sjvote_${ticker}`, JSON.stringify(data));
  return data;
}

export function getFeaturedStock(): VoteData | null {
  const now = Date.now();
  const window24h = 24 * 60 * 60 * 1000;
  const allVotes = getAllVotedStocks();
  if (allVotes.length === 0) return null;

  // Prefer stocks with recent vote activity in the past 24h
  const recent = allVotes.filter(
    (v) => v.lastVotedAt && now - v.lastVotedAt < window24h
  );

  const pool = recent.length > 0 ? recent : allVotes;

  // Sort by voteCount24h desc, then by total votes as tiebreaker
  return pool.sort((a, b) => {
    const a24 = a.voteCount24h ?? 0;
    const b24 = b.voteCount24h ?? 0;
    if (b24 !== a24) return b24 - a24;
    return (b.likes + b.dislikes) - (a.likes + a.dislikes);
  })[0] ?? null;
}

export function getComments(ticker: string): BBSComment[] {
  const key = `sjbbs_${ticker}`;
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch(e) {}
  }
  
  // Seed 4 example comments
  const now = Date.now();
  const seed: BBSComment[] = [
    { id: "1", ticker, side: "like", nickname: "名無しのホルダー", comment: "業績回復してるし、ここからが本番でしょ。握力試されてる。", timestamp: now - 1000 * 60 * 30, agrees: 12, disagrees: 2 },
    { id: "2", ticker, side: "dislike", nickname: "空売り職人", comment: "チャート完全に終わってる。どう見ても下落トレンド継続中。", timestamp: now - 1000 * 60 * 60 * 2, agrees: 8, disagrees: 15 },
    { id: "3", ticker, side: "like", nickname: "逆張りマン", comment: "この押し目は買い。機関の空売りも限界近いと思うけどね。", timestamp: now - 1000 * 60 * 60 * 5, agrees: 24, disagrees: 5 },
    { id: "4", ticker, side: "dislike", nickname: "逃げ遅れ", comment: "高値掴みしちゃった…もう無理。損切りします", timestamp: now - 1000 * 60 * 60 * 24, agrees: 5, disagrees: 40 },
  ];
  
  localStorage.setItem(key, JSON.stringify(seed));
  return seed;
}

export function addComment(ticker: string, side: "like" | "dislike", nickname: string, comment: string): BBSComment[] {
  const comments = getComments(ticker);
  const newComment: BBSComment = {
    id: Math.random().toString(36).substring(2, 9),
    ticker,
    side,
    nickname: nickname || (side === "like" ? "名無しのホルダー" : "名無しの売り豚"),
    comment,
    timestamp: Date.now(),
    agrees: 0,
    disagrees: 0
  };
  comments.unshift(newComment);
  localStorage.setItem(`sjbbs_${ticker}`, JSON.stringify(comments));
  return comments;
}

export function reactToComment(ticker: string, commentId: string, reaction: "agree" | "disagree"): BBSComment[] {
  const comments = getComments(ticker);
  const comment = comments.find(c => c.id === commentId);
  if (comment) {
    if (reaction === "agree") comment.agrees += 1;
    else comment.disagrees += 1;
    localStorage.setItem(`sjbbs_${ticker}`, JSON.stringify(comments));
  }
  return comments;
}

export function getAllVotedStocks(): VoteData[] {
  const results: VoteData[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("sjvote_")) {
      try {
        const data = JSON.parse(localStorage.getItem(key)!) as VoteData;
        if (data.likes + data.dislikes >= 5) {
          results.push(data);
        }
      } catch(e) {}
    }
  }
  return results;
}
