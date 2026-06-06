import { type ChartConfig } from "@/registry/ui/chart";
import type { SankeyGraph, TreemapNode } from "@/registry/echarts-core/parts/types";
import { DUAL_SERIES_CHART_CONFIG, TRAFFIC_MONTHLY_DATA } from "./example-shared";

export { TRAFFIC_MONTHLY_DATA, DUAL_SERIES_CHART_CONFIG };

export const SCATTER_DESKTOP = [
  { x: 120, y: 260 },
  { x: 180, y: 420 },
  { x: 240, y: 310 },
  { x: 320, y: 480 },
  { x: 390, y: 360 },
  { x: 450, y: 520 },
  { x: 510, y: 410 },
  { x: 580, y: 550 },
];

export const SCATTER_MOBILE = [
  { x: 140, y: 180 },
  { x: 210, y: 290 },
  { x: 280, y: 220 },
  { x: 350, y: 340 },
  { x: 420, y: 270 },
  { x: 490, y: 380 },
  { x: 560, y: 300 },
  { x: 620, y: 430 },
];

export const RADAR_SKILLS_DATA = [
  { skill: "JavaScript", desktop: 186, mobile: 80 },
  { skill: "TypeScript", desktop: 305, mobile: 200 },
  { skill: "React", desktop: 237, mobile: 120 },
  { skill: "Node.js", desktop: 173, mobile: 190 },
  { skill: "CSS", desktop: 209, mobile: 130 },
  { skill: "Python", desktop: 214, mobile: 140 },
];

export const SANKEY_MARKETING: SankeyGraph = {
  nodes: [
    { name: "Organic" },
    { name: "PaidAds" },
    { name: "Social" },
    { name: "Landing" },
    { name: "Product" },
    { name: "Cart" },
    { name: "Purchase" },
    { name: "Bounced" },
  ],
  links: [
    { source: 0, target: 3, value: 42000 },
    { source: 1, target: 3, value: 28000 },
    { source: 2, target: 3, value: 18000 },
    { source: 3, target: 4, value: 52000 },
    { source: 3, target: 7, value: 36000 },
    { source: 4, target: 5, value: 31000 },
    { source: 4, target: 7, value: 21000 },
    { source: 5, target: 6, value: 24000 },
    { source: 5, target: 7, value: 7000 },
  ],
};

export const SANKEY_CONFIG = {
  Organic: { label: "Organic", colors: { light: ["#059669"], dark: ["#34d399"] } },
  PaidAds: { label: "Paid Ads", colors: { light: ["#dc2626"], dark: ["#f87171"] } },
  Social: { label: "Social", colors: { light: ["#7c3aed"], dark: ["#a78bfa"] } },
  Landing: { label: "Landing", colors: { light: ["#0891b2"], dark: ["#22d3ee"] } },
  Product: { label: "Product", colors: { light: ["#2563eb"], dark: ["#60a5fa"] } },
  Cart: { label: "Cart", colors: { light: ["#ea580c"], dark: ["#fb923c"] } },
  Purchase: { label: "Purchase", colors: { light: ["#16a34a"], dark: ["#4ade80"] } },
  Bounced: { label: "Bounced", colors: { light: ["#f43f5e"], dark: ["#fb7185"] } },
} satisfies ChartConfig;

export const FUNNEL_DATA = [
  { stage: "visitors", value: 10000 },
  { stage: "signups", value: 5200 },
  { stage: "trials", value: 2800 },
  { stage: "paid", value: 1200 },
];

export const FUNNEL_CONFIG = {
  visitors: { label: "Visitors", colors: { light: ["#3b82f6"], dark: ["#60a5fa"] } },
  signups: { label: "Signups", colors: { light: ["#10b981"], dark: ["#34d399"] } },
  trials: { label: "Trials", colors: { light: ["#f59e0b"], dark: ["#fbbf24"] } },
  paid: { label: "Paid", colors: { light: ["#be123c"], dark: ["#f43f5e"] } },
} satisfies ChartConfig;

export const WATERFALL_DATA = [
  { name: "opening", value: 120, type: "start" },
  { name: "product-a", value: 45, type: "increase" },
  { name: "returns", value: -15, type: "decrease" },
  { name: "marketing", value: 20, type: "increase" },
  { name: "closing", value: 170, type: "total" },
];

