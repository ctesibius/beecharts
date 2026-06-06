"use client";

import {
  type ChartConfig,
  ChartContainer,
  getLoadingData,
} from "@/registry/ui/chart";
import { ChartPlotShell } from "@/registry/echarts-core/chart-plot-shell";
import { EChartsHost } from "@/registry/echarts-core/echarts-host";
import { PartRegistryProvider, usePartId, usePartsSnapshot, useRegisterPart } from "@/registry/echarts-core/part-registry";
import { useHoverTraceMarkLine } from "@/registry/echarts-core/use-hover-trace-mark-line";
import { useMonospaceCollapse } from "@/registry/echarts-core/use-monospace-collapse";
import { useMonospaceFoldAnimation } from "@/registry/echarts-core/use-monospace-fold-animation";
import { BeeChartBrush } from "@/registry/echarts-core/bee-chart-brush";
import type { ChartPlotInsets } from "@/registry/echarts-core/chart-grid";
import { compileBarOption } from "@/registry/echarts-core/compile-bar";
import { BEE_HOVER_TRACE_SERIES_ID } from "@/registry/echarts-core/hover-trace-bar";
import { useChartBrush } from "@/registry/echarts-core/use-chart-brush";
import { useCompiledOption } from "@/registry/echarts-core/use-compiled-option";
import type { BeeChartEventHandlers } from "@/registry/echarts-core/use-bee-echarts";
import type { BarLayout, StackType } from "@/registry/echarts-core/parts/types";
import { ChartBackground } from "@/registry/ui/background";
import {
  BeeChartLegend,
  bindChartLegendLayer,
  type ChartLegendVariant,
} from "@/registry/ui/legend";
import { ChartTooltip, type TooltipRoundness, type TooltipVariant } from "@/registry/ui/tooltip";
import { useChart } from "@/registry/ui/chart";
import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { EChartsType } from "echarts/core";

type ValidateConfigKeys<TData, TConfig> = {
  [K in keyof TConfig]: K extends keyof TData ? ChartConfig[string] : never;
};

type BeeBarChartProps<
  TData extends Record<string, unknown>,
  TConfig extends Record<string, ChartConfig[string]>,
> = {
  config: TConfig & ValidateConfigKeys<TData, TConfig>;
  data: TData[];
  children: ReactNode;
  className?: string;
  stackType?: StackType;
  layout?: BarLayout;
  xDataKey?: keyof TData & string;
  isLoading?: boolean;
  loadingBars?: number;
  showBrush?: boolean;
  brushFormatLabel?: (value: unknown, index: number) => string;
  /** Default corner radius (px) for every `<Bar />`. */
  barRadius?: number;
  /** Chart layout preset — `histogram` uses touching bins with square corners. */
  variant?: "default" | "histogram";
  /** Fires when a `<Bar variant="hover-trace" />` category is focused (null = peak). */
  onHoverTraceChange?: (index: number | null) => void;
};

