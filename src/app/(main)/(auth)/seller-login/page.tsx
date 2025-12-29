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
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/hooks/useUser";
import { useEffect } from "react";

export default function SellerLoginPage() {
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
      const { data } = await api.post("/auth/seller-login", formData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", "SELLER");
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      router.push("/seller");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Seller verification failed. Account may be pending approval.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 min-h-screen flex items-center justify-center p-4 pt-20 pb-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />

      <AuthCard title="Seller Portal" subtitle="Merchant Control Access">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center mb-4">
            <div className="size-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Store className="size-8" />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-[10px] font-bold uppercase tracking-wider text-center leading-relaxed">
              {error}
            </div>
          )}

          <div className="space-y-4">
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
                placeholder="Password"
                className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end pr-1">
             <Link href="/forgot-password" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                Forgot Password?
             </Link>
          </div>

          <Button 
            disabled={loading}
            className="w-full h-14 text-sm font-black tracking-[0.2em] rounded-2xl group flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="size-5 animate-spin" /> : "AUTHENTICATE STORE"}
          </Button>

          <div className="text-center pt-4 space-y-4">
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
              New merchant? 
              <Link href="/seller-register" className="text-primary ml-2 hover:underline">Apply Now</Link>
            </p>
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest pt-4 border-t border-border">
               <Link href="/login" className="text-muted-foreground hover:text-primary transition-colors">Standard User Login</Link>
               <Link href="/admin-login" className="text-muted-foreground hover:text-primary transition-colors">Admin Access</Link>
            </div>
          </div>
        </form>
      </AuthCard>
    </div>
  );
}
