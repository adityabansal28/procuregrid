import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Factory } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[image:var(--gradient-hero)] text-primary-foreground shadow-[var(--shadow-glow)]">
            <Factory className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">ProcureGrid</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#platform" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Platform</a>
          <a href="#workflow" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Workflow</a>
          <a href="#trust" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Trust Layer</a>
          <a href="#pricing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Pricing</a>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Sign in</Button>
          <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90">Request demo</Button>
        </div>
      </div>
    </header>
  );
}
