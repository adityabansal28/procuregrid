import { en } from "./locales/en";
import { workspaceResources } from "./workspace-translations";

export const resources = {
  en: { translation: { ...workspaceResources.en, ...en.translation } },
} as const;