function BarChartCanvas<TData extends Record<string, unknown>>({
  data,
  xDataKey,
  layout,
  stackType,
  barRadius,
  variant,
  externalBrush,
  onPlotRect,
  chartReadyEpoch,
  onHoverTraceChange,
}: {
  data: TData[];
  xDataKey?: string;
  layout?: BarLayout;
  stackType?: StackType;
  barRadius?: number;
  variant?: "default" | "histogram";
  externalBrush?: boolean;
  onPlotRect?: (insets: ChartPlotInsets) => void;
  chartReadyEpoch: number;
  onHoverTraceChange?: (index: number | null) => void;
}) {
  const { chartId } = useChart();
  const parts = usePartsSnapshot();
  const monospaceBar = parts.find((p) => p.type === "bar" && p.variant === "monospace");
  const hoverTraceBar = parts.find((p) => p.type === "bar" && p.variant === "hover-trace");
  const hasMonospace = Boolean(monospaceBar);
  const hasHoverTrace = Boolean(hoverTraceBar);
  const chartRef = useRef<EChartsType | null>(null);
  const [chartInstanceEpoch, setChartInstanceEpoch] = useState(0);
  const handleChartInstance = useCallback((instance: EChartsType | null) => {
    chartRef.current = instance;
    if (instance) setChartInstanceEpoch((epoch) => epoch + 1);
  }, []);
  const [monospaceHoveredIndex, setMonospaceHoveredIndex] = useState<number | null>(null);
  const [hoverTraceIndex, setHoverTraceIndex] = useState<number | null>(null);
  // Latest callback, invoked from timers/ECharts events; written post-render.
  const onHoverTraceChangeRef = useRef(onHoverTraceChange);
  useEffect(() => {
    onHoverTraceChangeRef.current = onHoverTraceChange;
  });
  const hoverTraceHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const monospaceCollapsed = useMonospaceCollapse(data, chartReadyEpoch);

  const clearHoverTraceHideTimer = useCallback(() => {
    if (hoverTraceHideTimerRef.current != null) {
      clearTimeout(hoverTraceHideTimerRef.current);
      hoverTraceHideTimerRef.current = null;
    }
  }, []);

  const scheduleHoverTraceHide = useCallback(() => {
    clearHoverTraceHideTimer();
    hoverTraceHideTimerRef.current = setTimeout(() => {
      setHoverTraceIndex(null);
      onHoverTraceChangeRef.current?.(null);
    }, 48);
  }, [clearHoverTraceHideTimer]);

  // Reset transient hover state when the dataset changes, using React's
  // documented "adjust state on prop change" pattern (compare a prev-value ref
  // during render). This is the recommended alternative to a setState-in-effect;
  // the lint rule doesn't recognize the prev-value idiom, hence the scoped disable.
  /* eslint-disable react-hooks/refs */
  const prevDataRef = useRef(data);
  if (prevDataRef.current !== data) {
    prevDataRef.current = data;
    setMonospaceHoveredIndex(null);
    setHoverTraceIndex(null);
  }
  /* eslint-enable react-hooks/refs */

  // The side effects (notify parent, clear pending hide timer) stay in an effect.
  useEffect(() => {
    onHoverTraceChangeRef.current?.(null);
    clearHoverTraceHideTimer();
  }, [data, clearHoverTraceHideTimer]);

  useEffect(() => () => clearHoverTraceHideTimer(), [clearHoverTraceHideTimer]);

  useMonospaceFoldAnimation({
    chartRef,
    enabled: hasMonospace,
    dataKey: monospaceBar?.type === "bar" ? monospaceBar.dataKey : "",
    rows: data,
    collapsed: monospaceCollapsed,
    hoveredIndex: monospaceHoveredIndex,
    chartReadyEpoch,
    chartInstanceEpoch,
  });

  const { option, colorEpoch } = useCompiledOption(compileBarOption, {
    data,
    xDataKey,
    layout,
    stackType,
    barRadius,
    variant,
    externalBrush,
    monospaceCollapsed: false,
    monospaceHoveredIndex: null,
  });

  useHoverTraceMarkLine({
    chartRef,
    chartId,
    enabled: hasHoverTrace,
    dataKey: hoverTraceBar?.type === "bar" ? hoverTraceBar.dataKey : "",
    rows: data,
    hoveredIndex: hoverTraceIndex,
    chartReadyEpoch,
    chartInstanceEpoch,
    colorEpoch,
  });

  const eventHandlers = useMemo<BeeChartEventHandlers | undefined>(() => {
    if (!hasMonospace && !hasHoverTrace) return undefined;
    return {
      onSeriesMouseOver: (params) => {
        if (params.componentType !== "series") return;
        if (hasMonospace && params.seriesType === "custom") {
          if (typeof params.dataIndex !== "number" || params.dataIndex < 0) return;
          const next = params.dataIndex;
          setMonospaceHoveredIndex((prev) => (prev === next ? prev : next));
          return;
        }
        if (hasHoverTrace && params.seriesType === "bar") {
          const seriesId = (params as { seriesId?: string }).seriesId;
          if (seriesId && seriesId !== BEE_HOVER_TRACE_SERIES_ID) return;
          if (typeof params.dataIndex !== "number" || params.dataIndex < 0) return;
          clearHoverTraceHideTimer();
          const next = params.dataIndex;
          setHoverTraceIndex((prev) => (prev === next ? prev : next));
          onHoverTraceChangeRef.current?.(next);
        }
      },
      onGlobalOut: () => {
        if (hasMonospace) setMonospaceHoveredIndex(null);
        if (hasHoverTrace) scheduleHoverTraceHide();
      },
    };
  }, [hasMonospace, hasHoverTrace, clearHoverTraceHideTimer, scheduleHoverTraceHide]);

  return (
    <EChartsHost
      option={option}
      colorEpoch={colorEpoch}
      onPlotRect={onPlotRect}
      eventHandlers={eventHandlers}
      onChartInstance={handleChartInstance}
    />
  );
}

