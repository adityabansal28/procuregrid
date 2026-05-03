const stats = [
  { value: "12,400+", label: "Verified suppliers" },
  { value: "₹840Cr", label: "Procurement processed" },
  { value: "47", label: "Industrial categories" },
  { value: "99.2%", label: "On-time GRN match" },
];

export function Stats() {
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-surface px-6 py-8 text-center md:py-10">
            <div className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">{s.value}</div>
            <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
