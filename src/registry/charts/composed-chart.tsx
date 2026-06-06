"use client";

import { type ChartConfig, ChartContainer, getLoadingData } from "@/registry/ui/chart";
import { BeeChartBrush } from "@/registry/echarts-core/bee-chart-brush";
import type { ChartPlotInsets } from "@/registry/echarts-core/chart-grid";
import { ChartPlotShell } from "@/registry/echarts-core/chart-plot-shell";
import { EChartsHost } from "@/registry/echarts-core/echarts-host";
import { PartRegistryProvider, usePartId, useRegisterPart } from "@/registry/echarts-core/part-registry";
import { compileComposedOption } from "@/registry/echarts-core/compile-composed";
import { useChartBrush } from "@/registry/echarts-core/use-chart-brush";
import { useCompiledOption } from "@/registry/echarts-core/use-compiled-option";
import { ChartBackground } from "@/registry/ui/background";
import {
  BeeChartLegend,
  bindChartLegendLayer,
  type ChartLegendVariant,
} from "@/registry/ui/legend";
import { ChartTooltip, type TooltipRoundness, type TooltipVariant } from "@/registry/ui/tooltip";
import type { ReactNode } from "react";
import { useState } from "react";

type BeeComposedChartProps<
  TData extends Record<string, unknown>,
  TConfig extends Record<string, ChartConfig[string]>,
> = {
  config: TConfig;
  data: TData[];
  children: ReactNode;
  className?: string;
  xDataKey?: keyof TData & string;
  isLoading?: boolean;
  loadingBars?: number;
  showBrush?: boolean;
  barRadius?: number;
  brushFormatLabel?: (value: unknown, index: number) => string;
};

function ComposedChartCanvas<TData extends Record<string, unknown>>({
  data,
  xDataKey,
  barRadius,
  externalBrush,
  onPlotRect,
}: {
  data: TData[];
  xDataKey?: string;
  barRadius?: number;
  externalBrush?: boolean;
  onPlotRect?: (insets: ChartPlotInsets) => void;
}) {
  const { option, colorEpoch } = useCompiledOption(compileComposedOption, {
    data,
    xDataKey,
    barRadius,
    externalBrush,
  });
  return <EChartsHost option={option} colorEpoch={colorEpoch} onPlotRect={onPlotRect} />;
}

export function BeeComposedChart<
  TData extends Record<string, unknown>,
  TConfig extends Record<string, ChartConfig[string]>,
>({
  config,
  data,
  children,
  className,
  xDataKey,
  isLoading = false,
  loadingBars,
  showBrush = true,
  barRadius,
  brushFormatLabel,
}: BeeComposedChartProps<TData, TConfig>) {
  const displayData = isLoading
    ? (getLoadingData(loadingBars ?? 8) as unknown as TData[])
    : data;
  const xKey = xDataKey as string | undefined;
  const { visibleData, brushProps } = useChartBrush({ data: displayData });
  const chartData = showBrush && !isLoading ? visibleData : displayData;
  const externalBrush = showBrush && !isLoading;
  const [plotAlign, setPlotAlign] = useState<ChartPlotInsets | null>(null);

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
              compile={compileComposedOption}
              rootFields={{ xDataKey: xKey, barRadius, externalBrush: true }}
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
          loadingVariant="composed"
          canvas={
            <ComposedChartCanvas
              data={chartData}
              xDataKey={xKey}
              barRadius={barRadius}
              externalBrush={externalBrush}
              onPlotRect={setPlotAlign}
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

export function YAxis({
  yAxisId,
  orientation,
  domain,
  unit,
}: {
  yAxisId?: string;
  orientation?: "left" | "right";
  domain?: [number, number];
  unit?: string;
}) {
  const id = usePartId();
  useRegisterPart({ type: "yAxis", id, yAxisId, orientation, domain, unit });
  return null;
}

export function Bar({
  dataKey,
  barProps,
  radius,
  stackId,
  showInLegend,
}: {
  dataKey: string;
  barProps?: { yAxisId?: string };
  radius?: number;
  stackId?: string;
  showInLegend?: boolean;
}) {
  const id = usePartId();
  useRegisterPart({
    type: "bar",
    id,
    dataKey,
    yAxisId: barProps?.yAxisId,
    radius,
    stackId,
    showInLegend,
  });
  return null;
}

export function Line({
  dataKey,
  lineProps,
  curveType = "linear",
  variant,
  showInLegend,
}: {
  dataKey: string;
  curveType?: "linear" | "monotone" | "step";
  lineProps?: { yAxisId?: string };
  /** `points` — markers only (e.g. box-plot median ticks). */
  variant?: "points";
  showInLegend?: boolean;
}) {
  const id = usePartId();
  useRegisterPart({
    type: "line",
    id,
    dataKey,
    curveType,
    yAxisId: lineProps?.yAxisId,
    variant,
    showInLegend,
  });
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
