"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Mail, Lock, User, ArrowRight, Loader2, Check } from "lucide-react";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    re_password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.re_password) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    try {
      await api.post("/auth/users/", formData);
      router.push("/login");
    } catch (err: unknown) {
      const error = err as { response?: { data?: Record<string, string[]> } };
      const data = error.response?.data;
      if (data) {
        const firstError = Object.values(data)[0];
        setError(
          Array.isArray(firstError) ? firstError[0] : "Registration failed.",
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    "Track all your job applications",
    "Analytics and insights dashboard",
    "AI-powered resume feedback",
    "Career lessons and resources",
  ];

  return (
    <div className="min-h-screen bg-[#050810] flex overflow-hidden">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden">
        <AnimatedBackground />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139,92,246,0.07) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139,92,246,0.07) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
        <div
          className="absolute top-0 right-0 w-px h-full opacity-20"
          style={{
            background:
              "linear-gradient(to bottom, transparent, #8b5cf6, #3b82f6, transparent)",
          }}
        />
        <motion.div
          animate={{ y: [0, -30, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/3 w-72 h-72 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <span
            className="font-bold text-xl"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            JobTracker
          </span>
        </div>

        {/* Center content */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="text-xs font-semibold tracking-[0.3em] text-purple-400 uppercase mb-4">
              Everything you need
            </p>
            <h1 className="text-5xl font-black text-white leading-tight mb-6">
              One platform.
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 50%, #06b6d4 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Endless opportunities.
              </span>
            </h1>
          </motion.div>

          {/* Feature list */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-3 mt-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: "rgba(139,92,246,0.2)",
                    border: "1px solid rgba(139,92,246,0.4)",
                  }}
                >
                  <Check className="w-3 h-3 text-purple-400" />
                </div>
                <span className="text-gray-400 text-sm">{feature}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="relative z-10">
          <p className="text-gray-600 text-sm italic">
            &ldquo;Got 3 interviews within my first week of using this.&rdquo;
          </p>
          <p className="text-gray-700 text-xs mt-1">— Beta user</p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, #8b5cf6, #3b82f6, transparent)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-black text-white mb-2">
              Create account
            </h2>
            <p className="text-gray-500 text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              {
                name: "email",
                label: "Email address",
                type: "email",
                placeholder: "you@example.com",
                icon: Mail,
              },
              {
                name: "username",
                label: "Username",
                type: "text",
                placeholder: "johndoe",
                icon: User,
              },
              {
                name: "password",
                label: "Password",
                type: "password",
                placeholder: "••••••••",
                icon: Lock,
              },
              {
                name: "re_password",
                label: "Confirm password",
                type: "password",
                placeholder: "••••••••",
                icon: Lock,
              },
            ].map((field) => (
              <div key={field.name}>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                  {field.label}
                </label>
                <div className="relative group">
                  <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-purple-400 transition-colors" />
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name as keyof typeof formData]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    required
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.06] transition-all duration-200"
                  />
                </div>
              </div>
            ))}

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

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="w-full relative overflow-hidden rounded-xl py-3.5 text-sm font-bold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              style={{
                background: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)",
                boxShadow: "0 0 30px rgba(139,92,246,0.3)",
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Create my account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </span>
            </motion.button>
          </form>

          <p className="text-center text-xs text-gray-600 mt-6">
            By creating an account, you agree to our{" "}
            <span className="text-gray-500 hover:text-gray-400 cursor-pointer transition-colors">
              Terms
            </span>{" "}
            and{" "}
            <span className="text-gray-500 hover:text-gray-400 cursor-pointer transition-colors">
              Privacy Policy
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
