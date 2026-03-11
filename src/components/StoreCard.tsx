"use client";

import { MapPin, MonitorPlay, Crown } from "lucide-react";
import { type Store } from "@/lib/storeData";
import { supabase } from "@/lib/supabase";

export default function StoreCard({ store }: { store: Store }) {
  const isPremium = store.isPremium;

  const handleLinkClick = () => {
    // Fire and forget the click track
    supabase.rpc('increment_click_count', { target_store_id: store.id })
      .then(({ error }) => {
        if (error) {
          // Fallback if RPC does not exist
          const currentCount = store.click_count || 0;
          supabase.from('stores').update({ click_count: currentCount + 1 }).eq('id', store.id).then();
        }
      });
  };

  return (
    <div 
      className={`
        bg-white rounded-2xl flex flex-col h-full overflow-hidden transition-all duration-300 group
        ${isPremium 
          ? "border-2 border-emerald-400 shadow-[0_4px_20px_rgba(16,185,129,0.15)] hover:shadow-[0_12px_40px_rgba(16,185,129,0.25)] hover:-translate-y-1.5" 
          : "border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1"
        }
      `}
    >
      {/* 16:9 Unified Thumbnail Area */}
      <div className="relative w-full aspect-video bg-slate-50 overflow-hidden flex items-center justify-center shrink-0 border-b border-slate-100">
        {isPremium && store.thumbnailUrl ? (
          <img 
            src={store.thumbnailUrl} 
            alt={`${store.name} 썸네일`} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
            <MonitorPlay className="w-12 h-12 text-slate-200" strokeWidth={1.5} />
          </div>
        )}

        {/* Premium Badge Overlay */}
        {isPremium && (
          <div className="absolute top-3 left-3 bg-emerald-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider flex items-center gap-1 shadow-md">
            <Crown className="w-3.5 h-3.5" />
            PREMIUM
          </div>
        )}
      </div>

      {/* Card Content Area */}
      <div className="p-5 md:p-6 flex flex-col flex-1">
        {/* Header Info */}
        <div className="flex-1">
          <h3 className={`text-xl md:text-2xl font-bold mb-3 tracking-tight transition-colors ${isPremium ? 'text-emerald-900 group-hover:text-emerald-600' : 'text-slate-900 group-hover:text-emerald-600'}`}>
            {store.name}
          </h3>
          
          <div className="flex items-start gap-1.5 mb-5 text-slate-500">
            <MapPin className="w-4 h-4 md:w-5 md:h-5 mt-0.5 shrink-0" />
            <p className="text-sm md:text-base font-medium leading-relaxed">
              {store.address}
            </p>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            {store.badges.map((badge, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-xs md:text-sm font-semibold tracking-wide"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Naver CTA Button */}
        <a
          href={store.naverUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleLinkClick}
          className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white rounded-xl font-bold text-sm md:text-base transition-colors flex items-center justify-center text-center mt-auto shadow-sm"
        >
          네이버 플레이스 보기
        </a>
      </div>
    </div>
  );
}
