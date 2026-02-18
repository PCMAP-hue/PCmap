/**
 * PC MAP v2.3 - Visual Identity & Clean Layout
 * Features: 
 * 1. Kakao Yellow Branding (#FEE500)
 * 2. Optimized Footer Layout (Partnership vs Legal)
 * 3. 3-Step Partnership Guide Modal
 * 4. Robust CSV Parsing & Core Features Preservation
 */

// 1. Persistent Navigation Map
const REGION_MAP = {
    "서울": ["강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"],
    "경기": ["수원시", "성남시", "고양시", "용인시", "부천시", "안산시", "안양시", "남양주시", "화성시", "평택시", "의정부시", "파주시", "시흥시", "김포시", "광명시", "광주시", "군포시", "이천시", "오산시", "하남시", "양주시", "구리시", "안성시", "포천시", "의왕시", "여주시", "양평군", "가평군", "연천군"],
    "인천": ["부평구", "남동구", "연수구", "미추홀구", "서구", "계양구", "중구", "동구", "강화군", "옹진군"],
    "부산": ["해운대구", "부산진구", "동래구", "남구", "북구", "사하구", "금정구", "연제구", "수영구", "사상구", "기장군", "중구", "동구", "서구", "영도구", "강서구"],
    "대전": ["유성구", "서구", "중구", "동구", "대덕구"],
    "대구": ["중구", "동구", "서구", "남구", "북구", "수성구", "달서구", "달성군"],
    "광주": ["동구", "서구", "남구", "북구", "광산구"],
    "울산": ["중구", "남구", "동구", "북구", "울주군"],
    "세종": ["세종특별자치시"],
    "강원": ["춘천시", "원주시", "강릉시", "동해시", "태백시", "속초시", "삼척시"],
    "제주": ["제주시", "서귀포시"]
};

// 2. Legal Content
const LEGAL_CONTENT = {
    tos: {
        title: "이용약관",
        body: `제1조 (목적): 본 약관은 'PC맵'이 제공하는 매장 정보 공유 서비스의 이용 조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.

제2조 (정보의 제공): 서비스는 네이버 플레이스 데이터를 기반으로 하며, 실제 운영 상태와 차이가 있을 수 있습니다. 방문 전 확인은 이용자의 책임입니다.

제3조 (책임의 제한): 본 서비스는 정보 중개 플랫폼으로, 이용자와 수리점 간의 거래 및 분쟁에 대해 법적 책임을 지지 않습니다.`
    },
    privacy: {
        title: "개인정보처리방침",
        body: `수집 항목: 제휴 문의 시 성함, 연락처, 매장명.

수집 목적: 광고 및 제휴 상담 진행.

보유 기간: 상담 완료 후 1년 내 파기(관련 법령에 의거 보관 필요 시 예외).`
    }
};

// 3. Fallback Data (Zero-Downtime)
const FALLBACK_STORES = [
    {
        id: 1, name: "강남 마스터 PC 수리", isPremium: false, region: "서울", subRegion: "강남구",
        address: "서울특별시 강남구 테헤란로 427", thumbnailUrl: "https://images.unsplash.com/photo-1591405351990-4726e331f141?w=800",
        description: "국가공인 PC 정비사가 직접 운영하는 강남 1등 수리점입니다. 정찰제 도입으로 투명합니다.",
        tags: ["당일수리", "정품사용", "무료진단"], naverLink: "https://map.naver.com"
    },
    {
        id: 2, name: "구사컴퓨터", isPremium: true, region: "경기", subRegion: "수원시",
        address: "경기도 수원시 장안구 일월로76번길 10-4 1층", thumbnailUrl: "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20241023_55%2F1729673110572pvXKB_JPEG%2FR0004913.JPG",
        description: "수원 1등 조립컴퓨터 및 수리 전문점. 네이버 평점 최고점을 기록 중인 검증된 업체입니다.",
        tags: ["조립컴퓨터", "컴퓨터수리", "무료청소"], naverLink: "https://naver.me/FJbYgwxg"
    }
];

let appData = {
    regions: REGION_MAP,
    stores: FALLBACK_STORES
};

let currentCity = "서울";
let currentDistrict = "강남구";

// --- Logic Helpers ---

function parseBool(val) {
    if (!val) return false;
    return val.toString().trim().toUpperCase() === "TRUE";
}

function cleanURL(url) {
    if (!url) return "#";
    let trimmed = url.trim();
    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
        return "https://" + trimmed;
    }
    return trimmed;
}

function parseCSV(text) {
    const lines = text.trim().split(/\r?\n/).filter(l => l.trim() !== "");
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    return lines.slice(1).map(line => {
        const regex = /(".*?"|[^,]+|(?<=,)(?=,)|(?<=^)(?=,))/g;
        const matches = line.match(regex);
        const values = matches ? matches.map(v => v.trim().replace(/^"|"$/g, '')) : [];

        let obj = {};
        headers.forEach((header, i) => {
            let val = values[i] || "";
            if (header === 'isPremium') val = parseBool(val);
            if (header === 'id') val = parseInt(val) || 0;
            if (header === 'tags') {
                val = val ? val.split(/\s*[\/,]\s*/).map(t => t.trim()).filter(t => t !== "") : [];
            }
            obj[header] = val;
        });
        return obj;
    });
}

async function loadAppData() {
    renderCityChips();
    updateDistrictNav();
    renderStores();

    try {
        const response = await fetch('stores.csv');
        if (response.ok) {
            const csvText = await response.text();
            const csvData = parseCSV(csvText);
            if (csvData.length > 0) {
                appData.stores = csvData;
                renderStores();
                console.log("Data overridden by v2.3 stores.csv");
            }
        }
    } catch (e) {
        console.warn("CSV not available, using fallback.", e);
    }
}

