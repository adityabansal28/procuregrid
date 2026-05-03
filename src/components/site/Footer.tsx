import { Factory } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[image:var(--gradient-hero)] text-primary-foreground">
                <Factory className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold tracking-tight">ProcureGrid</span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Protected procurement infrastructure for Indian manufacturing.
            </p>
          </div>

          {[
            { h: "Platform", l: ["Suppliers", "Workflow", "Escrow", "Analytics"] },
            { h: "Company", l: ["About", "Pricing", "Careers", "Contact"] },
          ].map((c) => (
            <div key={c.h}>
              <div className="text-sm font-semibold">{c.h}</div>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {c.l.map((x) => (
                  <li key={x}><a href="#" className="hover:text-foreground">{x}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <div>© {new Date().getFullYear()} ProcureGrid Technologies Pvt. Ltd.</div>
          <div className="flex gap-5">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
