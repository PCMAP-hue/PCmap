"use client";

import { useState } from "react";
import PartnershipModal from "./PartnershipModal";

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <footer className="w-full bg-slate-50 border-t border-slate-200 pt-16 pb-12">
      <div className="w-full max-w-4xl mx-auto px-4 md:px-6 flex flex-col items-center text-center">
        
        {/* Call to Action Section */}
        <div className="mb-12 flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 tracking-tight">
            PC수리점 사장님이신가요?
          </h2>
          <p className="text-base md:text-lg text-slate-500 font-medium mb-8 max-w-md leading-relaxed">
            지역 최상단에 매장을 노출하고 더 많은 고객을 만나보세요. 쉽고 빠르게 입점할 수 있습니다.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="py-4 px-10 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white rounded-full font-bold text-lg transition-colors shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5"
          >
            입점 문의하기
          </button>
        </div>

        {/* Minimal Copyright */}
        <div className="w-full border-t border-slate-200/60 pt-8 flex flex-col items-center gap-2">
          <h3 className="text-lg font-bold text-slate-300 tracking-widest">PCMAP</h3>
          <p className="text-sm text-slate-400 font-medium">우리 동네 검증된 PC 수리점 지도</p>
          <p className="text-xs text-slate-400 mt-2">© 2026 PCMAP. All rights reserved.</p>
        </div>
      </div>

      <PartnershipModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </footer>
  );
}
