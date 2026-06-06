export const dynamic = "force-static";
export const revalidate = false;

export function GET() {
  return Response.json({
    skills: [
      {
        name: "becocharts",
        description: "Add and customize BeeCharts chart components in shadcn/ui and Recharts projects.",
        files: ["skill.md"],
      },
    ],
  });
}
