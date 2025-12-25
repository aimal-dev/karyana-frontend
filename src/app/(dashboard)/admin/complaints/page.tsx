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
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
         <h1 className="text-4xl font-black text-white tracking-tight">User Complaints</h1>
         <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-1">Manage and resolve customer queries and issues</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
         {complaints?.length === 0 ? (
           <div className="bg-white/5 border border-dashed border-white/10 rounded-[3rem] p-24 flex flex-col items-center justify-center text-center">
              <div className="size-24 rounded-full bg-emerald-500/10 flex items-center justify-center mb-8 border border-emerald-500/20">
                 <CheckCircle2 className="size-12 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-black text-white">No active complaints!</h3>
              <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-3">All your customers are currently satisfied.</p>
           </div>
         ) : (
           complaints?.map((complaint: Complaint) => (
             <div key={complaint.id} className="bg-white/5 border border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-indigo-500/30 transition-all duration-500">
                <div className="p-8 space-y-6">
                   <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                         <div className="size-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-indigo-500 shadow-xl group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500">
                            <MessageSquare className="size-6" />
                         </div>
                         <div>
                            <h3 className="text-xl font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{complaint.subject}</h3>
                            <div className="flex items-center gap-4 mt-1">
                               <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                                  <User className="size-3" />
                                  {complaint.user?.name || "Anonymous User"}
                               </div>
                               <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                                  <Clock className="size-3" />
                                  {new Date(complaint.createdAt).toLocaleString()}
                               </div>
                            </div>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-500 ${
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
                           className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 hover:bg-red-500/10 hover:text-red-500 transition-all"
                         >
                           <Trash2 className="size-4" />
                         </button>
                      </div>
                   </div>

                   <div className="bg-white/5 border border-white/5 rounded-3xl p-6 relative">
                      <div className="absolute -left-2 top-6 w-1 h-8 bg-indigo-500 rounded-full" />
                      <p className="text-sm font-bold text-gray-300 leading-relaxed italic">
                        &quot;{complaint.message}&quot;
                      </p>
                   </div>

                   {complaint.sellerReply && (
                     <div className="space-y-4 mb-6">
                        {complaint.sellerReply.split('\n\n').map((reply, idx) => (
                          <div key={idx} className="bg-emerald-500/5 border border-emerald-500/10 rounded-3xl p-6 flex items-start gap-4">
                              <div className="size-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0">
                                <Reply className="size-5 -scale-x-100" />
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Response</p>
                                <p className="text-sm font-bold text-emerald-200/80 leading-relaxed whitespace-pre-wrap">
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
                             className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-5 text-sm font-medium focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all min-h-[120px] resize-none pr-16"
                           />
                           <div className="absolute right-4 bottom-4 flex gap-2">
                              {/* Mark Resolved Button */}
                                {/* Mark Resolved Button */}
                                <button 
                                  onClick={() => {
                                    if(!confirm("Mark this complaint as RESOLVED? This will close the ticket.")) return;
                                    api.put(`/complaints/reply/${complaint.id}`, { status: "RESOLVED" }).then(() => {
                                       queryClient.invalidateQueries({ queryKey: ["admin-complaints"] });
                                       toast({ variant: "success", title: "Resolved", description: "Complaint marked as resolved." });
                                    });
                                  }}
                                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 font-bold text-xs uppercase tracking-wider hover:bg-emerald-500 hover:text-white transition-all shadow-lg border border-emerald-500/20"
                                >
                                  <CheckCircle2 className="size-4" />
                                  Mark as Resolved
                                </button>

                              <button 
                                onClick={() => {
                                  if(!replyText[complaint.id]) return;
                                  replyMutation.mutate({ id: complaint.id, reply: replyText[complaint.id] });
                                }}
                                disabled={replyMutation.isPending || !replyText[complaint.id]}
                                className="size-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:scale-100"
                              >
                                {replyMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                              </button>
                           </div>
                        </div>
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
