"use client";

import { useState, useRef } from "react";
import HeroSection from "@/components/HeroSection";
import SearchSection from "@/components/SearchSection";
import RegionSection from "@/components/RegionSection";
import StoreList from "@/components/StoreList";
import Footer from "@/components/Footer";

export default function Home() {
  const [selectedProvince, setSelectedProvince] = useState<string>("전체");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("전체");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const storeListRef = useRef<HTMLDivElement>(null);

  const handleScrollToStores = () => {
    // slight delay to allow React state updates and Framer Motion animations to calculate height
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
            setSelectedDistrict("전체"); // Reset district when province changes
            handleScrollToStores();
          }}
          onDistrictChange={(d) => {
            setSelectedDistrict(d);
            handleScrollToStores();
          }}
        />
        <div ref={storeListRef} className="scroll-mt-24">
          <StoreList
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

