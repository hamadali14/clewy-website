"use client";

import React from "react";
import { motion } from "framer-motion";
import { NavBar } from "@/components/NavBar";
import { Code, Box, Layers, Activity } from "lucide-react";

export default function WhyClewy() {
  return (
    <div className="relative min-h-screen font-sans selection:bg-black/10 bg-[#FBFBFA]">
      <NavBar />
      
      <section className="relative pt-48 pb-32 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black/10 bg-white/50 backdrop-blur-sm mb-6">
              <span className="text-xs font-semibold tracking-widest uppercase text-black/60">Philosophy</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-[#111110] leading-[1.05] mb-8">
              The Problem with <br />
              <span className="text-black/40">Traditional Solutions.</span>
            </h1>
            <p className="text-lg text-black/60 leading-relaxed mx-auto max-w-2xl">
              Modern enterprise software suffers from a fundamental flaw: the gap between business logic and technical implementation. Clewy was engineered from the ground up to solve this.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* The Problem */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_16px_48px_0_rgba(0,0,0,0.05)] rounded-[2.5rem] p-10 md:p-14"
            >
              <div className="w-12 h-12 bg-red-100/50 rounded-2xl flex items-center justify-center text-red-600 mb-8">
                <Code className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-[#111110] mb-4">Generic Languages</h3>
              <p className="text-black/60 leading-relaxed mb-6">
                Generic programming languages (Python, TypeScript, Go) are powerful, but they require every business concept—roles, permissions, workflows—to be implemented manually, time and time again. 
              </p>
              <p className="text-black/60 leading-relaxed">
                A simple rule like "Administrators can approve requests" results in hundreds of lines of code scattered across controllers, middleware, and database schemas.
              </p>
            </motion.div>

            {/* The Answer */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#111110] text-[#FBFBFA] border border-white/10 shadow-[0_16px_48px_0_rgba(0,0,0,0.1)] rounded-[2.5rem] p-10 md:p-14"
            >
              <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-400 mb-8">
                <Box className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight mb-4">The Clewy Answer</h3>
              <p className="text-white/60 leading-relaxed mb-6">
                Clewy is built on the principle that <span className="text-white font-medium">domain knowledge belongs in the language, not the library.</span> Instead of writing boilerplate code, Clewy introduces first-class constructs for the concepts that actually govern how companies work.
              </p>
              <p className="text-white/60 leading-relaxed">
                It compiles directly to production-ready TypeScript and Next.js code, complete with database schemas, API endpoints, and authentication.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#111110]">Why It Matters</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Layers, title: "Explicit Business Logic", desc: "In Clewy, business rules are visible at the top level of the code. You see exactly what the system allows." },
              { icon: Activity, title: "Convention Over Configuration", desc: "Clewy makes intelligent assumptions based on your industry and domain, saving you hundreds of hours." },
              { icon: Code, title: "Compiled, Not Interpreted", desc: "Clewy compiles at build time. There are no runtime surprises. Errors are caught early." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white/40 backdrop-blur-sm border border-black/5 rounded-3xl p-8"
              >
                <div className="w-10 h-10 bg-[#111110] text-[#FBFBFA] rounded-full flex items-center justify-center mb-6">
                  <feature.icon className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-semibold mb-3">{feature.title}</h4>
                <p className="text-sm text-black/60 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
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
