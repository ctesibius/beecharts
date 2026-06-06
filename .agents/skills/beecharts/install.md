# Install BeeCharts components

Use the project’s package runner with the shadcn CLI (BeeCharts is a shadcn registry).

```bash
pnpm dlx shadcn@latest add @beecharts/<chart-name>
```

Examples:

```bash
pnpm dlx shadcn@latest add @beecharts/bar-chart
pnpm dlx shadcn@latest add @beecharts/line-chart
pnpm dlx shadcn@latest add @beecharts/chart @beecharts/tooltip @beecharts/legend
```

CLI installs into `components/beecharts/` (charts + ui).

## Chart recipes (BI helpers)

```bash
pnpm dlx shadcn@latest add @beecharts/chart-recipes
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
| `@beecharts/area-chart` | chart, tooltip, legend, dot, evil-brush, background |
| `@beecharts/line-chart` | same as area |
| `@beecharts/bar-chart` | chart, tooltip, legend, evil-brush, background |
| `@beecharts/composed-chart` | chart, tooltip, legend, dot, evil-brush, background |
| `@beecharts/pie-chart` | chart, tooltip, legend, background |
| `@beecharts/radial-chart` | chart, tooltip, legend, background |
| `@beecharts/radar-chart` | chart, tooltip, legend, dot, background |
| `@beecharts/scatter-chart` | chart, tooltip, legend, dot, background |
| `@beecharts/sankey-chart` | chart, tooltip, background |
| `@beecharts/treemap-chart` | chart, tooltip, legend, background |
| `@beecharts/funnel-chart` | chart, tooltip, legend, background |
| `@beecharts/waterfall-chart` | chart, tooltip, legend, background |
| `@beecharts/sparkline-chart` | chart, tooltip, dot, background |
| `@beecharts/chart-recipes` | none (data helpers only) |

Installing a chart automatically adds its `registryDependencies`.

## UI-only installs

| CLI | When |
|-----|------|
| `@beecharts/chart` | Required base — always needed |
| `@beecharts/tooltip` | If building custom tooltips |
| `@beecharts/legend` | If building custom legends |
| `@beecharts/dot` | Custom dots outside bundled charts |
| `@beecharts/background` | Custom backgrounds |
| `@beecharts/evil-brush` | Standalone brush experiments |

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
