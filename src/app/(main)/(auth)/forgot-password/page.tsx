"use client"

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import api from "@/lib/axios";
import AuthCard from "../components/AuthCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"USER" | "SELLER">("USER");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/auth/forgot-password", { email, role });
      setSuccess(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Failed to send reset link.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="mt-10 min-h-screen flex items-center justify-center p-4 pt-20 pb-20">
        <AuthCard title="Check Email" subtitle="Reset link dispatched">
          <div className="text-center space-y-6">
            <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary animate-bounce">
              <CheckCircle2 className="size-10" />
            </div>
            <p className="text-muted-foreground text-sm font-medium leading-relaxed">
              We&apos;ve sent a password reset link to <span className="text-foreground font-bold">{email}</span>. 
              Please check your inbox and follow the instructions.
            </p>
            <Link href="/login" className="inline-flex items-center gap-2 text-primary text-xs font-black uppercase tracking-widest hover:underline">
               <ArrowLeft className="size-4" /> Back to Login
            </Link>
          </div>
        </AuthCard>
      </div>
    );
  }

  return (
    <div className="mt-10 min-h-screen flex items-center justify-center p-4 pt-20 pb-20 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
      
      <AuthCard title="Forgot Password" subtitle="Recover your account access">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-[10px] font-bold uppercase tracking-wider text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
             {/* Role Selector */}
             <div className="flex bg-muted/30 p-1.5 rounded-2xl border border-border">
                <button
                   type="button"
                   onClick={() => setRole("USER")}
                   className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${role === "USER" ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                >
                   Buyer
                </button>
                <button
                   type="button"
                   onClick={() => setRole("SELLER")}
                   className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${role === "SELLER" ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                >
                   Seller
                </button>
             </div>

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type="email"
                placeholder="Recovery Email Address"
                className="pl-12 h-14 bg-muted/30 border-border rounded-2xl focus:border-primary transition-all"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <Button 
            disabled={loading}
            className="w-full h-14 text-sm font-black tracking-[0.2em] rounded-2xl shadow-lg shadow-primary/20"
          >
            {loading ? <Loader2 className="size-5 animate-spin" /> : "SEND RECOVERY LINK"}
          </Button>

          <div className="text-center pt-2">
            <Link href="/login" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary text-[10px] font-bold uppercase tracking-widest transition-colors">
               <ArrowLeft className="size-3" /> Back to User Login
            </Link>
          </div>
        </form>
      </AuthCard>
    </div>
  );
}
