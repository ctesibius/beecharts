# Registry examples index

Path: `src/registry/examples/<name>.tsx`

Shared **traffic** dataset (`desktop` / `mobile`, emerald + rose) lives in `example-shared.ts` and powers bar, line, and composed basic previews.

## Registered blocks (v1)

| Block | Chart |
|-------|-------|
| `ex-bar-chart` | bar |
| `ex-loading-state-bar-chart` | bar |
| `ex-line-chart` | line |
| `ex-loading-state-line-chart` | line |
| `ex-composed-chart` | composed (bar desktop + line mobile) |
| `ex-loading-state-composed-chart` | composed |
| `ex-pareto-chart` | composed (recipe) |
| `ex-pie-chart` | pie |
| `ex-gauge-chart` | radial semi |
| `ex-gauge-with-target-chart` | radial semi + target |
| `ex-heatmap-chart` | heatmap |
| `monospace-bar-chart` | bar blocks page (`/docs/bar-chart/blocks`) |

## Chart recipes (`@beecharts/chart-recipes`)

| Block | Primitive doc |
|-------|----------------|
| `ex-pareto-chart` | composed-chart |

## Not yet in registry

Many `ex-*` names in MDX (variants, area, scatter, sankey, etc.) are from the Recharts-era docs and are being ported. Do not reference them in new code until they appear in `registry-example.ts`.

## Agent workflow

1. [when-to-use.md](./when-to-use.md) → chart type  
2. [install.md](./install.md) → CLI + `chart-recipes`  
3. Closest registered `ex-*` file → copy composition  
4. [components.md](./components.md) → child parts  
5. [recipes.md](./recipes.md) → data helpers  
