import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Factory, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { user, company, loading, refreshSession } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitStage, setSubmitStage] = useState<string | null>(null);
  const canSubmit = email.trim().length > 0 && password.length > 0 && !submitting;

  useEffect(() => {
    if (loading) return;
    if (user && company) {
      navigate({ to: "/app", replace: true });
      return;
    }
    if (user && !company) {
      navigate({ to: "/onboarding/company", replace: true });
    }
  }, [company, loading, navigate, user]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setSubmitStage("Signing you in...");

    try {
      const supabase = getSupabaseBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      setSubmitStage("Loading your workspace...");
      const nextState = await refreshSession();

      if (nextState.user && nextState.company) {
        setSubmitStage("Redirecting to your workspace...");
        navigate({ to: "/app", replace: true });
        return;
      }

      if (nextState.user) {
        setSubmitStage("Redirecting to company setup...");
        navigate({ to: "/onboarding/company", replace: true });
        return;
      }

      setError("Sign-in completed, but session could not be loaded. Please try again.");
    } catch (nextError) {
      const message = nextError instanceof Error ? nextError.message : "Unknown sign-in error";
      setError(message);
    } finally {
      setSubmitting(false);
      if (error) {
        setSubmitStage(null);
      }
    }
  }

  return (
    <div className="min-h-screen bg-[image:var(--gradient-subtle)] px-6 py-16">
      <div className="mx-auto flex max-w-5xl items-center justify-center">
        <Card className="w-full max-w-md border-border/70 bg-white/90 shadow-[var(--shadow-lg)] backdrop-blur">
          <CardHeader className="space-y-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[image:var(--gradient-hero)] text-primary-foreground">
              <Factory className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-2xl">Sign in to ProcureGrid</CardTitle>
              <CardDescription className="mt-2">
                Continue into your procurement workspace.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="password">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>

              {error ? <p className="text-sm text-destructive">{error}</p> : null}
              {submitting && submitStage ? <p className="text-sm text-muted-foreground">{submitStage}</p> : null}

              <Button className="w-full" disabled={!canSubmit} type="submit">
                {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "Sign in"}
              </Button>
            </form>

            <p className="mt-6 text-sm text-muted-foreground">
              New to ProcureGrid?{" "}
              <Link className="font-medium text-foreground underline underline-offset-4" to="/signup">
                Create your account
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
