import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Factory, LoaderCircle, ShieldCheck } from "lucide-react";
import { useTranslation } from "@/lib/translation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import heroImg from "@/assets/hero-factory.jpg";

export const Route = createFileRoute("/auth/callback")({
  validateSearch: (search: Record<string, unknown>) => ({
    error: typeof search.error === "string" ? search.error : "",
    error_description: typeof search.error_description === "string" ? search.error_description : "",
  }),
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { company, loading, refreshSession, user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const heroBadge = t("authPages.login.heroBadge", {
    defaultValue: "Verified suppliers, protected procurement",
  });
  const callbackTitle = t("authPages.oauthCallback.title", {
    defaultValue: "Completing sign-in",
  });
  const callbackDescription = t("authPages.oauthCallback.description", {
    defaultValue: "Securely finishing your Google sign-in and loading your workspace.",
  });
  const callbackErrorFallback = t("authPages.oauthCallback.errorFallback", {
    defaultValue: "Google sign-in could not be completed. Please try again.",
  });
  const backToLoginLabel = t("authPages.oauthCallback.backToLogin", {
    defaultValue: "Back to sign in",
  });

  useEffect(() => {
    if (search.error || search.error_description) {
      setError(search.error_description || search.error || callbackErrorFallback);
      return;
    }

    if (loading || !user) {
      return;
    }

    navigate({ to: company ? "/app" : "/onboarding/company", replace: true });
  }, [
    callbackErrorFallback,
    company,
    loading,
    navigate,
    search.error,
    search.error_description,
    user,
  ]);

  useEffect(() => {
    if (search.error || search.error_description || user) {
      return;
    }

    let cancelled = false;

    async function waitForAuthenticatedUser() {
      const supabase = getSupabaseBrowserClient();

      for (let attempt = 0; attempt < 20; attempt += 1) {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          return session.user;
        }

        await new Promise((resolve) => window.setTimeout(resolve, 250));
      }

      return null;
    }

    async function completeGoogleAuth() {
      try {
        const nextUser = await waitForAuthenticatedUser();

        if (!nextUser) {
          setError(callbackErrorFallback);
          return;
        }

        const nextSession = await refreshSession();

        if (!nextSession.user) {
          setError(callbackErrorFallback);
          return;
        }
      } catch (nextError) {
        if (cancelled) return;
        setError(nextError instanceof Error ? nextError.message : callbackErrorFallback);
      }
    }

    void completeGoogleAuth();

    return () => {
      cancelled = true;
    };
  }, [callbackErrorFallback, refreshSession, search.error, search.error_description, user]);

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
                {heroBadge}
              </div>
              <h1 className="mt-6 text-4xl font-bold leading-tight">{callbackTitle}</h1>
              <p className="mt-4 text-lg text-white/75">{callbackDescription}</p>
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
                <CardTitle className="text-2xl">{callbackTitle}</CardTitle>
                <CardDescription className="mt-2">{callbackDescription}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {error ? (
                <>
                  <p className="text-sm text-destructive">{error}</p>
                  <Button asChild className="w-full" variant="outline">
                    <Link to="/login">{backToLoginLabel}</Link>
                  </Button>
                </>
              ) : (
                <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/35 px-4 py-3 text-sm text-muted-foreground">
                  <LoaderCircle className="h-4 w-4 animate-spin text-primary" />
                  {callbackDescription}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
