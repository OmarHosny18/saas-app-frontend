"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import Link from "next/link";
import {
  Plus,
  LayoutGrid,
  List,
  Search,
  Filter,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  ExternalLink,
  Trash2,
  Edit,
  ChevronDown,
} from "lucide-react";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { HoverEffect } from "@/components/ui/card-hover-effect";

interface JobApplication {
  id: number;
  company_name: string;
  job_title: string;
  location: string;
  status: string;
  salary: number | null;
  applied_date: string | null;
  job_url: string;
  tags: { id: number; name: string }[];
  notes: string;
}

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string; border: string; glow: string }
> = {
  wishlist: {
    label: "Wishlist",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/30",
    glow: "shadow-[0_0_15px_rgba(59,130,246,0.3)]",
  },
  applied: {
    label: "Applied",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    border: "border-cyan-400/30",
    glow: "shadow-[0_0_15px_rgba(6,182,212,0.3)]",
  },
  interview: {
    label: "Interview",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/30",
    glow: "shadow-[0_0_15px_rgba(234,179,8,0.3)]",
  },
  offer: {
    label: "Offer",
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/30",
    glow: "shadow-[0_0_15px_rgba(34,197,94,0.3)]",
  },
  rejected: {
    label: "Rejected",
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/30",
    glow: "shadow-[0_0_15px_rgba(239,68,68,0.3)]",
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function JobsPage() {
  const [view, setView] = useState<"grid" | "table">("grid");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const queryClient = useQueryClient();

  const { data: jobs = [], isLoading } = useQuery<JobApplication[]>({
    queryKey: ["jobs"],
    queryFn: async () => {
      const res = await api.get("/jobs/");
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/jobs/${id}/`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["jobs"] }),
  });

  const filtered = jobs.filter((job) => {
    const matchesSearch =
      job.company_name.toLowerCase().includes(search.toLowerCase()) ||
      job.job_title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />

      <div className="relative z-10 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] text-blue-400 uppercase mb-1">
              Applications
            </p>
            <h1 className="text-4xl font-black text-white">
              Job{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Tracker
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
              {[
                { id: "grid", icon: LayoutGrid },
                { id: "table", icon: List },
              ].map(({ id, icon: Icon }) => (
                <motion.button
                  key={id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setView(id as "grid" | "table")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    view === id
                      ? "bg-blue-500/20 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </motion.button>
              ))}
            </div>

            <Link href="/jobs/new">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  boxShadow: "0 0 20px rgba(59,130,246,0.3)",
                }}
              >
                <Plus className="w-4 h-4" />
                New Application
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3"
        >
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search company or role..."
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/40 transition-all duration-200"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border transition-all duration-200 ${
              showFilters
                ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                : "bg-white/[0.04] border-white/10 text-gray-400 hover:text-white"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filter
            <ChevronDown
              className={`w-3 h-3 transition-transform ${showFilters ? "rotate-180" : ""}`}
            />
          </motion.button>
        </motion.div>

        {/* Filter Pills */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 flex-wrap overflow-hidden"
            >
              {["all", ...Object.keys(statusConfig)].map((status) => {
                const config = statusConfig[status];
                const isActive = statusFilter === status;
                return (
                  <motion.button
                    key={status}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 capitalize ${
                      isActive
                        ? status === "all"
                          ? "bg-white/10 border-white/30 text-white"
                          : `${config.bg} ${config.border} ${config.color} ${config.glow}`
                        : "bg-white/[0.03] border-white/10 text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    {status === "all" ? "All" : config.label}
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-6"
        >
          <p className="text-gray-500 text-sm">
            <span className="text-white font-bold">{filtered.length}</span>{" "}
            {filtered.length === 1 ? "application" : "applications"}
          </p>
          {Object.entries(statusConfig).map(([status, config]) => {
            const count = jobs.filter((j) => j.status === status).length;
            if (!count) return null;
            return (
              <div key={status} className="flex items-center gap-1.5">
                <div
                  className={`w-2 h-2 rounded-full ${config.bg} border ${config.border}`}
                />
                <span className={`text-xs ${config.color}`}>
                  {count} {config.label}
                </span>
              </div>
            );
          })}
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* GRID VIEW */}
        {!isLoading && view === "grid" && (
          <>
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-64 gap-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-gray-600" />
                </div>
                <p className="text-gray-500 text-sm">No applications found</p>
                <Link href="/jobs/new">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white"
                    style={{
                      background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    Add your first application
                  </motion.button>
                </Link>
              </motion.div>
            ) : (
              <HoverEffect
                items={filtered.map((job) => ({
                  title: job.job_title,
                  description: job.company_name,
                  link: job.job_url || `/jobs/${job.id}`,
                }))}
                className="grid-cols-1 md:grid-cols-2 xl:grid-cols-3 py-0 gap-4"
                renderItem={(_, idx) => {
                  const job = filtered[idx];
                  const config =
                    statusConfig[job.status] ?? statusConfig.wishlist;
                  return (
                    <div className="relative h-full">
                      {/* Status glow top border */}
                      <div
                        className="absolute top-0 left-6 right-6 h-px rounded-full opacity-60"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${
                            job.status === "wishlist"
                              ? "#3b82f6"
                              : job.status === "applied"
                                ? "#06b6d4"
                                : job.status === "interview"
                                  ? "#eab308"
                                  : job.status === "offer"
                                    ? "#22c55e"
                                    : "#ef4444"
                          }, transparent)`,
                        }}
                      />

                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white"
                          style={{
                            background:
                              "linear-gradient(135deg, #1e293b, #334155)",
                          }}
                        >
                          {job.company_name[0].toUpperCase()}
                        </div>
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${config.bg} ${config.border} ${config.color}`}
                        >
                          {config.label}
                        </span>
                      </div>

                      {/* Content */}
                      <h3 className="font-bold text-white text-base mb-1 group-hover:text-blue-300 transition-colors">
                        {job.job_title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4">
                        {job.company_name}
                      </p>

                      {/* Meta */}
                      <div className="space-y-1.5 mb-4">
                        {job.location && (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <MapPin className="w-3 h-3" />
                            {job.location}
                          </div>
                        )}
                        {job.salary && (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <DollarSign className="w-3 h-3" />$
                            {job.salary.toLocaleString()}
                          </div>
                        )}
                        {job.applied_date && (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {new Date(job.applied_date).toLocaleDateString()}
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      {job.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {job.tags.map((tag) => (
                            <span
                              key={tag.id}
                              className="text-xs px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-400"
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                        <Link href={`/jobs/${job.id}`} className="flex-1">
                          <motion.button
                            whileTap={{ scale: 0.97 }}
                            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/5 hover:bg-blue-500/10 border border-white/10 hover:border-blue-500/30 text-xs text-gray-400 hover:text-blue-400 transition-all duration-200"
                          >
                            <Edit className="w-3 h-3" />
                            Edit
                          </motion.button>
                        </Link>
                        {job.job_url && (
                          <a
                            href={job.job_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <motion.button
                              whileTap={{ scale: 0.97 }}
                              className="p-2 rounded-lg bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 text-gray-400 hover:text-cyan-400 transition-all duration-200"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </motion.button>
                          </a>
                        )}
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          onClick={() => deleteMutation.mutate(job.id)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-gray-400 hover:text-red-400 transition-all duration-200"
                        >
                          <Trash2 className="w-3 h-3" />
                        </motion.button>
                      </div>
                    </div>
                  );
                }}
              />
            )}
          </>
        )}

        {/* TABLE VIEW */}
        {!isLoading && view === "table" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/10 overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.02)",
              backdropFilter: "blur(12px)",
            }}
          >
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <div className="col-span-4">Role & Company</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Location</div>
              <div className="col-span-2">Salary</div>
              <div className="col-span-1">Date</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {/* Table Rows */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filtered.map((job, index) => {
                const config =
                  statusConfig[job.status] ?? statusConfig.wishlist;
                return (
                  <motion.div
                    key={job.id}
                    variants={itemVariants}
                    whileHover={{
                      backgroundColor: "rgba(59,130,246,0.04)",
                      transition: { duration: 0.15 },
                    }}
                    className={`grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 last:border-0 group transition-all duration-200`}
                  >
                    {/* Role & Company */}
                    <div className="col-span-4 flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0"
                        style={{
                          background:
                            "linear-gradient(135deg, #1e293b, #334155)",
                        }}
                      >
                        {job.company_name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors truncate">
                          {job.job_title}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {job.company_name}
                        </p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-2 flex items-center">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${config.bg} ${config.border} ${config.color}`}
                      >
                        {config.label}
                      </span>
                    </div>

                    {/* Location */}
                    <div className="col-span-2 flex items-center">
                      <span className="text-xs text-gray-500 truncate">
                        {job.location || "—"}
                      </span>
                    </div>

                    {/* Salary */}
                    <div className="col-span-2 flex items-center">
                      <span className="text-xs text-gray-500">
                        {job.salary ? `$${job.salary.toLocaleString()}` : "—"}
                      </span>
                    </div>

                    {/* Date */}
                    <div className="col-span-1 flex items-center">
                      <span className="text-xs text-gray-500">
                        {job.applied_date
                          ? new Date(job.applied_date).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" },
                            )
                          : "—"}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 flex items-center justify-end gap-1.5">
                      <Link href={`/jobs/${job.id}`}>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="p-1.5 rounded-lg hover:bg-blue-500/10 text-gray-600 hover:text-blue-400 transition-all duration-200"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </motion.button>
                      </Link>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteMutation.mutate(job.id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-600 hover:text-red-400 transition-all duration-200"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}

              {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center h-48 gap-3">
                  <Building2 className="w-8 h-8 text-gray-700" />
                  <p className="text-gray-600 text-sm">No applications found</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
