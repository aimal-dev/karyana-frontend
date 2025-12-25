"use client"

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatusItemProps {
  label: string;
  value: number;
  icon: LucideIcon;
  colorClass: string;
}

export function StatusBar({ items }: { items: StatusItemProps[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((item, idx) => (
        <div key={idx} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-4 group hover:bg-white/[0.08] transition-all">
           <div className={cn("size-12 rounded-xl flex items-center justify-center text-white shadow-lg", item.colorClass)}>
              <item.icon className="size-6" />
           </div>
           <div>
              <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest leading-none mb-1 opacity-70">{item.label}</p>
              <h4 className="text-xl font-medium text-white uppercase tracking-tight font-subheading-main">{item.value}</h4>
           </div>
        </div>
      ))}
    </div>
  );
}
