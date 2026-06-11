"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Shield, Terminal, Globe, ChevronRight, CheckCircle2 } from "lucide-react";
import { NavBar } from "@/components/NavBar";

const CODE_SNIPPET = `// The Future of Computation
import { Net, Memory } from "clewy/core";

@Invariant(Memory.Safe)
export struct DataModel {
  pub id: UUID;
  pub state: State<"idle" | "active">;
}

// Deterministic allocation with O(1) GC overhead
func process(model: mut DataModel) -> Result<(), Error> {
  match model.state {
    "idle" => Net.dispatch(model),
    "active" => {
       Memory.pin(model);
       await Net.sync();
    }
  }
  return Ok(());
}`;

const PARTNERS = [
  "MIT Tech Labs",
  "Quantum Labs",
  "Stanford AI Research",
  "NVIDIA Research",
  "Global AI Institute",
  "Oxford Computing",
  "Berkeley Systems"
];

const ARTICLES = [
  {
    title: "CLEWY 0.8: Optimized Memory Management for AI Workloads",
    date: "OCTOBER 12, 2026",
    category: "RESEARCH",
  },
  {
    title: "Data Consistency Verification in Dynamic Architectures",
    date: "SEPTEMBER 28, 2026",
    category: "WHITEPAPER",
  },
  {
    title: "Type-Driven Performance: Benchmarking against Rust and Go",
    date: "SEPTEMBER 05, 2026",
    category: "ENGINEERING",
  }
];

