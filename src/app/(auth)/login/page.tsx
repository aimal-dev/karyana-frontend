"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import api from "@/lib/axios";
import AuthCard from "../components/AuthCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await api.post("/auth/login", formData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", "USER");
      router.push("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Login failed. Please check credentials.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 pt-20 pb-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
         <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px]" />
      </div>

      <AuthCard title="Welcome Back" subtitle="User Login Access">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-xs font-bold uppercase tracking-widest animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type="email"
                placeholder="Email Address"
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

          <Button 
            disabled={loading}
            className="w-full h-14 text-sm font-black tracking-[0.2em] rounded-2xl group flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="size-5 animate-spin" /> : "SECURE LOGIN"}
          </Button>

          <div className="text-center pt-4 space-y-4">
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
              Dont have an account? 
              <Link href="/register" className="text-primary ml-2 hover:underline">Register Now</Link>
            </p>
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest pt-4 border-t border-white/5">
               <Link href="/seller-login" className="text-muted-foreground hover:text-white transition-colors">Seller Portal</Link>
               <Link href="/admin-login" className="text-muted-foreground hover:text-white transition-colors">Admin Access</Link>
            </div>
          </div>
        </form>
      </AuthCard>
    </div>
  );
}
