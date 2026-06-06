import { absoluteUrl } from "@/lib/utils";
import { source } from "@/lib/source";
import { processMdxForLLMs } from "@/lib/llm";

const IMPORTANT_DOCS = new Set([
  "/docs",
  "/docs/installation",
  "/docs/components",
  "/docs/chart-config",
]);

const CHART_DOCS = new Set([
  "/docs/area-chart/static",
  "/docs/line-chart/static",
  "/docs/bar-chart/static",
  "/docs/bar-chart/blocks",
  "/docs/composed-chart/static",
  "/docs/radar-chart/static",
  "/docs/pie-chart/static",
  "/docs/heatmap-chart/static",
  "/docs/calendar-chart/static",
  "/docs/radial-chart/static",
  "/docs/sankey-chart/static",
  "/docs/scatter-chart/static",
  "/docs/treemap-chart/static",
  "/docs/funnel-chart/static",
  "/docs/waterfall-chart/static",
  "/docs/sparkline-chart/static",
  "/docs/chart-recipes",
]);

function getMarkdownUrl(pageUrl: string) {
  return pageUrl === "/docs" ? "/docs.md" : `${pageUrl}.md`;
}

function getPageSummary(page: ReturnType<typeof source.getPages>[number]) {
  return {
    title: page.data.title,
    description: page.data.description,
    url: page.url,
    markdownUrl: getMarkdownUrl(page.url),
  };
}

function renderLinks(pages: ReturnType<typeof source.getPages>) {
  return pages
    .map((page) => {
      const summary = getPageSummary(page);
      const description = summary.description ? ` - ${summary.description}` : "";
      return `- [${summary.title}](${summary.markdownUrl})${description}`;
    })
    .join("\n");
}

export function getAgentDocPages() {
  return source.getPages();
}

export function generateLlmsTxt() {
  const pages = getAgentDocPages();
  const startHere = pages.filter((page) => IMPORTANT_DOCS.has(page.url));
  const chartDocs = pages.filter((page) => CHART_DOCS.has(page.url));
  const uiDocs = pages.filter((page) => page.url.startsWith("/docs/ui/"));

  return `# BeeCharts Documentation

> BeeCharts is an open-source composable chart library for React dashboards, built with shadcn/ui and Apache ECharts.

## Start Here
${renderLinks(startHere)}

## Chart Components
${renderLinks(chartDocs)}

## UI Components
${renderLinks(uiDocs)}

## Agent Resources
- [Full documentation snapshot](/llms-full.txt)
- [Agent skill](/skill.md)
- [MCP server](/mcp)
`;
}

export async function generateLlmsFullTxt() {
  const pages = getAgentDocPages();
  const sections = await Promise.all(
    pages.map(async (page) => {
      const raw = await page.data.getText("raw");
      const content = processMdxForLLMs(raw).trim();
      const summary = getPageSummary(page);
      const description = summary.description ? `\n\n> ${summary.description}` : "";

      return `## ${summary.title}${description}

Source: ${absoluteUrl(summary.url)}
Markdown: ${absoluteUrl(summary.markdownUrl)}

${content}`;
    }),
  );

  return `# BeeCharts Full Documentation

> Full markdown snapshot of the BeeCharts documentation generated from the same MDX source as beecharts.local.

${sections.join("\n\n---\n\n")}
`;
}

export function generateSkillMd() {
  return `---
name: beecharts
description: Add and customize BeeCharts chart components in shadcn/ui projects (ECharts engine).
license: MIT
compatibility: Requires a React/Next.js project with shadcn/ui and echarts.
metadata:
  source: ${absoluteUrl("/llms.txt")}
---

# BeeCharts

Use this skill when a user wants to install, add, customize, or debug BeeCharts chart components.

## Workflow

1. Read \`/llms.txt\` to find the relevant documentation page.
2. For setup, follow \`/docs/installation.md\`.
3. For chart usage, read the matching chart page such as \`/docs/bar-chart/static.md\`.
4. For shared options, read \`/docs/chart-config.md\`, \`/docs/ui/tooltip.md\`, \`/docs/ui/legend.md\`, and \`/docs/ui/background.md\`.
5. Add components with: \`npx shadcn@latest add @beecharts/{chart-name}\`.

## Constraints

- BeeCharts compiles compound children (\`<Grid />\`, \`<Bar />\`, etc.) into ECharts \`option\` objects.
- Install \`echarts\` (and peers) alongside registry components.
- Preserve the user's existing shadcn/ui and Tailwind setup.
`;
}

export function getAgentSkillsIndex() {
  return {
    $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
    skills: [
      {
        name: "beecharts",
        type: "skill-md",
        description: "Add and customize BeeCharts chart components (ECharts engine).",
        url: "/.well-known/agent-skills/beecharts/SKILL.md",
      },
    ],
  };
}
