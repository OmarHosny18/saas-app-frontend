"use client";

import { motion } from "framer-motion";
import { Bell, Search } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/jobs": "Job Applications",
  "/analytics": "Analytics",
  "/lessons": "Lessons",
};

export function Navbar() {
  const { user } = useAuthStore();
  const pathname = usePathname();

  const title =
    Object.entries(pageTitles).find(([key]) => pathname.startsWith(key))?.[1] ??
    "JobTracker";

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed top-0 left-64 right-0 h-16 glass border-b border-border z-40 flex items-center px-6 gap-4"
    >
      {/* Page Title */}
      <div className="flex-1">
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 glass rounded-xl px-4 py-2 border border-border hover:border-primary/30 transition-all duration-200 group cursor-pointer">
        <Search className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
        <span className="text-sm text-muted-foreground">Search...</span>
        <kbd className="ml-4 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
          ⌘K
        </kbd>
      </div>

      {/* Notifications */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-9 h-9 glass rounded-xl flex items-center justify-center border border-border hover:border-primary/30 hover:shadow-neon-blue transition-all duration-200"
      >
        <Bell className="w-4 h-4 text-muted-foreground" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full shadow-neon-blue" />
      </motion.button>

      {/* Avatar */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center shadow-neon-blue cursor-pointer"
      >
        <span className="text-sm font-bold text-white">
          {user?.username?.[0]?.toUpperCase() ?? "U"}
        </span>
      </motion.div>
    </motion.header>
  );
}
