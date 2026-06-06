"use client";

import { useMemo, useState } from "react";
import {
  BeeCalendarChart,
  Calendar,
  Tooltip as CalendarTooltip,
  Legend as CalendarLegend,
} from "@/registry/charts/calendar-chart";
import {
  BeeHeatmapChart,
  Heatmap,
  Tooltip as HeatmapTooltip,
  Legend as HeatmapLegend,
} from "@/registry/charts/heatmap-chart";
import {
  prepareCalendarWorkloadCells,
  prepareTeamWorkloadMatrix,
} from "@/registry/lib/chart-recipes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  WORKLOAD_TEAM_ROWS,
  WORKLOAD_UTILIZATION_CONFIG,
  WORKLOAD_WEEK_DATES,
  computeTeamWorkloadSummary,
  workloadDaysForEmployee,
  workloadEmployeeNames,
} from "@/registry/examples/workload-demo-data";

type WorkloadView = "team" | "employee";

function MetricCard({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="bg-muted/40 rounded-lg px-4 py-3">
      <p className="text-muted-foreground text-xs uppercase tracking-wider">{label}</p>
      <p className="mt-1 text-2xl font-medium tabular-nums">{value}</p>
      {detail ? <p className="text-muted-foreground mt-1 text-xs">{detail}</p> : null}
    </div>
  );
}

export function BeeExampleWorkloadDashboardChart() {
  const [view, setView] = useState<WorkloadView>("team");
  const [employee, setEmployee] = useState("Maya Chen");

  const summary = useMemo(
    () => computeTeamWorkloadSummary(WORKLOAD_WEEK_DATES, WORKLOAD_TEAM_ROWS),
    [],
  );

  const teamMatrix = useMemo(
    () => prepareTeamWorkloadMatrix([...WORKLOAD_WEEK_DATES], WORKLOAD_TEAM_ROWS),
    [],
  );

  const employeeCalendar = useMemo(() => {
    const days = workloadDaysForEmployee(employee);
    return prepareCalendarWorkloadCells(days);
  }, [employee]);

  const employees = workloadEmployeeNames();

  return (
    <div className="flex h-full w-full flex-col gap-4 p-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard
          label="Team avg utilization"
          value={`${summary.avgUtilization}%`}
          detail="Assigned ÷ available, this week"
        />
        <MetricCard
          label="Overbooked slots"
          value={String(summary.overbookedSlots)}
          detail="Person-days at or above 100%"
        />
        <MetricCard
          label="Open capacity"
          value={`${summary.openHours.toFixed(0)}h`}
          detail="Unassigned hours this week"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <ToggleGroup
          type="single"
          size="sm"
          variant="outline"
          value={view}
          onValueChange={(next) => {
            if (next) setView(next as WorkloadView);
          }}
        >
          <ToggleGroupItem value="team" aria-label="Team week view">
            Team week
          </ToggleGroupItem>
          <ToggleGroupItem value="employee" aria-label="Employee month view">
            Employee month
          </ToggleGroupItem>
        </ToggleGroup>

        {view === "employee" ? (
          <Select value={employee} onValueChange={setEmployee}>
            <SelectTrigger size="sm" className="w-[200px]" aria-label="Select employee">
              <SelectValue placeholder="Select employee" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}
      </div>

      <div className="min-h-0 min-w-0 flex-1">
        {view === "team" ? (
          <BeeHeatmapChart config={WORKLOAD_UTILIZATION_CONFIG} className="h-full w-full">
            <Heatmap
              dataKey="utilization"
              data={teamMatrix.cells}
              xLabels={teamMatrix.colLabels}
              yLabels={teamMatrix.rowLabels}
              min={teamMatrix.min}
              max={teamMatrix.max}
              enableZoom={false}
            />
            <HeatmapLegend />
            <HeatmapTooltip />
          </BeeHeatmapChart>
        ) : (
          <BeeCalendarChart config={WORKLOAD_UTILIZATION_CONFIG} className="h-full w-full">
            <Calendar
              dataKey="utilization"
              data={employeeCalendar.cells}
              range={employeeCalendar.range}
              min={employeeCalendar.min}
              max={employeeCalendar.max}
              cellSize={22}
            />
            <CalendarLegend />
            <CalendarTooltip />
          </BeeCalendarChart>
        )}
      </div>
    </div>
  );
}
