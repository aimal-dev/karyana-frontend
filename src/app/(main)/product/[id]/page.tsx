"use client"

import { useState, use } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Button } from "@/components/ui/Button";
import { Star, Minus, Plus, ShoppingCart, Heart, ShieldCheck, Truck, RefreshCcw, User, MessageSquare } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import ProductSection from "@/components/home/ProductSection";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Review {
  id: number;
  rating: number;
  comment: string | null;
  reply: string | null;
  createdAt: string;
  user: {
    id: number;
    name: string | null;
  };
}

export default function ProductSinglePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "reviews" | "shipping">("description");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [selectedVariant, setSelectedVariant] = useState<{ id: number; name: string; price: number; stock: number; image?: string | null } | null>(null);
  const addToCart = useCartStore((state) => state.addToCart);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await api.get(`/products/${id}`);
      return res.data.product;
    }
  });

  const allImages = product ? [
    product.image, 
    ...(product.images?.map((img: {url: string}) => img.url) || []),
    ...(product.variants?.map((v: {image?: string}) => v.image).filter(Boolean) || [])
  ].filter(Boolean) : [];
  const displayImage = previewImage || selectedVariant?.image || product?.image || "/placeholder.png";

  // Fetch reviews for this product
  const { data: reviewsData } = useQuery({
    queryKey: ["reviews", id],
    queryFn: async () => {
      try {
        const res = await api.get(`/reviews/product/${id}`);
        return res.data;
      } catch {
        // If not authenticated or error, return empty
        return { reviews: [], total: 0 };
      }
    },
    enabled: !!id
  });

  // Post review mutation
  const postReviewMutation = useMutation({
    mutationFn: async (reviewData: { productId: number; rating: number; comment: string }) => {
      const res = await api.post("/reviews", reviewData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", id] });
      setNewReview({ rating: 5, comment: "" });
    },
  });

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.comment.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please write a comment before submitting",
      });
      return;
    }
    try {
      await postReviewMutation.mutateAsync({
        productId: Number(id),
        rating: newReview.rating,
        comment: newReview.comment,
      });
      toast({
        variant: "success",
        title: "Review Posted!",
        description: "Thank you for your feedback",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        const axiosError = error as { response?: { status?: number; data?: { error?: string } } };
        if (axiosError.response?.status === 401) {
          toast({
            variant: "destructive",
            title: "Authentication Required",
            description: "Please login to post a review",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: axiosError.response?.data?.error || "Failed to post review",
          });
        }
      }
    }
  };

  const reviews = reviewsData?.reviews || [];
  const totalReviews = reviewsData?.total || 0;
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / reviews.length
    : 0;

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center pt-20"><div className="size-16 border-t-2 border-primary rounded-full animate-spin" /></div>;
  if (!product) return <div className="min-h-screen bg-background flex items-center justify-center pt-20 font-black text-4xl uppercase tracking-tighter shadow-sm">Product Not Found</div>;

  return (
    <div className="min-h-screen bg-background pt-28 md:pt-32 pb-20 px-20">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 item-start">
          
          {/* Gallery Area */}
          <div className="space-y-6">
            <div className="relative aspect-square rounded-[2rem] overflow-hidden border border-border p-10 bg-muted/30 flex items-center justify-center shadow-inner">
               <Image 
                 src={displayImage} 
                 alt={product.title} 
                 fill 
                 className="object-contain transition-all duration-700 hover:scale-105" 
               />
               <div className="absolute top-8 left-8 bg-primary text-primary-foreground font-black text-[10px] px-4 py-2 rounded-full uppercase tracking-widest shadow-lg shadow-primary/20">
                  {product.category?.name}
               </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
               {allImages.map((img: string, i: number) => (
                 <div 
                   key={i} 
                   onClick={() => setPreviewImage(img)}
                   className={cn(
                     "aspect-square rounded-2xl border border-border bg-muted/30 relative overflow-hidden cursor-pointer hover:border-primary transition-all p-2 flex items-center justify-center group",
                     (previewImage || product.image) === img ? "ring-2 ring-primary border-primary" : "hover:bg-muted/50"
                   )}
                 >
                    <Image src={img} alt={`thumb-${i}`} fill className="object-contain p-1.5 transition-transform group-hover:scale-110" />
                 </div>
               ))}
            </div>
          </div>

          {/* Details Area */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-yellow-500">
                 {[...Array(5)].map((_, i) => <Star key={i} className={`size-3.5 ${i < Math.floor(avgRating) ? 'fill-current' : 'text-muted'}`} />)}
                 <span className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] ml-2">({totalReviews} Reviews)</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none uppercase font-subheading-main">{product.title}</h1>
              <div className="flex items-center gap-4 pt-2">
                  <span className="text-primary font-medium text-4xl tracking-tighter">RS {selectedVariant ? selectedVariant.price.toFixed(2) : product.price.toFixed(2)}</span>
                  {(selectedVariant ? selectedVariant.price < (product.price * 1.2) : true) && (
                     <span className="text-muted-foreground line-through text-lg font-medium opacity-50 tracking-tighter">RS {(selectedVariant ? selectedVariant.price * 1.2 : product.price * 1.2).toFixed(2)}</span>
                  )}
               </div>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed font-medium uppercase tracking-wide">
               {product.description || "Indulge in the pure, unadulterated goodness of our premium organic products. Sourced directly from local farms, ensuring maximum freshness and nutrient density for your daily health needs."}
            </p>

            {/* Variants Selector */}
            {product.variants && product.variants.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-border">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Select Option:</span>
                    <div className="flex flex-wrap gap-2">
                        {product.variants.map((variant: any) => (
                            <button
                                key={variant.id}
                                onClick={() => {
                                    setSelectedVariant(variant);
                                    if (variant.image) {
                                        setPreviewImage(variant.image);
                                    }
                                }}
                                className={cn(
                                    "px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all",
                                    selectedVariant?.id === variant.id 
                                        ? "bg-primary text-primary-foreground border-primary ring-2 ring-primary/20" 
                                        : "bg-muted/10 border-border hover:border-primary/50 text-foreground"
                                )}
                            >
                                {variant.name} - RS {variant.price}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-y border-border py-10">
               <div className="flex items-center bg-muted/30 border border-border rounded-2xl h-14 px-4 gap-6 shrink-0">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="hover:text-primary transition-colors"><Minus className="size-4" /></button>
                  <span className="font-black text-lg w-8 text-center tabular-nums">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="hover:text-primary transition-colors"><Plus className="size-4" /></button>
               </div>
               
               <Button 
                 onClick={() => addToCart({ 
                    ...product, 
                    productId: product.id, 
                    qty,
                    variantId: selectedVariant?.id,
                    price: selectedVariant ? selectedVariant.price : product.price, // Override price
                    title: selectedVariant ? `${product.title} (${selectedVariant.name})` : product.title
                 })}
                 disabled={selectedVariant ? selectedVariant.stock < 1 : product.stock < 1}
                 className="flex-1 h-14 text-[10px] font-black tracking-[0.2em] rounded-2xl gap-3 group shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                  <ShoppingCart className="size-4 group-hover:translate-x-1 transition-transform" /> 
                  {(selectedVariant ? selectedVariant.stock < 1 : product.stock < 1) ? "OUT OF STOCK" : "ADD TO BAG"}
               </Button>

               <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl border-border shrink-0 hover:bg-primary/10 hover:text-primary transition-colors">
                  <Heart className="size-5" />
               </Button>
            </div>

            <div className="space-y-3 pt-2">
               <div className="flex items-center gap-3">
                  <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest w-24">SKU:</span>
                  <span className="font-black text-[10px] uppercase tracking-widest">KRYN-{product.id}{selectedVariant ? `-${selectedVariant.id}` : ''}</span>
               </div>
               <div className="flex items-center gap-3">
                  <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest w-24">Category:</span>
                  <span className="text-primary font-black text-[10px] uppercase tracking-widest">{product.category?.name}</span>
               </div>
               <div className="flex items-center gap-3">
                  <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest w-24">Tags:</span>
                  <span className="font-black text-[10px] uppercase tracking-widest">{product.tags ? product.tags.slice(0, 3).join(", ") : "Organic, Fresh"}</span>
               </div>
            </div>

            {/* Features Row */}
            <div className="grid grid-cols-3 gap-4 pt-8">
               {[
                 { icon: Truck, label: "Fast Delivery" },
                 { icon: ShieldCheck, label: "Secure Pay" },
                 { icon: RefreshCcw, label: "Easy Returns" }
               ].map((item, i) => (
                 <div key={i} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-muted/20 border border-border gap-2 group hover:border-primary transition-colors">
                    <item.icon className="size-5 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-center leading-none">{item.label}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Tabs / Description / Reviews */}
        <div className="mt-24 space-y-12">
            <div className="flex gap-12 border-b border-border">
              <button 
                onClick={() => setActiveTab("description")}
                className={`font-black text-[10px] uppercase tracking-[0.2em] pb-4 -mb-[2px] transition-colors ${activeTab === "description" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-primary"}`}
              >
                Description
              </button>
              <button 
                onClick={() => setActiveTab("reviews")}
                className={`font-black text-[10px] uppercase tracking-[0.2em] pb-4 -mb-[2px] transition-colors ${activeTab === "reviews" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-primary"}`}
              >
                Reviews ({totalReviews})
              </button>
              <button 
                onClick={() => setActiveTab("shipping")}
                className={`font-black text-[10px] uppercase tracking-[0.2em] pb-4 -mb-[2px] transition-colors ${activeTab === "shipping" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-primary"}`}
              >
                Shipping
              </button>
            </div>
           
            {/* Description Tab */}
            {activeTab === "description" && (
              <div className="max-w-4xl space-y-6">
                <h3 className="font-black text-4xl tracking-tighter uppercase font-subheading-main">Pure Organic Excellence</h3>
                <p className="text-muted-foreground leading-relaxed text-sm font-medium tracking-wide">
                   Our {product.title} is sourced strictly from artisanal farms that follow zero-chemical protocols. We believe in providing you with food that is not just a commodity, but a medicine for the body. Every package is sealed with freshness and checked for quality by our expert selectors.
                </p>
                <ul className="space-y-4 pt-4">
                   {[
                     "100% Organic certified produce",
                     "No artificial preservatives or colors",
                     "Freshly harvested within 24 hours of dispatch",
                     "Sustainable and carbon-neutral packaging"
                   ].map((li, i) => (
                     <li key={i} className="flex items-center gap-3 text-muted-foreground text-[10px] font-black tracking-widest uppercase">
                        <div className="size-1 bg-primary rounded-full" /> {li}
                     </li>
                   ))}
                </ul>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div className="max-w-4xl space-y-8">
                {/* Post Review Form */}
                <div className="bg-card border border-border rounded-2xl p-8">
                  <h3 className="font-black text-xl tracking-tighter uppercase font-subheading-main mb-6">
                    Write a <span className="text-primary">Review</span>
                  </h3>
                  <form onSubmit={handleSubmitReview} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Your Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => setNewReview({ ...newReview, rating })}
                            className="transition-transform hover:scale-110"
                          >
                            <Star
                              className={`size-8 ${rating <= newReview.rating ? "fill-yellow-500 text-yellow-500" : "text-muted"}`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Your Comment</label>
                      <textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        placeholder="Share your experience with this product..."
                        className="w-full min-h-32 bg-muted/30 border border-border rounded-xl p-4 text-sm resize-none focus:outline-none focus:border-primary transition-colors"
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={postReviewMutation.isPending}
                      className="h-12 px-8 font-black text-[10px] tracking-[0.2em] rounded-xl uppercase"
                    >
                      {postReviewMutation.isPending ? "Posting..." : "Post Review"}
                    </Button>
                  </form>
                </div>

                  {/* Reviews List */}
                <div className="space-y-6">
                  <h3 className="font-black text-xl tracking-tighter uppercase font-subheading-main">
                    Customer <span className="font-subheading-main">Reviews</span> ({totalReviews})
                  </h3>
                  {reviews.length === 0 ? (
                    <div className="bg-muted/30 border border-border rounded-2xl p-12 text-center">
                      <MessageSquare className="size-12 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide">
                        No reviews yet. Be the first to review this product!
                      </p>
                    </div>
                  ) : (
                    reviews.map((review: Review) => (
                      <ReviewItem key={review.id} review={review} queryClient={queryClient} productId={Number(id)} />
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Shipping Tab */}
            {activeTab === "shipping" && (
              <div className="max-w-4xl space-y-6">
                <h3 className="font-black text-2xl tracking-tighter uppercase font-subheading-main">Shipping Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-xl border border-border">
                    <Truck className="size-6 text-primary shrink-0 mt-1" />
                    <div>
                      <h4 className="font-medium text-sm uppercase tracking-wider mb-1">Free Delivery</h4>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                        Free standard shipping on all orders. Delivered within 3-5 business days.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-xl border border-border">
                    <RefreshCcw className="size-6 text-primary shrink-0 mt-1" />
                    <div>
                      <h4 className="font-medium text-sm uppercase tracking-wider mb-1">Easy Returns</h4>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                        30-day return policy. Items must be unused and in original packaging.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>

        {/* Related Products Section */}
        <div className="mt-32 border-t border-border pt-20">
           <ProductSection title="Related Products" subtitle="YOU MAY ALSO LIKE" type="trending" />
        </div>
      </div>
    </div>
  );
}

function ReviewItem({ review, queryClient, productId }: { review: Review, queryClient: import("@tanstack/react-query").QueryClient, productId: number }) {
  const [replyText, setReplyText] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);
  const { toast } = useToast();

  const replyMutation = useMutation({
    mutationFn: async (text: string) => {
      await api.post(`/reviews/${review.id}/reply`, { reply: text });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", String(productId)] });
      toast({ variant: "success", title: "Reply Sent", description: "Your reply has been added." });
      setReplyText("");
      setShowReplyInput(false);
    },
    onError: (err: unknown) => {
        const error = err as { response?: { data?: { error?: string } } };
        toast({ variant: "destructive", title: "Wait!", description: error.response?.data?.error || "Failed to reply." });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
       await api.delete(`/reviews/${review.id}`);
    },
    onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["reviews", String(productId)] });
       toast({ variant: "success", title: "Deleted", description: "Review deleted." });
    },
    onError: (err: unknown) => {
       const error = err as { response?: { data?: { error?: string } } };
       toast({ variant: "destructive", title: "Error", description: error.response?.data?.error || "You are not authorized to delete this." });
    }
  });

  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-4 group">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="size-6 text-primary" />
          </div>
          <div>
            <h4 className="font-black text-sm uppercase tracking-wider">{review.user.name || "Anonymous"}</h4>
            <p className="text-[8px] text-muted-foreground uppercase tracking-widest">
              {new Date(review.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
            <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                <Star key={i} className={`size-4 ${i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-muted"}`} />
                ))}
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => setShowReplyInput(!showReplyInput)} 
                  className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline hover:text-primary/80"
                >
                  Reply
                </button>
                <button 
                  onClick={() => { if(confirm("Are you sure you want to delete this review?")) deleteMutation.mutate() }} 
                  className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:underline hover:text-red-600"
                >
                  Delete
                </button>
            </div>
        </div>
      </div>
      {review.comment && (
        <p className="text-sm text-muted-foreground leading-relaxed pl-16">
          {review.comment}
        </p>
      )}
      
      {/* Chat History */}
      {review.reply && (
        <div className="pl-16 pt-4 space-y-3">
           {review.reply.split("\n\n").map((msg, i) => {
              const [role_name, ...rest] = msg.split("]: ");
              const content = rest.join("]: ");
              const isUser = role_name.includes("USER");
              
              return (
                  <div key={i} className={`p-3 rounded-xl border max-w-[90%] text-xs ${isUser ? "bg-muted/30 border-border mr-auto" : "bg-primary/5 border-primary/10 ml-auto"}`}>
                      <span className={`block font-black text-[8px] uppercase tracking-widest mb-1 ${isUser ? "text-muted-foreground" : "text-primary"}`}>
                          {role_name}]
                      </span>
                      <p className="opacity-90 leading-relaxed">{content}</p>
                  </div>
              );
           })}
        </div>
      )}

      {/* Reply Input */}
      {showReplyInput && (
          <div className="pl-16 pt-2 flex gap-2">
              <input 
                 className="flex-1 bg-muted/30 border border-border rounded-xl px-4 py-2 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                 placeholder="Write a reply..."
                 value={replyText}
                 onChange={(e) => setReplyText(e.target.value)}
                 onKeyDown={(e) => {
                     if (e.key === 'Enter' && !e.shiftKey) {
                         e.preventDefault();
                         if (replyText.trim()) replyMutation.mutate(replyText);
                     }
                 }}
              />
              <Button size="sm" onClick={() => replyText.trim() && replyMutation.mutate(replyText)} disabled={replyMutation.isPending} className="h-full rounded-xl">
                 {replyMutation.isPending ? <div className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin"/> : "Post"}
              </Button>
          </div>
      )}
    </div>
  );
}
