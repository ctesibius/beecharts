"use client";

import { type ChartConfig, ChartContainer, getLoadingData } from "@/registry/ui/chart";
import { BeeChartBrush } from "@/registry/echarts-core/bee-chart-brush";
import type { ChartPlotInsets } from "@/registry/echarts-core/chart-grid";
import { ChartPlotShell } from "@/registry/echarts-core/chart-plot-shell";
import { EChartsHost } from "@/registry/echarts-core/echarts-host";
import { PartRegistryProvider, usePartId, useRegisterPart } from "@/registry/echarts-core/part-registry";
import { compileLineOption } from "@/registry/echarts-core/compile-line";
import { useChartBrush } from "@/registry/echarts-core/use-chart-brush";
import { useCompiledOption } from "@/registry/echarts-core/use-compiled-option";
import { ChartBackground } from "@/registry/ui/background";
import {
  BeeChartLegend,
  bindChartLegendLayer,
  type ChartLegendVariant,
} from "@/registry/ui/legend";
import { ChartTooltip, type TooltipRoundness, type TooltipVariant } from "@/registry/ui/tooltip";
import { type ReactNode, useState } from "react";

type BeeLineChartProps<
  TData extends Record<string, unknown>,
  TConfig extends Record<string, ChartConfig[string]>,
> = {
  config: TConfig;
  data: TData[];
  children: ReactNode;
  className?: string;
  xDataKey?: keyof TData & string;
  isLoading?: boolean;
  showBrush?: boolean;
  brushFormatLabel?: (value: unknown, index: number) => string;
};

function LineChartCanvas<TData extends Record<string, unknown>>({
  data,
  xDataKey,
  externalBrush,
  onPlotRect,
}: {
  data: TData[];
  xDataKey?: string;
  externalBrush?: boolean;
  onPlotRect?: (insets: ChartPlotInsets) => void;
}) {
  const { option, colorEpoch } = useCompiledOption(compileLineOption, {
    data,
    xDataKey,
    externalBrush,
  });
  return <EChartsHost option={option} colorEpoch={colorEpoch} onPlotRect={onPlotRect} />;
}

export function BeeLineChart<
  TData extends Record<string, unknown>,
  TConfig extends Record<string, ChartConfig[string]>,
>({
  config,
  data,
  children,
  className,
  xDataKey,
  isLoading,
  showBrush = true,
  brushFormatLabel,
}: BeeLineChartProps<TData, TConfig>) {
  const displayData = isLoading
    ? (getLoadingData(12) as unknown as TData[])
    : data;
  const { visibleData, brushProps } = useChartBrush({ data: displayData });
  const xKey = xDataKey as string | undefined;
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
              compile={compileLineOption}
              rootFields={{ xDataKey: xKey, externalBrush: true }}
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
          loadingVariant="line"
          canvas={
            <LineChartCanvas
              data={chartData}
              xDataKey={xKey}
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

export function YAxis() {
  const id = usePartId();
  useRegisterPart({ type: "yAxis", id });
  return null;
}

export function Line({
  dataKey,
  curveType = "linear",
}: {
  dataKey: string;
  curveType?: "linear" | "monotone" | "step";
  lineProps?: Record<string, unknown>;
}) {
  const id = usePartId();
  useRegisterPart({ type: "line", id, dataKey, curveType });
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
