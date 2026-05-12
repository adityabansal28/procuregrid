import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Factory, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const { user, company, loading } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    const supabase = getSupabaseBrowserClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setSubmitting(false);
      return;
    }

    const nextUser = data.user;
    if (nextUser) {
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: nextUser.id,
        full_name: fullName,
      });

      if (profileError) {
        setError(profileError.message);
        setSubmitting(false);
        return;
      }
    }

    setSubmitting(false);
    navigate({ to: "/onboarding/company", replace: true });
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
              <CardTitle className="text-2xl">Create your ProcureGrid account</CardTitle>
              <CardDescription className="mt-2">
                Start with identity first, then set up your company workspace.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="fullName">
                  Full name
                </label>
                <Input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="Aditya Bansal"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">
                  Work email
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
                  autoComplete="new-password"
                  minLength={8}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>

              {error ? <p className="text-sm text-destructive">{error}</p> : null}

              <Button className="w-full" disabled={submitting || loading} type="submit">
                {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "Create account"}
              </Button>
            </form>

            <p className="mt-6 text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link className="font-medium text-foreground underline underline-offset-4" to="/login">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
