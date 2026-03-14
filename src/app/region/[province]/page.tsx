import { Metadata } from "next";
import { getRegionFromSlug } from "@/lib/regionData";
import RegionContent from "@/components/RegionContent";

export async function generateMetadata({ params }: { params: Promise<{ province: string }> }): Promise<Metadata> {
  const { province } = await params;
  const provinceName = getRegionFromSlug(province, true);
  
  return {
    title: `${provinceName} 컴퓨터 수리 | 진짜 우리 동네 수리점 PC맵`,
    description: `${provinceName} 지역의 검증된 오프라인 컴퓨터 수리점을 확인하세요. 허위 출장 없는 투명한 서비스를 제공합니다.`,
    openGraph: {
      title: `${provinceName} 컴퓨터 수리 | 진짜 우리 동네 수리점 PC맵`,
      description: `${provinceName} 지역의 검증된 오프라인 컴퓨터 수리점을 확인하세요.`,
    }
  };
}

export default async function ProvincePage({ params }: { params: Promise<{ province: string }> }) {
  const { province } = await params;
  const provinceName = getRegionFromSlug(province, true);

  return <RegionContent initialProvince={provinceName} />;
}
