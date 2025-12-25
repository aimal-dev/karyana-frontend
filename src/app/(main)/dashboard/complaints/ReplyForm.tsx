"use client"

import { useState } from "react";
import api from "@/lib/axios";
import { Button } from "@/components/ui/Button";
import { Loader2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ReplyForm({ complaintId, onSuccess }: { complaintId: number, onSuccess: () => void }) {
    const [reply, setReply] = useState("");
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async () => {
        if(!reply.trim()) return;
        setLoading(true);
        try {
            await api.put(`/complaints/user-reply/${complaintId}`, { userReply: reply });
            toast({ title: "Reply Sent", description: "Your reply has been added." });
            setReply("");
            onSuccess();
        } catch {
            toast({ variant: "destructive", title: "Error", description: "Failed to send reply" });
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="space-y-3">
            <textarea 
                value={reply}
                onChange={e => setReply(e.target.value)}
                placeholder="Write a reply..."
                className="w-full h-24 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium resize-none"
            />
            <div className="flex justify-between items-center">
                <div /> {/* Spacer for flex-between */}
                <Button 
                   size="sm" 
                   onClick={handleSubmit} 
                   disabled={!reply.trim() || loading}
                   className="gap-2"
                >
                    {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                    Reply
                </Button>
            </div>
        </div>
    );
}
