# Becocharts

Fork of [BeeCharts](https://github.com/legions-developer/becocharts) with **Apache ECharts** as the render engine instead of Recharts.

- Compound component API (`BeeBarChart`, `<Bar />`, `<Grid />`, …)
- `ChartConfig` design tokens (light/dark CSS variables on `[data-chart]`)
- `chart-recipes` data helpers for BI patterns

See [PLAN.md](./PLAN.md) for the full migration checklist.

## v1 charts

Bar, line, composed, pie, heatmap, gauge.

## Development

```bash
corepack enable
pnpm install
pnpm run dev
pnpm run registry:fresh
pnpm exec tsc --noEmit
```

Registry namespace: `@beecharts/*`
