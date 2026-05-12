import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Building2, LoaderCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export const Route = createFileRoute("/onboarding/company")({
  component: CompanyOnboardingPage,
});

function withTimeout<T>(promise: Promise<T>, ms: number, message: string) {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      reject(new Error(message));
    }, ms);

    promise
      .then((value) => {
        window.clearTimeout(timeoutId);
        resolve(value);
      })
      .catch((error) => {
        window.clearTimeout(timeoutId);
        reject(error);
      });
  });
}

function CompanyOnboardingPage() {
  const navigate = useNavigate();
  const { user, company, loading, refreshMembership, signOut } = useAuth();
  const [name, setName] = useState("");
  const [companyType, setCompanyType] = useState<"buyer" | "supplier" | "hybrid">("buyer");
  const [gstNumber, setGstNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [industryCategory, setIndustryCategory] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitStage, setSubmitStage] = useState<string | null>(null);
  const canSubmit = !!user && name.trim().length > 0 && !submitting;

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/login", replace: true });
      return;
    }
    if (company) {
      navigate({ to: "/app", replace: true });
    }
  }, [company, loading, navigate, user]);

  async function handleSignOut() {
    setSigningOut(true);
    await signOut();
    setSigningOut(false);
    navigate({ to: "/login", replace: true });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      setError("You need to sign in before creating a company.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSubmitStage("Preparing company setup...");

    try {
      setSubmitStage("Connecting to Supabase...");
      const supabase = getSupabaseBrowserClient();
      setSubmitStage("Creating company and membership...");
      const companyId = crypto.randomUUID();

      const { error: companyError } = await withTimeout(
        supabase.from("companies").insert({
          id: companyId,
          name,
          company_type: companyType,
          gst_number: gstNumber || null,
          pan_number: panNumber || null,
          industry_category: industryCategory || null,
        }),
        15000,
        "Company insert timed out after 15 seconds.",
      );

      if (companyError) {
        setError(`Company creation failed: ${companyError.message}`);
        return;
      }

      const { error: membershipError } = await withTimeout(
        supabase.from("company_memberships").insert({
          company_id: companyId,
          user_id: user.id,
          role: "company_admin",
          status: "active",
        }),
        15000,
        "Membership insert timed out after 15 seconds.",
      );

      if (membershipError) {
        setError(`Membership creation failed: ${membershipError.message}`);
        return;
      }

      setSubmitStage("Refreshing your workspace membership...");
      await refreshMembership();
      setSubmitStage("Redirecting to your workspace...");
      navigate({ to: "/app", replace: true });
    } catch (nextError) {
      const message = nextError instanceof Error ? nextError.message : "Unknown onboarding error";
      setError(`Unexpected onboarding error: ${message}`);
    } finally {
      setSubmitting(false);
      if (error) {
        setSubmitStage(null);
      }
    }
  }

  if (loading || (!!user && company)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[image:var(--gradient-subtle)]">
        <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-white/80 px-5 py-4 shadow-[var(--shadow-md)] backdrop-blur">
          <LoaderCircle className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">Checking your workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[image:var(--gradient-subtle)] px-6 py-16">
      <div className="mx-auto flex max-w-5xl items-center justify-center">
        <Card className="w-full max-w-2xl border-border/70 bg-white/90 shadow-[var(--shadow-lg)] backdrop-blur">
          <CardHeader className="space-y-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[image:var(--gradient-hero)] text-primary-foreground">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-2xl">Set up your company workspace</CardTitle>
              <CardDescription className="mt-2">
                This creates your first tenant and makes you the company admin for Sprint 1.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex justify-end">
              <Button variant="outline" onClick={handleSignOut} type="button">
                {signingOut ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                Sign out
              </Button>
            </div>
            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium" htmlFor="companyName">
                  Company name
                </label>
                <Input
                  id="companyName"
                  type="text"
                  placeholder="ProcureGrid Technologies Pvt. Ltd."
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Company type</label>
                <Select value={companyType} onValueChange={(value) => setCompanyType(value as typeof companyType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your company type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buyer">Buyer</SelectItem>
                    <SelectItem value="supplier">Supplier</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="industryCategory">
                  Industry category
                </label>
                <Input
                  id="industryCategory"
                  type="text"
                  placeholder="EV components"
                  value={industryCategory}
                  onChange={(event) => setIndustryCategory(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="gstNumber">
                  GST number
                </label>
                <Input
                  id="gstNumber"
                  type="text"
                  placeholder="Optional for Sprint 1"
                  value={gstNumber}
                  onChange={(event) => setGstNumber(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="panNumber">
                  PAN number
                </label>
                <Input
                  id="panNumber"
                  type="text"
                  placeholder="Optional for Sprint 1"
                  value={panNumber}
                  onChange={(event) => setPanNumber(event.target.value)}
                />
              </div>

              {error ? <p className="text-sm text-destructive md:col-span-2">{error}</p> : null}
              {submitting && submitStage ? (
                <p className="text-sm text-muted-foreground md:col-span-2">{submitStage}</p>
              ) : null}

              <div className="md:col-span-2">
                <Button className="w-full md:w-auto" disabled={!canSubmit} type="submit">
                  {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "Create company"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
