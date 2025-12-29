"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { 
  MessageSquare, 
  Loader2, 
  Trash2, 
  Reply, 
  User, 
  CheckCircle2,
  Clock,
  Send
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Complaint {
  id: number;
  subject: string;
  message: string;
  sellerReply?: string;
  createdAt: string;
  user?: { name: string };
  status: string;
}

export default function AdminComplaintsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [replyText, setReplyText] = useState<Record<number, string>>({});

  const { data: complaints, isLoading } = useQuery({
    queryKey: ["admin-complaints"],
    queryFn: async () => {
       const response = await api.get("/complaints/seller");
      return response.data.complaints;
    }
  });

  const replyMutation = useMutation({
    mutationFn: async ({ id, reply }: { id: number, reply: string }) => {
      await api.put(`/complaints/reply/${id}`, { sellerReply: reply });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-complaints"] });
      toast({ variant: "success", title: "Reply Sent", description: "Your response has been sent to the user." });
      setReplyText({});
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/complaints/seller/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-complaints"] });
      toast({ variant: "destructive", title: "Deleted", description: "Complaint has been removed." });
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
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 font-subheading-main">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
         <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">User Complaints</h1>
            <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-1 opacity-70">Manage and resolve customer queries and issues</p>
         </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-6 mt-4">
         {complaints?.length === 0 ? (
            <div className="bg-white/5 border border-dashed border-white/10 rounded-[2.5rem] md:rounded-[3rem] p-12 md:p-24 flex flex-col items-center justify-center text-center">
               <div className="size-20 md:size-24 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 md:mb-8 border border-emerald-500/20 shrink-0">
                  <CheckCircle2 className="size-10 md:size-12 text-emerald-500" />
               </div>
               <h3 className="text-xl md:text-2xl font-black text-white px-4">No active complaints!</h3>
               <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-3 px-6 opacity-70">All your customers are currently satisfied.</p>
            </div>
         ) : (
            complaints?.map((complaint: Complaint) => (
              <div key={complaint.id} className="bg-white/5 border border-white/5 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden group hover:border-indigo-500/30 transition-all duration-500">
                 <div className="p-5 md:p-8 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                       <div className="flex items-start gap-4 flex-1">
                          <div className="size-12 md:size-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-indigo-500 shadow-xl group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500 shrink-0">
                             <MessageSquare className="size-5 md:size-6" />
                          </div>
                          <div className="min-w-0 flex-1">
                             <h3 className="text-lg md:text-xl font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight truncate">{complaint.subject}</h3>
                             <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1">
                                <div className="flex items-center gap-1.5 text-gray-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                                   <User className="size-3 shrink-0" />
                                   <span className="truncate max-w-[120px]">{complaint.user?.name || "Anonymous User"}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                                   <Clock className="size-3 shrink-0" />
                                   {new Date(complaint.createdAt).toLocaleDateString()}
                                </div>
                             </div>
                          </div>
                       </div>
                       <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                          <span className={`px-3 md:px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border transition-all duration-500 ${
                            complaint.sellerReply 
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                              : "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-lg shadow-amber-500/5 animate-pulse"
                          }`}>
                            {complaint.sellerReply ? "Resolved" : "Awaiting Action"}
                          </span>
                          <button 
                            onClick={() => {
                              if(confirm("Permanently delete this complaint?")) deleteMutation.mutate(complaint.id);
                            }}
                            className="size-9 md:size-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 hover:bg-red-500/10 hover:text-red-500 transition-all shrink-0"
                          >
                            <Trash2 className="size-4 md:size-4" />
                          </button>
                       </div>
                    </div>

                    <div className="bg-white/5 border border-white/5 rounded-2xl md:rounded-3xl p-5 md:p-6 relative">
                       <div className="absolute -left-1 md:-left-2 top-6 w-1 h-8 bg-indigo-500 rounded-full" />
                       <p className="text-xs md:text-sm font-bold text-gray-300 leading-relaxed italic">
                         &quot;{complaint.message}&quot;
                       </p>
                    </div>

                    {complaint.sellerReply && (
                      <div className="space-y-4 mb-4 md:mb-6">
                         {complaint.sellerReply.split('\n\n').map((reply, idx) => (
                           <div key={idx} className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl md:rounded-3xl p-5 md:p-6 flex items-start gap-3 md:gap-4">
                               <div className="size-8 md:size-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0">
                                 <Reply className="size-4 md:size-5 -scale-x-100" />
                               </div>
                               <div>
                                 <p className="text-[9px] md:text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Response</p>
                                 <p className="text-xs md:text-sm font-bold text-emerald-200/80 leading-relaxed whitespace-pre-wrap">
                                     {reply}
                                 </p>
                               </div>
                           </div>
                         ))}
                      </div>
                    )}

                    {complaint.status !== "RESOLVED" && (
                      <div className="space-y-4 pt-2">
                         <div className="relative">
                            <textarea 
                              placeholder="Write your reply..."
                              value={replyText[complaint.id] || ""}
                              onChange={(e) => setReplyText(prev => ({ ...prev, [complaint.id]: e.target.value }))}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl px-5 md:px-6 py-4 md:py-5 text-sm font-medium focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all min-h-[120px] md:min-h-[140px] resize-none pr-14 md:pr-16"
                            />
                            <div className="absolute right-3 bottom-3 md:right-4 md:bottom-4 flex items-center gap-2">
                                <button 
                                  onClick={() => {
                                    if(!confirm("Mark this complaint as RESOLVED? This will close the ticket.")) return;
                                    api.put(`/complaints/reply/${complaint.id}`, { status: "RESOLVED" }).then(() => {
                                       queryClient.invalidateQueries({ queryKey: ["admin-complaints"] });
                                       toast({ variant: "success", title: "Resolved", description: "Complaint marked as resolved." });
                                    });
                                  }}
                                  className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 font-bold text-[10px] uppercase tracking-wider hover:bg-emerald-500 hover:text-white transition-all shadow-lg border border-emerald-500/20 whitespace-nowrap"
                                >
                                  <CheckCircle2 className="size-3.5" />
                                  Mark resolved
                                </button>

                              <button 
                                onClick={() => {
                                  if(!replyText[complaint.id]) return;
                                  replyMutation.mutate({ id: complaint.id, reply: replyText[complaint.id] });
                                }}
                                disabled={replyMutation.isPending || !replyText[complaint.id]}
                                className="size-10 md:size-12 rounded-xl bg-indigo-500 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:scale-100"
                              >
                                {replyMutation.isPending ? <Loader2 className="size-4 md:size-5 animate-spin" /> : <Send className="size-4 md:size-5" />}
                              </button>
                            </div>
                         </div>
                         <button 
                            onClick={() => {
                                if(!confirm("Mark this complaint as RESOLVED? This will close the ticket.")) return;
                                api.put(`/complaints/reply/${complaint.id}`, { status: "RESOLVED" }).then(() => {
                                   queryClient.invalidateQueries({ queryKey: ["admin-complaints"] });
                                   toast({ variant: "success", title: "Resolved", description: "Complaint marked as resolved." });
                                });
                            }}
                            className="md:hidden w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500/10 text-emerald-500 font-bold text-[10px] uppercase tracking-[0.2em] border border-emerald-500/20"
                         >
                            <CheckCircle2 className="size-3" /> Mark as Resolved
                         </button>
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
