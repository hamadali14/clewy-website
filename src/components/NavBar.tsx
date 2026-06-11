"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";

export function NavBar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [email, setEmail] = useState("");

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsJoined(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsJoined(false);
      setEmail("");
    }, 2500);
  };

  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-50 flex justify-center mt-6 px-4">
        <div className="flex items-center justify-between w-full max-w-5xl px-6 py-3 bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_0_rgba(0,0,0,0.03)] rounded-full">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#111110] rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-[#FBFBFA] rounded-full" />
            </div>
            <span className="font-semibold tracking-wide text-[#111110] text-sm uppercase">CLEWY</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#111110]/70">
            <Link href="/why-clewy" className="hover:text-[#111110] transition-colors">Why Clewy</Link>
            <Link href="/research" className="hover:text-[#111110] transition-colors">Research</Link>
            <Link href="/docs" className="hover:text-[#111110] transition-colors">Docs</Link>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2 text-sm font-medium text-[#FBFBFA] bg-[#111110] hover:bg-[#111110]/90 rounded-full transition-all shadow-md"
          >
            Join Waitlist
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg bg-[#FBFBFA]/90 backdrop-blur-2xl border border-white shadow-2xl rounded-3xl p-8 overflow-hidden"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-black/40 hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold tracking-tight text-[#111110] mb-2">Request Early Access</h3>
                <p className="text-sm text-black/60">Join the enterprise beta for early documentation and API access.</p>
              </div>

              <div className="flex justify-center gap-6 mb-8 text-center">
                <div>
                  <div className="text-2xl font-bold text-[#111110]">41,385+</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-black/40">Developers</div>
                </div>
                <div className="w-px bg-black/10"></div>
                <div>
                  <div className="text-2xl font-bold text-[#111110]">9,720+</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-black/40">Researchers</div>
                </div>
              </div>

              <form onSubmit={handleJoin} className="relative">
                <AnimatePresence mode="wait">
                  {!isJoined ? (
                    <motion.div 
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex bg-white rounded-full p-1.5 shadow-sm border border-black/5 focus-within:ring-2 ring-black/5"
                    >
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="researcher@university.edu" 
                        required
                        className="flex-1 bg-transparent border-none outline-none px-5 text-sm text-[#111110] placeholder:text-black/30"
                      />
                      <button type="submit" className="px-6 py-2.5 bg-[#111110] text-sm text-white rounded-full font-medium hover:bg-black/90 transition-colors">
                        Submit
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full flex items-center justify-center gap-3 bg-green-50 text-green-700 rounded-full p-3.5 border border-green-200"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-medium text-sm">Access requested successfully.</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
