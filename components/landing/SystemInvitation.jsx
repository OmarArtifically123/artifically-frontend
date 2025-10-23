"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useInViewState } from "@/hooks/useInViewState";

export default function SystemInvitation() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const containerRef = useRef(null);
  const isInView = useInViewState(containerRef);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In production, replace with actual API endpoint
      setStatus("success");
      setEmail("");

      // Reset after 4 seconds
      setTimeout(() => setStatus("idle"), 4000);
    } catch (error) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delay: 0.2, duration: 0.6 },
    },
  };

  return (
    <section
      ref={containerRef}
      className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, rgba(10,10,20,0.3), rgba(15,15,30,0.5))",
      }}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-5 bg-blue-500" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-5 bg-cyan-500" />
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 rounded-full blur-3xl opacity-5 bg-purple-500" />
      </div>

      <motion.div
        className="relative z-10 max-w-3xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Main Content */}
        <motion.div className="text-center space-y-8" variants={contentVariants}>
          {/* Headline */}
          <div className="space-y-4">
            <motion.span
              className="inline-block text-sm font-semibold px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400"
              variants={contentVariants}
            >
              READY TO BEGIN
            </motion.span>

            <h2 className="text-4xl sm:text-6xl font-bold text-white leading-tight">
              Join the Future of
              <br />
              Enterprise Automation
            </h2>

            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              You've seen the vision. You understand the impact. Now it's time to experience it.
              Join enterprise leaders who are transforming how they operate with the most advanced
              AI automation platform ever built.
            </p>
          </div>

          {/* Email Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-4"
            variants={contentVariants}
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.input
                type="email"
                placeholder="your@company.email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading"}
                className={`flex-1 px-6 py-4 rounded-lg bg-slate-900 text-white placeholder-slate-500 border transition-all focus:outline-none ${
                  status === "error"
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-slate-700 focus:border-indigo-500/50"
                }`}
                whileFocus={{ scale: 1.02 }}
              />

              <motion.button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className={`px-8 py-4 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  status === "success"
                    ? "bg-green-500/20 text-green-400 border border-green-500/50"
                    : "bg-indigo-600 text-white border border-indigo-500 hover:bg-indigo-700"
                }`}
                whileHover={status !== "loading" && status !== "success" ? { scale: 1.05 } : {}}
                whileTap={status !== "loading" && status !== "success" ? { scale: 0.95 } : {}}
              >
                {status === "idle" && "Get Started"}
                {status === "loading" && (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block"
                  >
                    ⏳
                  </motion.span>
                )}
                {status === "success" && "✓ Check Your Email"}
                {status === "error" && "Try Again"}
              </motion.button>
            </div>

            {/* Status Messages */}
            <motion.div
              className="h-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: status !== "idle" ? 1 : 0 }}
            >
              {status === "success" && (
                <p className="text-green-400 text-sm font-medium">
                  Welcome! Your trial invite is on its way. Check your inbox in the next minute.
                </p>
              )}
              {status === "error" && (
                <p className="text-red-400 text-sm font-medium">
                  Something went wrong. Please try again or contact support.
                </p>
              )}
            </motion.div>
          </motion.form>

          {/* Trust Signals */}
          <motion.div
            className="grid grid-cols-3 gap-4 sm:gap-8 pt-8 border-t border-slate-700"
            variants={contentVariants}
          >
            {[
              { icon: "🚀", label: "14-Day Free Trial", description: "No credit card required" },
              { icon: "🔒", label: "Enterprise Security", description: "SOC 2, HIPAA, FedRAMP" },
              { icon: "📞", label: "Dedicated Support", description: "Expert onboarding team" },
            ].map((signal, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <div className="text-2xl mb-2">{signal.icon}</div>
                <div className="font-semibold text-white text-sm">{signal.label}</div>
                <div className="text-xs text-slate-500">{signal.description}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Secondary CTA */}
          <motion.div className="pt-8 space-y-3" variants={contentVariants}>
            <p className="text-slate-400 text-sm">Or explore at your own pace</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {[
                { label: "View Demo", href: "#" },
                { label: "Schedule Call", href: "#" },
                { label: "Documentation", href: "#" },
              ].map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  className="px-6 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors rounded-lg border border-slate-700 hover:border-slate-600"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Floating Elements for Visual Interest */}
        <motion.div
          className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-indigo-500/5 blur-2xl pointer-events-none"
          animate={{
            y: [0, 30, 0],
            x: [0, 15, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-cyan-500/5 blur-2xl pointer-events-none"
          animate={{
            y: [0, -30, 0],
            x: [0, -15, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </motion.div>
    </section>
  );
}
