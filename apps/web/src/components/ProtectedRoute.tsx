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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {loading ? "Verificando acesso..." : "Redirecionando para login..."}
          </p>
        </div>
      </div>
    );
  }

  if (user.userType && !allowedTypes.includes(user.userType)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecionando...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}




