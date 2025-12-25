"use client"

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Loader2 } from "lucide-react";

export default function ReviewRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const { data, isLoading, error } = useQuery({
    queryKey: ["review", id],
    queryFn: async () => {
      const res = await api.get(`/reviews/${id}`);
      return res.data;
    },
    enabled: !!id,
    retry: 1
  });

  useEffect(() => {
    if (data?.review) {
       router.replace(`/product/${data.review.product.id}`);
    }
  }, [data, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="ml-2 text-sm text-gray-500 font-bold uppercase tracking-wider">Redirecting...</p>
      </div>
    );
  }

  if (error) {
     return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
           <h1 className="text-2xl font-black text-gray-900">Review Not Found</h1>
           <p className="text-gray-500">The review you are looking for does not exist or has been deleted.</p>
           <button onClick={() => router.push("/")} className="text-primary hover:underline font-bold">
              Go Home
           </button>
        </div>
     );
  }

  return null;
}
