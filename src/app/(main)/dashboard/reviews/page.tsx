"use client"

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";
import { 
  Star, 
  Loader2
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface Review {
  id: number;
  rating: number;
  comment: string | null;
  reply: string | null;
  createdAt: string;
  product: {
    id: number;
    title: string;
  };
}

export default function ReviewsPage() {
  // State for reply inputs
  const [replyText, setReplyText] = useState<Record<number, string>>({});
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ["my-reviews"],
    queryFn: async () => {
      const res = await api.get("/reviews/me");
      return res.data;
    }
  });

  const replyMutation = useMutation({
    mutationFn: async ({ id, reply }: { id: number, reply: string }) => {
      await api.post(`/reviews/${id}/reply`, { reply });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-reviews"] });
      toast({ variant: "success", title: "Reply Sent", description: "Your response has been added." });
      setReplyText({});
    },
    onError: (err: unknown) => {
        const error = err as { response?: { data?: { error?: string } } };
        toast({ variant: "destructive", title: "Error", description: error.response?.data?.error || "Failed to reply." });
    }
  });

  const deleteMutation = useMutation({
      mutationFn: async (id: number) => {
          await api.delete(`/reviews/${id}`);
      },
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["my-reviews"] });
          toast({ variant: "success", title: "Deleted", description: "Review removed." });
      },
      onError: (err: unknown) => {
          const error = err as { response?: { data?: { error?: string } } };
          toast({ variant: "destructive", title: "Error", description: error.response?.data?.error || "Failed to delete." });
      }
  });

  const reviews = data?.reviews || [];

  if (isLoading) {
    return (
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
         <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Reviews</h1>
         <p className="text-gray-500 font-medium text-sm mt-1">See what you have said about our products.</p>
      </div>

      <div className="grid gap-6">
         {reviews.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center">
                <div className="size-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300 mb-4">
                    <Star className="size-8" />
                </div>
                <p className="text-gray-500 font-medium">You haven&apos;t posted any reviews yet.</p>
                <Link href="/shop" className="mt-4 inline-block">
                    <Button variant="outline" className="rounded-xl">Browse Products</Button>
                </Link>
            </div>
         ) : (
            reviews.map((review: Review) => (
                <div key={review.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm group">
                   <div className="flex justify-between items-start mb-4">
                      <div>
                         <Link href={`/product/${review.product.id}`} className="font-black text-lg hover:text-primary transition-colors">
                            {review.product.title}
                         </Link>
                         <div className="flex items-center gap-1 mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`size-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} 
                                />
                            ))}
                            <span className="text-xs font-bold text-gray-400 ml-2">
                               {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                         </div>
                      </div>
                      <button 
                        onClick={() => { if(confirm("Delete this review?")) deleteMutation.mutate(review.id) }}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2"
                        title="Delete Review"
                      >
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </button>
                   </div>

                   <p className="text-gray-600 leading-relaxed text-sm font-medium">
                      {review.comment || "No comment provided."}
                   </p>

                   {/* Reply Section */}
                   {review.reply && (
                      <div className="mt-6 bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-3">
                         {review.reply.split("\n\n").map((msg, i) => {
                             const [role_name, ...rest] = msg.split("]: ");
                             const content = rest.join("]: ");
                             const isMe = role_name.includes("USER");
                             return (
                                 <div key={i} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                                      <span className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">{role_name}]</span>
                                      <div className={`p-3 rounded-xl text-sm max-w-[90%] ${isMe ? "bg-primary/10 text-primary-900" : "bg-white border border-gray-200 text-gray-600"}`}>
                                          {content}
                                      </div>
                                 </div>
                             )
                         })}
                      </div>
                   )}
                   
                   {/* Reply Input */}
                   <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                        <input 
                            placeholder="Type a reply..."
                            value={replyText[review.id] || ""}
                            onChange={(e) => setReplyText({...replyText, [review.id]: e.target.value})}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && replyText[review.id]) {
                                    replyMutation.mutate({ id: review.id, reply: replyText[review.id] });
                                }
                            }}
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                         <Button 
                            size="sm" 
                            disabled={replyMutation.isPending}
                            onClick={() => replyText[review.id] && replyMutation.mutate({ id: review.id, reply: replyText[review.id] })}
                            className="rounded-xl px-4"
                         >
                            {replyMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : "Reply"}
                         </Button>
                   </div>
                </div>
            ))
         )}
      </div>
    </div>
  );
}
