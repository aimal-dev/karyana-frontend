"use client"

import { MetricCard } from "@/components/dashboard/MetricCard";
import { StatusBar } from "@/components/dashboard/StatusBar";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { OrdersTable } from "@/components/dashboard/OrdersTable";
import { 
  Users, 
  Store, 
  ShoppingBag, 
  DollarSign, 
  Target,
  Clock,
  CheckCircle,
  XCircle,
  Activity
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const response = await api.get("/dashboard/admin");
      return response.data;
    }
  });

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="size-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const stats = data?.stats;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div>
         <h1 className="text-4xl font-medium text-white tracking-tighter uppercase font-subheading-main">System Overview</h1>
         <p className="text-gray-400 font-medium uppercase tracking-[0.2em] text-[10px] mt-1 opacity-70">Global administration and statistics</p>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard 
          title="Total Users" 
          value={stats?.users?.total || 0} 
          icon={Users} 
          color="blue" 
        />
        <MetricCard 
          title="Total Sellers" 
          value={stats?.sellers?.total || 0} 
          icon={Store} 
          color="purple" 
          description={`${stats?.sellers?.pending || 0} Pending`}
        />
        <MetricCard 
          title="Global Orders" 
          value={stats?.orders?.total || 0} 
          icon={ShoppingBag} 
          color="teal" 
        />
        <MetricCard 
          title="Total Revenue" 
          value={`Rs ${stats?.revenue?.totalRevenue?.toLocaleString() || "0.00"}`} 
          icon={DollarSign} 
          color="orange" 
        />
        <MetricCard 
          title="Success Rate" 
          value={`${stats?.successRate || "0"}%`} 
          icon={Target} 
          color="yellow" 
        />
      </div>

      {/* Order Status Summary */}
      <StatusBar 
        items={[
          { label: "Pending Orders", value: stats?.orders?.pending || 0, icon: Clock, colorClass: "bg-amber-500" },
          { label: "Processing", value: stats?.orders?.processing || 0, icon: Activity, colorClass: "bg-indigo-500" },
          { label: "Delivered", value: stats?.orders?.delivered || 0, icon: CheckCircle, colorClass: "bg-emerald-500" },
          { label: "Cancelled", value: stats?.orders?.cancelled || 0, icon: XCircle, colorClass: "bg-red-500" },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2">
            <SalesChart data={stats?.chartData} title="Platform Sales" subtitle="Global revenue aggregated by day" />
         </div>
         <div className="bg-white/5 border border-white/5 rounded-[2rem] p-8">
            <h3 className="text-xl font-medium text-white mb-6 uppercase tracking-tight font-subheading-main">Recent Activity</h3>
            <div className="space-y-6">
               {(data?.recent?.orders || []).slice(0, 4).map((order: { id: number; user?: { name: string }; createdAt: string }, i: number) => (
                 <div key={i} className="flex items-start gap-4">
                    <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center font-bold text-xs text-indigo-400">
                       {i + 1}
                    </div>
                    <div>
                       <p className="text-sm font-bold text-white">Order {order.id} placed</p>
                       <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">{order.user?.name} · {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                 </div>
               ))}
            </div>
            <button className="w-full py-4 mt-8 rounded-xl bg-white/5 border border-white/5 text-xs font-black uppercase tracking-widest text-gray-400 hover:bg-white/10 transition-colors">
               View All Audit Logs
            </button>
         </div>
      </div>

      {/* Global Orders Table */}
      <OrdersTable 
        onView={() => router.push("/admin/orders")}
        orders={(data?.recent?.orders || []).map((o: { id: number; user?: { name: string; email: string }; status: string; total: number; createdAt: string }) => ({
          id: o.id,
          customer: o.user?.name || "Customer",
          email: o.user?.email || "",
          product: "View Order",
          date: new Date(o.createdAt).toLocaleDateString(),
          status: o.status,
          price: o.total
        }))}
      />
    </div>
  );
}
