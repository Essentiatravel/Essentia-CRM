"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface User {
  id: string;
  email: string;
  nome?: string;
  userType?: "admin" | "guia" | "cliente";
  telefone?: string;
  endereco?: string;
  data_nascimento?: string;
  cpf?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  signup: (
    params: {
      email: string;
      password: string;
      nome?: string;
      userType?: User["userType"];
      metadata?: Record<string, string | string[]>;
    }
  ) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Função para buscar dados do usuário da tabela users
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      const [firstName, ...lastNameParts] = (data.nome || "").split(" ");
      return {
        id: data.id,
        email: data.email,
        nome: data.nome,
        firstName: firstName || "",
        lastName: lastNameParts.join(" ") || "",
        userType: data.user_type || data.userType,
        telefone: data.telefone,
        endereco: data.endereco,
        data_nascimento: data.dataNascimento,
        cpf: data.cpf,
      };
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session?.user) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Buscar dados completos do usuário da tabela users
      const profile = await fetchUserProfile(session.user.id);
      if (profile) {
        setUser(profile);
      } else {
        // Fallback para user_metadata se não encontrar na tabela
        const metadata = session.user.user_metadata ?? {};
        setUser({
          id: session.user.id,
          email: session.user.email ?? "",
          nome: metadata.nome,
          userType: metadata.userType,
          telefone: metadata.telefone,
          endereco: metadata.endereco,
          data_nascimento: metadata.data_nascimento,
          cpf: metadata.cpf,
        });
      }
      setLoading(false);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!session?.user) {
        setUser(null);
        return;
      }

      // Buscar dados completos do usuário da tabela users
      const profile = await fetchUserProfile(session.user.id);
      if (profile) {
        setUser(profile);
      } else {
        // Fallback para user_metadata se não encontrar na tabela
        const metadata = session.user.user_metadata ?? {};
        setUser({
          id: session.user.id,
          email: session.user.email ?? "",
          nome: metadata.nome,
          userType: metadata.userType,
          telefone: metadata.telefone,
          endereco: metadata.endereco,
          data_nascimento: metadata.data_nascimento,
          cpf: metadata.cpf,
        });
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        return { error: error.message };
      }

      // Buscar dados do usuário imediatamente após login
      if (data.user) {
        const profile = await fetchUserProfile(data.user.id);
        if (profile) {
          setUser(profile);
        } else {
          const metadata = data.user.user_metadata ?? {};
          setUser({
            id: data.user.id,
            email: data.user.email ?? "",
            nome: metadata.nome,
            userType: metadata.userType,
            telefone: metadata.telefone,
            endereco: metadata.endereco,
            data_nascimento: metadata.data_nascimento,
            cpf: metadata.cpf,
          });
        }
      }
      
      return {};
    } catch (error) {
      return { error: "Erro ao fazer login" };
    }
  };

  const signup: AuthContextType["signup"] = async ({ email, password, nome, userType, metadata }) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome,
          userType,
          ...metadata,
        },
      },
    });

    if (error) {
      console.error("Erro no cadastro Supabase:", error.message);
      return { error: error.message };
    }

    return {};
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Erro ao sair do Supabase:", error.message);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}