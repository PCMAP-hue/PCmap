"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { type Store } from "@/lib/storeData";
import { provinceList, regions } from "@/lib/regionData";
import { Lock, LayoutDashboard, Store as StoreIcon, Plus, Edit, Trash2, LogOut, RefreshCw, BarChart, Crown, X, Search, Filter } from "lucide-react";

const ADMIN_PIN = "265422";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  const [activeTab, setActiveTab] = useState<"dashboard" | "stores">("dashboard");
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter logic
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("전체");
  const [selectedDistrict, setSelectedDistrict] = useState("전체");

  // Modal logic
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    province: "",
    district: "",
    badges: "",
    naverUrl: "",
    isPremium: false,
    thumbnailUrl: ""
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setIsAuthenticated(true);
      fetchStores();
    } else {
      setPinError(true);
      setPinInput("");
    }
  };

  const fetchStores = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("stores").select("*").order("click_count", { ascending: false });
    if (!error && data) {
      setStores(data);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPinInput("");
  };

  // derived data
  const topStores = useMemo(() => {
    return [...stores].sort((a, b) => (b.click_count || 0) - (a.click_count || 0)).slice(0, 5);
  }, [stores]);

  const provinceStats = useMemo(() => {
    const stats: Record<string, number> = {};
    stores.forEach(s => {
      stats[s.province] = (stats[s.province] || 0) + (s.click_count || 0);
    });
    return Object.entries(stats).sort((a, b) => b[1] - a[1]);
  }, [stores]);

  const totalClicks = useMemo(() => stores.reduce((sum, s) => sum + (s.click_count || 0), 0), [stores]);

  const filteredStores = useMemo(() => {
    return stores.filter(store => {
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
  }, [stores, searchQuery, selectedProvince, selectedDistrict]);

  // CRUD
  const handleDelete = async (id: string) => {
    if (!confirm("정말 이 매장을 삭제하시겠습니까?")) return;
    const { error } = await supabase.from("stores").delete().eq("id", id);
    if (!error) fetchStores();
  };

  const openModal = (store?: Store) => {
    if (store) {
      setEditingStore(store);
      setFormData({
        name: store.name,
        address: store.address,
        province: store.province,
        district: store.district,
        badges: store.badges.join(", "),
        naverUrl: store.naverUrl,
        isPremium: store.isPremium || false,
        thumbnailUrl: store.thumbnailUrl || ""
      });
    } else {
      setEditingStore(null);
      setFormData({
        name: "",
        address: "",
        province: "",
        district: "",
        badges: "",
        naverUrl: "",
        isPremium: false,
        thumbnailUrl: ""
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStore(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse badges
    const parsedBadges = formData.badges.split(",").map(b => b.trim()).filter(b => b !== "");

    const payload = {
      name: formData.name,
      address: formData.address,
      province: formData.province,
      district: formData.district,
      badges: parsedBadges,
      naverUrl: formData.naverUrl,
      isPremium: formData.isPremium,
      thumbnailUrl: formData.thumbnailUrl
    };

    if (editingStore) {
      // update
      await supabase.from("stores").update(payload).eq("id", editingStore.id);
    } else {
      // insert
      await supabase.from("stores").insert([{ ...payload, click_count: 0 }]);
    }
    closeModal();
    fetchStores();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm text-center border border-slate-100">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">관리자 로그인</h1>
          <p className="text-slate-500 mb-8 text-sm">페이지 접근을 위해 PIN을 입력하세요.</p>
          
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input 
              type="password"
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setPinError(false);
              }}
              placeholder="••••••"
              className={`w-full bg-slate-50 border px-4 py-3 rounded-xl text-center text-xl tracking-widest font-mono focus:outline-none focus:ring-2 transition-all ${pinError ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-emerald-200 focus:border-emerald-400'}`}
              maxLength={6}
            />
            {pinError && <p className="text-red-500 text-xs font-semibold">PIN 번호가 일치하지 않습니다.</p>}
            
            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 rounded-xl font-bold transition-all shadow-md mt-2"
            >
              접속하기
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm shrink-0">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white shadow-sm">
              <Lock className="w-4 h-4" />
            </div>
            Admin
          </h1>
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${activeTab === 'dashboard' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            대시보드
          </button>
          <button 
            onClick={() => setActiveTab("stores")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${activeTab === 'stores' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <StoreIcon className="w-5 h-5" />
            매장 관리
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            로그아웃
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 lg:p-10 h-screen overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 tracking-tight">데이터 대시보드</h2>
                  <p className="text-slate-500 mt-1 font-medium">전체 매장의 운영 성과를 확인하세요.</p>
                </div>
                <button 
                  onClick={fetchStores}
                  className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 shadow-sm transition-all"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  새로고침
                </button>
              </header>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-slate-500 font-semibold text-sm tracking-wide">누적 총 클릭수</p>
                    <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg">
                      <BarChart className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-4xl font-extrabold text-slate-800">{totalClicks.toLocaleString()}</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-slate-500 font-semibold text-sm tracking-wide">등록된 총 매장수</p>
                    <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                      <StoreIcon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-4xl font-extrabold text-slate-800">{stores.length}</h3>
                </div>
              </div>

              {/* Charts & Lists */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top 5 */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800">클릭수 순위 (Top 5)</h3>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {topStores.map((store, i) => (
                      <div key={store.id} className="p-4 px-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <span className={`w-6 text-center font-bold ${i < 3 ? 'text-emerald-500' : 'text-slate-400'}`}>{i+1}</span>
                          <div>
                            <p className="font-semibold text-slate-800">{store.name}</p>
                            <p className="text-xs text-slate-500">{store.address}</p>
                          </div>
                        </div>
                        <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">
                          {store.click_count || 0} clicks
                        </div>
                      </div>
                    ))}
                    {topStores.length === 0 && <div className="p-6 text-center text-slate-400">데이터가 없습니다.</div>}
                  </div>
                </div>

                {/* Province Stats */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800">지역별 누적 클릭수</h3>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {provinceStats.map(([prov, count], i) => (
                      <div key={prov} className="p-4 px-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <span className="font-semibold text-slate-700">{prov}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-32 bg-slate-100 rounded-full h-2 overflow-hidden hidden sm:block">
                            <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${Math.min((count / totalClicks) * 100 || 0, 100)}%` }} />
                          </div>
                          <span className="w-8 text-right text-sm font-bold text-slate-500">{count}</span>
                        </div>
                      </div>
                    ))}
                    {provinceStats.length === 0 && <div className="p-6 text-center text-slate-400">데이터가 없습니다.</div>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "stores" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 tracking-tight">매장 관리</h2>
                  <p className="text-slate-500 mt-1 font-medium">데이터베이스의 매장을 추가, 수정, 삭제합니다.</p>
                </div>
                <button 
                  onClick={() => openModal()}
                  className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-emerald-500/20 transition-all hover:-translate-y-0.5"
                >
                  <Plus className="w-5 h-5" />
                  신규 등록
                </button>
              </header>

              {/* Filters Section */}
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
                {/* Search */}
                <div className="relative w-full md:w-96 shrink-0">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="매장명, 주소, 지역 검색..."
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white transition-all text-sm font-medium"
                  />
                </div>
                
                {/* Region Selectors */}
                <div className="flex w-full gap-3 overflow-x-auto pb-1 md:pb-0">
                  <div className="relative shrink-0">
                    <select
                      value={selectedProvince}
                      onChange={(e) => {
                        setSelectedProvince(e.target.value);
                        setSelectedDistrict("전체");
                      }}
                      className="appearance-none pl-4 pr-10 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 font-semibold text-slate-700 text-sm cursor-pointer transition-colors"
                    >
                      {provinceList.map((prov) => (
                        <option key={prov} value={prov}>{prov}</option>
                      ))}
                    </select>
                    <Filter className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                  
                  {selectedProvince !== "전체" && regions[selectedProvince]?.length > 0 && (
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="appearance-none pl-4 pr-10 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 font-semibold text-slate-700 text-sm cursor-pointer transition-colors shrink-0 animate-in fade-in"
                    >
                      <option value="전체">{selectedProvince} 전체</option>
                      {regions[selectedProvince].map((dist) => (
                        <option key={dist} value={dist}>{dist}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                        <th className="p-4 font-semibold text-sm">진열/이름</th>
                        <th className="p-4 font-semibold text-sm">지역</th>
                        <th className="p-4 font-semibold text-sm text-center">클릭수</th>
                        <th className="p-4 font-semibold text-sm text-right">관리</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredStores.map(store => (
                        <tr key={store.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="p-4 flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${store.isPremium ? 'bg-amber-100 text-amber-500' : 'bg-slate-100 text-slate-400'}`}>
                              {store.isPremium ? <Crown className="w-5 h-5" /> : <StoreIcon className="w-5 h-5" />}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">{store.name}</p>
                              <p className="text-xs text-slate-400 max-w-[200px] truncate">{store.address}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-medium text-slate-700">{store.province}</span>
                            <span className="text-slate-400 text-sm ml-1">{store.district}</span>
                          </td>
                          <td className="p-4 text-center">
                            <span className="inline-flex bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-bold">
                              {store.click_count || 0}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => openModal(store)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                                <Edit className="w-5 h-5" />
                              </button>
                              <button onClick={() => handleDelete(store.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredStores.length === 0 && (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-slate-400">조건에 맞는 매장이 없습니다.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur z-10">
              <h2 className="text-xl font-bold text-slate-900">{editingStore ? "매장 수정" : "새 매장 등록"}</h2>
              <button 
                type="button" 
                onClick={closeModal} 
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="닫기"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">매장명</label>
                  <input required placeholder="예: 컴수리연구소" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">네이버 플레이스 URL</label>
                  <input required type="url" placeholder="https://m.place.naver.com/..." className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400" value={formData.naverUrl} onChange={e => setFormData({...formData, naverUrl: e.target.value})} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">도/광역시 (Province)</label>
                  <input required placeholder="예: 서울" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400" value={formData.province} onChange={e => setFormData({...formData, province: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">시/군/구 (District)</label>
                  <input required placeholder="예: 강남구" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700">상세 주소</label>
                  <input required placeholder="전체 주소 입력" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700">배지 (콤마[,]로 구분)</label>
                  <input placeholder="단골많음, 조립전문, 리뷰이벤트" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400" value={formData.badges} onChange={e => setFormData({...formData, badges: e.target.value})} />
                </div>

                <div className="space-y-2 md:col-span-2 p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                  <div>
                    <label className="font-bold text-emerald-900 flex items-center gap-2">
                      <Crown className="w-5 h-5 text-amber-500" />
                      프리미엄 매장 여부
                    </label>
                    <p className="text-xs text-emerald-600 mt-1">프리미엄 활성화 시 썸네일 노출 및 상단 배치</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" className="sr-only peer" checked={formData.isPremium} onChange={e => setFormData({...formData, isPremium: e.target.checked})} />
                    <div className="w-14 h-7 bg-emerald-200 rounded-full peer peer-checked:bg-emerald-500 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-7 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-300"></div>
                  </label>
                </div>

                {formData.isPremium && (
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700">16:9 썸네일 URL (프리미엄 전용)</label>
                    <input placeholder="https://..." className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400" value={formData.thumbnailUrl} onChange={e => setFormData({...formData, thumbnailUrl: e.target.value})} />
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-slate-100 flex gap-3 justify-end">
                <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors">
                  취소
                </button>
                <button type="submit" className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-md shadow-emerald-500/20 transition-colors">
                  저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
