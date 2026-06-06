# Install BeeCharts components

Use the project’s package runner with the shadcn CLI (BeeCharts is a shadcn registry).

```bash
pnpm dlx shadcn@latest add @evilcharts/<chart-name>
```

Examples:

```bash
pnpm dlx shadcn@latest add @evilcharts/bar-chart
pnpm dlx shadcn@latest add @evilcharts/line-chart
pnpm dlx shadcn@latest add @evilcharts/chart @evilcharts/tooltip @evilcharts/legend
```

CLI installs into `components/beecharts/` (charts + ui).

## Chart recipes (BI helpers)

```bash
pnpm dlx shadcn@latest add @evilcharts/chart-recipes
```

Installs `lib/chart-recipes.ts`. Use with primitives — see [recipes.md](./recipes.md) and `/docs/chart-recipes`.

## Peer dependencies

Charts declare:

- `echarts`
- `motion` (motion.dev)

Install once per app:

```bash
pnpm add echarts motion
```

## Registry packages by chart

| Chart CLI | Pulls UI deps (typical) |
|-----------|------------------------|
| `@evilcharts/area-chart` | chart, tooltip, legend, dot, bee-brush, background |
| `@evilcharts/line-chart` | same as area |
| `@evilcharts/bar-chart` | chart, tooltip, legend, bee-brush, background |
| `@evilcharts/composed-chart` | chart, tooltip, legend, dot, bee-brush, background |
| `@evilcharts/pie-chart` | chart, tooltip, legend, background |
| `@evilcharts/radial-chart` | chart, tooltip, legend, background |
| `@evilcharts/radar-chart` | chart, tooltip, legend, dot, background |
| `@evilcharts/scatter-chart` | chart, tooltip, legend, dot, background |
| `@evilcharts/sankey-chart` | chart, tooltip, background |
| `@evilcharts/treemap-chart` | chart, tooltip, legend, background |
| `@evilcharts/funnel-chart` | chart, tooltip, legend, background |
| `@evilcharts/waterfall-chart` | chart, tooltip, legend, background |
| `@evilcharts/sparkline-chart` | chart, tooltip, dot, background |
| `@evilcharts/chart-recipes` | none (data helpers only) |

Installing a chart automatically adds its `registryDependencies`.

## UI-only installs

| CLI | When |
|-----|------|
| `@evilcharts/chart` | Required base — always needed |
| `@evilcharts/tooltip` | If building custom tooltips |
| `@evilcharts/legend` | If building custom legends |
| `@evilcharts/dot` | Custom dots outside bundled charts |
| `@evilcharts/background` | Custom backgrounds |
| `@evilcharts/bee-brush` | Standalone brush experiments |

## Import paths (after install)

```tsx
import { BeeBarChart, Bar, XAxis, YAxis, Grid, Tooltip, Legend } from "@/components/beecharts/charts/bar-chart";
import { type ChartConfig } from "@/components/beecharts/ui/chart";
import { binForHistogram, prepareBulletRow } from "@/lib/chart-recipes";
```

Paths may use `@/registry/...` inside the beecharts repo; consumer apps use `components/beecharts/...` and `lib/chart-recipes.ts`.

## Docs

- Primitives: `/docs/bar-chart`, `/docs/line-chart`, etc.
- Recipes: `/docs/chart-recipes`
- Copy patterns from registry examples: see [examples.md](./examples.md)
