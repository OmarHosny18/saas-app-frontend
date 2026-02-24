"use client";

import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  Briefcase,
  TrendingUp,
  Target,
  Trophy,
  XCircle,
  MapPin,
  FileText,
} from "lucide-react";
import { SparklesCore } from "@/components/ui/sparkles";
import BlurText from "@/components/ui/BlurText";
import CountUp from "@/components/ui/CountUp";
import AnimatedList from "@/components/ui/AnimatedList";

interface DashboardData {
  total_applications: number;
  applications_this_month: number;
  interview_rate: string;
  offer_rate: string;
  rejection_rate: string;
  by_status: { status: string; count: number }[];
  over_time: { month: string; count: number }[];
  top_titles: { job_title: string; count: number }[];
  top_locations: { location: string; count: number }[];
}

const statusColors: Record<string, string> = {
  wishlist: "#3b82f6",
  applied: "#06b6d4",
  interview: "#eab308",
  offer: "#22c55e",
  rejected: "#ef4444",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-xl px-4 py-3 text-sm border border-white/10"
        style={{
          background: "rgba(5,8,16,0.95)",
          backdropFilter: "blur(12px)",
        }}
      >
        <p className="text-gray-400 mb-1">{label}</p>
        {payload.map((p: any) => (
          <p
            key={p.name}
            className="font-bold"
            style={{ color: p.color || "#3b82f6" }}
          >
            {p.value} {p.name}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await api.get("/analytics/dashboard/");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Applications",
      value: data?.total_applications ?? 0,
      icon: Briefcase,
      color: "#3b82f6",
      bg: "rgba(59,130,246,0.1)",
      border: "rgba(59,130,246,0.2)",
      glow: "rgba(59,130,246,0.3)",
      suffix: "",
    },
    {
      label: "This Month",
      value: data?.applications_this_month ?? 0,
      icon: TrendingUp,
      color: "#06b6d4",
      bg: "rgba(6,182,212,0.1)",
      border: "rgba(6,182,212,0.2)",
      glow: "rgba(6,182,212,0.3)",
      suffix: "",
    },
    {
      label: "Interview Rate",
      value: parseFloat(data?.interview_rate ?? "0"),
      icon: Target,
      color: "#eab308",
      bg: "rgba(234,179,8,0.1)",
      border: "rgba(234,179,8,0.2)",
      glow: "rgba(234,179,8,0.3)",
      suffix: "%",
    },
    {
      label: "Offer Rate",
      value: parseFloat(data?.offer_rate ?? "0"),
      icon: Trophy,
      color: "#22c55e",
      bg: "rgba(34,197,94,0.1)",
      border: "rgba(34,197,94,0.2)",
      glow: "rgba(34,197,94,0.3)",
      suffix: "%",
    },
    {
      label: "Rejection Rate",
      value: parseFloat(data?.rejection_rate ?? "0"),
      icon: XCircle,
      color: "#ef4444",
      bg: "rgba(239,68,68,0.1)",
      border: "rgba(239,68,68,0.2)",
      glow: "rgba(239,68,68,0.3)",
      suffix: "%",
    },
  ];

  const pieData =
    data?.by_status?.map((item) => ({
      name: item.status,
      value: item.count,
      color: statusColors[item.status] ?? "#6b7280",
    })) ?? [];

  const overTimeData =
    data?.over_time?.map((item) => ({
      month: new Date(item.month).toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      }),
      Applications: item.count,
    })) ?? [];

  const barData =
    data?.by_status?.map((item) => ({
      status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
      count: item.count,
      fill: statusColors[item.status] ?? "#6b7280",
    })) ?? [];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Hero Section with Sparkles */}
      <motion.div
        variants={itemVariants}
        className="relative rounded-3xl overflow-hidden p-10"
        style={{
          background: "linear-gradient(135deg, #0a0f1e 0%, #0f172a 100%)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Sparkles background */}
        <div className="absolute inset-0">
          <SparklesCore
            id="analytics-sparkles"
            background="transparent"
            minSize={0.4}
            maxSize={1.2}
            particleDensity={40}
            className="w-full h-full"
            particleColor="#3b82f6"
          />
        </div>

        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, #3b82f6, #8b5cf6, transparent)",
          }}
        />

        <div className="relative z-10">
          <p className="text-xs font-semibold tracking-[0.3em] text-blue-400 uppercase mb-3">
            Career Intelligence
          </p>
          <BlurText
            text="Your Analytics"
            className="text-5xl font-black text-white mb-3"
            delay={60}
          />
          <p className="text-gray-400 text-lg max-w-lg">
            Deep insights into your job search performance and progress.
          </p>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
      >
        {statCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="rounded-2xl p-5 border"
            style={{
              background: card.bg,
              borderColor: card.border,
              boxShadow: `0 0 20px ${card.glow}`,
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
              style={{ background: `${card.color}20` }}
            >
              <card.icon className="w-5 h-5" style={{ color: card.color }} />
            </div>
            <div className="flex items-baseline gap-0.5">
              <CountUp
                from={0}
                to={card.value}
                duration={1.5}
                className="text-3xl font-black text-white"
              />
              {card.suffix && (
                <span className="text-lg font-black text-white">
                  {card.suffix}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">{card.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row 1 */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Applications Over Time */}
        <div
          className="rounded-2xl p-6 border border-white/5"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <h3 className="text-sm font-bold text-white mb-1">
            Applications Over Time
          </h3>
          <p className="text-xs text-gray-500 mb-6">
            Monthly application volume
          </p>
          {overTimeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={overTimeData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#6b7280", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#6b7280", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="Applications"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: "#8b5cf6" }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center">
              <p className="text-gray-600 text-sm">Not enough data yet</p>
            </div>
          )}
        </div>

        {/* Status Breakdown Pie */}
        <div
          className="rounded-2xl p-6 border border-white/5"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <h3 className="text-sm font-bold text-white mb-1">
            Status Breakdown
          </h3>
          <p className="text-xs text-gray-500 mb-6">
            Distribution across all statuses
          </p>
          {pieData.length > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="60%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {pieData.map((entry) => (
                  <div
                    key={entry.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: entry.color }}
                      />
                      <span className="text-xs text-gray-400 capitalize">
                        {entry.name}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-white">
                      {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[220px] flex items-center justify-center">
              <p className="text-gray-600 text-sm">No data yet</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Charts Row 2 */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Bar Chart */}
        <div
          className="lg:col-span-2 rounded-2xl p-6 border border-white/5"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <h3 className="text-sm font-bold text-white mb-1">
            Applications by Status
          </h3>
          <p className="text-xs text-gray-500 mb-6">
            Count per application status
          </p>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} barSize={32}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />
                <XAxis
                  dataKey="status"
                  tick={{ fill: "#6b7280", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#6b7280", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center">
              <p className="text-gray-600 text-sm">No data yet</p>
            </div>
          )}
        </div>

        {/* Top Titles AnimatedList */}
        <div
          className="rounded-2xl p-6 border border-white/5"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <h3 className="text-sm font-bold text-white mb-1">Top Job Titles</h3>
          <p className="text-xs text-gray-500 mb-4">Most applied positions</p>
          {data?.top_titles?.length ? (
            <AnimatedList
              items={data.top_titles.map(
                (item, index) =>
                  `${index + 1}. ${item.job_title} — ${item.count}`,
              )}
              showGradients={false}
              displayScrollbar={false}
              className="space-y-1"
              itemClassName="!bg-white/5 !border !border-white/10 hover:!border-blue-500/20 !rounded-xl !px-3 !py-2 !text-xs !text-gray-300"
            />
          ) : (
            <div className="h-48 flex items-center justify-center">
              <p className="text-gray-600 text-sm">No data yet</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Top Locations */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl p-6 border border-white/5"
        style={{ background: "rgba(255,255,255,0.02)" }}
      >
        <h3 className="text-sm font-bold text-white mb-1">Top Locations</h3>
        <p className="text-xs text-gray-500 mb-6">Where you're applying</p>
        {data?.top_locations?.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {data.top_locations.map((item, index) => (
              <motion.div
                key={item.location}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="rounded-2xl p-4 border border-white/5 hover:border-purple-500/20 transition-all duration-200 text-center"
                style={{ background: "rgba(139,92,246,0.05)" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: "rgba(139,92,246,0.1)" }}
                >
                  <MapPin className="w-5 h-5 text-purple-400" />
                </div>
                <p className="text-xs text-gray-300 font-medium truncate">
                  {item.location}
                </p>
                <p className="text-lg font-black text-white mt-1">
                  {item.count}
                </p>
                <p className="text-xs text-gray-600">applications</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center">
            <p className="text-gray-600 text-sm">No location data yet</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
