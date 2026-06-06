import type { EChartsOption } from "echarts";
import { applyChartUiToOption } from "./apply-chart-ui";
import type { CompileContext, PieSeriesPart } from "./parts/types";

export function compilePieOption(ctx: CompileContext): EChartsOption {
  const pies = ctx.parts.filter((p): p is PieSeriesPart => p.type === "pie");
  const pie = pies[0];
  const nameKey = pie?.nameKey ?? ctx.nameKey ?? Object.keys(ctx.data[0] ?? {})[0];
  const valueKey = pie?.dataKey ?? "value";

  const pieData = ctx.data.map((row) => {
    const seriesKey = String(row[nameKey] ?? "");
    return {
      name: ctx.config[seriesKey]?.label?.toString() ?? seriesKey,
      value: Number(row[valueKey] ?? row[seriesKey] ?? 0),
      itemStyle: { color: ctx.resolveColor(seriesKey, 0) },
    };
  });

  const inner = pie?.innerRadius ?? 0;
  const outer = pie?.outerRadius ?? "70%";

  const base: EChartsOption = {
    tooltip: { trigger: "item" },
    series: [
      {
        type: "pie",
        radius: [inner, outer],
        data: pieData,
        emphasis: { itemStyle: { shadowBlur: 10 } },
      },
    ],
  };

  return applyChartUiToOption(ctx, base);
}
