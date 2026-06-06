import type { ChartConfig } from "@/registry/ui/chart";

const THEMES = { light: "", dark: ".dark" } as const;

function getThemePrefix(): string {
  if (typeof document === "undefined") return "";
  return document.documentElement.classList.contains("dark") ? THEMES.dark : THEMES.light;
}

/** Read resolved hex/rgb from CSS variables on the chart container. */
export function createColorResolver(chartId: string, config: ChartConfig) {
  return function resolveColor(key: string, index = 0): string {
    if (typeof document === "undefined") {
      const entry = config[key];
      const colors = entry?.colors?.light ?? entry?.colors?.dark;
      return colors?.[index] ?? colors?.[0] ?? "#8884d8";
    }

    const selector = `${getThemePrefix()} [data-chart="${chartId}"]`.trim();
    const el = document.querySelector(selector) ?? document.querySelector(`[data-chart="${chartId}"]`);
    if (!el) {
      const entry = config[key];
      const theme = document.documentElement.classList.contains("dark") ? "dark" : "light";
      const colors = entry?.colors?.[theme];
      return colors?.[index] ?? colors?.[0] ?? "#8884d8";
    }

    const value = getComputedStyle(el).getPropertyValue(`--color-${key}-${index}`).trim();
    if (value) return value;

    const entry = config[key];
    const theme = document.documentElement.classList.contains("dark") ? "dark" : "light";
    const colors = entry?.colors?.[theme];
    return colors?.[index] ?? colors?.[0] ?? "#8884d8";
  };
}

/**
 * Wash/fade fills (area, bar gradients, radar polygons, sparklines) in light mode use the
 * brighter `dark` palette slot so opacity fades read airy on white backgrounds.
 * Strokes and solid caps keep `resolveColor` (darker light-slot tokens).
 */
export function resolveAreaFillColor(
  config: ChartConfig,
  key: string,
  resolveColor: (key: string, index: number) => string,
  index = 0,
): string {
  const isDark =
    typeof document !== "undefined" && document.documentElement.classList.contains("dark");
  if (isDark) return resolveColor(key, index);

  const entry = config[key];
  const bright = entry?.colors?.dark?.[index] ?? entry?.colors?.dark?.[0];
  return bright ?? resolveColor(key, index);
}

/** Subscribe to `.dark` class toggles on `<html>`. */
export function subscribeThemeChange(onChange: () => void): () => void {
  if (typeof document === "undefined") return () => {};

  const observer = new MutationObserver((records) => {
    for (const record of records) {
      if (record.attributeName === "class") {
        onChange();
        break;
      }
    }
  });

  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}
