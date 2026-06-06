"use client";

import { useMemo, useState } from "react";
import type { EChartsOption } from "echarts";
import { useChart } from "@/registry/ui/chart";
import { createColorResolver, subscribeThemeChange } from "./resolve-chart-colors";
import { usePartsSnapshot } from "./part-registry";
import type { CompileContext, StackType, BarLayout, FunnelConnection, FunnelTaper } from "./parts/types";
import { useEffect } from "react";

export type CompileRootFields<TData extends Record<string, unknown> = Record<string, unknown>> = {
  data: TData[];
  xDataKey?: string;
  layout?: BarLayout;
  stackType?: StackType;
  nameKey?: string;
  variant?: "default" | "histogram";
  barRadius?: number;
  valueDataKey?: string;
  stageKey?: string;
  valueKey?: string;
  radialVariant?: "full" | "semi";
  radialLayout?: "concentric" | "rose";
  radialInnerRadius?: number | string;
  radialOuterRadius?: number | string;
  stageGap?: number;
  funnelConnection?: FunnelConnection;
  funnelTaper?: FunnelTaper;
  externalBrush?: boolean;
  /** Monospace bars: false = intro expanded width, true = collapsed thin rest state. */
  monospaceCollapsed?: boolean;
  /** Hovered category index for monospace width expand. */
  monospaceHoveredIndex?: number | null;
};

export function useCompiledOption<TData extends Record<string, unknown>>(
  compile: (ctx: CompileContext<TData>) => EChartsOption,
  root: CompileRootFields<TData>,
) {
  const { config, chartId } = useChart();
  const parts = usePartsSnapshot();
  const [colorEpoch, setColorEpoch] = useState(0);

  useEffect(() => subscribeThemeChange(() => setColorEpoch((e) => e + 1)), []);

  const resolveColor = useMemo(
    () => createColorResolver(chartId, config),
    [chartId, config, colorEpoch],
  );

  const option = useMemo(() => {
    const ctx: CompileContext<TData> = {
      config,
      data: root.data,
      parts,
      chartId,
      resolveColor,
      xDataKey: root.xDataKey,
      layout: root.layout,
      stackType: root.stackType,
      nameKey: root.nameKey,
      variant: root.variant,
      barRadius: root.barRadius,
      valueDataKey: root.valueDataKey,
      stageKey: root.stageKey,
      valueKey: root.valueKey,
      radialVariant: root.radialVariant,
      radialLayout: root.radialLayout,
      radialInnerRadius: root.radialInnerRadius,
      radialOuterRadius: root.radialOuterRadius,
      stageGap: root.stageGap,
      funnelConnection: root.funnelConnection,
      funnelTaper: root.funnelTaper,
      externalBrush: root.externalBrush,
      monospaceCollapsed: root.monospaceCollapsed,
      monospaceHoveredIndex: root.monospaceHoveredIndex,
    };
    return compile(ctx);
  }, [
    compile,
    config,
    root.data,
    root.xDataKey,
    root.layout,
    root.stackType,
    root.nameKey,
    root.variant,
    root.barRadius,
    root.valueDataKey,
    root.stageKey,
    root.valueKey,
    root.radialVariant,
    root.radialLayout,
    root.radialInnerRadius,
    root.radialOuterRadius,
    root.stageGap,
    root.funnelConnection,
    root.funnelTaper,
    root.externalBrush,
    root.monospaceCollapsed,
    root.monospaceHoveredIndex,
    parts,
    chartId,
    resolveColor,
    colorEpoch,
  ]);

  return { option, colorEpoch };
}
