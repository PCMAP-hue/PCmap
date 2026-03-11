export interface Store {
  id: string;
  name: string;
  address: string;
  province: string;
  district: string;
  badges: string[];
  naverUrl: string;
  isPremium?: boolean;
  thumbnailUrl?: string;
  click_count?: number;
}
