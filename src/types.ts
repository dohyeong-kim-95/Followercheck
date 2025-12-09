export interface FollowerData {
  group: string;
  platform: string;
  label?: string;
  url: string;
  followerCount: number;
  timestamp: Date;
  error?: string;
}

export interface ScraperResult {
  success: boolean;
  followerCount?: number;
  error?: string;
}
