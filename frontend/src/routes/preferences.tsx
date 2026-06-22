import { createFileRoute } from "@tanstack/react-router";
import { SlidersHorizontal } from "lucide-react";
import { useTranslation } from "@/lib/translation";
import { ProtectedPlaceholderPage } from "@/components/app/ProtectedPlaceholderPage";

export const Route = createFileRoute("/preferences")({
  component: PreferencesPage,
});

function PreferencesPage() {
  const { t } = useTranslation();

  return (
    <ProtectedPlaceholderPage
      title={t("workspace.pages.preferences.title")}
      description={t("workspace.pages.preferences.description")}
      icon={SlidersHorizontal}
    />
  );
}
