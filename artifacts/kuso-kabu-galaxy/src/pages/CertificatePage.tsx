import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const certSchema = z.object({
  ticker: z.string().min(1, "入力してください"),
  company: z.string().min(1, "入力してください"),
  lossAmount: z.coerce.number().min(1, "入力してください"),
  duration: z.string().min(1, "入力してください"),
  damage: z.string().min(1, "選択してください"),
});

export default function CertificatePage() {
  const { toast } = useToast();
  const [certNum] = useState(() => `KUSO-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`);
  const certRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof certSchema>>({
    resolver: zodResolver(certSchema),
    defaultValues: {
      ticker: "3681",
      company: "ブイキューブ",
      lossAmount: 1000000,
      duration: "3年",
      damage: "重傷",
    },
  });

  const values = form.watch();

  const handleCopy = () => {
    const text = `クソ株被災証明書 [${certNum}]\n銘柄: ${values.company} (${values.ticker})\n損失額: ${values.lossAmount.toLocaleString()}円\nダメージ: ${values.damage}\n\n☢KUSO-KABU GALAXYで発行☢\nhttps://kuso-kabu.example.com`;
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "コピーしました",
        description: "クリップボードに証明書テキストをコピーしました。",
      });
    });
  };

  const shareText = encodeURIComponent(`クソ株被災証明書を発行しました。\n銘柄: ${values.company}\n損失額: ${values.lossAmount.toLocaleString()}円\n#クソ株ギャラクシー\n`);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white crt-glow mb-2">クソ株被災証明書ジェネレーター</h1>
          <p className="text-muted-foreground">あなたの痛みを形にして、世界にシェアしましょう。</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="bg-card border border-border p-6 rounded-sm">
            <Form {...form}>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="ticker"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>銘柄コード</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-input" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>銘柄名</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-input" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="lossAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>損失金額 (円)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="bg-input font-mono" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>保有期間 (例: 3ヶ月、2年)</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-input" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="damage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>心の傷</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-input">
                            <SelectValue placeholder="選択してください" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="軽傷">軽傷 (かすり傷)</SelectItem>
                          <SelectItem value="中傷">中傷 (眠れない)</SelectItem>
                          <SelectItem value="重傷">重傷 (ご飯の味がしない)</SelectItem>
                          <SelectItem value="瀕死">瀕死 (息が苦しい)</SelectItem>
                          <SelectItem value="廃人">廃人 (もう何も感じない)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>

          <div className="flex flex-col gap-4">
            <div 
              ref={certRef}
              className="bg-[#f4f4f0] text-black p-8 border-8 border-double border-gray-400 relative overflow-hidden transform-gpu"
              style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.02) 10px, rgba(0,0,0,0.02) 20px)'
              }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl text-red-500/10 font-serif font-black rotate-[-30deg] pointer-events-none whitespace-nowrap">
                VOID
              </div>
              
              <div className="text-right text-sm font-mono text-gray-500 mb-4">
                証番: {certNum}
              </div>
              
              <h2 className="text-3xl font-black text-center mb-8 border-b-2 border-black pb-4 tracking-[0.5em] ml-[0.5em]">
                クソ株被災証明書
              </h2>
              
              <div className="space-y-6 text-lg">
                <div className="flex justify-between border-b border-gray-300 pb-1">
                  <span className="font-bold text-gray-600">被災銘柄:</span>
                  <span className="font-bold">{values.company || '未入力'} ({values.ticker || '----'})</span>
                </div>
                
                <div className="flex justify-between border-b border-gray-300 pb-1">
                  <span className="font-bold text-gray-600">損失金額:</span>
                  <span className="font-bold font-mono text-red-700">
                    -{Number(values.lossAmount || 0).toLocaleString()}円
                  </span>
                </div>
                
                <div className="flex justify-between border-b border-gray-300 pb-1">
                  <span className="font-bold text-gray-600">拘束期間:</span>
                  <span className="font-bold">{values.duration || '未入力'}</span>
                </div>
                
                <div className="flex justify-between border-b border-gray-300 pb-1">
                  <span className="font-bold text-gray-600">被災状況:</span>
                  <span className="font-bold text-xl">{values.damage || '未入力'}</span>
                </div>
              </div>
              
              <div className="mt-8 text-sm leading-relaxed text-justify text-gray-700">
                上記の者は、表記の銘柄において多大なる精神的・経済的苦痛を受けたことをここに証明する。
                この絶望をバネに、明日はストップ高を引けるよう祈念する。
              </div>
              
              <div className="mt-8 flex justify-between items-end">
                <div>
                  <div className="text-sm">発行日: {new Date().toLocaleDateString('ja-JP')}</div>
                  <div className="text-xs text-gray-500 mt-2">※この証明書はジョークです。</div>
                </div>
                <div className="relative w-20 h-20 border-4 border-red-600 rounded-full flex items-center justify-center text-red-600 font-black text-xl rotate-[-15deg] opacity-80 mix-blend-multiply">
                  公認
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={handleCopy} variant="outline" className="flex-1 font-bold">
                コピーする
              </Button>
              <Button asChild className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold">
                <a href={`https://twitter.com/intent/tweet?text=${shareText}`} target="_blank" rel="noopener noreferrer">
                  Xでシェア
                </a>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
