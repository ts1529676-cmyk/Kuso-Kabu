import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Search, SearchIcon } from "lucide-react";
import { searchStocks, Stock } from "@/data/stocks";
import { Input } from "@/components/ui/input";

export function NavBar() {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Stock[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query) {
      setResults(searchStocks(query));
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (ticker: string) => {
    setLocation(`/stock/${ticker}`);
    setIsOpen(false);
    setQuery("");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query) {
      // Just navigate to whatever query it is
      const ticker = query.toUpperCase();
      handleSelect(ticker);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-black tracking-tighter" data-testid="link-home">
          <span className="text-secondary drop-shadow-[0_0_8px_rgba(255,0,60,0.5)]">クソ株</span>
          <span className="text-foreground">.com</span>
        </Link>

        <div className="flex-1 max-w-md mx-4 relative" ref={wrapperRef}>
          <form onSubmit={handleSearchSubmit} className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="銘柄コードや企業名で検索..."
              className="w-full bg-input pl-9 border-none focus-visible:ring-primary"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query && setIsOpen(true)}
              data-testid="input-search"
            />
          </form>

          {isOpen && (
            <div className="absolute top-full left-0 w-full mt-1 bg-popover border border-popover-border rounded-md shadow-xl overflow-hidden z-50">
              {results.length > 0 ? (
                <ul className="py-1">
                  {results.map((stock) => (
                    <li key={stock.ticker}>
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-muted text-sm flex justify-between items-center transition-colors"
                        onClick={() => handleSelect(stock.ticker)}
                        data-testid={`button-search-result-${stock.ticker}`}
                      >
                        <span className="font-mono text-muted-foreground">{stock.ticker}</span>
                        <span className="font-bold text-foreground truncate ml-2">{stock.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                query && (
                  <button
                    className="w-full text-left px-4 py-3 hover:bg-muted text-sm text-muted-foreground"
                    onClick={() => handleSelect(query.toUpperCase())}
                  >
                    「{query}」を検索
                  </button>
                )
              )}
            </div>
          )}
        </div>

        <nav>
          <Link href="/ranking" className="text-sm font-bold text-foreground hover:text-primary transition-colors" data-testid="link-ranking">
            ランキング
          </Link>
        </nav>
      </div>
    </header>
  );
}
