"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardRoute, type UserType } from "@/lib/auth-redirect";

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

    console.log("🔒 [ProtectedRoute] Verificando acesso");
    console.log("🔒 [ProtectedRoute] User:", user);
    console.log("🔒 [ProtectedRoute] UserType:", user?.userType);
    console.log("🔒 [ProtectedRoute] Allowed Types:", allowedTypes);
    console.log("🔒 [ProtectedRoute] Pathname:", pathname);

    if (!user) {
      console.log("⛔ [ProtectedRoute] Usuário não autenticado, redirecionando para login");
      router.push(`/login?redirect=${encodeURIComponent(pathname ?? redirectTo)}`);
      return;
    }

    if (user.userType && !allowedTypes.includes(user.userType)) {
      console.log("⛔ [ProtectedRoute] Usuário não tem permissão. Redirecionando...");

      // Usar utilitário para obter rota correta
      const dashboardRoute = getDashboardRoute(user.userType as UserType);
      console.log("➡️ [ProtectedRoute] Redirecionando para:", dashboardRoute);
      router.push(dashboardRoute);
    } else {
      console.log("✅ [ProtectedRoute] Acesso permitido");
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




