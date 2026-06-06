# Data recipes (`@evilcharts/chart-recipes`)

Install once:

```bash
npx shadcn@latest add @evilcharts/chart-recipes
```

Repo source: `src/registry/lib/chart-recipes.ts`. Docs: `/docs/chart-recipes`.

---

## Histogram → `BeeBarChart`

```ts
const data = binForHistogram(values, 8);
// { bin, count }[]
```

**Example:** `ex-histogram-chart` — [bar-chart doc](/docs/bar-chart)

---

## Bullet → `BeeBarChart`

```ts
const data = [prepareBulletRow("Revenue", { actual: 72, target: 80, max: 100 })];
```

Use `layout="horizontal"`, `stackType="stacked"` for range bands, then `actual` and `target` bars.

**Example:** `ex-bullet-chart`

---

## Pareto → `BeeComposedChart`

```ts
const data = prepareParetoData(rows, "cause", "count");
// adds count + cumulative (0–100)
```

Dual `YAxis` + `<Bar dataKey="count" />` + `<Line dataKey="cumulative" />`.

**Example:** `ex-pareto-chart`

---

## Box plot → `BeeComposedChart`

```ts
const row = prepareBoxPlotRow("Team A", samples);
const data = [row].map((r) => ({ ...r, iqr: Math.max(r.q3 - r.q1, 1) }));
```

Custom `<Bar barProps={{ shape: BoxPlotShape }} />` — see `ex-boxplot-chart`.

---

## Heatmap → `BeeScatterChart`

```ts
const { cells, min, max } = prepareHeatmapCells(rowLabels, colLabels, matrix);
```

Render with categorical tick formatters and a square `scatterProps.shape`.

**Example:** `ex-heatmap-chart`

---

## Gauge → `BeeRadialChart`

`nameKey` values must match `chartConfig` keys (use `series`, not a free-form label).

```ts
const data = [{ series: "score", value: normalizeGaugeValue(72, 0, 100) }];
// chartConfig.score, nameKey="series", <RadialBar dataKey="value" />

const withTarget = prepareGaugeRows({ score: 72, target: 80 });
// chartConfig.score + chartConfig.target
```

`variant="semi"`, `<RadialBar dataKey="value" />`.

**Examples:** `ex-gauge-chart`, `ex-gauge-with-target-chart`

---

## Bubble (sized) → `BeeScatterChart`

Add a `size` field per point; use `scatterProps.shape` to scale radius.

**Examples:** `ex-bubble-chart`, `ex-bubble-sized-chart`

---

## When not to add a chart module

Histogram, Pareto, bullet, heatmap, gauge, and box plot stay **recipes** on existing primitives unless geometry is truly custom (waterfall, funnel, sankey, sparkline tier).
