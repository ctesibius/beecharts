# BeeCharts — Agent skills

Two skills live under `.agents/skills/`:

| Skill | Audience | Use when |
|-------|----------|----------|
| **evilcharts** | App developers and their coding agents | Choosing charts, installing `@evilcharts/*`, composing `Evil*Chart` children, BI recipes |
| **evilcharts-build** | Contributors to this repository | Registry, examples, docs, `chart-recipes.ts`, no duplicate chart modules |

## For consumer agents (default)

Start at [evilcharts/SKILL.md](./evilcharts/SKILL.md).

1. [when-to-use.md](./evilcharts/when-to-use.md) — goal → chart type
2. [install.md](./evilcharts/install.md) — CLI and deps
3. [components.md](./evilcharts/components.md) — roots and child parts
4. [recipes.md](./evilcharts/recipes.md) — histogram, pareto, gauge, etc.
5. [examples.md](./evilcharts/examples.md) — `ex-*` block names to copy

Docs site: `/docs/chart-recipes` for all BI helpers; primitives under `/docs/<chart>`.

## For repo maintainers

Start at [evilcharts-build/SKILL.md](./evilcharts-build/SKILL.md) and [chart-catalog.md](./evilcharts-build/chart-catalog.md).

## Pointing your agent at these skills

- **Cursor / Claude Code:** Copy or symlink `.agents/skills/evilcharts` into the project’s agent skills path, or reference the folder in project rules.
- **Trigger phrases:** BeeCharts, `@evilcharts`, gauge, histogram, pareto, waterfall, funnel, sankey, composable chart, `BeeBarChart`.

## Design principles (all agents)

- Compound components — no boolean `isGauge` on one mega chart
- Primitives + data recipes — not separate packages per BI synonym
- `chartConfig` keys match `dataKey`
- Size with `className` on the chart root
