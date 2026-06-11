"use client";

import React from "react";
import { motion } from "framer-motion";
import { NavBar } from "@/components/NavBar";
import { BookOpen, BarChart3, Clock, Zap } from "lucide-react";

export default function Research() {
  return (
    <div className="relative min-h-screen font-sans selection:bg-black/10 bg-[#FBFBFA]">
      <NavBar />
      
      <section className="relative pt-48 pb-20 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black/10 bg-white/50 backdrop-blur-sm mb-6">
              <span className="text-xs font-semibold tracking-widest uppercase text-black/60">Publications</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-[#111110] leading-[1.05] mb-8">
              Academic Rigor. <br />
              <span className="text-black/40">Enterprise Scale.</span>
            </h1>
            <p className="text-lg text-black/60 leading-relaxed mx-auto max-w-2xl">
              Clewy is backed by extensive research in memory safety, deterministic execution, and compiler design. Explore our whitepapers and see how we compare against Rust and Go.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benchmarks */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_16px_48px_0_rgba(0,0,0,0.05)] rounded-[2.5rem] p-10 md:p-16">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-[#111110] mb-4">Performance Benchmarks</h2>
              <p className="text-black/60">Tested on standard cloud workloads (10k concurrent state transitions).</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Clewy */}
              <div className="bg-[#111110] text-[#FBFBFA] border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                  <Zap className="w-24 h-24" />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2">Clewy</h3>
                <p className="text-white/60 text-sm mb-8">Hybrid Engine v0.8</p>
                <div className="space-y-6">
                  <div>
                    <div className="text-xs font-semibold tracking-widest text-white/40 mb-1">LATENCY (P99)</div>
                    <div className="text-3xl font-bold">1.2ms</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold tracking-widest text-white/40 mb-1">MEMORY FOOTPRINT</div>
                    <div className="text-3xl font-bold">42MB</div>
                  </div>
                </div>
              </div>

              {/* Go */}
              <div className="bg-white border border-black/5 shadow-sm rounded-3xl p-8">
                <h3 className="text-xl font-bold tracking-tight text-[#111110] mb-2">Go</h3>
                <p className="text-black/50 text-sm mb-8">v1.22</p>
                <div className="space-y-6">
                  <div>
                    <div className="text-xs font-semibold tracking-widest text-black/40 mb-1">LATENCY (P99)</div>
                    <div className="text-3xl font-bold text-[#111110]">2.8ms</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold tracking-widest text-black/40 mb-1">MEMORY FOOTPRINT</div>
                    <div className="text-3xl font-bold text-[#111110]">85MB</div>
                  </div>
                </div>
              </div>

              {/* Rust */}
              <div className="bg-white border border-black/5 shadow-sm rounded-3xl p-8">
                <h3 className="text-xl font-bold tracking-tight text-[#111110] mb-2">Rust</h3>
                <p className="text-black/50 text-sm mb-8">v1.78</p>
                <div className="space-y-6">
                  <div>
                    <div className="text-xs font-semibold tracking-widest text-black/40 mb-1">LATENCY (P99)</div>
                    <div className="text-3xl font-bold text-[#111110]">0.9ms</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold tracking-widest text-black/40 mb-1">MEMORY FOOTPRINT</div>
                    <div className="text-3xl font-bold text-[#111110]">18MB</div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center text-xs text-black/40 mt-10">
              * Note: While Rust maintains an edge in pure systems performance, Clewy matches Go's latency while providing strict structural invariance and eliminating all boilerplate business logic.
            </p>
          </div>
        </div>
      </section>

      {/* Whitepapers */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-[#111110]">Featured Whitepapers</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: "Clewy 0.8: Optimized Memory Management for AI Workloads", author: "Dr. Sarah Chen, Quantum Labs", date: "OCTOBER 12, 2026" },
              { title: "Data Consistency Verification in Dynamic Architectures", author: "Prof. Michael Aris, MIT Tech Labs", date: "SEPTEMBER 28, 2026" },
              { title: "Type-Driven Performance: A Hybrid Compilation Model", author: "The Clewy Foundation", date: "SEPTEMBER 05, 2026" },
              { title: "Deterministic Business Logic via Static Analysis", author: "Dr. Elena Rostova", date: "AUGUST 14, 2026" }
            ].map((paper, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group flex flex-col justify-between h-full bg-white/40 backdrop-blur-sm border border-black/5 rounded-3xl p-8 hover:bg-white hover:shadow-xl transition-all duration-500 cursor-pointer"
              >
                <div>
                  <div className="w-10 h-10 bg-black/5 text-[#111110] rounded-full flex items-center justify-center mb-6">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-semibold leading-snug mb-4 group-hover:text-black/70 transition-colors">
                    {paper.title}
                  </h3>
                  <p className="text-sm text-black/60 mb-8">{paper.author}</p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs font-semibold text-black/40">{paper.date}</span>
                  <span className="text-xs font-semibold text-[#c4b59b] group-hover:text-[#111110] transition-colors uppercase tracking-widest">Read PDF</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-black/10 py-12 px-6 bg-white/50 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#111110] rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-[#FBFBFA] rounded-full" />
            </div>
            <span className="font-semibold tracking-wide text-[#111110] text-sm uppercase">CLEWY</span>
          </div>
          <div className="text-xs text-black/40">
            © 2026 Clewy. All rights reserved. Powered by The Clewy Foundation.
          </div>
        </div>
      </footer>
    </div>
  );
}
