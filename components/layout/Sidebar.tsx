"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  BookOpen,
  BarChart3,
  LogOut,
  Zap,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Jobs",
    href: "/jobs",
    icon: Briefcase,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    label: "Lessons",
    href: "/lessons",
    icon: BookOpen,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed left-0 top-0 h-full w-64 glass border-r border-border flex flex-col z-50"
    >
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center shadow-neon-blue group-hover:shadow-neon-purple transition-all duration-300">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg gradient-text">JobTracker</span>
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer",
                  isActive
                    ? "bg-primary/10 border border-primary/30 shadow-neon-blue"
                    : "hover:bg-muted border border-transparent",
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 transition-colors duration-200",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground",
                  )}
                />
                <span
                  className={cn(
                    "text-sm font-medium transition-colors duration-200",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground",
                  )}
                >
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-neon-blue"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-border">
        <div className="glass rounded-xl p-3 mb-3">
          <p className="text-sm font-medium text-foreground truncate">
            {user?.username || "User"}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {user?.email || ""}
          </p>
        </div>
        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.97 }}
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left hover:bg-destructive/10 border border-transparent hover:border-destructive/30 transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 text-muted-foreground group-hover:text-destructive transition-colors duration-200" />
          <span className="text-sm font-medium text-muted-foreground group-hover:text-destructive transition-colors duration-200">
            Logout
          </span>
        </motion.button>
      </div>
    </motion.aside>
  );
}
