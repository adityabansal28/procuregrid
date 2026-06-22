import type { ReactNode } from "react";
import { resources } from "@/i18n/translations";

type TranslationOptions = {
  defaultValue?: string;
  returnObjects?: boolean;
  [key: string]: unknown;
};

const englishTranslations = resources.en.translation as Record<string, unknown>;

function getValueByPath(path: string) {
  return path.split(".").reduce<unknown>((current, segment) => {
    if (!current || typeof current !== "object" || Array.isArray(current)) {
      return undefined;
    }

    return (current as Record<string, unknown>)[segment];
  }, englishTranslations);
}

function interpolate(template: string, options: TranslationOptions) {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_match, key: string) => {
    const value = options[key];
    return value == null ? "" : String(value);
  });
}

function translate(path: string, options: TranslationOptions = {}) {
  const value = getValueByPath(path);

  if (options.returnObjects) {
    return value ?? options.defaultValue ?? path;
  }

  if (typeof value === "string") {
    return interpolate(value, options);
  }

  if (value == null) {
    return options.defaultValue ?? path;
  }

  return String(value);
}

export function useTranslation() {
  return {
    t: translate as <T = string>(path: string, options?: TranslationOptions) => T,
    i18n: {
      language: "en",
    },
  };
}

export function I18nextProvider({ children }: { children: ReactNode; i18n?: unknown }) {
  return children;
}
