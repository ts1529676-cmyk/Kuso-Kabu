export function Footer() {
  return (
    <footer className="border-t border-border mt-20 py-8 bg-black">
      <div className="container mx-auto px-4 text-center">
        <p className="text-muted-foreground text-sm font-bold">
          このサイトはエンターテインメント目的であり、投資助言ではありません。
        </p>
        <p className="text-muted-foreground/50 text-xs mt-2 font-mono">
          &copy; {new Date().getFullYear()} KUSO-KABU GALAXY. All rights reversed.
        </p>
      </div>
    </footer>
  );
}
