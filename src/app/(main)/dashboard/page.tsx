"use client"

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  CreditCard,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser, User as UserType } from "@/hooks/useUser";

interface Order {
  id: number;
  createdAt: string;
  total: number;
  status: "PENDING" | "DELIVERED" | "CANCELLED" | "PROCESSING";
  items: unknown[];
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: user } = useUser() as { data: UserType | null | undefined };

  useEffect(() => {
    if (user && user.role !== "USER") {
      if (user.role === "ADMIN") router.push("/admin");
      else if (user.role === "SELLER") router.push("/seller");
    }
  }, [user, router]);
  
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await api.get("/dashboard/user");
      return res.data;
    }
  });

  const { data: recentOrdersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["recent-orders"],
    queryFn: async () => {
      const res = await api.get("/orders?limit=3");
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!dashboardData || !dashboardData.stats || !dashboardData.user) {
    return (
      <div className="flex flex-col h-96 items-center justify-center space-y-4">
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Failed to load dashboard data</p>
        <Button onClick={() => window.location.reload()} variant="outline" size="sm" className="rounded-xl">
          Try Again
        </Button>
      </div>
    );
  }

  const { stats, user: profile } = dashboardData;
  const recentOrders = recentOrdersData?.orders || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Hello, <span className="text-primary">{profile.name || "User"}</span>
          </h1>
          <p className="text-gray-500 font-medium text-sm mt-1">Here is what happenning with your account today.</p>
        </div>
        <div className="hidden sm:block">
           <Button className="rounded-xl shadow-lg shadow-primary/20">
             New Order
           </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <StatsCard 
           title="Total Orders" 
           value={stats.totalOrders} 
           icon={ShoppingBag} 
           color="bg-blue-50 text-blue-600"
         />
         <StatsCard 
           title="Pending" 
           value={stats.pendingOrders} 
           icon={Clock} 
           color="bg-yellow-50 text-yellow-600"
         />
         <StatsCard 
           title="Completed" 
           value={stats.deliveredOrders} 
           icon={CheckCircle2} 
           color="bg-green-50 text-green-600"
         />
         <StatsCard 
           title="Total Spent" 
           value={`Rs ${stats.totalSpent.toLocaleString()}`} 
           icon={CreditCard} 
           color="bg-purple-50 text-purple-600"
         />
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-xl font-medium text-gray-900">Recent Orders</h2>
           <Link href="/dashboard/orders" className="text-sm font-bold text-primary hover:underline">
             View All
           </Link>
        </div>

        {ordersLoading ? (
           <div className="py-8 text-center text-gray-400">Loading orders...</div>
        ) : recentOrders.length === 0 ? (
           <div className="py-8 text-center text-gray-400">No recent orders found.</div>
        ) : (
           <div className="space-y-6">
             {recentOrders.map((order: Order) => (
               <div key={order.id} className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                  <div className="size-16 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                     <ShoppingBag className="size-8 text-gray-400" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                     <h4 className="font-bold text-gray-900">Order #{order.id}</h4>
                     <p className="text-xs text-gray-500 font-medium">
                       {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} Items
                     </p>
                  </div>
                  <div className="flex flex-col items-center md:items-end gap-1">
                     <span className="font-black text-lg text-gray-900">Rs {order.total.toLocaleString()}</span>
                     <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        order.status === "DELIVERED" ? "bg-green-100 text-green-700" :
                        order.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                        "bg-gray-100 text-gray-700"
                     }`}>
                       {order.status}
                     </span>
                  </div>
                  <Link href={`/orders/${order.id}`}>
                    <Button variant="ghost" size="sm" className="rounded-xl">Details</Button>
                  </Link>
               </div>
             ))}
           </div>
        )}
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, color }: { title: string, value: string | number, icon: React.ElementType, color: string }) {
  return (
    <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className={`size-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="size-6" />
        </div>
        <div>
           <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{title}</p>
           <h3 className="text-2xl font-black text-gray-900 mt-1">{value}</h3>
        </div>
      </div>
    </div>
  );
}
