import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Building2, LoaderCircle, LogOut, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export const Route = createFileRoute("/app")({
  component: AppHomePage,
});

function AppHomePage() {
  const navigate = useNavigate();
  const { user, membership, company, loading, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/login", replace: true });
      return;
    }
    if (!company) {
      navigate({ to: "/onboarding/company", replace: true });
    }
  }, [company, loading, navigate, user]);

  async function handleSignOut() {
    setSigningOut(true);
    await signOut();
    setSigningOut(false);
    navigate({ to: "/login", replace: true });
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <LoaderCircle className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-primary-glow">Sprint 1</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Authenticated workspace</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              You are signed in, attached to a company tenant, and inside the first protected application shell.
            </p>
          </div>

          <Button variant="outline" onClick={handleSignOut}>
            {signingOut ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            Sign out
          </Button>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="h-4 w-4 text-primary" />
                Company
              </CardTitle>
              <CardDescription>Your active tenant for all protected data.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><span className="font-medium">Name:</span> {company?.name ?? "Not set"}</p>
              <p><span className="font-medium">Type:</span> {company?.company_type ?? "Not set"}</p>
              <p><span className="font-medium">Industry:</span> {company?.industry_category ?? "Not set"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserRound className="h-4 w-4 text-primary" />
                User
              </CardTitle>
              <CardDescription>Your current authenticated identity.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><span className="font-medium">Email:</span> {user?.email ?? "Unknown"}</p>
              <p><span className="font-medium">User ID:</span> {user?.id ?? "Unknown"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Access
              </CardTitle>
              <CardDescription>The first RBAC baseline for ProcureGrid.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><span className="font-medium">Role:</span> {membership?.role ?? "Not set"}</p>
              <p><span className="font-medium">Membership:</span> {membership?.status ?? "Not set"}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
