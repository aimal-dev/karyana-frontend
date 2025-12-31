"use client"

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageSquare, 
  Plus, 
  Loader2,
  Trash2
} from "lucide-react";
import { ReplyForm } from "./ReplyForm";

interface Complaint {
  id: number;
  subject: string;
  message: string;
  sellerReply: string | null;
  userReply: string | null;
  createdAt: string;
  status: string;
}

export default function ComplaintsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ subject: "", message: "" });

  const { data, isLoading } = useQuery({
    queryKey: ["complaints"],
    queryFn: async () => {
      const res = await api.get("/complaints/my");
      return res.data;
    }
  });

  const complaints = data?.complaints || [];

  const createMutation = useMutation({
    mutationFn: async (data: { subject: string; message: string }) => {
       return await api.post("/complaints", data);
    },
    onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["complaints"] });
       toast({ variant: "success", title: "Submitted", description: "Complaint submitted successfully" });
       setFormData({ subject: "", message: "" });
       setShowForm(false);
    },
    onError: (err: { response?: { data?: { error?: string } } }) => {
       toast({ variant: "destructive", title: "Error", description: err.response?.data?.error || "Failed" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if(!formData.subject || !formData.message) return;
      createMutation.mutate(formData);
  };

  const handleDelete = async (id: number) => {
     if(!confirm("Are you sure?")) return;
     try {
       await api.delete(`/complaints/${id}`);
       queryClient.invalidateQueries({ queryKey: ["complaints"] });
       toast({ title: "Deleted", description: "Complaint deleted" });
     } catch {}
  };

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Complaints</h1>
            <p className="text-gray-500 font-medium text-sm mt-1">Report issues or send feedback.</p>
         </div>
         <Button 
           onClick={() => setShowForm(!showForm)} 
           className="w-full sm:w-auto h-12 rounded-xl gap-2 font-black shadow-lg shadow-primary/20 active:scale-95 transition-all"
         >
            {showForm ? "Cancel" : <><Plus className="size-4" /> New Complaint</>}
         </Button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg animate-in fade-in zoom-in-95 duration-200">
           <h3 className="font-black text-lg mb-4">Submit New Complaint</h3>
           <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Subject</label>
                  <Input 
                    value={formData.subject}
                    onChange={e => setFormData({...formData, subject: e.target.value})}
                    placeholder="Briefly describe the issue..."
                    className="bg-gray-50 border-gray-200"
                  />
               </div>
               <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Message</label>
                  <textarea 
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    placeholder="Detailed explanation..."
                    className="w-full min-h-[100px] p-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
                  />
               </div>
               <Button disabled={createMutation.isPending} className="w-full">
                  {createMutation.isPending && <Loader2 className="mr-2 size-4 animate-spin"/>}
                  Submit Complaint
               </Button>
           </form>
        </div>
      )}

      <div className="grid gap-6">
         {complaints.length === 0 && !showForm ? (
            <div className="text-center p-12 bg-white rounded-3xl border border-gray-100">
               <div className="size-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300 mb-4">
                  <MessageSquare className="size-8" />
               </div>
               <p className="text-gray-500 font-medium">No complaints found.</p>
            </div>
         ) : (
            complaints.map((c: Complaint) => (
               <div key={c.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <h3 className="font-black text-lg text-gray-900">{c.subject}</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                           {new Date(c.createdAt).toLocaleDateString()}
                        </p>
                     </div>
                     <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)} className="text-gray-400 hover:text-red-500">
                        <Trash2 className="size-4" />
                     </Button>
                  </div>
                  
                  <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                     <p className="text-gray-700 text-sm font-medium leading-relaxed">{c.message}</p>
                  </div>

                  {/* Chat History */}
                  {c.sellerReply && (
                      <div className="space-y-4 mb-6">
                          {c.sellerReply.split('\n\n').map((msg, idx) => {
                             const isUser = msg.includes(`[USER -`);
                             return (
                               <div key={idx} className={`p-4 rounded-2xl border ${isUser ? 'bg-gray-50 border-gray-100 ml-8' : 'bg-blue-50 border-blue-100 mr-8'}`}>
                                   <p className={`text-[10px] font-black uppercase tracking-wider mb-1 ${isUser ? 'text-gray-400' : 'text-blue-500'}`}>
                                      {isUser ? "You" : "Support Team"}
                                   </p>
                                   <p className={`text-sm font-medium ${isUser ? 'text-gray-700' : 'text-blue-900'} whitespace-pre-wrap`}>
                                      {msg.replace(/\[.*?\]:\s/, '')} {/* Strip the prefix for cleaner UI */}
                                   </p>
                               </div>
                             );
                          })}
                      </div>
                  )}

                  {/* Reply Action */}
                  {c.status !== "RESOLVED" && (
                     <div className="mt-4 pt-4 border-t border-gray-100">
                        <ReplyForm complaintId={c.id} onSuccess={() => queryClient.invalidateQueries({ queryKey: ["complaints"] })} />
                     </div>
                  )}
                  {c.status === "RESOLVED" && (
                    <div className="mt-4 p-3 bg-green-50 text-green-700 text-xs font-bold uppercase tracking-widest text-center rounded-xl border border-green-100">
                       Complaint Resolved
                    </div>
                  )}

                  {/* If user needs to reply back, implementation could go here, but kept simple for now */}
               </div>
            ))
         )}
      </div>
    </div>
  );
}
