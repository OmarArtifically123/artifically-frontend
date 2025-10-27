"use client";

import { useState } from "react";
import LogoWordmarkEnhanced from "@/components/ui/LogoWordmark.enhanced";

export default function LogoShowcase() {
  const [variant, setVariant] = useState<"light" | "dark" | "contrast">("light");
  const [animated, setAnimated] = useState(true);

  return (
    <div className="min-h-screen">
      {/* Light Mode Background */}
      {variant === "light" && (
        <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 -z-10" />
      )}
      
      {/* Dark Mode Background */}
      {variant === "dark" && (
        <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 -z-10" />
      )}
      
      {/* High Contrast Background */}
      {variant === "contrast" && (
        <div className="fixed inset-0 bg-black -z-10" />
      )}

      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-5xl font-bold mb-4 ${
            variant === "light" 
              ? "text-slate-900" 
              : "text-white"
          }`}>
            Premium Logo Showcase
          </h1>
          <p className={`text-xl ${
            variant === "light" 
              ? "text-slate-600" 
              : "text-slate-300"
          }`}>
            World-Class AI Automation Marketplace Branding
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <div className="flex gap-2 bg-white/10 backdrop-blur-sm rounded-xl p-2">
            <button
              onClick={() => setVariant("light")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                variant === "light"
                  ? "bg-white text-slate-900 shadow-lg"
                  : variant === "dark"
                  ? "bg-slate-800 text-white hover:bg-slate-700"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              Light Mode
            </button>
            <button
              onClick={() => setVariant("dark")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                variant === "dark"
                  ? "bg-slate-800 text-white shadow-lg"
                  : variant === "light"
                  ? "bg-slate-200 text-slate-900 hover:bg-slate-300"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              Dark Mode
            </button>
            <button
              onClick={() => setVariant("contrast")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                variant === "contrast"
                  ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/50"
                  : variant === "light"
                  ? "bg-slate-200 text-slate-900 hover:bg-slate-300"
                  : "bg-slate-800 text-white hover:bg-slate-700"
              }`}
            >
              High Contrast
            </button>
          </div>

          <label className={`flex items-center gap-3 px-6 py-3 rounded-lg cursor-pointer ${
            variant === "light"
              ? "bg-white shadow-lg"
              : variant === "contrast"
              ? "bg-cyan-500/20 border-2 border-cyan-500"
              : "bg-slate-800 border-2 border-slate-700"
          }`}>
            <input
              type="checkbox"
              checked={animated}
              onChange={(e) => setAnimated(e.target.checked)}
              className="w-5 h-5 accent-blue-500"
            />
            <span className={`font-semibold ${
              variant === "light" ? "text-slate-900" : "text-white"
            }`}>
              Animation
            </span>
          </label>
        </div>

        {/* Main Logo Display */}
        <div className={`rounded-3xl p-16 mb-12 ${
          variant === "light"
            ? "bg-white shadow-2xl"
            : variant === "contrast"
            ? "bg-black border-4 border-cyan-500"
            : "bg-slate-900 shadow-2xl shadow-blue-500/20"
        }`}>
          <div className="flex items-center justify-center">
            <LogoWordmarkEnhanced variant={variant} animated={animated} />
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className={`rounded-2xl p-8 ${
            variant === "light"
              ? "bg-white shadow-xl"
              : variant === "contrast"
              ? "bg-black border-2 border-cyan-500"
              : "bg-slate-900 shadow-xl"
          }`}>
            <div className="text-4xl mb-4">✨</div>
            <h3 className={`text-xl font-bold mb-2 ${
              variant === "light" ? "text-slate-900" : "text-white"
            }`}>
              Premium Gradients
            </h3>
            <p className={variant === "light" ? "text-slate-600" : "text-slate-300"}>
              5+ gradient stops with sophisticated color transitions and metallic effects
            </p>
          </div>

          <div className={`rounded-2xl p-8 ${
            variant === "light"
              ? "bg-white shadow-xl"
              : variant === "contrast"
              ? "bg-black border-2 border-cyan-500"
              : "bg-slate-900 shadow-xl"
          }`}>
            <div className="text-4xl mb-4">🎨</div>
            <h3 className={`text-xl font-bold mb-2 ${
              variant === "light" ? "text-slate-900" : "text-white"
            }`}>
              3D Depth & Dimension
            </h3>
            <p className={variant === "light" ? "text-slate-600" : "text-slate-300"}>
              Layered depth effects, drop shadows, and multi-dimensional visual hierarchy
            </p>
          </div>

          <div className={`rounded-2xl p-8 ${
            variant === "light"
              ? "bg-white shadow-xl"
              : variant === "contrast"
              ? "bg-black border-2 border-cyan-500"
              : "bg-slate-900 shadow-xl"
          }`}>
            <div className="text-4xl mb-4">♿</div>
            <h3 className={`text-xl font-bold mb-2 ${
              variant === "light" ? "text-slate-900" : "text-white"
            }`}>
              WCAG AAA Compliant
            </h3>
            <p className={variant === "light" ? "text-slate-600" : "text-slate-300"}>
              Perfect contrast ratios, screen reader support, and universal accessibility
            </p>
          </div>
        </div>

        {/* Size Variations */}
        <div className={`rounded-2xl p-8 mb-12 ${
          variant === "light"
            ? "bg-white shadow-xl"
            : variant === "contrast"
            ? "bg-black border-2 border-cyan-500"
            : "bg-slate-900 shadow-xl"
        }`}>
          <h2 className={`text-2xl font-bold mb-8 ${
            variant === "light" ? "text-slate-900" : "text-white"
          }`}>
            Scalability Test
          </h2>
          
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <span className={`text-sm font-mono w-24 ${
                variant === "light" ? "text-slate-600" : "text-slate-400"
              }`}>
                Large
              </span>
              <LogoWordmarkEnhanced variant={variant} animated={false} style={{ width: '600px' }} />
            </div>
            
            <div className="flex items-center gap-4">
              <span className={`text-sm font-mono w-24 ${
                variant === "light" ? "text-slate-600" : "text-slate-400"
              }`}>
                Medium
              </span>
              <LogoWordmarkEnhanced variant={variant} animated={false} style={{ width: '400px' }} />
            </div>
            
            <div className="flex items-center gap-4">
              <span className={`text-sm font-mono w-24 ${
                variant === "light" ? "text-slate-600" : "text-slate-400"
              }`}>
                Small
              </span>
              <LogoWordmarkEnhanced variant={variant} animated={false} style={{ width: '280px' }} />
            </div>
            
            <div className="flex items-center gap-4">
              <span className={`text-sm font-mono w-24 ${
                variant === "light" ? "text-slate-600" : "text-slate-400"
              }`}>
                Tiny
              </span>
              <LogoWordmarkEnhanced variant={variant} animated={false} style={{ width: '180px' }} />
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        <div className={`rounded-2xl p-8 ${
          variant === "light"
            ? "bg-white shadow-xl"
            : variant === "contrast"
            ? "bg-black border-2 border-cyan-500"
            : "bg-slate-900 shadow-xl"
        }`}>
          <h2 className={`text-2xl font-bold mb-6 ${
            variant === "light" ? "text-slate-900" : "text-white"
          }`}>
            Technical Excellence
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className={`text-3xl font-bold mb-2 ${
                variant === "contrast" ? "text-cyan-400" : "text-blue-500"
              }`}>
                25+
              </div>
              <div className={variant === "light" ? "text-slate-600" : "text-slate-300"}>
                Premium Gradients
              </div>
            </div>
            
            <div>
              <div className={`text-3xl font-bold mb-2 ${
                variant === "contrast" ? "text-cyan-400" : "text-blue-500"
              }`}>
                15+
              </div>
              <div className={variant === "light" ? "text-slate-600" : "text-slate-300"}>
                Visual Effects
              </div>
            </div>
            
            <div>
              <div className={`text-3xl font-bold mb-2 ${
                variant === "contrast" ? "text-cyan-400" : "text-blue-500"
              }`}>
                100%
              </div>
              <div className={variant === "light" ? "text-slate-600" : "text-slate-300"}>
                Accessible
              </div>
            </div>
            
            <div>
              <div className={`text-3xl font-bold mb-2 ${
                variant === "contrast" ? "text-cyan-400" : "text-blue-500"
              }`}>
                ∞
              </div>
              <div className={variant === "light" ? "text-slate-600" : "text-slate-300"}>
                Scalability
              </div>
            </div>
          </div>
        </div>

        {/* Enhancement Details */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className={`rounded-2xl p-8 ${
            variant === "light"
              ? "bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200"
              : variant === "contrast"
              ? "bg-black border-2 border-cyan-500"
              : "bg-gradient-to-br from-blue-950 to-purple-950 border-2 border-blue-800"
          }`}>
            <h3 className={`text-xl font-bold mb-4 ${
              variant === "light" ? "text-slate-900" : "text-white"
            }`}>
              🎯 Design Enhancements
            </h3>
            <ul className={`space-y-2 ${
              variant === "light" ? "text-slate-700" : "text-slate-200"
            }`}>
              <li>✓ Multi-layer depth effects</li>
              <li>✓ Premium metallic sheens</li>
              <li>✓ Sophisticated orbit rings</li>
              <li>✓ Enhanced data streams</li>
              <li>✓ Energy particle system</li>
              <li>✓ 3D dimensional infinity symbol</li>
              <li>✓ Advanced star field</li>
              <li>✓ Premium connection nodes</li>
            </ul>
          </div>

          <div className={`rounded-2xl p-8 ${
            variant === "light"
              ? "bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200"
              : variant === "contrast"
              ? "bg-black border-2 border-cyan-500"
              : "bg-gradient-to-br from-purple-950 to-pink-950 border-2 border-purple-800"
          }`}>
            <h3 className={`text-xl font-bold mb-4 ${
              variant === "light" ? "text-slate-900" : "text-white"
            }`}>
              🚀 Technical Features
            </h3>
            <ul className={`space-y-2 ${
              variant === "light" ? "text-slate-700" : "text-slate-200"
            }`}>
              <li>✓ SVG-based perfect scaling</li>
              <li>✓ Filter effects optimization</li>
              <li>✓ Gradient complexity control</li>
              <li>✓ Animation performance</li>
              <li>✓ Theme-aware color systems</li>
              <li>✓ Accessibility compliance</li>
              <li>✓ Print-ready quality</li>
              <li>✓ Cross-browser compatibility</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

