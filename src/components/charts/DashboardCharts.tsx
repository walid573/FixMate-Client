"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ---------------------------------------------------------------------------
// Shared charts for the three overview dashboards. Data is always passed in
// from the server components — these are presentation-only client components.
// Colors mirror the shared booking-status palette + brand tokens.
// ---------------------------------------------------------------------------

export const NAVY = "#102747";
export const ORANGE = "#ff963d";

const STATUS_COLORS: Record<string, string> = {
  requested: "#3b82f6", // blue
  accepted: "#6366f1", // indigo
  "in-progress": "#f59e0b", // amber
  completed: "#10b981", // green
  rejected: "#ef4444", // red
  cancelled: "#94a3b8", // gray
};

const STATUS_LABELS: Record<string, string> = {
  requested: "Requested",
  accepted: "Accepted",
  "in-progress": "In Progress",
  completed: "Completed",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

const AXIS = { fontSize: 11, fill: "#64748b" } as const;

export function BookingStatusDonut({
  bookings,
}: {
  bookings: Array<{ status?: string }>;
}) {
  const data = Object.keys(STATUS_LABELS)
    .map((key) => ({
      key,
      name: STATUS_LABELS[key],
      value: bookings.filter((b) => b.status === key).length,
    }))
    .filter((d) => d.value > 0);

  if (data.length === 0) {
    return <ChartEmpty />;
  }

  return (
    <ResponsiveContainer width="100%" height={230}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={55}
          outerRadius={82}
          paddingAngle={2}
          stroke="none"
        >
          {data.map((entry) => (
            <Cell key={entry.key} fill={STATUS_COLORS[entry.key]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0", fontSize: 12 }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

interface PaymentLike {
  amount: number;
  paidAt?: string | null;
  createdAt?: string | null;
}

export function RevenueBarChart({ payments }: { payments: PaymentLike[] }) {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleDateString("en-US", { month: "short" }),
      revenue: 0,
    };
  });
  const byKey = new Map(months.map((m) => [m.key, m]));

  payments.forEach((p) => {
    const raw = p.paidAt || p.createdAt;
    if (!raw) return;
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return;
    const bucket = byKey.get(`${d.getFullYear()}-${d.getMonth()}`);
    if (bucket) bucket.revenue += Number(p.amount) || 0;
  });

  return (
    <ResponsiveContainer width="100%" height={230}>
      <BarChart data={months} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="label" tick={AXIS} tickLine={false} axisLine={false} />
        <YAxis
          tick={AXIS}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => `$${v.toLocaleString()}`}
        />
        <Tooltip
          cursor={{ fill: "rgba(16,39,71,0.04)" }}
          formatter={(v) => [`$${Number(v).toLocaleString()}`, "Revenue"]}
          contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0", fontSize: 12 }}
        />
        <Bar dataKey="revenue" fill={ORANGE} radius={[6, 6, 0, 0]} maxBarSize={42} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ServiceJobsChart({
  data,
}: {
  data: Array<{ title: string; jobs: number }>;
}) {
  if (data.length === 0) {
    return <ChartEmpty />;
  }

  return (
    <ResponsiveContainer width="100%" height={230}>
      <BarChart
        data={data.slice(0, 6)}
        layout="vertical"
        margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
      >
        <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis type="number" allowDecimals={false} tick={AXIS} tickLine={false} axisLine={false} />
        <YAxis
          type="category"
          dataKey="title"
          width={120}
          tick={{ ...AXIS, fontSize: 10 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          cursor={{ fill: "rgba(16,39,71,0.04)" }}
          formatter={(v) => [`${v} jobs`, "Bookings"]}
          contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0", fontSize: 12 }}
        />
        <Bar dataKey="jobs" fill={NAVY} radius={[0, 6, 6, 0]} maxBarSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function ChartEmpty() {
  return (
    <div className="flex h-[230px] items-center justify-center text-sm text-muted-foreground">
      No data to chart yet.
    </div>
  );
}
