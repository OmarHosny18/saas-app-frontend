"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import {
  Briefcase,
  TrendingUp,
  Target,
  Trophy,
  XCircle,
  ArrowRight,
  Plus,
} from "lucide-react";
import Link from "next/link";

interface DashboardData {
  total_applications: number;
  applications_this_month: number;
  interview_rate: string;
  offer_rate: string;
  rejection_rate: string;
  by_status: { status: string; count: number }[];
  top_titles: { job_title: string; count: number }[];
  top_locations: { location: string; count: number }[];
}

const statusColors: Record<string, string> = {
  wishlist: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  applied: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  interview: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  offer: "text-green-400 bg-green-400/10 border-green-400/20",
  rejected: "text-red-400 bg-red-400/10 border-red-400/20",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await api.get("/analytics/dashboard/");
      return res.data;
    },
  });

  const statCards = [
    {
      label: "Total Applications",
      value: data?.total_applications ?? 0,
      icon: Briefcase,
      color: "text-blue-400",
      glow: "shadow-neon-blue",
      bg: "bg-blue-400/10",
      border: "border-blue-400/20",
    },
    {
      label: "This Month",
      value: data?.applications_this_month ?? 0,
      icon: TrendingUp,
      color: "text-cyan-400",
      glow: "shadow-neon-cyan",
      bg: "bg-cyan-400/10",
      border: "border-cyan-400/20",
    },
    {
      label: "Interview Rate",
      value: `${data?.interview_rate ?? 0}%`,
      icon: Target,
      color: "text-yellow-400",
      glow: "",
      bg: "bg-yellow-400/10",
      border: "border-yellow-400/20",
    },
    {
      label: "Offer Rate",
      value: `${data?.offer_rate ?? 0}%`,
      icon: Trophy,
      color: "text-green-400",
      glow: "",
      bg: "bg-green-400/10",
      border: "border-green-400/20",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            Good{" "}
            {new Date().getHours() < 12
              ? "morning"
              : new Date().getHours() < 18
                ? "afternoon"
                : "evening"}
            , <span className="gradient-text">{user?.username}</span> 👋
          </h2>
          <p className="text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening with your job search
          </p>
        </div>
        <Link href="/jobs/new">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-gradient-brand text-white px-4 py-2.5 rounded-xl shadow-neon-blue hover:shadow-neon-purple transition-all duration-300 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Application
          </motion.button>
        </Link>
      </motion.div>

      {/* Stat Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {statCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`glass rounded-2xl p-5 border ${card.border} hover:${card.glow} transition-all duration-300`}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}
              >
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{card.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{card.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* By Status */}
        <motion.div
          variants={itemVariants}
          className="glass rounded-2xl p-6 border border-border"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">
              Applications by Status
            </h3>
            <Link
              href="/analytics"
              className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {data?.by_status?.length ? (
              data.by_status.map((item) => (
                <div
                  key={item.status}
                  className="flex items-center justify-between"
                >
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-lg border capitalize ${
                      statusColors[item.status] ??
                      "text-muted-foreground bg-muted border-border"
                    }`}
                  >
                    {item.status}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(item.count / (data?.total_applications || 1)) * 100}%`,
                        }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full bg-gradient-brand rounded-full"
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground w-4 text-right">
                      {item.count}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">
                No applications yet.
              </p>
            )}
          </div>
        </motion.div>

        {/* Top Job Titles */}
        <motion.div
          variants={itemVariants}
          className="glass rounded-2xl p-6 border border-border"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Top Job Titles</h3>
            <Link
              href="/jobs"
              className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {data?.top_titles?.length ? (
              data.top_titles.map((item, index) => (
                <motion.div
                  key={item.job_title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between glass-hover rounded-xl px-3 py-2"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-muted-foreground w-4">
                      {index + 1}
                    </span>
                    <span className="text-sm text-foreground">
                      {item.job_title}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-lg">
                    {item.count}
                  </span>
                </motion.div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No data yet.</p>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
