"use client"
import { useSyncExternalStore } from "react";

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from "recharts";

import { useId } from "react";

interface SalesChartProps {
  data?: { date: string; sales: number }[];
  title?: string;
  subtitle?: string;
}

const defaultData = [
  { date: "Day 1", sales: 240 },
  { date: "Day 2", sales: 139 },
  { date: "Day 3", sales: 980 },
  { date: "Day 4", sales: 390 },
  { date: "Day 5", sales: 480 },
  { date: "Day 6", sales: 380 },
  { date: "Day 7", sales: 430 },
];

export function SalesChart({ 
  data = defaultData, 
  title = "Sales Performance", 
  subtitle = "Showing daily results for the last 7 days" 
}: SalesChartProps) {
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const chartId = useId();
  const gradientId = `colorSales-${chartId.replace(/:/g, "")}`;

  // Use provided data if it's not empty, otherwise default to defaultData
  const chartData = data && data.length > 0 ? data : defaultData;

  return (
    <div className="bg-white/5 border border-white/5 rounded-[2rem] p-8 h-[450px] relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
           <div>
              <h3 className="text-xl font-black text-white tracking-tight">{title}</h3>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">{subtitle}</p>
           </div>
        </div>

        <div className="h-[320px] w-full min-h-[320px]">
          {!isMounted ? (
            <div className="h-full w-full bg-white/5 rounded-2xl animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#666", fontSize: 10, fontWeight: "600" }} 
                  dy={10}
                  tickFormatter={(val) => {
                    // Try to format date if it's a date string
                    try {
                      if (val.includes("-")) {
                        const date = new Date(val);
                        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      }
                    } catch {
                      return val;
                    }
                  }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#666", fontSize: 10, fontWeight: "600" }}
                  tickFormatter={(val) => `Rs ${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#111", 
                    border: "1px solid rgba(255,255,255,0.1)", 
                    borderRadius: "16px", 
                    fontSize: "12px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                  }}
                  itemStyle={{ fontWeight: "bold", color: "#3b82f6" }}
                  formatter={(val: number | string | undefined) => [`Rs ${Number(val || 0).toLocaleString()}`, "Sales"]}
                  labelStyle={{ color: "#999", marginBottom: "4px", fontSize: "10px", fontWeight: "bold", textTransform: "uppercase" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#3b82f6" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  strokeLinecap="round"
                  fill={`url(#${gradientId})`}
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

