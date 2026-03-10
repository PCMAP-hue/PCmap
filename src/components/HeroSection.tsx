"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full h-[100dvh] md:h-screen min-h-[500px] flex items-center justify-center overflow-hidden bg-white">
      {/* Background Video Wrapper - Forces 75vh on mobile so sides don't crop, but Section stays 100vh */}
      <div className="absolute top-0 left-0 w-full h-[75dvh] md:h-screen">
        <video
          className="w-full h-full object-cover object-center scale-100 md:scale-[1.05] bg-white"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/main-bg.mp4" type="video/mp4" />
        </video>
        {/* Mobile Gradient Mask to blend the bottom edge of the video into the white section background */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white md:hidden"></div>
      </div>

      {/* Content Container (No Box, Text Shadow Only) */}
      <div className="relative z-20 w-full max-w-5xl px-4 md:px-6 flex flex-col items-center mt-[-20dvh] md:mt-[-10vh]">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
           className="w-full max-w-4xl flex flex-col items-center text-center"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[4rem] font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-5 drop-shadow-[0_2px_4px_rgba(255,255,255,1)] md:drop-shadow-[0_4px_8px_rgba(255,255,255,0.9)]" style={{ textShadow: "0 0 10px white, 0 0 20px white, 0 0 30px white" }}>
            허위 출장은 이제 그만.<br className="hidden sm:block" />
            <span className="text-emerald-500 inline-block sm:ml-2">진짜 PC 전문가</span>를 만나다.
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-700 font-bold tracking-wide max-w-2xl mx-auto leading-relaxed drop-shadow-md" style={{ textShadow: "0 0 8px white, 0 0 16px white" }}>
            PC맵에서 검증된 우리 동네 오프라인 수리점을 확인하세요.
          </p>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center cursor-pointer"
        onClick={() => {
          window.scrollTo({
            top: window.innerHeight,
            behavior: "smooth"
          });
        }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <ChevronDown className="w-10 h-10 md:w-12 md:h-12 text-slate-900/40" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  );
}