export default function Home() {
  const [email, setEmail] = useState("");
  const [isWaitlistJoined, setIsWaitlistJoined] = useState(false);

  return (
    <div className="relative min-h-screen font-sans selection:bg-black/10">
      <NavBar />

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black/10 bg-white/50 backdrop-blur-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs font-semibold tracking-widest uppercase text-black/60">Version 0.8 Beta</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-[#111110] leading-[1.05] mb-8">
                The Future of Programming is Here. <br />
                <span className="text-black/40">Research-Driven. Structurally Invariant.</span>
              </h1>
              <p className="text-lg text-black/60 leading-relaxed mb-10 max-w-xl">
                A highly-composable, open-source hybrid language engineered for advanced cloud architectures, deterministic business logic, and memory-safe enterprise systems.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/research" className="flex items-center justify-center gap-2 px-8 py-4 bg-[#111110] text-white rounded-full font-medium hover:bg-black/80 transition-all shadow-xl shadow-black/10 group">
                  Read the Whitepaper
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/docs" className="flex items-center justify-center gap-2 px-8 py-4 bg-white border border-black/10 text-[#111110] rounded-full font-medium hover:bg-black/5 transition-all">
                  <Terminal className="w-4 h-4" />
                  View Documentation
                </Link>
              </div>
            </motion.div>

            {/* Code Playground Preview */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/40 bg-[#111110]"
            >
              <div className="absolute inset-x-0 top-0 h-12 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <div className="ml-4 px-3 py-1 bg-white/10 rounded-md text-xs text-white/50 font-mono">core_logic.cly</div>
              </div>
              <div className="p-6 pt-16 h-full overflow-hidden text-sm font-mono text-white/80 leading-relaxed">
                <pre>
                  <code className="block">
                    {CODE_SNIPPET.split('\n').map((line, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 + i * 0.05 }}
                        className="flex"
                      >
                        <span className="w-8 text-white/30 select-none">{i + 1}</span>
                        <span dangerouslySetInnerHTML={{
                          __html: line
                            .replace(/import|export|struct|func|match|await|return|mut/g, '<span class="text-[#c4b59b]">$&</span>')
                            .replace(/@Invariant|Result|Ok|Error/g, '<span class="text-[#8b9487]">$&</span>')
                            .replace(/".*?"/g, '<span class="text-green-400/80">$&</span>')
                            .replace(/\/\/.*$/g, '<span class="text-white/40">$&</span>')
                        }} />
                      </motion.div>
                    ))}
                  </code>
                </pre>
              </div>

              {/* Floating metrics animation */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-6 -bottom-6 bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-black/50">Memory Safety</div>
                  <div className="text-lg font-semibold text-black">100% Verified</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof & Waitlist */}
      <section className="py-24 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_16px_48px_0_rgba(0,0,0,0.05)] rounded-[2.5rem] p-10 md:p-16 text-center">
            
            <div className="flex justify-center gap-12 mb-12 flex-wrap">
              <div>
                <div className="text-4xl md:text-5xl font-bold tracking-tight text-[#111110] mb-2">41,385+</div>
                <div className="text-sm font-medium uppercase tracking-widest text-black/50">Developers Joined</div>
              </div>
              <div className="w-px bg-black/10 hidden md:block"></div>
              <div>
                <div className="text-4xl md:text-5xl font-bold tracking-tight text-[#111110] mb-2">9,720+</div>
                <div className="text-sm font-medium uppercase tracking-widest text-black/50">Researchers Waitlisted</div>
              </div>
            </div>

            <div className="max-w-xl mx-auto">
              <h2 className="text-2xl font-semibold mb-6">Gain Early Access to the Enterprise Beta</h2>
              <form 
                onSubmit={(e) => { e.preventDefault(); setIsWaitlistJoined(true); }}
                className="relative flex items-center"
              >
                <AnimatePresence mode="wait">
                  {!isWaitlistJoined ? (
                    <motion.div 
                      key="form"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="w-full flex bg-white rounded-full p-2 shadow-lg border border-black/5 transition-shadow hover:shadow-xl focus-within:shadow-xl focus-within:ring-2 ring-black/5"
                    >
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="researcher@university.edu" 
                        required
                        className="flex-1 bg-transparent border-none outline-none px-6 text-[#111110] placeholder:text-black/30"
                      />
                      <button type="submit" className="px-8 py-3 bg-[#111110] text-white rounded-full font-medium hover:bg-black/90 transition-colors">
                        Get Early Access
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full flex items-center justify-center gap-3 bg-green-50 text-green-700 rounded-full p-4 border border-green-200"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-medium">You're on the list. We'll be in touch soon.</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* Research Partnerships */}
      <section className="py-20 border-y border-black/5 bg-white/20">
        <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
          <p className="text-sm font-semibold tracking-widest uppercase text-black/40">In Partnership With Leading Institutions</p>
        </div>
        <div className="flex overflow-hidden relative">
          {/* Fading Edges */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#FBFBFA] to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#FBFBFA] to-transparent z-10"></div>
          
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 30, repeat: Infinity }}
            className="flex flex-none gap-24 pr-24 items-center opacity-60"
          >
            {[...PARTNERS, ...PARTNERS].map((partner, i) => (
              <div key={i} className="text-xl font-medium tracking-tight whitespace-nowrap text-black/80 flex items-center gap-3">
                <Globe className="w-5 h-5 text-black/30" />
                {partner}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Deep Technical Research Blog */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#111110] mb-4">Latest Research & Updates</h2>
              <p className="text-black/50 max-w-md">Dive deep into the architecture, benchmarks, and theoretical foundations of Clewy.</p>
            </div>
            <Link href="/research" className="hidden md:flex items-center gap-2 text-sm font-semibold hover:text-black/60 transition-colors">
              View All Publications <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {ARTICLES.map((article, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group cursor-pointer flex flex-col h-full bg-white/40 backdrop-blur-sm border border-black/5 rounded-3xl p-8 hover:bg-white/60 hover:shadow-xl transition-all duration-500"
              >
                <div className="text-xs font-bold tracking-widest text-[#c4b59b] mb-6">{article.category}</div>
                <h3 className="text-xl font-semibold leading-snug mb-8 group-hover:text-black/70 transition-colors flex-1">
                  {article.title}
                </h3>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs font-semibold text-black/40">{article.date}</span>
                  <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-[#111110] group-hover:text-white transition-colors">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/10 py-12 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#111110] rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-[#FBFBFA] rounded-full" />
            </div>
            <span className="font-semibold tracking-wide text-[#111110] text-sm uppercase">CLEWY</span>
          </div>
          
          <div className="flex items-center gap-8 text-sm font-medium text-black/50">
            <a href="#" className="hover:text-black transition-colors">Community</a>
            <a href="#" className="hover:text-black transition-colors">GitHub</a>
            <a href="#" className="hover:text-black transition-colors">Security</a>
            <a href="#" className="hover:text-black transition-colors">Contact</a>
          </div>

          <div className="text-xs text-black/40">
            © 2026 Clewy. All rights reserved. Powered by The Clewy Foundation.
          </div>
        </div>
      </footer>
    </div>
  );
}
