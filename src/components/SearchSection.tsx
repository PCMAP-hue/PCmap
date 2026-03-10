"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";

interface SearchSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function SearchSection({ searchQuery, onSearchChange }: SearchSectionProps) {
  return (
    <section className="w-full py-20 md:py-32 bg-slate-50 flex items-center justify-center px-4 md:px-6">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex flex-col items-center text-center mb-10"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">수리점 찾기</h2>
          <p className="text-base md:text-lg text-slate-500 font-medium">
            원하는 지역의 검증된 PC 수리점을 빠르게 검색해 보세요.
          </p>
        </motion.div>

        {/* Search Bar Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-3xl mx-auto relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-400/20 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
          <form 
            onSubmit={(e) => e.preventDefault()}
            className="relative flex items-center bg-white border border-slate-200 rounded-full shadow-lg overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/50 focus-within:border-transparent transition-all duration-300"
          >
            <div className="pl-6 pr-3 text-slate-400">
              <Search className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="지역 또는 매장명"
              className="flex-1 py-4 sm:py-5 bg-transparent text-slate-900 placeholder:text-slate-400 outline-none text-base sm:text-lg w-full font-medium"
            />
            <button 
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white px-8 sm:px-10 py-4 sm:py-5 font-bold text-base sm:text-lg transition-colors flex shrink-0 items-center justify-center cursor-default sm:cursor-pointer"
            >
              검색
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
