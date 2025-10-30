"use client";

import { motion } from "framer-motion";
import { ArrowRight, Users, Target, Star } from "lucide-react";

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-5xl font-bold text-white mb-6">
            Join Our <span className="text-blue-400">Elite Team</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-12">
            We're building the future of AI-powered business solutions. 
            Be part of something revolutionary.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            >
              <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Collaborative Culture</h3>
              <p className="text-gray-300">Work with brilliant minds who share your passion for innovation.</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            >
              <Target className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Cutting-Edge Projects</h3>
              <p className="text-gray-300">Work on projects that shape the future of technology.</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            >
              <Star className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Competitive Benefits</h3>
              <p className="text-gray-300">Top-tier compensation, equity, and comprehensive benefits.</p>
            </motion.div>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-xl text-center"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Ready to Apply?</h2>
            <p className="text-blue-100 mb-6">
              Send us your resume and let's start a conversation about your future with Artifically.
            </p>
            <a
              href="/contact?path=careers"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Apply Now
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
