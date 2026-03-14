"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { type Store } from "@/lib/storeData";
import StoreCard from "@/components/StoreCard";

// Using the same animation logic from RegionSection for consistency
const containerDefaults = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemDefaults = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
};

export default function StoreList({ 
  allStores,
  loading,
  selectedProvince, 
  selectedDistrict,
  searchQuery
}: { 
  allStores: Store[];
  loading: boolean;
  selectedProvince: string;
  selectedDistrict: string;
  searchQuery: string;
}) {

  // Filter Logic
  const filteredStores = useMemo(() => {
    if (loading) return [];
    
    const result = allStores.filter(store => {
      // Safety checks for basic data
      const name = store.name || "";
      const address = store.address || "";
      const province = store.province || "";
      const district = store.district || "";

      // 1. Search Query Filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch = 
          name.toLowerCase().includes(query) ||
          address.toLowerCase().includes(query) ||
          province.toLowerCase().includes(query) ||
          district.toLowerCase().includes(query);
        
        if (!matchesSearch) return false;
      }

      // 2. Region Filter
      if (!selectedProvince || selectedProvince === "전체") return true;

      const storeProvince = province.trim();
      const storeDistrict = district.trim();
      const targetProvince = selectedProvince.trim();
      
      // Province Matching (Flexible)
      const provinceMatch = storeProvince.includes(targetProvince) || targetProvince.includes(storeProvince);
      if (!provinceMatch) return false;
      
      // District Matching (Flexible)
      if (selectedDistrict && selectedDistrict !== "전체") {
        const targetDistrict = selectedDistrict.trim();
        const districtMatch = storeDistrict.includes(targetDistrict) || targetDistrict.includes(storeDistrict);
        if (!districtMatch) return false;
      }

      return true;
    });

    console.log(`Filtered: ${result.length} stores (Filter: ${selectedProvince} > ${selectedDistrict})`);
    return result;
  }, [allStores, searchQuery, selectedProvince, selectedDistrict, loading]);

  // Shuffle and Group Logic
  const displayStores = useMemo(() => {
    const now = new Date().getTime();

    const processedStores = filteredStores.map(store => {
      let isTrulyPremium = !!store.isPremium;
      if (isTrulyPremium && store.premium_end_date) {
        const endDate = new Date(store.premium_end_date).getTime();
        if (now > endDate) isTrulyPremium = false;
      }
      
      // Ensure badges is always an array
      const safeBadges = Array.isArray(store.badges) ? store.badges : [];
      
      return { ...store, isPremium: isTrulyPremium, badges: safeBadges };
    });

    const premiums = processedStores.filter(s => s.isPremium);
    const regulars = processedStores.filter(s => !s.isPremium);

    const shuffleArray = (array: any[]) => {
      const result = [...array];
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
    };

    return [...shuffleArray(premiums), ...shuffleArray(regulars)];
  }, [filteredStores]);

  if (loading) {
    return (
      <div className="w-full py-16 text-center text-slate-500 font-medium">
        매장 정보를 불러오는 중입니다...
      </div>
    );
  }

  if (displayStores.length === 0) {
    return (
      <div className="w-full py-16 text-center text-slate-500 font-medium">
        해당 지역에 등록된 매장이 없습니다.
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerDefaults}
      initial="hidden"
      animate="show"
      className="w-full max-w-6xl mx-auto px-4 md:px-6 py-12"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {displayStores.map((store) => (
          <motion.div key={store.id} variants={itemDefaults} className="h-full">
            <StoreCard store={store} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
