"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedTypes?: string[];
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  allowedTypes = ["admin"],
  redirectTo = "/",
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname ?? redirectTo)}`);
      return;
    }

    if (user.userType && !allowedTypes.includes(user.userType)) {
      if (user.userType === "admin") {
        router.push("/admin");
      } else if (user.userType === "guia") {
        router.push("/guia");
      } else if (user.userType === "cliente") {
        router.push("/cliente");
      } else {
        router.push(redirectTo);
      }
    }
  }, [user, loading, allowedTypes, redirectTo, router, pathname]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 text-gray-600 text-sm">
            {loading ? "Carregando..." : "Redirecionando..."}
          </p>
        </div>
      </div>
    );
  }

  if (user.userType && !allowedTypes.includes(user.userType)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 text-gray-600 text-sm">Redirecionando...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}




