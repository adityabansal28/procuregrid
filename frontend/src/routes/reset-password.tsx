import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, Circle, Eye, EyeOff, Factory, LoaderCircle, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  getPasswordRequirements,
  isPasswordValid,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "@/lib/password-policy";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import heroImg from "@/assets/hero-factory.jpg";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [checkingRecovery, setCheckingRecovery] = useState(true);
  const [recoveryReady, setRecoveryReady] = useState(false);

  const passwordRequirements = useMemo(() => getPasswordRequirements(password), [password]);
  const passwordIsValid = isPasswordValid(password);
  const passwordsMatch = password === confirmPassword;
  const canSubmit =
    recoveryReady &&
    !checkingRecovery &&
    !submitting &&
    passwordIsValid &&
    passwordsMatch &&
    confirmPassword.length > 0;

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    let mounted = true;
    let resolved = false;

    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const search = typeof window !== "undefined" ? window.location.search : "";
    const isRecoveryUrl = hash.includes("type=recovery") || search.includes("type=recovery");

    const resolveReady = () => {
      if (!mounted || resolved) return;
      resolved = true;
      setRecoveryReady(true);
      setCheckingRecovery(false);
      setError(null);
    };

    const resolveInvalid = () => {
      if (!mounted || resolved) return;
      resolved = true;
      setRecoveryReady(false);
      setCheckingRecovery(false);
      setError(t("authPages.resetPassword.invalidLink"));
    };

    const timeoutId = window.setTimeout(() => {
      if (!resolved) {
        resolveInvalid();
      }
    }, 2500);

    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted || resolved) return;

      if (session && isRecoveryUrl) {
        resolveReady();
        return;
      }

      if (!isRecoveryUrl) {
        resolveInvalid();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && !!session && isRecoveryUrl)) {
        resolveReady();
      }
    });

    return () => {
      mounted = false;
      window.clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [t]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!passwordIsValid) {
      setError(t("authPages.signup.passwordPolicyError"));
      setSubmitting(false);
      return;
    }

    if (!passwordsMatch) {
      setError(t("authPages.resetPassword.confirmPasswordError"));
      setSubmitting(false);
      return;
    }

    try {
      const supabase = getSupabaseBrowserClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      await supabase.auth.signOut();
      setSuccess(t("authPages.resetPassword.success"));
      window.setTimeout(() => {
        navigate({ to: "/login", replace: true });
      }, 1500);
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
                {t("authPages.resetPassword.title")}
              </h1>
              <p className="mt-4 text-lg text-white/75">
                {t("authPages.resetPassword.description")}
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
                <CardTitle className="text-2xl">{t("authPages.resetPassword.title")}</CardTitle>
                <CardDescription className="mt-2">
                  {t("authPages.resetPassword.description")}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {checkingRecovery ? (
                <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/35 px-4 py-3 text-sm text-muted-foreground">
                  <LoaderCircle className="h-4 w-4 animate-spin text-primary" />
                  Checking your recovery link...
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="password">
                      {t("authPages.resetPassword.passwordLabel")}
                    </label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        minLength={PASSWORD_MIN_LENGTH}
                        maxLength={PASSWORD_MAX_LENGTH}
                        placeholder={t("authPages.resetPassword.passwordPlaceholder")}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        aria-describedby="reset-password-requirements"
                        aria-invalid={password.length > 0 && !passwordIsValid}
                        className="pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="confirmPassword">
                      {t("authPages.resetPassword.confirmPasswordLabel")}
                    </label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        minLength={PASSWORD_MIN_LENGTH}
                        maxLength={PASSWORD_MAX_LENGTH}
                        placeholder={t("authPages.resetPassword.confirmPasswordPlaceholder")}
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        aria-invalid={confirmPassword.length > 0 && !passwordsMatch}
                        className="pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((current) => !current)}
                        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                        aria-label={
                          showConfirmPassword ? "Hide confirm password" : "Show confirm password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div
                    id="reset-password-requirements"
                    className="rounded-lg border border-border bg-muted/35 p-3"
                  >
                    <p className="text-xs font-semibold text-foreground">
                      {t("authPages.signup.passwordRequirementsLabel")}
                    </p>
                    <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                      {passwordRequirements.map((requirement) => {
                        const RequirementIcon = requirement.isMet ? Check : Circle;

                        return (
                          <li
                            key={requirement.id}
                            className={
                              requirement.isMet
                                ? "flex items-center gap-2 text-xs text-emerald-700"
                                : "flex items-center gap-2 text-xs text-muted-foreground"
                            }
                          >
                            <RequirementIcon className="h-3.5 w-3.5 shrink-0" />
                            {t(`authPages.signup.passwordRequirements.${requirement.id}`)}
                          </li>
                        );
                      })}
                      <li
                        className={
                          confirmPassword.length > 0 && passwordsMatch
                            ? "flex items-center gap-2 text-xs text-emerald-700"
                            : "flex items-center gap-2 text-xs text-muted-foreground"
                        }
                      >
                        {confirmPassword.length > 0 && passwordsMatch ? (
                          <Check className="h-3.5 w-3.5 shrink-0" />
                        ) : (
                          <Circle className="h-3.5 w-3.5 shrink-0" />
                        )}
                        {t("authPages.resetPassword.confirmPasswordLabel")}
                      </li>
                    </ul>
                  </div>

                  {error ? <p className="text-sm text-destructive">{error}</p> : null}
                  {success ? <p className="text-sm text-emerald-700">{success}</p> : null}

                  <Button className="w-full" disabled={!canSubmit} type="submit">
                    {submitting ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      t("authPages.resetPassword.submit")
                    )}
                  </Button>
                </form>
              )}

              <p className="mt-6 text-sm text-muted-foreground">
                <Link
                  className="font-medium text-foreground underline underline-offset-4"
                  to="/forgot-password"
                >
                  {t("authPages.resetPassword.backToForgotPassword")}
                </Link>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                <Link
                  className="font-medium text-foreground underline underline-offset-4"
                  to="/login"
                >
                  {t("authPages.resetPassword.backToLogin")}
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
