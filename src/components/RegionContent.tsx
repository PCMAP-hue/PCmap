"use client";

import { useState, useRef, useEffect } from "react";
import { type Store } from "@/lib/storeData";
import { supabase } from "@/lib/supabase";
import HeroSection from "@/components/HeroSection";
import SearchSection from "@/components/SearchSection";
import RegionSection from "@/components/RegionSection";
import StoreList from "@/components/StoreList";
import Footer from "@/components/Footer";

interface RegionContentProps {
  initialProvince?: string;
  initialDistrict?: string;
}

export default function RegionContent({
  initialProvince = "전체",
  initialDistrict = "전체"
}: RegionContentProps) {
  const [allStores, setAllStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvince, setSelectedProvince] = useState<string>(initialProvince);
  const [selectedDistrict, setSelectedDistrict] = useState<string>(initialDistrict);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const storeListRef = useRef<HTMLDivElement>(null);

  // Fetch all stores once on mount
  useEffect(() => {
    async function fetchStores() {
      setLoading(true);
      const { data, error } = await supabase.from("stores").select("*");
      if (error) {
        console.error("Error fetching stores:", error);
      } else if (data) {
        setAllStores(data as Store[]);
      }
      setLoading(false);
    }
    fetchStores();
  }, []);

  // Ensure state stays in sync with URL/Props changes
  useEffect(() => {
    setSelectedProvince(initialProvince);
    setSelectedDistrict(initialDistrict);
  }, [initialProvince, initialDistrict]);

  const handleScrollToStores = () => {
    setTimeout(() => {
      storeListRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <main className="flex-1">
        <HeroSection />
        <SearchSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <RegionSection
          selectedProvince={selectedProvince}
          selectedDistrict={selectedDistrict}
          onProvinceChange={(p) => {
            setSelectedProvince(p);
            setSelectedDistrict("전체"); 
            handleScrollToStores();
          }}
          onDistrictChange={(d) => {
            setSelectedDistrict(d);
            handleScrollToStores();
          }}
        />
        <div ref={storeListRef} className="scroll-mt-24">
          <StoreList
            allStores={allStores}
            loading={loading}
            selectedProvince={selectedProvince}
            selectedDistrict={selectedDistrict}
            searchQuery={searchQuery}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
