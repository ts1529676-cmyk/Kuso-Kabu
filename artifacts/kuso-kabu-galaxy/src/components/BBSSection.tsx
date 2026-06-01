import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { motion, AnimatePresence } from "framer-motion";

interface BBSComment {
  id: string;
  nickname: string;
  entryPrice: number;
  comment: string;
  timestamp: number;
  likes: number;
  sads: number;
}

const formSchema = z.object({
  nickname: z.string().min(1, "必須項目です").max(20, "20文字以内で入力してください"),
  entryPrice: z.coerce.number().min(1, "1以上を入力してください"),
  comment: z.string().min(1, "懺悔を入力してください").max(500, "500文字以内で入力してください"),
});

const getSeedComments = (ticker: string): BBSComment[] => [
  {
    id: `seed-1-${ticker}`,
    nickname: "ナイアガラの滝壺",
    entryPrice: 1500,
    comment: "信じてホールドしてたのに起きたらS安貼り付きとかマジで草も生えない。",
    timestamp: Date.now() - 86400000 * 2,
    likes: 12,
    sads: 45,
  },
  {
    id: `seed-2-${ticker}`,
    nickname: "追証マン",
    entryPrice: 2800,
    comment: "ナンピンからのナンピンでついに死が見えました。さようなら。",
    timestamp: Date.now() - 3600000 * 5,
    likes: 88,
    sads: 2,
  }
];

export function BBSSection({ ticker }: { ticker: string }) {
  const [comments, setComments] = useState<BBSComment[]>([]);
  const storageKey = `kuso_bbs_${ticker}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setComments(JSON.parse(saved));
    } else {
      const seeds = getSeedComments(ticker);
      setComments(seeds);
      localStorage.setItem(storageKey, JSON.stringify(seeds));
    }
  }, [ticker, storageKey]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickname: "名無しの含み損",
      entryPrice: 0,
      comment: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const newComment: BBSComment = {
      id: Math.random().toString(36).substring(7),
      nickname: values.nickname,
      entryPrice: values.entryPrice,
      comment: values.comment,
      timestamp: Date.now(),
      likes: 0,
      sads: 0,
    };
    const updated = [newComment, ...comments];
    setComments(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    form.reset({ ...values, comment: "" });
  };

  const handleReaction = (id: string, type: "likes" | "sads") => {
    const updated = comments.map(c => {
      if (c.id === id) {
        return { ...c, [type]: c[type] + 1 };
      }
      return c;
    });
    setComments(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  return (
    <div className="bg-black border border-border p-6 rounded-sm mt-8">
      <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
        <span className="text-secondary text-2xl">✝</span>
        <h2 className="text-2xl font-bold text-white crt-glow">お祈りホルダー達の懺悔室</h2>
      </div>

      <div className="mb-8 p-4 border border-border bg-card">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nickname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ニックネーム</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-input border-border focus-visible:ring-primary" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="entryPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>平均取得単価 (円)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="bg-input border-border focus-visible:ring-primary font-mono" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>懺悔の書き込み</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="例: もう許してください" 
                      className="bg-input border-border focus-visible:ring-primary min-h-[100px] resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/80 font-bold">
              懺悔する
            </Button>
          </form>
        </Form>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="border border-border bg-card p-4 rounded-sm"
            >
              <div className="flex justify-between items-start mb-2 border-b border-border/50 pb-2">
                <div>
                  <span className="font-bold text-white mr-2">{comment.nickname}</span>
                  <span className="text-xs text-muted-foreground font-mono">@ {comment.entryPrice.toLocaleString()}円</span>
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  {new Date(comment.timestamp).toLocaleString("ja-JP")}
                </span>
              </div>
              <p className="text-card-foreground text-sm leading-relaxed mb-4 whitespace-pre-wrap">
                {comment.comment}
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-xs border-primary/50 hover:bg-primary/20 hover:text-primary"
                  onClick={() => handleReaction(comment.id, "likes")}
                >
                  いいね（慰める） <span className="ml-1 font-mono">{comment.likes}</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-xs border-destructive/50 hover:bg-destructive/20 hover:text-destructive"
                  onClick={() => handleReaction(comment.id, "sads")}
                >
                  悲しいね（自業自得） <span className="ml-1 font-mono">{comment.sads}</span>
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
