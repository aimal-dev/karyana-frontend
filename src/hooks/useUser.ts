import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface User {
  id: number;
  name: string;
  email: string;
  role: "USER" | "ADMIN" | "SELLER";
  address?: string;
  city?: string;
  phone?: string;
}

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) return null;
      
      try {
        const res = await api.get("/auth/me");
        return res.data.user as User;
      } catch (error: any) {
        if (error.response?.status === 403 || error.response?.status === 401) {
          localStorage.removeItem("token"); // Clear invalid token
        }
        return null; // Not logged in
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // Cache user data for 5 minutes
  });
}
