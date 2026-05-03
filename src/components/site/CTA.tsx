import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section id="pricing" className="bg-background py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-[image:var(--gradient-hero)] p-10 text-center text-primary-foreground shadow-[var(--shadow-lg)] md:p-16">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_oklch(0.55_0.18_250_/_0.5),_transparent_60%)]" />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
              Run procurement like infrastructure.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/75">
              Flexible plans for every buyer and seller. Verification, escrow and analytics included on every tier.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Book a 20-min demo
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/25 bg-white/5 text-white backdrop-blur hover:bg-white/10 hover:text-white">
                Talk to sales
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
