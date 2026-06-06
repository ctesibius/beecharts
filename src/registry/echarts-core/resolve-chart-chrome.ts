/** Design-token colors for axes, grids, and ECharts chrome — resolved from the chart container. */

export type ChartChromeColors = {
  foreground: string;
  background: string;
  muted: string;
  border: string;
  splitLine: string;
  popover: string;
  popoverForeground: string;
};

const LIGHT_FALLBACK: ChartChromeColors = {
  foreground: "oklch(0.145 0 0)",
  background: "oklch(1 0 0)",
  muted: "oklch(0.4 0 0)",
  border: "oklch(0.922 0 0)",
  splitLine: "oklch(0.922 0 0)",
  popover: "oklch(1 0 0)",
  popoverForeground: "oklch(0.145 0 0)",
};

const DARK_FALLBACK: ChartChromeColors = {
  foreground: "oklch(0.985 0 0)",
  background: "oklch(0.145 0 0)",
  muted: "oklch(0.708 0 0)",
  border: "oklch(1 0 0 / 0.12)",
  splitLine: "oklch(1 0 0 / 0.1)",
  popover: "oklch(0.269 0 0)",
  popoverForeground: "oklch(0.985 0 0)",
};

function readCssVar(el: Element, name: string, fallback: string): string {
  const value = getComputedStyle(el).getPropertyValue(name).trim();
  return value || fallback;
}

export function resolveChartChrome(chartId: string): ChartChromeColors {
  if (typeof document === "undefined") {
    return LIGHT_FALLBACK;
  }

  const isDark = document.documentElement.classList.contains("dark");
  const fallback = isDark ? DARK_FALLBACK : LIGHT_FALLBACK;
  const el =
    document.querySelector(`[data-chart="${chartId}"]`) ?? document.documentElement;

  const foreground = readCssVar(el, "--foreground", fallback.foreground);
  const muted = readCssVar(el, "--muted-foreground", fallback.muted);
  const border = readCssVar(el, "--border", fallback.border);

  return {
    foreground,
    background: readCssVar(el, "--background", fallback.background),
    muted,
    border,
    splitLine: border,
    popover: readCssVar(el, "--popover", fallback.popover),
    popoverForeground: readCssVar(el, "--popover-foreground", fallback.popoverForeground),
  };
}

const CANVAS_LIGHT: ChartChromeColors = {
  foreground: "#171717",
  background: "#ffffff",
  muted: "#737373",
  border: "#e5e5e5",
  splitLine: "#e5e5e5",
  popover: "#ffffff",
  popoverForeground: "#171717",
};

const CANVAS_DARK: ChartChromeColors = {
  foreground: "#fafafa",
  background: "#0a0a0a",
  muted: "#a1a1aa",
  border: "rgba(255, 255, 255, 0.12)",
  splitLine: "rgba(255, 255, 255, 0.1)",
  popover: "#262626",
  popoverForeground: "#fafafa",
};

/** Resolve design tokens to rgb/hex strings ECharts canvas can paint. */
function cssColorToCanvasRgb(color: string, context: Element): string {
  if (!color) return color;
  if (/^#[\da-f]{3,8}$/i.test(color) || /^rgba?\(/i.test(color)) {
    return color;
  }

  const probe = document.createElement("span");
  probe.style.color = color;
  context.appendChild(probe);
  const rgb = getComputedStyle(probe).color;
  context.removeChild(probe);
  return rgb || color;
}

/** Seam color between ECharts marks (treemap gaps, funnel borders, point halos). */
export function resolveCanvasGapColor(chartId: string): string {
  return resolveCanvasChartChrome(chartId).background;
}

/** Label on saturated series fills (funnel segments, treemap leaves). */
export function resolveCanvasTileLabelColor(chartId: string): string {
  const chrome = resolveCanvasChartChrome(chartId);
  const isDark =
    typeof document !== "undefined" && document.documentElement.classList.contains("dark");
  return isDark ? chrome.popoverForeground : "#ffffff";
}

/** Label on chart background / group headers (treemap parents). */
export function resolveCanvasGroupLabelColor(chartId: string): string {
  return resolveCanvasChartChrome(chartId).foreground;
}

export function resolveCanvasChartChrome(chartId: string): ChartChromeColors {
  if (typeof document === "undefined") {
    return CANVAS_LIGHT;
  }

  const isDark = document.documentElement.classList.contains("dark");
  const fallback = isDark ? CANVAS_DARK : CANVAS_LIGHT;
  const el =
    document.querySelector(`[data-chart="${chartId}"]`) ?? document.documentElement;
  const chrome = resolveChartChrome(chartId);

  return {
    foreground: cssColorToCanvasRgb(chrome.foreground, el) || fallback.foreground,
    background: cssColorToCanvasRgb(chrome.background, el) || fallback.background,
    muted: cssColorToCanvasRgb(chrome.muted, el) || fallback.muted,
    border: cssColorToCanvasRgb(chrome.border, el) || fallback.border,
    splitLine: cssColorToCanvasRgb(chrome.splitLine, el) || fallback.splitLine,
    popover: cssColorToCanvasRgb(chrome.popover, el) || fallback.popover,
    popoverForeground:
      cssColorToCanvasRgb(chrome.popoverForeground, el) || fallback.popoverForeground,
  };
}
