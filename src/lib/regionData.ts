// src/lib/regionData.ts

export type RegionCategory = string;
export type SubRegion = string;

export interface RegionData {
  [key: RegionCategory]: SubRegion[];
}

/**
 * 전국 지역 데이터
 * - 빈 배열([]): 하위 구/군 없이 해당 시/도만 표시되는 지역
 * - 배열 값이 있는 경우: 해당 지역 선택 시 하위 구/군 표시
 */
export const regions: RegionData = {
  "전체": [],
  "서울": [
    "강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구",
    "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구",
    "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"
  ],
  "경기": [
    "수원시", "성남시", "고양시", "용인시", "부천시", "안산시", "안양시", "남양주시",
    "화성시", "평택시", "의정부시", "시흥시", "파주시", "광명시", "김포시", "군포시",
    "광주시", "이천시", "양주시", "오산시", "구리시", "안성시", "포천시", "의왕시",
    "하남시", "여주시", "양평군", "동두천시", "과천시", "가평군", "연천군"
  ],
  "인천": [
    "계양구", "남동구", "동구", "미추홀구", "부평구", "서구", "연수구", "중구", "강화군", "옹진군"
  ],
  "강원": [],
  "충북": [],
  "충남": [],
  "대전": [
    "대덕구", "동구", "서구", "유성구", "중구"
  ],
  "광주": [
    "광산구", "남구", "동구", "북구", "서구"
  ],
  "경북": [],
  "경남": [],
  "대구": [
    "남구", "달서구", "동구", "북구", "서구", "수성구", "중구", "달성군", "군위군"
  ],
  "부산": [
    "강서구", "금정구", "기장군", "남구", "동구", "동래구", "부산진구", "북구",
    "사상구", "사하구", "서구", "수영구", "연제구", "영도구", "중구", "해운대구"
  ],
  "전북": [],
  "전남": [],
  "제주": [
    "제주시", "서귀포시"
  ],
};

// "전체"를 제외한 시/도 목록 
export const provinceList = Object.keys(regions);

// 시/도 영문 슬러그 매핑
export const provinceSlugMap: Record<string, string> = {
  "서울": "seoul",
  "경기": "gyeonggi",
  "인천": "incheon",
  "강원": "gangwon",
  "충북": "chungbuk",
  "충남": "chungnam",
  "대전": "daejeon",
  "광주": "gwangju",
  "경북": "gyeongbuk",
  "경남": "gyeongnam",
  "대구": "daegu",
  "부산": "busan",
  "전북": "jeonbuk",
  "전남": "jeonnam",
  "제주": "jeju",
};

// 슬러그로부터 시/도 한글명 가져오기
export const slugToProvinceMap: Record<string, string> = Object.fromEntries(
  Object.entries(provinceSlugMap).map(([k, v]) => [v, k])
);

// 주요 구/군 영문 슬러그 매핑 (필요 시 추가)
export const districtSlugMap: Record<string, string> = {
  "수원시": "suwon",
  "성남시": "seongnam",
  "고양시": "goyang",
  "용인시": "yongin",
  "부천시": "bucheon",
  "안산시": "ansan",
  "안양시": "anyang",
  "남양주시": "namyangju",
  "화성시": "hwaseong",
  "강남구": "gangnam",
  "해운대구": "haeundae",
  // ... 필요한 만큼 추가 가능
};

// 슬러그로부터 구/군 한글명 가져오기
export const slugToDistrictMap: Record<string, string> = Object.fromEntries(
  Object.entries(districtSlugMap).map(([k, v]) => [v, k])
);

/**
 * 한글 지역명을 영문 슬러그로 변환 (매핑이 없으면 한글 그대로 반환하거나 간단히 변환)
 */
export const getSlugFromRegion = (regionName: string, isProvince: boolean = true): string => {
  const map = isProvince ? provinceSlugMap : districtSlugMap;
  return map[regionName] || regionName;
};

/**
 * 영문 슬러그로부터 한글 지역명 복구
 */
export const getRegionFromSlug = (slug: string, isProvince: boolean = true): string => {
  const map = isProvince ? slugToProvinceMap : slugToDistrictMap;
  return map[slug] || slug;
};
