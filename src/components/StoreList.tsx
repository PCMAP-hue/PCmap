"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { type Store } from "@/lib/storeData";
import { supabase } from "@/lib/supabase";
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
  selectedProvince, 
  selectedDistrict,
  searchQuery
}: { 
  selectedProvince: string;
  selectedDistrict: string;
  searchQuery: string;
}) {
  const [allStores, setAllStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial Fetch from Supabase
  useEffect(() => {
    async function fetchStores() {
      setLoading(true);
      const { data, error } = await supabase
        .from("stores")
        .select("*");
      
      if (error) {
        console.error("Error fetching stores:", error);
      } else if (data) {
        setAllStores(data as Store[]);
      }
      setLoading(false);
    }

    fetchStores();
  }, []);

  // Filter Logic (Memoized so we only recalculate when dependencies change)
  const filteredStores = useMemo(() => {
    return allStores.filter(store => {
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch = 
          store.name.toLowerCase().includes(query) ||
          store.address.toLowerCase().includes(query) ||
          store.province.toLowerCase().includes(query) ||
          store.district.toLowerCase().includes(query);
        
        if (!matchesSearch) return false;
      }

      if (selectedProvince !== "전체") {
        if (store.province !== selectedProvince) return false;
        if (selectedDistrict !== "전체" && store.district !== selectedDistrict) return false;
      }

      return true;
    });
  }, [allStores, searchQuery, selectedProvince, selectedDistrict]);

  // Shuffle and Group Logic (Premium First)
  // Processed synchronously with rendering to prevent Framer Motion animation glitches
  const displayStores = useMemo(() => {
    const premiums = filteredStores.filter(s => s.isPremium);
    const regulars = filteredStores.filter(s => !s.isPremium);

    // Fisher-Yates array shuffle
    const shuffleArray = (array: Store[]) => {
      const result = [...array];
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
    };

    return [
      ...shuffleArray(premiums), 
      ...shuffleArray(regulars)
    ];
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
