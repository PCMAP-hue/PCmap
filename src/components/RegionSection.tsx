"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { regions, provinceList } from "@/lib/regionData";
import { MapPin } from "lucide-react";

interface RegionSectionProps {
  selectedProvince: string;
  selectedDistrict: string;
  onProvinceChange: (p: string) => void;
  onDistrictChange: (d: string) => void;
}

export default function RegionSection({
  selectedProvince,
  selectedDistrict,
  onProvinceChange,
  onDistrictChange
}: RegionSectionProps) {
  const handleProvinceClick = (province: string) => {
    onProvinceChange(province);
  };

  const currentDistricts = regions[selectedProvince as keyof typeof regions] || [];
  const hasSubDistricts = selectedProvince !== "전체";

  return (
    <section className="w-full py-20 bg-white border-t border-slate-100 px-4 md:px-6">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Section Header */}
        <div className="flex items-center gap-2 mb-10 text-slate-900">
          <MapPin className="w-6 h-6 md:w-8 md:h-8 text-emerald-500" />
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            지역별 수리점 찾기
          </h2>
        </div>

        {/* Primary Regions (Provinces/Cities) Grid */}
        <div className="w-full max-w-4xl mx-auto mb-8">
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {provinceList.map((province) => {
              const isSelected = selectedProvince === province;
              return (
                <button
                  key={province}
                  onClick={() => handleProvinceClick(province)}
                  className={`
                    px-5 py-2.5 md:px-7 md:py-3 rounded-full font-bold text-sm md:text-base 
                    transition-all duration-300 ease-out border shadow-sm
                    ${isSelected 
                      ? "bg-emerald-500 text-white border-emerald-500 shadow-emerald-500/20 shadow-md ring-2 ring-emerald-500/30 ring-offset-2" 
                      : "bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:text-emerald-500 hover:bg-emerald-50/50"}
                  `}
                >
                  {province}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sub-Districts Expanded Area */}
        {/* Removed mode="wait" to prevent laggy close-and-reopen animations when switching tab */}
        <AnimatePresence>
          {hasSubDistricts && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-full bg-slate-50 border border-slate-100 rounded-3xl overflow-hidden shadow-inner"
            >
              <div className="p-6 md:p-8 flex flex-wrap items-center justify-center gap-2.5 md:gap-3">
                {/* Always include '전체' for districts too */}
                <button
                  onClick={() => onDistrictChange("전체")}
                  className={`
                    px-4 py-2 rounded-full font-semibold text-sm md:text-base transition-colors border
                    ${selectedDistrict === "전체"
                      ? "bg-slate-800 text-white border-slate-800"
                      : "bg-white text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-800"}
                  `}
                >
                  전체
                </button>

                {currentDistricts.map((district) => {
                  const isSelected = selectedDistrict === district;
                  return (
                    <button
                      key={district}
                      onClick={() => onDistrictChange(district)}
                      className={`
                        px-4 py-2 rounded-full font-semibold text-sm md:text-base transition-colors border
                        ${isSelected
                          ? "bg-slate-800 text-white border-slate-800"
                          : "bg-white text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-800"}
                      `}
                    >
                      {district}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
