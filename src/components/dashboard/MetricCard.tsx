"use client"

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: "teal" | "orange" | "blue" | "yellow" | "purple";
  description?: string;
}

const colors = {
  teal: "bg-[#14b8a6]",
  orange: "bg-[#f97316]",
  blue: "bg-[#3b82f6]",
  yellow: "bg-[#eab308]",
  purple: "bg-[#a855f7]",
};

export function MetricCard({ title, value, icon: Icon, color, description }: MetricCardProps) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-[2rem] p-8 flex flex-col justify-between min-h-[180px] group transition-all duration-500 hover:scale-[1.02]",
      colors[color]
    )}>
      {/* Decorative background circle */}
      <div className="absolute -right-4 -top-4 size-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500" />
      
      <div className="flex items-center justify-between relative z-10">
        <div className="size-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/10">
           <Icon className="size-6 text-white" />
        </div>
        {description && (
           <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{description}</span>
        )}
      </div>

      <div className="mt-auto relative z-10">
        <p className="text-white/80 text-sm font-bold uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-4xl font-black text-white tracking-tighter">{value}</h3>
      </div>
    </div>
  );
}
