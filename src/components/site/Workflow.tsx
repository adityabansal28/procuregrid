import { ChevronRight } from "lucide-react";

const steps = [
  { n: "01", t: "Purchase Request", d: "Internal approvals routed automatically." },
  { n: "02", t: "RFQ", d: "Invite verified suppliers in one click." },
  { n: "03", t: "Compare Quotes", d: "Side-by-side price, lead-time, trust score." },
  { n: "04", t: "Purchase Order", d: "Generated with one signature." },
  { n: "05", t: "GRN & Invoice", d: "Goods receipt matched, invoice reconciled." },
  { n: "06", t: "Escrow Payment", d: "Released on milestone — no disputes." },
];

export function Workflow() {
  return (
    <section id="workflow" className="relative overflow-hidden bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary-glow">The workflow</div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
            From requisition to payment, on rails.
          </h2>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.n} className="relative rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
              <div className="flex items-start justify-between">
                <span className="text-sm font-mono font-semibold text-primary-glow">{s.n}</span>
                {i < steps.length - 1 && (
                  <ChevronRight className="h-5 w-5 text-muted-foreground/40" />
                )}
              </div>
              <h3 className="mt-3 text-lg font-semibold">{s.t}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
