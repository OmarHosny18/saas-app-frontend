"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import PillNav from "@/components/ui/PillNav";
import LightRays from "@/components/ui/LightRays";
import { motion } from "framer-motion";
import MagicBento from "@/components/ui/MagicBento";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Jobs", href: "/jobs" },
  { label: "Analytics", href: "/analytics" },
  { label: "Lessons", href: "/lessons" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { fetchUser, logout, user } = useAuthStore();
  const pathname = usePathname();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* HARD Background Reset */}
      <div className="fixed inset-0 bg-black -z-20" />
      {/* LightRays Layer */}
      <div className="fixed inset-0 -z-10">
        <LightRays
          raysOrigin="top-center"
          raysColor="#3b82f6"
          raysSpeed={1}
          lightSpread={0.5}
          rayLength={3}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0}
          distortion={0}
          pulsating={false}
          fadeDistance={1}
          saturation={1}
        />
      </div>
      {/* MagicBento (Transparent Overlay) */}s{/* Top Bar */}
      <div className="fixed top-12 left-0 right-0 z-50 flex justify-center items-center px-8">
        <div className="absolute left-1/2 -translate-x-1/2">
          <PillNav
            items={navItems}
            activeHref={pathname}
            baseColor="#000000"
            pillColor="#000000"
            hoveredPillTextColor="#3b82f6"
            pillTextColor="#ffffff"
            initialLoadAnimation={true}
          />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              }}
            >
              {user?.username?.[0]?.toUpperCase() ?? "U"}
            </div>
            <span className="text-sm text-gray-300 font-medium">
              {user?.username}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            className="px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm text-gray-400 hover:text-red-400 hover:border-red-500/30 transition-all duration-200"
          >
            Logout
          </motion.button>
        </div>
      </div>
      {/* Main Content */}
      <main className="pt-32 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="max-w-7xl mx-auto px-8 pb-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
