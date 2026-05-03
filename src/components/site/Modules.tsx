import { BadgeCheck, Workflow, Lock, Gauge, BarChart3, Network } from "lucide-react";

const modules = [
  {
    icon: BadgeCheck,
    title: "Supplier Verification",
    desc: "GST, PAN, factory inspection and video verification. Four trust tiers — Pending, Verified, Trusted, Strategic.",
  },
  {
    icon: Workflow,
    title: "Procurement Workflow",
    desc: "PR → RFQ → Quote → PO → Shipment → GRN → Invoice → Payment. One system of record, end to end.",
  },
  {
    icon: Lock,
    title: "Protected Transactions",
    desc: "Regulated escrow partner holds funds. 50% locked, terms flexible. Buyer and supplier both protected.",
  },
  {
    icon: Gauge,
    title: "Dynamic Trust Score",
    desc: "Delivery reliability, defect rate, repeat orders and disputes feed a live score that drives ranking and escrow %.",
  },
  {
    icon: BarChart3,
    title: "Procurement Analytics",
    desc: "Monthly spend, vendor concentration, category cost and supplier dependency — finally measurable.",
  },
  {
    icon: Network,
    title: "Credit Orchestration",
    desc: "Payment behavior tracked across the network. Plug into NBFC partners without becoming a lender.",
  },
];

export function Modules() {
  return (
    <section id="platform" className="bg-surface py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-widest text-primary-glow">The platform</div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
              Six modules. One procurement spine.
            </h2>
          </div>
          <p className="max-w-md text-base text-muted-foreground">
            Procurement-native. Manufacturing-focused. Built for SMEs and mid-sized factories — not enterprise IT departments.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => (
            <div
              key={m.title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-sm)] transition-all hover:-translate-y-1 hover:border-primary-glow/40 hover:shadow-[var(--shadow-lg)]"
            >
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[image:var(--gradient-accent)] opacity-0 blur-3xl transition-opacity group-hover:opacity-30" />
              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[image:var(--gradient-hero)] text-primary-foreground">
                  <m.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
