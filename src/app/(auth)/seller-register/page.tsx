"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import api from "@/lib/axios";
import AuthCard from "../components/AuthCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2, Mail, Lock, Store } from "lucide-react";

export default function SellerRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/auth/seller-register", formData);
      setSuccess(true);
      // Wait 3 seconds then redirect
      setTimeout(() => router.push("/seller-login"), 3000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Registration failed. Try again.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <AuthCard title="Request Sent" subtitle="Seller Application Under Review">
           <div className="text-center space-y-6">
              <div className="size-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto border border-primary/50 animate-bounce">
                 <Store className="size-10 text-primary" />
              </div>
              <p className="text-white text-sm font-medium leading-relaxed">
                 Your seller request has been submitted successfully. Our admin team will review your application. You will be able to log in once approved.
              </p>
              <p className="text-primary font-bold text-xs uppercase tracking-widest">Redirecting to login...</p>
           </div>
        </AuthCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 pt-20 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent" />

      <AuthCard title="Be a Seller" subtitle="Launch Your Digital Store">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-xs font-bold uppercase tracking-widest animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative group">
              <Store className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type="text"
                placeholder="Store / Company Name"
                className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type="email"
                placeholder="Business Email"
                className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type="password"
                placeholder="Secure Password"
                className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
            <p className="text-[10px] text-primary/80 font-bold uppercase tracking-widest leading-tight">
              Important: Seller accounts require manual approval by the admin team before gaining dashboard access.
            </p>
          </div>

          <Button 
            disabled={loading}
            className="w-full h-14 text-sm font-black tracking-[0.2em] rounded-2xl group flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="size-5 animate-spin" /> : "APPLY AS SELLER"}
          </Button>

          <div className="text-center pt-4">
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
              Already applied? 
              <Link href="/seller-login" className="text-primary ml-2 hover:underline">Seller Login</Link>
            </p>
          </div>
        </form>
      </AuthCard>
    </div>
  );
}
