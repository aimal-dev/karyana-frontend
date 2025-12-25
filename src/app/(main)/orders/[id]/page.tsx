"use client"

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { 
  Package, 
  MapPin, 
  CreditCard,
  Loader2,
  Phone,
  Truck
} from "lucide-react";
import Image from "next/image";

interface TrackingEvent {
  id: number;
  status: string;
  message: string;
  createdAt: string;
}

interface OrderItem {
  id: number;
  qty: number;
  price: number;
  product: {
    title: string;
    image: string | null;
  };
}

interface Order {
  id: number;
  status: string;
  total: number;
  createdAt: string;
  shippingAddress: string | null;
  shippingCity: string | null;
  shippingPhone: string | null;
  items: OrderItem[];
  payment: {
    method: string;
    status: string;
  } | null;
  trackingHistory: TrackingEvent[];
}

export default function OrderDetailsPage() {
  const { id } = useParams();

  const STATUS_COLORS: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    PROCESSING: "bg-blue-100 text-blue-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    PAYMENT_FAILED: "bg-red-100 text-red-700",
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const res = await api.get(`/orders/${id}`);
      return res.data;
    },
    enabled: !!id,
    refetchInterval: 5000
  });

  const order: Order | undefined = data?.order;

  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
           <Loader2 className="size-8 animate-spin text-primary" />
        </div>
    );
  }

  if (error || !order) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
           <p className="font-bold text-gray-500">Order not found.</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] pt-32 pb-12">
       <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          {/* Header */}
          <div className="mb-8">
             <div className="flex items-center gap-3">
                <h1 className="text-3xl font-medium text-gray-900 tracking-tight">Order #{order.id}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-700"}`}>
                   {order.status}
                </span>
             </div>
             <p className="text-gray-500 font-medium text-sm mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
             </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             {/* Left Column: Items + Tracking */}
             <div className="lg:col-span-2 space-y-8">
                 {/* Tracking Timeline */}
                 <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center gap-2">
                       <Truck className="size-5 text-gray-400" />
                       Order Updates
                    </h2>
                    <div className="space-y-8 pl-2 border-l-2 border-dashed border-gray-100 relative">
                       {(order.trackingHistory || []).length === 0 ? (
                           <p className="text-sm text-gray-500 pl-6">No updates yet.</p>
                       ) : (
                           order.trackingHistory.map((event) => (
                              <div key={event.id} className="relative pl-6">
                                 <div className="absolute -left-[9px] top-1 size-4 bg-white border-2 border-primary rounded-full" />
                                 <p className="text-sm font-bold text-gray-900">{event.message}</p>
                                 <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">
                                    {new Date(event.createdAt).toLocaleString()}
                                 </p>
                              </div>
                           ))
                       )}
                    </div>
                 </div>

                 {/* Items */}
                 <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center gap-2">
                       <Package className="size-5 text-gray-400" />
                       Items
                    </h2>
                    <div className="space-y-6">
                       {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 py-2">
                             <div className="size-16 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 relative overflow-hidden">
                                {item.product.image ? (
                                    <Image src={item.product.image} alt={item.product.title} fill className="object-cover" /> 
                                ) : (
                                    <Package className="size-6" />
                                )}
                             </div>
                             <div className="flex-1">
                                <h4 className="font-bold text-gray-900">{item.product.title}</h4>
                                <p className="text-xs text-gray-500 font-medium">Qty: {item.qty} × Rs {item.price}</p>
                             </div>
                             <div className="font-medium text-gray-900">
                                Rs {(item.qty * item.price).toLocaleString()}
                             </div>
                          </div>
                       ))}
                    </div>
                    <div className="border-t border-gray-100 mt-6 pt-6 flex justify-between items-center">
                       <span className="font-bold text-gray-500 uppercase text-xs tracking-wider">Total Amount</span>
                       <span className="font-medium text-2xl text-primary">Rs {order.total.toLocaleString()}</span>
                    </div>
                 </div>
             </div>

             {/* Right Column: Info */}
             <div className="space-y-8">
                 <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center gap-2">
                       <MapPin className="size-5 text-gray-400" />
                       Shipping Details
                    </h2>
                    <div className="space-y-4">
                       <div>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Address</p>
                          <p className="text-sm font-bold text-gray-900">{order.shippingAddress || "Not provided"}</p>
                          <p className="text-sm text-gray-600">{order.shippingCity}</p>
                       </div>
                       <div>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Contact</p>
                          <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                             <Phone className="size-3" />
                             {order.shippingPhone || "N/A"}
                          </p>
                       </div>
                    </div>
                 </div>

                 <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center gap-2">
                       <CreditCard className="size-5 text-gray-400" />
                       Payment Info
                    </h2>
                    <div className="space-y-4">
                       <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Method</span>
                          <span className="text-sm font-bold text-gray-900">{order.payment?.method || "N/A"}</span>
                       </div>
                       <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Status</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider ${
                             order.payment?.status === "SUCCESS" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                          }`}>
                             {order.payment?.status || "PENDING"}
                          </span>
                       </div>
                    </div>
                 </div>
             </div>
          </div>
       </div>
    </div>
  );
}
