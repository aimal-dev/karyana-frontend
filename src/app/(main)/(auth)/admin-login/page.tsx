"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import api from "@/lib/axios";
import AuthCard from "../components/AuthCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2, ShieldCheck, Mail, Lock } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/hooks/useUser";
import { useEffect } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user, isLoading: userLoading } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => {
    if (!userLoading && user) {
       if (user.role === "ADMIN") router.push("/admin");
       else if (user.role === "SELLER") router.push("/seller");
       else router.push("/");
    }
  }, [user, userLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await api.post("/auth/admin-login", formData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", "ADMIN");
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      router.push("/admin");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Invalid Admin Credentials.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-15 min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Intense red/green glow for danger/admin area */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[200px] pointer-events-none" />
      
      <AuthCard title="HQ Terminal" subtitle="Administrative Command Access" className="border-primary/20">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center mb-6">
            <div className="size-20 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shadow-[0_0_30px_rgba(34,197,94,0.2)]">
              <ShieldCheck className="size-10" />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-[10px] font-bold uppercase tracking-widest text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type="email"
                placeholder="Admin Identifier"
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
                placeholder="Security Key"
                className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <Button 
            disabled={loading}
            className="w-full h-14 text-sm font-black tracking-[0.3em] rounded-2xl group flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(34,197,94,0.1)]"
          >
            {loading ? <Loader2 className="size-5 animate-spin" /> : <span className="flex items-center gap-2">EXECUTE LOGIN <ShieldCheck className="size-4" /></span>}
          </Button>

          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest pt-4 border-t border-border">
               <Link href="/login" className="text-muted-foreground hover:text-primary transition-colors">Standard User Login</Link>
               <Link href="/seller-login" className="text-muted-foreground hover:text-primary transition-colors">Seller Access</Link>
          </div>
        </form>
      </AuthCard>
    </div>
  );
}
