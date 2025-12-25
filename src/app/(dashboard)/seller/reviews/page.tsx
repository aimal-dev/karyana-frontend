"use client"

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";
import { 
  Star, 
  Loader2, 
  Package, 
  MessageCircle,
  TrendingUp,
  ThumbsUp,
  Calendar
} from "lucide-react";

interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  user?: { name: string };
  reply?: string;
}

interface ProductWithReviews {
  productId: number;
  title: string;
  avgRating: number;
  totalReviews: number;
  reviews: Review[];
}

export default function SellerReviewsPage() {
  // State for replies
  const [replyText, setReplyText] = useState<Record<number, string>>({});
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: report, isLoading } = useQuery<ProductWithReviews[]>({
    queryKey: ["seller-reviews"],
    queryFn: async () => {
      const response = await api.get("/reviews/seller");
      return response.data.products;
    }
  });

  const replyMutation = useMutation({
    mutationFn: async ({ id, reply }: { id: number, reply: string }) => {
      await api.post(`/reviews/${id}/reply`, { reply });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-reviews"] });
      toast({ variant: "success", title: "Reply Sent", description: "Response added to review." });
      setReplyText({});
    },
    onError: (err: unknown) => {
        const error = err as { response?: { data?: { error?: string } } };
        toast({ variant: "destructive", title: "Wait!", description: error.response?.data?.error || "Failed to reply." });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
        await api.delete(`/reviews/${id}`);
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["seller-reviews"] });
        toast({ variant: "destructive", title: "Deleted", description: "Review removed." });
    },
    onError: (err: unknown) => {
        const error = err as { response?: { data?: { error?: string } } };
        toast({ variant: "destructive", title: "Error", description: error.response?.data?.error || "Failed to delete." });
    }
  });

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="size-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-end justify-between">
         <div>
            <h1 className="text-4xl font-medium text-white tracking-tighter uppercase font-subheading-main">Product Reviews</h1>
            <p className="text-gray-400 font-medium uppercase tracking-[0.2em] text-[10px] mt-1 opacity-70">Monitor customer feedback and product ratings</p>
         </div>

         <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-6">
            <div className="flex flex-col items-end">
               <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">Global Sentiment</span>
               <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xl font-medium text-white">Positive</span>
                  <ThumbsUp className="size-4 text-emerald-500" />
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 gap-12">
         {report?.length === 0 ? (
           <div className="bg-white/5 border border-dashed border-white/10 rounded-[3rem] p-24 text-center">
              <Star className="size-16 text-gray-700 mx-auto mb-6" />
              <h3 className="text-2xl font-medium text-white uppercase font-subheading-main">No reviews yet</h3>
              <p className="text-gray-500 font-medium text-xs uppercase tracking-widest mt-2 opacity-70">Feedback will appear here once customers start rating products.</p>
           </div>
         ) : (
           report?.map((product: ProductWithReviews) => (
             <div key={product.productId} className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                   <div className="flex items-center gap-4">
                      <div className="size-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 shrink-0">
                         <Package className="size-7" />
                      </div>
                      <div>
                         <h3 className="text-2xl font-medium text-white tracking-tighter uppercase font-subheading-main">{product.title}</h3>
                         <div className="flex items-center gap-2 mt-1">
                            <div className="flex">
                               {[...Array(5)].map((_, i) => (
                                 <Star key={i} className={`size-3 ${i < Math.round(product.avgRating) ? "fill-amber-500 text-amber-500" : "text-gray-700"}`} />
                               ))}
                            </div>
                            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">{product.avgRating} / 5.0</span>
                            <span className="text-gray-800 font-bold">•</span>
                            <span className="text-[10px] font-medium text-indigo-400 uppercase tracking-widest">{product.totalReviews} total reviews</span>
                         </div>
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                      <TrendingUp className="size-4 text-emerald-500" />
                      <span className="text-[10px] font-medium text-white uppercase tracking-widest">Active Growth</span>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {product.reviews.map((review: Review) => (
                     <div key={review.id} className="bg-white/5 border border-white/5 rounded-3xl p-6 hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300 group flex flex-col h-full">
                        <div className="flex items-start justify-between mb-4">
                           <div className="flex items-center gap-3">
                              <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 font-medium text-sm group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                 {review.user?.name?.[0] || "U"}
                              </div>
                              <div>
                                 <h4 className="text-sm font-medium text-white uppercase tracking-tight font-subheading-main">{review.user?.name || "Anonymous"}</h4>
                                 <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                                    <Calendar className="size-3" />
                                    {new Date(review.createdAt).toLocaleDateString()}
                                 </div>
                              </div>
                           </div>
                           <div className="flex items-center gap-2">
                               <div className="flex items-center px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-medium">
                                  {review.rating}.0 <Star className="size-2.5 ml-1 fill-amber-500" />
                               </div>
                               <button onClick={() => { if(confirm("Delete this review?")) deleteMutation.mutate(review.id) }} className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                               </button>
                           </div>
                        </div>
                        
                        <div className="relative pl-4 mb-4 flex-grow">
                           <div className="absolute left-0 top-0 w-1 h-full bg-indigo-500/20 rounded-full group-hover:bg-indigo-500 transition-colors" />
                           <p className="text-sm font-medium text-gray-300 leading-relaxed italic">
                              &quot;{review.comment || "No comment provided."}&quot;
                           </p>
                        </div>

                        {/* Replies */}
                        {review.reply && (
                             <div className="mt-4 mb-4 space-y-2 bg-indigo-500/5 p-3 rounded-xl border border-indigo-500/10">
                                {review.reply.split("\n\n").map((msg, i) => (
                                    <div key={i}>
                                        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">
                                            {msg.split(']: ')[0] + ']'}
                                        </p>
                                        <p className="text-xs text-indigo-200/80 leading-relaxed pl-2">
                                            {msg.split(']: ')[1]}
                                        </p>
                                    </div>
                                ))}
                             </div>
                        )}

                        <div className="mt-auto pt-4 border-t border-white/5">
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="Write a public reply..." 
                                    value={replyText[review.id] || ""}
                                    onChange={(e) => setReplyText({...replyText, [review.id]: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-3 pr-10 py-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && replyText[review.id]) {
                                            replyMutation.mutate({ id: review.id, reply: replyText[review.id] });
                                        }
                                    }}
                                />
                                <button 
                                    onClick={() => replyText[review.id] && replyMutation.mutate({ id: review.id, reply: replyText[review.id] })}
                                    className="absolute right-1 top-1 p-1.5 bg-indigo-500 rounded-lg text-white hover:bg-indigo-600 transition-colors"
                                >
                                    {replyMutation.isPending ? <Loader2 className="size-3 animate-spin"/> : <MessageCircle className="size-3" />}
                                </button>
                            </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           ))
         )}
      </div>
    </div>
  );
}
