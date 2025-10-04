"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Settings, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export const AdminAccessButton: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Button
        asChild
        className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        size="lg"
      >
        <a href="/admin">
          <Settings className="h-5 w-5 mr-2" />
          Dashboard Admin
          <ArrowRight className="h-4 w-4 ml-2" />
        </a>
      </Button>
    </motion.div>
  );
};

export default AdminAccessButton;

