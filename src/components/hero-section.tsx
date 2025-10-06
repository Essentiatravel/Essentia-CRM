"use client";
import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";

const HERO_BACKGROUND_STYLE: CSSProperties = {
  backgroundColor: "#2563EB",
  backgroundImage:
    "linear-gradient(135deg, #2563EB 0%, #3B82F6 45%, #FB923C 100%)",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const HERO_OVERLAY_STYLE: CSSProperties = {
  backgroundImage:
    "linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0) 65%)",
};

const HERO_HIGHLIGHTS_STYLE: CSSProperties = {
  backgroundImage: [
    "radial-gradient(circle at 20% 25%, rgba(255, 255, 255, 0.28), transparent 60%)",
    "radial-gradient(circle at 80% 10%, rgba(255, 255, 255, 0.2), transparent 55%)",
  ].join(", "),
  mixBlendMode: "screen",
};

export default function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={HERO_BACKGROUND_STYLE}
    >
      {/* Soft dark overlay to keep legibility */}
      <div
        className="pointer-events-none absolute inset-0"
        style={HERO_OVERLAY_STYLE}
      />
      {/* Subtle highlight accents to mimic the original glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={HERO_HIGHLIGHTS_STYLE}
      />
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Descubra a Magia da 
            <span className="text-orange-300"> Itália</span>
          </h1>
          
          <p className="text-lg md:text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Explore a Itália com quem entende. Roteiros únicos, guias locais 
            experientes e experiências autênticas que você nunca esquecerá.
          </p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Button 
              size="lg" 
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
              onClick={() => scrollToSection('roteiros')}
            >
              Conheça os Roteiros
            </Button>
          </motion.div>
        </motion.div>
        
        {/* Decorative elements */}
        <motion.div
          className="pointer-events-none absolute -top-4 -right-4 h-24 w-24 rounded-full bg-orange-300/20 blur-xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-blue-300/20 blur-xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 0],
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
    </section>
  );
}
