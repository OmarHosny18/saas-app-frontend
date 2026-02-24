"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import {
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  Link as LinkIcon,
  FileText,
  Tag,
  ArrowLeft,
  Loader2,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import BlurText from "@/components/ui/BlurText";
import SplitText from "@/components/ui/SplitText";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";

const statusOptions = [
  { value: "wishlist", label: "Wishlist", color: "#3b82f6" },
  { value: "applied", label: "Applied", color: "#06b6d4" },
  { value: "interview", label: "Interview", color: "#eab308" },
  { value: "offer", label: "Offer", color: "#22c55e" },
  { value: "rejected", label: "Rejected", color: "#ef4444" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const fieldVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

interface FormData {
  company_name: string;
  job_title: string;
  location: string;
  salary: string;
  status: string;
  applied_date: string;
  job_url: string;
  notes: string;
  resume_version: string;
  cover_letter_version: string;
  tags: string;
}

export default function NewJobPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<FormData>({
    company_name: "",
    job_title: "",
    location: "",
    salary: "",
    status: "applied",
    applied_date: "",
    job_url: "",
    notes: "",
    resume_version: "",
    cover_letter_version: "",
    tags: "",
  });
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => api.post("/jobs/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      router.push("/jobs");
    },
    onError: () => setError("Failed to create application. Please try again."),
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
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
    mutation.mutate(payload);
  };

  const inputClass =
    "w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.06] transition-all duration-200";

  const selectedStatus = statusOptions.find((s) => s.value === formData.status);

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
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

        {/* Header */}
        <div className="mb-10">
          <BlurText
            text="New Application"
            className="text-4xl font-black text-white mb-2"
            delay={80}
          />
          <SplitText
            text="Fill in the details below to track your job application."
            className="text-gray-500 text-sm"
            delay={20}
            duration={0.4}
          />
        </div>

        {/* Form Card with HoverBorderGradient */}
        <HoverBorderGradient
          containerClassName="w-full rounded-2xl"
          className="w-full bg-[#050810] rounded-2xl p-8"
          as="div"
        >
          <form onSubmit={handleSubmit}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Row 1 - Company & Job Title */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div variants={fieldVariants}>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-3 h-3" />
                      Company Name *
                    </span>
                  </label>
                  <input
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    placeholder="Google, Meta, etc."
                    required
                    className={inputClass}
                  />
                </motion.div>

                <motion.div variants={fieldVariants}>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3 h-3" />
                      Job Title *
                    </span>
                  </label>
                  <input
                    name="job_title"
                    value={formData.job_title}
                    onChange={handleChange}
                    placeholder="Software Engineer, etc."
                    required
                    className={inputClass}
                  />
                </motion.div>
              </div>

              {/* Row 2 - Location & Salary */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div variants={fieldVariants}>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" />
                      Location
                    </span>
                  </label>
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="New York, Remote, etc."
                    className={inputClass}
                  />
                </motion.div>

                <motion.div variants={fieldVariants}>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="w-3 h-3" />
                      Salary (USD)
                    </span>
                  </label>
                  <input
                    name="salary"
                    type="number"
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="95000"
                    className={inputClass}
                  />
                </motion.div>
              </div>

              {/* Row 3 - Status & Date */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div variants={fieldVariants}>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                    Status *
                  </label>
                  <div className="relative">
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className={`${inputClass} appearance-none pr-10`}
                      style={{ color: selectedStatus?.color }}
                    >
                      {statusOptions.map((s) => (
                        <option
                          key={s.value}
                          value={s.value}
                          style={{ color: s.color, background: "#050810" }}
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
                      <Calendar className="w-3 h-3" />
                      Applied Date
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

              {/* Row 4 - Job URL */}
              <motion.div variants={fieldVariants}>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                  <span className="flex items-center gap-1.5">
                    <LinkIcon className="w-3 h-3" />
                    Job URL
                  </span>
                </label>
                <input
                  name="job_url"
                  type="url"
                  value={formData.job_url}
                  onChange={handleChange}
                  placeholder="https://careers.company.com/..."
                  className={inputClass}
                />
              </motion.div>

              {/* Row 5 - Resume & Cover Letter */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div variants={fieldVariants}>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                    Resume Version
                  </label>
                  <input
                    name="resume_version"
                    value={formData.resume_version}
                    onChange={handleChange}
                    placeholder="v2-senior, tech-focused, etc."
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
                    placeholder="generic, startup, etc."
                    className={inputClass}
                  />
                </motion.div>
              </div>

              {/* Row 6 - Tags */}
              <motion.div variants={fieldVariants}>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3 h-3" />
                    Tags
                  </span>
                </label>
                <input
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="Python, Remote, Full Stack (comma separated)"
                  className={inputClass}
                />
              </motion.div>

              {/* Row 7 - Notes */}
              <motion.div variants={fieldVariants}>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any notes about this application..."
                  rows={4}
                  className={`${inputClass} resize-none`}
                />
              </motion.div>

              {/* Error */}
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

              {/* Submit */}
              <motion.div
                variants={fieldVariants}
                className="flex items-center gap-3 pt-2"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={mutation.isPending}
                  className="flex-1 py-3.5 rounded-xl text-sm font-black text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                    boxShadow: "0 0 30px rgba(59,130,246,0.3)",
                  }}
                >
                  {mutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Save Application"
                  )}
                </motion.button>

                <Link href="/jobs">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    className="px-6 py-3.5 rounded-xl text-sm font-medium text-gray-400 bg-white/5 border border-white/10 hover:border-white/20 hover:text-white transition-all duration-200"
                  >
                    Cancel
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </form>
        </HoverBorderGradient>
      </div>
    </div>
  );
}
