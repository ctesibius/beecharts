# BeeCharts chart catalog (simplified)

## Primitives (the only chart modules)

| Slug | Module | Notes |
|------|--------|--------|
| area-chart | `BeeAreaChart` | |
| line-chart | `BeeLineChart` | `showBrush` |
| bar-chart | `BeeBarChart` | histogram + bullet examples |
| composed-chart | `BeeComposedChart` | pareto + boxplot examples |
| pie-chart | `BeePieChart` | |
| radial-chart | `BeeRadialChart` | semi + gauge examples |
| radar-chart | `BeeRadarChart` | |
| scatter-chart | `BeeScatterChart` | bubble + heatmap examples |
| sankey-chart | `BeeSankeyChart` | Custom flow layout |
| treemap-chart | `BeeTreemapChart` | |
| waterfall-chart | `BeeWaterfallChart` | Bridge math |
| funnel-chart | `BeeFunnelChart` | Stage layout |
| sparkline-chart | `BeeSparklineChart` | Compact domain |

## Library (`registry:lib`)

| Slug | File | Helpers |
|------|------|---------|
| chart-recipes | `lib/chart-recipes.ts` | `binForHistogram`, `prepareParetoData`, `prepareBulletRow`, `prepareHeatmapCells`, `prepareBoxPlotRow`, `normalizeGaugeValue`, `prepareGaugeRows` |

CLI: `@beecharts/chart-recipes` — doc `/docs/chart-recipes`

## Example placement (single doc per primitive)

| Block name | Documented on |
|------------|---------------|
| `ex-histogram-chart`, `ex-loading-state-histogram-chart`, `ex-bullet-chart` | bar-chart |
| `ex-pareto-chart`, `ex-loading-state-pareto-chart`, `ex-boxplot-chart` | composed-chart |
| `ex-gauge-chart`, `ex-loading-state-gauge-chart`, `ex-gauge-with-target-chart` | radial-chart |
| `ex-bubble-chart`, `ex-bubble-sized-chart`, `ex-glowing-bubble-chart`, `ex-loading-state-bubble-chart`, `ex-heatmap-chart` | scatter-chart |

Bar **blocks** only: `/docs/bar-chart/blocks` (`monospace-bar-chart`, etc.)

## Removed (do not reintroduce)

- Separate registry components: `gauge-chart`, `bullet-chart`, `heatmap-chart`, `pareto-chart`, `bubble-chart`, `histogram-chart`
- Separate doc slugs for the above (use primitive + chart-recipes)
- Duplicate example `.tsx` for the same preview
