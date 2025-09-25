"use client";

import { useAuth } from "@/contexts/AuthContext";
import Header from "./header";
import { usePathname } from "next/navigation";

export default function HeaderWrapper() {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  // Não mostrar header em páginas de autenticação
  const authPages = ['/login', '/register'];
  const isAuthPage = authPages.includes(pathname);

  if (isAuthPage) {
    return null;
  }

  // Mostrar header mesmo durante loading na página principal
  const isHomePage = pathname === '/';
  if (loading && !isHomePage) {
    return null;
  }

  return <Header />;
}