// --- Navigation UI ---

function renderCityChips() {
    const cityNav = document.getElementById('city-nav');
    if (!cityNav) return;
    cityNav.innerHTML = Object.keys(REGION_MAP).map(city => `
        <button onclick="selectCity('${city}')" class="chip px-6 py-2.5 rounded-full border border-gray-100 text-[14px] font-bold bg-white text-gray-400 ${currentCity === city ? 'chip-active' : ''}">
            ${city}
        </button>
    `).join('');
}

function selectCity(city) {
    currentCity = city;
    currentDistrict = REGION_MAP[city] ? REGION_MAP[city][0] : "";
    renderCityChips();
    updateDistrictNav();
    renderStores();
}

function updateDistrictNav() {
    const districtNav = document.getElementById('district-nav');
    if (!districtNav) return;
    const districts = REGION_MAP[currentCity];
    if (districts) {
        districtNav.innerHTML = districts.map(district => `
            <button onclick="selectDistrict('${district}')" class="chip px-4 py-2 rounded-xl border border-transparent text-[13px] font-bold text-gray-400 bg-gray-50 ${currentDistrict === district ? 'sub-chip-active' : ''}">
                ${district}
            </button>
        `).join('');
    }
}

function selectDistrict(district) {
    currentDistrict = district;
    updateDistrictNav();
    renderStores();
}

// --- Rendering: Stores ---

function renderStores() {
    const storeGrid = document.getElementById('store-grid');
    const emptyState = document.getElementById('empty-state');
    if (!storeGrid || !emptyState) return;

    const filtered = appData.stores.filter(s =>
        s.region === currentCity && (currentDistrict ? s.subRegion === currentDistrict : true)
    );

    filtered.sort((a, b) => (b.isPremium === true ? 1 : 0) - (a.isPremium === true ? 1 : 0));

    if (filtered.length === 0) {
        storeGrid.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }

    storeGrid.classList.remove('hidden');
    emptyState.classList.add('hidden');

    storeGrid.innerHTML = filtered.map(store => `
        <div class="store-card relative flex flex-col rounded-[40px] p-8 bg-white border border-gray-100 ${store.isPremium ? 'premium-card' : ''}">
            ${store.isPremium ? `
                <div class="absolute top-6 right-8 flex items-center gap-1.5 px-3 py-1.5 rounded-full premium-badge">
                    <span>⭐</span>
                    <span class="font-black">TOP PREMIUM</span>
                </div>
            ` : ''}
            
            <div class="${store.isPremium ? 'premium-img-container' : 'mb-6 aspect-video rounded-2xl overflow-hidden bg-gray-50 shadow-inner'} border border-gray-50">
                <img src="${store.thumbnailUrl || 'https://via.placeholder.com/600x400?text=PC+MAP'}" class="w-full h-full object-cover">
            </div>

            <div class="mb-4">
                <h3 class="font-extrabold text-2xl tracking-tight mb-2">${store.name}</h3>
                <div class="flex items-center gap-1.5 self-start px-2 py-0.5 bg-green-50 rounded mb-2">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#00FF41]"></span>
                    <span class="text-[10px] font-black text-[#00FF41] uppercase tracking-tighter">파트너 검증</span>
                </div>
                <span class="text-xs text-gray-400 font-bold block">${store.address}</span>
            </div>
            
            <p class="text-gray-500 text-[14px] mb-6 leading-relaxed font-medium line-clamp-2">${store.description}</p>
            
            <div class="flex flex-wrap gap-2 mb-8 mt-auto">
                ${store.tags.map(t => `<span class="px-2 py-1 bg-green-50 text-[10px] text-[--electric-green] font-bold rounded">#${t}</span>`).join('')}
            </div>
            
            <button onclick="window.open('${cleanURL(store.naverLink)}', '_blank')" class="visit-btn block w-full py-5 rounded-[24px] text-center text-[15px] font-black ${store.isPremium ? 'bg-[#00FF41] text-black shadow-lg shadow-green-400/20' : 'bg-[#1D1D1F] text-white hover:bg-black'}">
                네이버 플레이스 방문하기
            </button>
        </div>
    `).join('');
}

// --- Modals ---

function openVideoModal(id) {
    const modal = document.getElementById('video-modal');
    const container = document.getElementById('player-container');
    if (!modal || !container) return;
    container.innerHTML = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${id}?autoplay=1" frameborder="0" allowfullscreen></iframe>`;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
    const modal = document.getElementById('video-modal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function openPartnershipModal() {
    const modal = document.getElementById('partnership-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closePartnershipModal() {
    const modal = document.getElementById('partnership-modal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function openLegalModal(type) {
    const modal = document.getElementById('legal-modal');
    const title = document.getElementById('legal-title');
    const body = document.getElementById('legal-body');
    if (!modal || !title || !body || !LEGAL_CONTENT[type]) return;

    title.innerText = LEGAL_CONTENT[type].title;
    body.innerText = LEGAL_CONTENT[type].body;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLegalModal() {
    const modal = document.getElementById('legal-modal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Global Exports
window.selectCity = selectCity;
window.selectDistrict = selectDistrict;
window.openVideoModal = openVideoModal;
window.closeVideoModal = closeVideoModal;
window.openPartnershipModal = openPartnershipModal;
window.closePartnershipModal = closePartnershipModal;
window.openLegalModal = openLegalModal;
window.closeLegalModal = closeLegalModal;

document.addEventListener('DOMContentLoaded', loadAppData);
