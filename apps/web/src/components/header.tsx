"use client";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { User, LogOut } from "lucide-react";

export default function Header() {
  const { user, logout } = useAuth();
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-blue-600">TURGUIDE</h1>
          <span className="ml-2 text-sm text-muted-foreground hidden sm:block">
            Explore a Itália com quem entende
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <button 
            onClick={() => scrollToSection('roteiros')}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Roteiros
          </button>
          <button 
            onClick={() => scrollToSection('destinos')}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Destinos
          </button>
          <button 
            onClick={() => scrollToSection('diferenciais')}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Por que nos escolher
          </button>
          <button 
            onClick={() => scrollToSection('contato')}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Contato
          </button>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                <span className="hidden sm:block">{user.nome}</span>
                <span className="text-xs text-gray-500 capitalize">({user.userType})</span>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:block ml-2">Sair</span>
              </Button>
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Entrar
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">
                  Cadastrar
                </Button>
              </Link>
            </>
          )}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
