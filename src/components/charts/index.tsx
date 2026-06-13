"use client";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const COLORS = ["#6366f1", "#34d399", "#f59e0b", "#f87171", "#60a5fa", "#a78bfa", "#fb923c"];

// ──────────────────────────────────────────────
// TrendArea
// ──────────────────────────────────────────────
interface TrendAreaProps {
  data: Record<string, unknown>[];
  lines: { key: string; color: string; label?: string }[];
  xKey: string;
  height?: number;
  gradient?: boolean;
  tooltip?: boolean;
  legend?: boolean;
}

export function TrendArea({ data, lines, xKey, height = 220, gradient = true, tooltip = true, legend = false }: TrendAreaProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <defs>
          {lines.map((l) => (
            <linearGradient key={l.key} id={`grad-${l.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={l.color} stopOpacity={0.25} />
              <stop offset="95%" stopColor={l.color} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
        {tooltip && <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }} />}
        {legend && <Legend wrapperStyle={{ fontSize: 12 }} />}
        {lines.map((l) => (
          <Area
            key={l.key}
            type="monotone"
            dataKey={l.key}
            name={l.label || l.key}
            stroke={l.color}
            strokeWidth={2}
            fill={gradient ? `url(#grad-${l.key})` : "transparent"}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ──────────────────────────────────────────────
// TrendLine
// ──────────────────────────────────────────────
interface TrendLineProps {
  data: Record<string, unknown>[];
  lines: { key: string; color: string; label?: string }[];
  xKey: string;
  height?: number;
  legend?: boolean;
}

export function TrendLine({ data, lines, xKey, height = 220, legend = false }: TrendLineProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }} />
        {legend && <Legend wrapperStyle={{ fontSize: 12 }} />}
        {lines.map((l) => (
          <Line
            key={l.key}
            type="monotone"
            dataKey={l.key}
            name={l.label || l.key}
            stroke={l.color}
            strokeWidth={2.5}
            dot={{ r: 3, strokeWidth: 0, fill: l.color }}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

// ──────────────────────────────────────────────
// GroupedBar
// ──────────────────────────────────────────────
interface GroupedBarProps {
  data: Record<string, unknown>[];
  bars: { key: string; color: string; label?: string }[];
  xKey: string;
  height?: number;
  legend?: boolean;
  radius?: number;
}

export function GroupedBar({ data, bars, xKey, height = 220, legend = false, radius = 4 }: GroupedBarProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }} />
        {legend && <Legend wrapperStyle={{ fontSize: 12 }} />}
        {bars.map((b) => (
          <Bar key={b.key} dataKey={b.key} name={b.label || b.key} fill={b.color} radius={[radius, radius, 0, 0]} maxBarSize={40} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

// ──────────────────────────────────────────────
// DonutChart
// ──────────────────────────────────────────────
interface DonutProps {
  data: { name: string; value: number; color?: string }[];
  height?: number;
  innerRadius?: number;
  label?: boolean;
}

export function DonutChart({ data, height = 200, innerRadius = 55, label = false }: DonutProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={innerRadius + 28}
          paddingAngle={3}
          dataKey="value"
          label={label ? ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%` : undefined}
          labelLine={label}
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color || COLORS[i % COLORS.length]} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ──────────────────────────────────────────────
// RadarChart
// ──────────────────────────────────────────────
interface RadarProps {
  data: { subject: string; score: number }[];
  height?: number;
  color?: string;
}

export function SubjectRadar({ data, height = 220, color = "#6366f1" }: RadarProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} margin={{ top: 8, right: 24, left: 24, bottom: 8 }}>
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#64748b" }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: "#94a3b8" }} tickCount={4} />
        <Radar name="Score" dataKey="score" stroke={color} fill={color} fillOpacity={0.2} strokeWidth={2} />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

// ──────────────────────────────────────────────
// HorizontalBar
// ──────────────────────────────────────────────
interface HBarProps {
  data: { name: string; value: number; color?: string }[];
  height?: number;
  max?: number;
}

export function HorizontalBar({ data, height = 200, max = 100 }: HBarProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart layout="vertical" data={data} margin={{ top: 0, right: 12, left: 0, bottom: 0 }}>
        <XAxis type="number" domain={[0, max]} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11, fill: "#475569" }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={16}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color || COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
