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

  useEffect(() => {
    if (loading || !user) return;

    const type = user.userType ?? 'admin';

    if (type === 'admin') {
      router.push('/admin');
    } else if (type === 'guia') {
      router.push('/guia');
    } else if (type === 'cliente') {
      router.push('/cliente');
    } else {
      router.push('/');
    }
  }, [user, loading, router]);

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
