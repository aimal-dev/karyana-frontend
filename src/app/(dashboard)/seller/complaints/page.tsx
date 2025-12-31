"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useState } from "react";
import { 
  Loader2,
  MessageSquare,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Complaint {
  id: number;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  user?: { name: string; email: string };
  sellerReply?: string;
}

export default function SellerComplaintsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  const { data: complaints, isLoading } = useQuery<Complaint[]>({
    queryKey: ["seller-complaints"],
    queryFn: async () => {
      const response = await api.get("/complaints/seller");
      return response.data.complaints;
    }
  });

  const replyMutation = useMutation({
    mutationFn: async ({ id, response }: { id: number; response: string }) => {
      await api.put(`/complaints/reply/${id}`, { sellerReply: response });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-complaints"] });
      toast({ variant: "success", title: "Success", description: "Reply sent successfully" });
      setReplyingTo(null);
      setReplyText("");
    },
    onError: (error: unknown) => { // Added onError block based on the provided snippet's content
      const err = error as { response?: { data?: { error?: string; details?: string } } };
      console.error("Failed to send reply", err); // Changed message to be relevant to reply
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: err.response?.data?.error || err.response?.data?.details || "Failed to send reply. Check Console." // Changed message
      });
    }
  });

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="size-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const statusColors = {
    PENDING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    RESOLVED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  };

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
         <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium text-white tracking-tighter uppercase font-subheading-main">Customer Complaints</h1>
         <p className="text-gray-400 font-medium uppercase tracking-[0.2em] text-[9px] md:text-[10px] mt-1 opacity-70">View and respond to customer issues</p>
      </div>

      <div className="space-y-6">
         {complaints?.length === 0 ? (
            <div className="bg-white/5 border border-dashed border-white/10 rounded-[2rem] md:rounded-[3rem] p-12 md:p-24 text-center">
               <MessageSquare className="size-12 md:size-16 text-gray-700 mx-auto mb-6" />
               <h3 className="text-xl md:text-2xl font-medium text-white uppercase font-subheading-main">No complaints</h3>
               <p className="text-gray-500 font-medium text-[10px] md:text-xs uppercase tracking-widest mt-2 opacity-70">Customer complaints will appear here</p>
            </div>
         ) : (
            complaints?.map((complaint: Complaint) => (
              <div key={complaint.id} className="bg-white/5 border border-white/5 rounded-2xl md:rounded-3xl overflow-hidden hover:bg-white/[0.08] transition-all">
                 <div className="p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                       <div className="flex items-center gap-4">
                          <div className="size-10 md:size-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-medium text-sm md:text-base shadow-lg shadow-indigo-500/20 shrink-0">
                             {complaint.user?.name?.[0] || "U"}
                          </div>
                          <div>
                             <h3 className="text-base md:text-lg font-medium text-white uppercase tracking-tight font-subheading-main leading-tight">{complaint.subject}</h3>
                             <div className="flex items-center gap-2 md:gap-3 mt-1 flex-wrap">
                                <span className="text-[10px] md:text-xs font-medium text-gray-500">{complaint.user?.name || "Anonymous"}</span>
                                <span className="text-gray-700 hidden md:inline">•</span>
                                <span className="text-[9px] md:text-[10px] font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                   <Clock className="size-2.5 md:size-3" />
                                   {new Date(complaint.createdAt).toLocaleDateString()}
                                </span>
                             </div>
                          </div>
                       </div>
                       <span className={cn(
                         "px-2.5 py-1 md:px-3 md:py-1 rounded-full text-[9px] md:text-[10px] font-medium uppercase tracking-widest border flex items-center gap-1.5",
                         statusColors[complaint.status as keyof typeof statusColors]
                       )}>
                          {complaint.status === "PENDING" ? <AlertCircle className="size-2.5 md:size-3" /> : <CheckCircle2 className="size-2.5 md:size-3" />}
                          {complaint.status}
                       </span>
                    </div>

                    <div className="bg-white/5 border border-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 mb-6">
                       <p className="text-xs md:text-sm font-medium text-gray-300 leading-relaxed">{complaint.message}</p>
                    </div>

                  {/* Display History */}
                    {complaint.sellerReply && (
                       <div className="space-y-4 mb-6">
                          {complaint.sellerReply.split('\n\n').map((reply, idx) => (
                             <div key={idx} className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl md:rounded-2xl p-4 md:p-6">
                                <div className="flex items-center gap-2 mb-2">
                                   <MessageSquare className="size-3.5 md:size-4 text-indigo-400" />
                                   <span className="text-[9px] md:text-[10px] font-medium text-indigo-400 uppercase tracking-widest">Response</span>
                                </div>
                                <p className="text-xs md:text-sm font-medium text-white leading-relaxed whitespace-pre-wrap">{reply}</p>
                             </div>
                          ))}
                       </div>
                    )}

                    {/* Reply Input - Hide ONLY if RESOLVED */}
                    {complaint.status !== "RESOLVED" && (
                       <div>
                          {replyingTo === complaint.id ? (
                             <div className="space-y-4">
                                <textarea
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  placeholder="Type your reply..."
                                  className="w-full bg-white/5 border border-white/5 rounded-xl md:rounded-2xl px-4 py-3 text-xs md:text-sm text-white resize-none focus:outline-none focus:border-indigo-500/50 min-h-[100px] md:min-h-[120px]"
                                />
                                <div className="flex flex-col sm:flex-row items-center gap-3">
                                   <button
                                     onClick={() => replyMutation.mutate({ id: complaint.id, response: replyText })}
                                     disabled={!replyText.trim() || replyMutation.isPending}
                                     className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-500 text-white font-medium text-[10px] md:text-xs uppercase tracking-widest hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all"
                                   >
                                      {replyMutation.isPending ? <Loader2 className="size-3.5 md:size-4 animate-spin" /> : <Send className="size-3.5 md:size-4" />}
                                      Send Reply
                                   </button>
                                   <button
                                     onClick={() => {
                                       setReplyingTo(null);
                                       setReplyText("");
                                     }}
                                     className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 border border-white/5 text-gray-400 font-medium text-[10px] md:text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                                   >
                                      Cancel
                                   </button>
                                </div>
                             </div>
                          ) : (
                             <button
                               onClick={() => setReplyingTo(complaint.id)}
                               className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 border border-white/5 text-gray-400 font-medium text-[10px] md:text-xs uppercase tracking-widest hover:bg-indigo-500 hover:text-white hover:border-indigo-500 transition-all flex items-center justify-center gap-2"
                             >
                                <MessageSquare className="size-3.5 md:size-4" />
                                Reply to Complaint
                             </button>
                          )}
                       </div>
                    )}
                 </div>
              </div>
            ))
         )}
      </div>
    </div>
  );
}
