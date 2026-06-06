---
name: beecharts
description: >-
  Build dashboards and BI visuals with BeeCharts composable React charts. Use when
  the user asks for charts, graphs, KPIs, sparklines, funnels, waterfalls,
  sankey, heatmaps, histograms, pareto, gauges, or @beecharts / BeeCharts
  components. Tells agents which Bee*Chart to install, which child parts to
  compose, when to use each chart type, and how to shape data. For contributing
  to the beecharts repo itself, use beecharts-build instead.
metadata:
  author: beecharts
  version: "1.0.0"
---

# BeeCharts (agent guide)

BeeCharts is a **composable** chart library: one root (`Bee*Chart`) + shared UI + children you assemble (`<Bar />`, `<Grid />`, `<Tooltip />`, …). It is **not** a single `<Chart type="bar" />` API.

Read in order:

| Doc | Use when |
|-----|----------|
| [when-to-use.md](./when-to-use.md) | Picking chart type from user intent |
| [install.md](./install.md) | CLI packages and peer deps |
| [components.md](./components.md) | Roots, parts, and props per chart |
| [recipes.md](./recipes.md) | `@beecharts/chart-recipes` — histogram, bullet, Pareto, heatmap, box plot, gauge |
| [examples.md](./examples.md) | Copy-paste reference implementations |

Repo docs: `https://beecharts.com/docs` (or local `/docs/<chart>`).

---

## Quick decision tree

```
User goal?
├─ Trend over time → line-chart or area-chart
├─ Compare categories → bar-chart
├─ Bars + line together → composed-chart
├─ Part-to-whole → pie-chart or treemap-chart
├─ Single KPI / progress arc → radial-chart (variant="semi")
├─ Compare metrics on axes → radar-chart
├─ X vs Y correlation → scatter-chart
├─ Flow / funnel stages → funnel-chart or sankey-chart
├─ Bridge / running total deltas → waterfall-chart
├─ Inline tiny trend (table/KPI) → sparkline-chart
├─ Distribution of numbers → bar-chart + binForHistogram (recipes.md)
├─ 80/20 / cumulative % → composed-chart + prepareParetoData (recipes.md)
└─ Hierarchy by area → treemap-chart
```

**Do not** install separate `gauge-chart`, `histogram-chart`, etc. Those are **patterns** on primitives (see [recipes.md](./recipes.md)).

---

## Non-negotiable patterns

1. **Install chart + UI deps** — Every chart needs `@beecharts/chart` at minimum; charts pull in `tooltip`, `legend`, `dot`, `background`, `bee-brush` as needed. See [install.md](./install.md).

2. **Compose children** — Root only holds `config`, `data`, layout props. Put `<Grid />`, axes, series, `<Tooltip />`, `<Legend />` inside the root.

3. **`chartConfig` drives colors** — Keys must match series `dataKey` / `nameKey`. Use theme-aware `colors.light` and `colors.dark`.

4. **Size the container** — `className="h-full w-full p-4"` (or fixed `h-64 w-full`) on the root. Sparklines often use `h-12`–`h-16`.

5. **Loading** — `isLoading` on the root; match skeleton with `ex-loading-state-*` examples in [examples.md](./examples.md).

6. **Selection** — `isClickable` on series + `<Legend isClickable />`; `onSelectionChange` on root where supported.

---

## Minimal template

```tsx
"use client";

import { BeeBarChart, Bar, Grid, XAxis, YAxis, Tooltip, Legend } from "@/components/beecharts/charts/bar-chart";
import { type ChartConfig } from "@/components/beecharts/ui/chart";

const data = [{ month: "Jan", desktop: 120, mobile: 80 }];

const chartConfig = {
  desktop: { label: "Desktop", colors: { light: ["#3b82f6"], dark: ["#60a5fa"] } },
  mobile: { label: "Mobile", colors: { light: ["#10b981"], dark: ["#34d399"] } },
} satisfies ChartConfig;

export function RevenueChart() {
  return (
    <BeeBarChart config={chartConfig} data={data} xDataKey="month" className="h-full w-full p-4">
      <Grid />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="desktop" />
      <Bar dataKey="mobile" />
    </BeeBarChart>
  );
}
```

Adjust import path to match the project (`@/components/beecharts/...` after CLI install).

---

## Shared UI modules

| CLI | Role |
|-----|------|
| `@beecharts/chart` | `ChartContainer`, `ChartConfig`, `LoadingIndicator` |
| `@beecharts/tooltip` | `ChartTooltip` / `ChartTooltipContent` (used by chart `Tooltip`) |
| `@beecharts/legend` | `ChartLegend` / `ChartLegendContent` |
| `@beecharts/dot` | Point markers for line/scatter/radar |
| `@beecharts/background` | `ChartBackground` / `backgroundVariant` on roots |
| `@beecharts/bee-brush` | Zoom brush footer on bar/line/area/composed |

---

## Related skills

- **composition-patterns** — compound components, context, avoid boolean prop sprawl
- **react-best-practices** — performance, motion, bundle size
- **beecharts-build** — only when modifying the beecharts repository (registry, docs)