export function BeeBarChart<
  TData extends Record<string, unknown>,
  TConfig extends Record<string, ChartConfig[string]>,
>({
  config,
  data,
  children,
  className,
  stackType = "default",
  layout = "vertical",
  xDataKey,
  isLoading = false,
  loadingBars,
  showBrush = true,
  barRadius,
  variant = "default",
  brushFormatLabel,
  onHoverTraceChange,
}: BeeBarChartProps<TData, TConfig>) {
  const displayData = isLoading
    ? (getLoadingData(loadingBars ?? 8) as unknown as TData[])
    : data;
  const xKey = xDataKey as string | undefined;
  const { visibleData, brushProps } = useChartBrush({ data: displayData });
  const chartData = showBrush && !isLoading ? visibleData : displayData;
  const externalBrush = showBrush && !isLoading;
  const [plotAlign, setPlotAlign] = useState<ChartPlotInsets | null>(null);
  const [chartReadyEpoch, setChartReadyEpoch] = useState(0);
  const chartReadyRef = useRef(false);

  const handlePlotRect = useCallback((insets: ChartPlotInsets) => {
    setPlotAlign(insets);
    if (!chartReadyRef.current) {
      chartReadyRef.current = true;
      setChartReadyEpoch(1);
    }
  }, []);

  return (
    <PartRegistryProvider>
      <ChartContainer
        config={config}
        className={className}
        isLoading={isLoading}
        footer={
          showBrush && !isLoading ? (
            <BeeChartBrush
              data={displayData}
              compile={compileBarOption}
              rootFields={{ xDataKey: xKey, layout, stackType, barRadius, variant, externalBrush: true }}
              xDataKey={xKey}
              formatLabel={brushFormatLabel}
              plotAlign={plotAlign}
              {...brushProps}
            />
          ) : undefined
        }
      >
        <ChartPlotShell
          isLoading={isLoading}
          loadingVariant="bar"
          canvas={
            <BarChartCanvas
              data={chartData}
              xDataKey={xKey}
              layout={layout}
              stackType={stackType}
              barRadius={barRadius}
              variant={variant}
              externalBrush={externalBrush}
              onPlotRect={handlePlotRect}
              chartReadyEpoch={chartReadyEpoch}
              onHoverTraceChange={onHoverTraceChange}
            />
          }
        >
          {children}
        </ChartPlotShell>
      </ChartContainer>
    </PartRegistryProvider>
  );
}

export { ChartBackground as Background };

export function Grid() {
  const id = usePartId();
  useRegisterPart({ type: "grid", id });
  return null;
}

export function XAxis({
  dataKey,
  tickFormatter,
}: {
  dataKey?: string;
  tickFormatter?: (value: unknown) => string;
}) {
  const id = usePartId();
  useRegisterPart({ type: "xAxis", id, dataKey, tickFormatter });
  return null;
}

export function YAxis() {
  const id = usePartId();
  useRegisterPart({ type: "yAxis", id });
  return null;
}

export function Bar({
  dataKey,
  variant = "default",
  radius,
  stackId,
}: {
  dataKey: string;
  variant?: string;
  isClickable?: boolean;
  radius?: number;
  glowing?: boolean;
  bufferBar?: boolean;
  stackId?: string;
}) {
  const id = usePartId();
  useRegisterPart({ type: "bar", id, dataKey, variant, radius, stackId });
  return null;
}

export function Tooltip({
  variant,
  roundness,
  hideLabel,
  hideIndicator,
  hide,
}: {
  variant?: TooltipVariant;
  roundness?: TooltipRoundness;
  hideLabel?: boolean;
  hideIndicator?: boolean;
  hide?: boolean;
}) {
  return (
    <ChartTooltip
      variant={variant}
      roundness={roundness}
      hideLabel={hideLabel}
      hideIndicator={hideIndicator}
      hide={hide}
    />
  );
}

export function Legend({
  variant = "rounded-square",
  align = "right",
  isClickable = false,
  hideIcon,
  className,
}: {
  variant?: ChartLegendVariant;
  align?: "left" | "center" | "right";
  isClickable?: boolean;
  hideIcon?: boolean;
  className?: string;
}) {
  const id = usePartId();
  useRegisterPart({ type: "legend", id, variant, align, isClickable });
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <BeeChartLegend
      variant={variant}
      align={align}
      hideIcon={hideIcon}
      isClickable={isClickable}
      className={className}
      selected={selected}
      onSelectChange={setSelected}
    />
  );
}

bindChartLegendLayer(Legend);
