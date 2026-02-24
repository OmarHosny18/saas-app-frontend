"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import {
  ArrowLeft,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  Link as LinkIcon,
  FileText,
  Tag,
  Loader2,
  ChevronDown,
  Trash2,
  ExternalLink,
  Edit3,
  Save,
  Briefcase,
  Clock,
} from "lucide-react";
import Link from "next/link";
import BlurText from "@/components/ui/BlurText";
import RotatingText from "@/components/ui/RotatingText";
import TiltedCard from "@/components/ui/TiltedCard";
import CountUp from "@/components/ui/CountUp";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";

const statusOptions = [
  {
    value: "wishlist",
    label: "Wishlist",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.1)",
    border: "rgba(59,130,246,0.3)",
  },
  {
    value: "applied",
    label: "Applied",
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.1)",
    border: "rgba(6,182,212,0.3)",
  },
  {
    value: "interview",
    label: "Interview",
    color: "#eab308",
    bg: "rgba(234,179,8,0.1)",
    border: "rgba(234,179,8,0.3)",
  },
  {
    value: "offer",
    label: "Offer",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.1)",
    border: "rgba(34,197,94,0.3)",
  },
  {
    value: "rejected",
    label: "Rejected",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.3)",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const fieldVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

interface JobApplication {
  id: number;
  company_name: string;
  job_title: string;
  location: string;
  status: string;
  salary: number | null;
  applied_date: string | null;
  job_url: string;
  notes: string;
  resume_version: string;
  cover_letter_version: string;
  tags: { id: number; name: string }[];
}

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<Record<string, string>>({});

  const { data: job, isLoading } = useQuery<JobApplication>({
    queryKey: ["job", id],
    queryFn: async () => {
      const res = await api.get(`/jobs/${id}/`);
      return res.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.patch(`/jobs/${id}/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["job", id] });
      setIsEditing(false);
    },
    onError: () => setError("Failed to update. Please try again."),
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/jobs/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      router.push("/jobs");
    },
  });

  const handleEdit = () => {
    if (!job) return;
    setFormData({
      company_name: job.company_name,
      job_title: job.job_title,
      location: job.location || "",
      salary: job.salary?.toString() || "",
      status: job.status,
      applied_date: job.applied_date || "",
      job_url: job.job_url || "",
      notes: job.notes || "",
      resume_version: job.resume_version || "",
      cover_letter_version: job.cover_letter_version || "",
      tags: job.tags.map((t) => t.name).join(", "),
    });
    setIsEditing(true);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const payload: Record<string, unknown> = {
      ...formData,
      salary: formData.salary ? parseInt(formData.salary) : null,
      applied_date: formData.applied_date || null,
      tags: formData.tags
        ? formData.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    };
    updateMutation.mutate(payload);
  };

  const inputClass =
    "w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.06] transition-all duration-200";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <p className="text-gray-500">Job not found.</p>
        <Link href="/jobs">
          <button className="text-blue-400 text-sm hover:text-blue-300 transition-colors">
            ← Back to Jobs
          </button>
        </Link>
      </div>
    );
  }

  const statusConfig =
    statusOptions.find((s) => s.value === job.status) ?? statusOptions[0];

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link href="/jobs">
            <motion.button
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors duration-200 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Jobs
            </motion.button>
          </Link>
        </motion.div>

        {/* HERO BANNER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden p-10"
          style={{
            background:
              "linear-gradient(135deg, #0a0f1e 0%, #0f172a 50%, #0a0f1e 100%)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Animated background glow */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(ellipse at 20% 50%, ${statusConfig.bg} 0%, transparent 60%),
                          radial-gradient(ellipse at 80% 50%, rgba(139,92,246,0.1) 0%, transparent 60%)`,
            }}
          />

          {/* Top accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${statusConfig.color}, transparent)`,
            }}
          />

          <div className="relative z-10 flex items-start justify-between gap-8">
            {/* Left content */}
            <div className="flex-1 space-y-6">
              {/* Status + Actions row */}
              <div className="flex items-center gap-3">
                <span
                  className="text-xs font-bold px-3 py-1.5 rounded-full border"
                  style={{
                    color: statusConfig.color,
                    background: statusConfig.bg,
                    borderColor: statusConfig.border,
                    boxShadow: `0 0 15px ${statusConfig.bg}`,
                  }}
                >
                  {statusConfig.label}
                </span>
                {job.job_url && (
                  <a
                    href={job.job_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-400 transition-colors border border-white/10 hover:border-blue-500/30 px-3 py-1.5 rounded-full"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View Posting
                  </a>
                )}
              </div>

              {/* Company name */}
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #1e293b, #334155)",
                  }}
                >
                  {job.company_name[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Position at</p>
                  <p className="text-2xl font-black text-white">
                    {job.company_name}
                  </p>
                </div>
              </div>

              {/* Job title with BlurText */}
              <div>
                <BlurText
                  text={job.job_title}
                  className="text-5xl font-black text-white leading-tight"
                  delay={60}
                />
              </div>

              {/* Rotating descriptor */}
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-sm">Looking for a</span>
                <RotatingText
                  texts={[
                    "great opportunity",
                    "career boost",
                    "perfect fit",
                    "new challenge",
                  ]}
                  className="text-sm font-bold text-blue-400"
                  staggerDuration={0.03}
                  rotationInterval={2500}
                />
              </div>

              {/* Meta row */}
              <div className="flex items-center gap-6 flex-wrap">
                {job.location && (
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    {job.location}
                  </div>
                )}
                {job.applied_date && (
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    Applied{" "}
                    {new Date(job.applied_date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                )}
                {job.resume_version && (
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    Resume: {job.resume_version}
                  </div>
                )}
              </div>

              {/* Tags */}
              {job.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Right — TiltedCard salary */}
            <div className="shrink-0 hidden lg:block">
              <TiltedCard
                imageSrc="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80"
                altText="Salary card"
                containerHeight="220px"
                containerWidth="300px"
                imageHeight="220px"
                imageWidth="300px"
                rotateAmplitude={10}
                scaleOnHover={1.05}
                showMobileWarning={false}
                showTooltip={false}
                displayOverlayContent={true}
                overlayContent={
                  <div
                    className="w-full h-full flex flex-col items-center justify-center p-6"
                    style={{
                      background: "rgba(5,8,16,0.92)",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <DollarSign className="w-6 h-6 text-green-400 mb-2" />
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Annual Salary
                    </p>
                    {job.salary ? (
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-white">
                          $
                        </span>
                        <CountUp
                          from={0}
                          to={job.salary}
                          duration={1.5}
                          className="text-4xl font-black text-white"
                        />
                      </div>
                    ) : (
                      <p className="text-xl font-black text-gray-600">
                        Not listed
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">per year</p>
                  </div>
                }
              />
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3"
        >
          {!isEditing ? (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEdit}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white"
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  boxShadow: "0 0 20px rgba(59,130,246,0.3)",
                }}
              >
                <Edit3 className="w-4 h-4" />
                Edit Application
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 hover:border-red-500/40 transition-all duration-200"
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Delete
              </motion.button>
            </>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white"
                style={{
                  background: "linear-gradient(135deg, #22c55e, #16a34a)",
                  boxShadow: "0 0 20px rgba(34,197,94,0.3)",
                }}
              >
                {updateMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Changes
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 rounded-xl text-sm font-medium text-gray-400 bg-white/5 border border-white/10 hover:border-white/20 hover:text-white transition-all duration-200"
              >
                Cancel
              </motion.button>
            </>
          )}
        </motion.div>

        {/* Info Cards Row */}
        {!isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {[
              {
                icon: Briefcase,
                label: "Job Title",
                value: job.job_title,
                color: "text-blue-400",
                bg: "rgba(59,130,246,0.1)",
              },
              {
                icon: Clock,
                label: "Cover Letter",
                value: job.cover_letter_version || "Not specified",
                color: "text-purple-400",
                bg: "rgba(139,92,246,0.1)",
              },
              {
                icon: Tag,
                label: "Tags",
                value: job.tags.length ? `${job.tags.length} tags` : "No tags",
                color: "text-cyan-400",
                bg: "rgba(6,182,212,0.1)",
              },
            ].map((card) => (
              <div
                key={card.label}
                className="rounded-2xl p-5 border border-white/5"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: card.bg }}
                >
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  {card.label}
                </p>
                <p className="text-white font-bold text-sm">{card.value}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Edit Form */}
        {isEditing && (
          <HoverBorderGradient
            containerClassName="w-full rounded-2xl"
            className="w-full bg-[#050810] rounded-2xl p-8"
            as="div"
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <motion.div variants={fieldVariants}>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-3 h-3" /> Company Name
                    </span>
                  </label>
                  <input
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </motion.div>
                <motion.div variants={fieldVariants}>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3 h-3" /> Job Title
                    </span>
                  </label>
                  <input
                    name="job_title"
                    value={formData.job_title}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </motion.div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <motion.div variants={fieldVariants}>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" /> Location
                    </span>
                  </label>
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </motion.div>
                <motion.div variants={fieldVariants}>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="w-3 h-3" /> Salary
                    </span>
                  </label>
                  <input
                    name="salary"
                    type="number"
                    value={formData.salary}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </motion.div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <motion.div variants={fieldVariants}>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className={`${inputClass} appearance-none pr-10`}
                    >
                      {statusOptions.map((s) => (
                        <option
                          key={s.value}
                          value={s.value}
                          style={{ background: "#050810" }}
                        >
                          {s.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </motion.div>
                <motion.div variants={fieldVariants}>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" /> Applied Date
                    </span>
                  </label>
                  <input
                    name="applied_date"
                    type="date"
                    value={formData.applied_date}
                    onChange={handleChange}
                    className={`${inputClass} [color-scheme:dark]`}
                  />
                </motion.div>
              </div>

              <motion.div variants={fieldVariants}>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                  <span className="flex items-center gap-1.5">
                    <LinkIcon className="w-3 h-3" /> Job URL
                  </span>
                </label>
                <input
                  name="job_url"
                  type="url"
                  value={formData.job_url}
                  onChange={handleChange}
                  className={inputClass}
                />
              </motion.div>

              <div className="grid grid-cols-2 gap-4">
                <motion.div variants={fieldVariants}>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                    Resume Version
                  </label>
                  <input
                    name="resume_version"
                    value={formData.resume_version}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </motion.div>
                <motion.div variants={fieldVariants}>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                    Cover Letter Version
                  </label>
                  <input
                    name="cover_letter_version"
                    value={formData.cover_letter_version}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </motion.div>
              </div>

              <motion.div variants={fieldVariants}>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3 h-3" /> Tags
                  </span>
                </label>
                <input
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="Python, Remote (comma separated)"
                  className={inputClass}
                />
              </motion.div>

              <motion.div variants={fieldVariants}>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className={`${inputClass} resize-none`}
                />
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                  <p className="text-red-400 text-sm">{error}</p>
                </motion.div>
              )}
            </motion.div>
          </HoverBorderGradient>
        )}

        {/* Notes view mode */}
        {!isEditing && job.notes && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <HoverBorderGradient
              containerClassName="w-full rounded-2xl"
              className="w-full bg-[#050810] rounded-2xl p-6"
              as="div"
            >
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Notes
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                {job.notes}
              </p>
            </HoverBorderGradient>
          </motion.div>
        )}
      </div>
    </div>
  );
}
