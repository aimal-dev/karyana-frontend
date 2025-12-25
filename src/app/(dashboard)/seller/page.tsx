"use client"

import { MetricCard } from "@/components/dashboard/MetricCard";
import { StatusBar } from "@/components/dashboard/StatusBar";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { OrdersTable } from "@/components/dashboard/OrdersTable";
import { 
  ShoppingBag, 
  DollarSign,
  Zap,
  Users,
  Package,
  Clock
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Loader2, Activity, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SellerDashboardPage() {
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["seller-stats"],
    queryFn: async () => {
      const response = await api.get("/dashboard/seller");
      return response.data;
    },
    refetchInterval: 5000
  });

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="size-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const stats = data?.stats;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div>
         <h1 className="text-4xl font-medium text-white tracking-tighter uppercase font-subheading-main">Store Overview</h1>
         <p className="text-gray-400 font-medium uppercase tracking-[0.2em] text-[10px] mt-1 opacity-70">Monitor your store performance and sales</p>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard 
          title="Today Orders" 
          value={stats?.totalOrders || 0} 
          icon={ShoppingBag} 
          color="teal" 
          description="Live"
        />
        <MetricCard 
          title="Total Revenue" 
          value={`Rs ${stats?.totalRevenue?.toFixed(2) || "0.00"}`} 
          icon={DollarSign} 
          color="orange" 
        />
        <MetricCard 
          title="All Time Sales" 
          value={`Rs ${stats?.totalRevenue?.toFixed(2) || "0.00"}`} 
          icon={Zap} 
          color="blue" 
        />
        <MetricCard 
          title="Total Customers" 
          value={stats?.totalCustomers || 0} 
          icon={Users} 
          color="yellow" 
        />
        <MetricCard 
          title="Total Products" 
          value={stats?.totalProducts || 0} 
          icon={Package} 
          color="purple" 
        />
      </div>

      {/* Order Status Summary */}
      <StatusBar 
        items={[
          { label: "Pending Orders", value: stats?.pendingOrders || 0, icon: Clock, colorClass: "bg-amber-500" },
          { label: "Processing", value: stats?.processingOrders || 0, icon: Activity, colorClass: "bg-indigo-500" },
          { label: "Delivered", value: stats?.deliveredOrders || 0, icon: CheckCircle, colorClass: "bg-emerald-500" },
          { label: "Cancelled", value: stats?.cancelledOrders || 0, icon: XCircle, colorClass: "bg-red-500" },
        ]}
      />

      {/* Sales Chart */}
      <SalesChart data={stats?.chartData} title="Store Sales" subtitle="Your revenue aggregated by day" />

      {/* Recent Orders Table */}
      <OrdersTable 
        onView={() => router.push("/seller/orders")}
        orders={(data?.recentOrders || []).map((o: { id: number; user?: { name: string; email: string }; items?: { product: { title: string } }[]; status: string; total: number; createdAt: string }) => ({
          id: o.id,
          customer: o.user?.name || "Customer",
          email: o.user?.email || "",
          product: o.items?.[0]?.product?.title || "Multiple Products",
          date: new Date(o.createdAt).toLocaleDateString(),
          status: o.status,
          price: o.total
        }))} 
      />
    </div>
  );
}
