---
name: beecharts-build
description: >-
  Build and extend BeeCharts composable charts. Use when adding charts,
  examples, or docs in beecharts. Covers primitives only, chart-recipes data
  helpers, example placement on primitive doc pages, and registry wiring. Do not
  add new Bee*Chart modules that duplicate bar, scatter, radial, or composed.
metadata:
  author: beecharts
  version: "2.0.0"
---

# BeeCharts — Agent build guide

**Consumers** building apps with BeeCharts should use the **[beecharts](../beecharts/SKILL.md)** skill (when to use, install, components, recipes).

This skill is for **maintainers** of the beecharts repository only.

Read **[chart-catalog.md](./chart-catalog.md)** for the chart list and example index.

## Rules

1. **One primitive per Recharts family** — bar, line, area, composed, scatter, radial, pie, radar, sankey, treemap, waterfall, funnel, sparkline.
2. **BI shapes = data helpers + examples** — use `src/registry/lib/chart-recipes.ts`, not new chart components.
3. **Examples live on the primitive doc** — register blocks in `registry-example.ts` under that chart’s section; embed with `<ComponentPreview name="ex-…" />` in the matching `static.mdx`.
4. **No duplicate doc nav** — do not add `gauge-chart`, `histogram-chart`, etc. to `meta.json`.

## chart-recipes (`registry-lib.ts`)

Register lib in `registry-lib.ts`; document on `/docs/chart-recipes`.

| Helper | Use with | Example block |
|--------|----------|---------------|
| `binForHistogram(values, binCount)` | `BeeBarChart` | `ex-histogram-chart` |
| `prepareBulletRow(label, opts)` | `BeeBarChart` horizontal | `ex-bullet-chart` |
| `prepareParetoData(rows, nameKey, valueKey)` | `BeeComposedChart` | `ex-pareto-chart` |
| `prepareBoxPlotRow(category, samples)` | `BeeComposedChart` + bar shape | `ex-boxplot-chart` |
| `prepareHeatmapCells(rows, cols, matrix)` | `BeeScatterChart` | `ex-heatmap-chart` |
| `normalizeGaugeValue(value, min, max)` | `BeeRadialChart` semi | `ex-gauge-with-target-chart` |
| Semi + one `RadialBar` | `BeeRadialChart` `variant="semi"` | `ex-gauge-chart` |
| Two-axis scatter / sized shape | `BeeScatterChart` | `ex-bubble-chart`, `ex-bubble-sized-chart` |

## Workflow

1. Add or update `src/registry/examples/ex-<feature>-<primitive>-chart.tsx` (or keep semantic names like `ex-gauge-chart` on radial).
2. Register in `registry-example.ts` with `registryDependencies: ["@beecharts/<primitive>-chart"]`.
3. Add `<ComponentPreview />` under **Examples** in the primitive’s `static.mdx`.
4. Run `npx tsx ./src/scripts/build-registry.mts`.

## Conventions

- `className="h-full w-full p-4"` on chart roots.
- `chartConfig` with `satisfies ChartConfig` and light/dark colors.
- Recharts `isAnimationActive={false}`; motion on primitives handles intro.
- Pair with **composition-patterns** and **react-best-practices**.

## Checklist

- [ ] No new `src/registry/charts/<recipe>-chart.tsx` unless truly custom geometry (waterfall, funnel, sankey, sparkline tier).
- [ ] Data prep in `chart-recipes.ts` if reused.
- [ ] Example + preview only on primitive doc page.
- [ ] Registry build run.
