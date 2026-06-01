import { Link } from "wouter";

export function NavBar() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-primary text-2xl">☢</span>
            <span className="font-black text-xl tracking-tight text-white crt-glow">クソ株ギャラクシー</span>
          </Link>
          <nav className="hidden md:flex gap-4">
            <Link href="/" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
              ランキング
            </Link>
            <Link href="/certificate" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
              被災証明書
            </Link>
          </nav>
        </div>
        <div className="hidden sm:block">
          <span className="text-xs font-mono text-primary animate-pulse border border-primary/30 px-2 py-1 bg-primary/10 rounded-sm crt-glow">
            今月の地獄行き特急券
          </span>
        </div>
      </div>
    </header>
  );
}
