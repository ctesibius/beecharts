"use client";

import { useEffect, useState } from "react";
import { CHART_ANIMATION, prefersReducedMotion } from "./chart-animation-tokens";
import { usePartsSnapshot } from "./part-registry";

/** Monospace bars mount expanded, then animate to thin rest width. */
export function useMonospaceCollapse(dataEpoch: unknown, chartReadyEpoch = 0) {
  const parts = usePartsSnapshot();
  const hasMonospace = parts.some((p) => p.type === "bar" && p.variant === "monospace");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!hasMonospace || !chartReadyEpoch) return;

    if (prefersReducedMotion()) {
      setCollapsed(true);
      return;
    }

    setCollapsed(false);
    let raf1 = 0;
    let timer = 0;

    raf1 = requestAnimationFrame(() => {
      timer = window.setTimeout(
        () => setCollapsed(true),
        CHART_ANIMATION.monospace.collapseDelayMs,
      );
    });

    return () => {
      cancelAnimationFrame(raf1);
      window.clearTimeout(timer);
    };
  }, [hasMonospace, dataEpoch, chartReadyEpoch]);

  return collapsed;
}
