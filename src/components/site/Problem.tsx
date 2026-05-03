import { FileSpreadsheet, MessageSquare, AlertTriangle, Clock, EyeOff, Banknote } from "lucide-react";

const pains = [
  { icon: FileSpreadsheet, title: "Excel-driven RFQs", desc: "Quotations scattered across spreadsheets and inboxes." },
  { icon: MessageSquare, title: "WhatsApp negotiations", desc: "No record, no audit trail, no accountability." },
  { icon: AlertTriangle, title: "Low supplier trust", desc: "No structured verification, frequent fraud and fakes." },
  { icon: Clock, title: "Delayed payments", desc: "Disputes drag on for weeks without resolution." },
  { icon: EyeOff, title: "Zero visibility", desc: "No supplier performance, no spend analytics." },
  { icon: Banknote, title: "Credit chaos", desc: "Buyers and suppliers fly blind on payment reliability." },
];

export function Problem() {
  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary-glow">The reality today</div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
            Industrial procurement in India is broken.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Manufacturers lose time, money and trust to a workflow held together by spreadsheets and goodwill.
          </p>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {pains.map((p) => (
            <div key={p.title} className="group bg-card p-7 transition-colors hover:bg-surface">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <p.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-base font-semibold">{p.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
