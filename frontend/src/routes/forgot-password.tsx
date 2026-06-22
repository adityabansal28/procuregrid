import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Factory, LoaderCircle, ShieldCheck } from "lucide-react";
import { useTranslation } from "@/lib/translation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { parseIdentifierByType } from "@/lib/auth-identifiers";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import heroImg from "@/assets/hero-factory.jpg";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const canSubmit = email.trim().length > 0 && !submitting;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const parsedEmail = parseIdentifierByType("email", email);
    if (!parsedEmail) {
      setError(t("authPages.forgotPassword.invalidEmail"));
      setSubmitting(false);
      return;
    }

    try {
      const supabase = getSupabaseBrowserClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(parsedEmail.value, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setSuccess(t("authPages.forgotPassword.success"));
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Unknown password reset error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[image:var(--gradient-subtle)]">
      <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative hidden overflow-hidden lg:block">
          <img
            src={heroImg}
            alt="Indian manufacturing factory floor with CNC machines"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.18_0.06_255_/_0.88)] via-[oklch(0.22_0.08_255_/_0.74)] to-[oklch(0.32_0.12_250_/_0.52)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_oklch(0.55_0.18_250_/_0.22),_transparent_60%)]" />
          <div className="absolute inset-x-0 bottom-0 p-12 text-white">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur">
                <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                {t("authPages.login.heroBadge")}
              </div>
              <h1 className="mt-6 text-4xl font-bold leading-tight">
                {t("authPages.forgotPassword.title")}
              </h1>
              <p className="mt-4 text-lg text-white/75">
                {t("authPages.forgotPassword.description")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
          <Card className="w-full max-w-md border-border/70 bg-white/92 shadow-[var(--shadow-lg)] backdrop-blur">
            <CardHeader className="space-y-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[image:var(--gradient-hero)] text-primary-foreground">
                <Factory className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-2xl">{t("authPages.forgotPassword.title")}</CardTitle>
                <CardDescription className="mt-2">
                  {t("authPages.forgotPassword.description")}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="email">
                    {t("authPages.forgotPassword.emailLabel")}
                  </label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder={t("authPages.forgotPassword.emailPlaceholder")}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>

                {error ? <p className="text-sm text-destructive">{error}</p> : null}
                {success ? <p className="text-sm text-emerald-700">{success}</p> : null}

                <Button className="w-full" disabled={!canSubmit} type="submit">
                  {submitting ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    t("authPages.forgotPassword.submit")
                  )}
                </Button>
              </form>

              <p className="mt-6 text-sm text-muted-foreground">
                <Link
                  className="font-medium text-foreground underline underline-offset-4"
                  to="/login"
                >
                  {t("authPages.forgotPassword.backToLogin")}
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
