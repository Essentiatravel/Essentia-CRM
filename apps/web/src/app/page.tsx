"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import HeroSection from "@/components/hero-section";
import ExperienceTypes from "@/components/experience-types";
import Destinations from "@/components/destinations";
import Differentials from "@/components/differentials";
import Footer from "@/components/footer";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <HeroSection />
      <ExperienceTypes />
      <Destinations />
      <Differentials />
      <Footer />
    </main>
  );
}