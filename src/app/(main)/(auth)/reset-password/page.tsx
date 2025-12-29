"use client"

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import api from "@/lib/axios";
import AuthCard from "../components/AuthCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2, Lock, ArrowLeft, CheckCircle2 } from "lucide-react";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const role = searchParams.get("role");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({ newPassword: "", confirmPassword: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }
    if (formData.newPassword.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/auth/reset-password", { 
        token, 
        role, 
        newPassword: formData.newPassword 
      });
      setSuccess(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Reset failed. Token may be invalid or expired.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!token || !role) {
    return (
      <div className="mt-10 min-h-screen flex items-center justify-center p-4">
        <AuthCard title="Invalid Link" subtitle="Access Denied">
           <div className="text-center space-y-4">
              <p className="text-muted-foreground text-sm">The reset link is malformed or missing required information.</p>
              <Link href="/login" className="text-primary font-bold hover:underline">Return to Login</Link>
           </div>
        </AuthCard>
      </div>
    );
  }

  if (success) {
    return (
      <div className="mt-10 min-h-screen flex items-center justify-center p-4">
        <AuthCard title="Success!" subtitle="Password updated">
          <div className="text-center space-y-6">
            <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary animate-bounce">
              <CheckCircle2 className="size-10" />
            </div>
            <p className="text-muted-foreground text-sm font-medium">
              Your password has been reset successfully. You can now login with your new credentials.
            </p>
            <Button onClick={() => router.push("/login")} className="w-full h-12 rounded-xl font-bold uppercase tracking-widest">
               GO TO LOGIN
            </Button>
          </div>
        </AuthCard>
      </div>
    );
  }

  return (
    <div className="mt-10 min-h-screen flex items-center justify-center p-4 pt-20 pb-20 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />

      <AuthCard title="Reset Password" subtitle="Enter your new security credentials">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-[10px] font-bold uppercase tracking-wider text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type="password"
                placeholder="New Password"
                className="pl-12 h-14 bg-muted/30 border-border rounded-2xl focus:border-primary transition-all"
                required
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type="password"
                placeholder="Confirm New Password"
                className="pl-12 h-14 bg-muted/30 border-border rounded-2xl focus:border-primary transition-all"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          <Button 
            disabled={loading}
            className="w-full h-14 text-sm font-black tracking-[0.2em] rounded-2xl shadow-lg shadow-primary/20"
          >
            {loading ? <Loader2 className="size-5 animate-spin" /> : "COMPLETE RESET"}
          </Button>

          <div className="text-center pt-2">
            <Link href="/login" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary text-[10px] font-bold uppercase tracking-widest transition-colors">
               <ArrowLeft className="size-3" /> Back to Login
            </Link>
          </div>
        </form>
      </AuthCard>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
       <div className="min-h-screen flex items-center justify-center">
         <Loader2 className="size-10 animate-spin text-primary" />
       </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
