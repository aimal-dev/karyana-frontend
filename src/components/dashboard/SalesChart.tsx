"use client"
import { useState, useEffect } from "react";

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";

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

export function SalesChart({ data = defaultData, title = "Sales Performance", subtitle = "Showing daily results for the last 7 days" }: SalesChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="h-[320px] w-full bg-white/5 rounded-2xl animate-pulse" />;

  return (
    <div className="bg-white/5 border border-white/5 rounded-[2rem] p-8 h-[450px]">
      <div className="flex items-center justify-between mb-8">
         <div>
            <h3 className="text-xl font-black text-white">{title}</h3>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">{subtitle}</p>
         </div>
      </div>

      <div className="h-[320px] w-full min-h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#666", fontSize: 10, fontWeight: "bold" }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#666", fontSize: 10, fontWeight: "bold" }} 
            />
            <Tooltip 
              contentStyle={{ backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "12px" }}
              itemStyle={{ fontWeight: "bold" }}
            />
            <Legend verticalAlign="top" align="center" iconType="circle" wrapperStyle={{ paddingBottom: "20px", fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }} />
            <Area 
              type="monotone" 
              dataKey="sales" 
              stroke="#3b82f6" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorSales)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