export const WATERFALL_CONFIG = {
  opening: { label: "Opening", colors: { light: ["#64748b"], dark: ["#94a3b8"] } },
  "product-a": { label: "Product A", colors: { light: ["#10b981"], dark: ["#34d399"] } },
  returns: { label: "Returns", colors: { light: ["#f43f5e"], dark: ["#fb7185"] } },
  marketing: { label: "Marketing", colors: { light: ["#3b82f6"], dark: ["#60a5fa"] } },
  closing: { label: "Closing", colors: { light: ["#8b5cf6"], dark: ["#a78bfa"] } },
} satisfies ChartConfig;

export const TREEMAP_DATA: TreemapNode[] = [
  {
    name: "Engineering",
    children: [
      { name: "Frontend", value: 420 },
      { name: "Backend", value: 380 },
      { name: "Infra", value: 220 },
    ],
  },
  {
    name: "Growth",
    children: [
      { name: "Marketing", value: 310 },
      { name: "Sales", value: 290 },
    ],
  },
];

export const TREEMAP_CONFIG = {
  Engineering: { label: "Engineering", colors: { light: ["#3b82f6"], dark: ["#60a5fa"] } },
  Frontend: { label: "Frontend", colors: { light: ["#10b981"], dark: ["#34d399"] } },
  Backend: { label: "Backend", colors: { light: ["#8b5cf6"], dark: ["#a78bfa"] } },
  Infra: { label: "Infra", colors: { light: ["#f59e0b"], dark: ["#fbbf24"] } },
  Growth: { label: "Growth", colors: { light: ["#be123c"], dark: ["#f43f5e"] } },
  Marketing: { label: "Marketing", colors: { light: ["#0891b2"], dark: ["#22d3ee"] } },
  Sales: { label: "Sales", colors: { light: ["#047857"], dark: ["#10b981"] } },
} satisfies ChartConfig;

export const SPARKLINE_DATA = [
  { value: 12 },
  { value: 18 },
  { value: 14 },
  { value: 22 },
  { value: 19 },
  { value: 28 },
  { value: 24 },
  { value: 32 },
  { value: 29 },
  { value: 36 },
];

export const SPARKLINE_CONFIG = {
  trend: { label: "Sessions", colors: { light: ["#047857"], dark: ["#10b981"] } },
} satisfies ChartConfig;

export const BROWSER_DATA = [
  { browser: "chrome", visitors: 275 },
  { browser: "safari", visitors: 200 },
  { browser: "firefox", visitors: 187 },
  { browser: "edge", visitors: 173 },
  { browser: "other", visitors: 90 },
];

export const BROWSER_GRADIENT_CONFIG = {
  chrome: { label: "Chrome", colors: { light: ["#3b82f6", "#06b6d4"], dark: ["#60a5fa", "#22d3ee"] } },
  safari: { label: "Safari", colors: { light: ["#10b981", "#14b8a6"], dark: ["#34d399", "#2dd4bf"] } },
  firefox: { label: "Firefox", colors: { light: ["#f59e0b", "#ef4444"], dark: ["#fbbf24", "#f87171"] } },
  edge: { label: "Edge", colors: { light: ["#8b5cf6", "#6366f1"], dark: ["#a78bfa", "#818cf8"] } },
  other: { label: "Other", colors: { light: ["#6b7280", "#9ca3af"], dark: ["#9ca3af", "#d1d5db"] } },
} satisfies ChartConfig;

export const BROWSER_CONFIG = {
  chrome: { label: "Chrome", colors: { light: ["#3b82f6"], dark: ["#60a5fa"] } },
  safari: { label: "Safari", colors: { light: ["#10b981"], dark: ["#34d399"] } },
  firefox: { label: "Firefox", colors: { light: ["#f59e0b"], dark: ["#fbbf24"] } },
  edge: { label: "Edge", colors: { light: ["#8b5cf6"], dark: ["#a78bfa"] } },
  other: { label: "Other", colors: { light: ["#6b7280"], dark: ["#9ca3af"] } },
} satisfies ChartConfig;

export const CHART_CONFIG_WITH_ICONS = {
  desktop: {
    label: "Desktop",
    colors: { light: ["#047857"], dark: ["#10b981"] },
  },
  mobile: {
    label: "Mobile",
    colors: { light: ["#be123c"], dark: ["#f43f5e"] },
  },
} satisfies ChartConfig;
