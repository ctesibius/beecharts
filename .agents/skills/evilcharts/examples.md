# Registry examples index

Path: `src/registry/examples/<name>.tsx`

## Chart recipes (`@evilcharts/chart-recipes`)

| Block | Primitive doc |
|-------|----------------|
| `ex-histogram-chart`, `ex-loading-state-histogram-chart` | bar-chart |
| `ex-bullet-chart` | bar-chart |
| `ex-pareto-chart`, `ex-loading-state-pareto-chart` | composed-chart |
| `ex-boxplot-chart` | composed-chart |
| `ex-gauge-chart`, `ex-loading-state-gauge-chart`, `ex-gauge-with-target-chart` | radial-chart |
| `ex-bubble-chart`, `ex-bubble-sized-chart`, `ex-glowing-bubble-chart`, `ex-loading-state-bubble-chart` | scatter-chart |
| `ex-heatmap-chart` | scatter-chart |

## Core entry examples

| Block | Chart |
|-------|-------|
| `ex-bar-chart` | bar |
| `ex-line-chart` | line |
| `ex-area-chart` | area |
| `ex-composed-chart` | composed |
| `ex-pie-chart` | pie |
| `ex-radial-chart` | radial full |
| `ex-semi-variant-radial-chart` | radial semi |
| `ex-radar-chart` | radar |
| `ex-scatter-chart` | scatter |
| `ex-waterfall-chart` | waterfall |
| `ex-funnel-chart` | funnel |
| `ex-sankey-chart` | sankey |
| `ex-treemap-chart` | treemap |
| `ex-sparkline-chart` | sparkline |

## Bar blocks (separate doc page)

| Block | CLI |
|-------|-----|
| `monospace-bar-chart` | `@evilcharts/monospace-bar-chart` |
| `hover-trace-bar-chart` | `@evilcharts/hover-trace-bar-chart` |
| `grid-bar-chart` | `@evilcharts/grid-bar-chart` |
| `isometric-bar-chart` | `@evilcharts/isometric-bar-chart` |

Documented on `/docs/bar-chart/blocks` — only bar chart uses a **blocks** sub-page.

## Loading states

`ex-loading-state-<family>-chart` per primitive family.

## Agent workflow

1. [when-to-use.md](./when-to-use.md) → chart type  
2. [install.md](./install.md) → CLI + `chart-recipes`  
3. Closest `ex-*` file → copy composition  
4. [components.md](./components.md) → child parts  
5. [recipes.md](./recipes.md) → data helpers  
