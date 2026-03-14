import { Metadata } from "next";
import { getRegionFromSlug } from "@/lib/regionData";
import RegionContent from "@/components/RegionContent";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ province: string, district: string }> 
}): Promise<Metadata> {
  const { province, district } = await params;
  const provinceName = getRegionFromSlug(province, true);
  const districtName = getRegionFromSlug(district, false);
  
  return {
    title: `${provinceName} ${districtName} 컴퓨터 수리 | 진짜 우리 동네 수리점 PC맵`,
    description: `${provinceName} ${districtName} 지역의 검증된 오프라인 컴퓨터 수리점을 확인하세요. 허위 출장 없는 투명한 서비스를 제공합니다.`,
    openGraph: {
      title: `${provinceName} ${districtName} 컴퓨터 수리 | 진짜 우리 동네 수리점 PC맵`,
      description: `${provinceName} ${districtName} 지역의 검증된 오프라인 컴퓨터 수리점을 확인하세요.`,
    }
  };
}

export default async function DistrictPage({ 
  params 
}: { 
  params: Promise<{ province: string, district: string }> 
}) {
  const { province, district } = await params;
  const provinceName = getRegionFromSlug(province, true);
  const districtName = getRegionFromSlug(district, false);

  return <RegionContent initialProvince={provinceName} initialDistrict={districtName} />;
}
