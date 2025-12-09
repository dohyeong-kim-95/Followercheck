import { ScraperResult } from '../types';
import { scrapeYouTube } from './youtube';
import { scrapeInstagram } from './instagram';
import { scrapeTikTok } from './tiktok';
import { scrapeTwitter } from './twitter';
import { scrapeFacebook } from './facebook';
import { scrapeWeibo } from './weibo';
import { scrapeDouyin } from './douyin';
import { scrapeBilibili } from './bilibili';
import { scrapeWeverse } from './weverse';
import { scrapeMnetPlus } from './mnetplus';

export async function scrapeFollowerCount(platform: string, url: string): Promise<ScraperResult> {
  const normalizedPlatform = platform.toLowerCase();

  switch (normalizedPlatform) {
    case 'youtube':
      return scrapeYouTube(url);
    case 'instagram':
      return scrapeInstagram(url);
    case 'tiktok':
      return scrapeTikTok(url);
    case 'twitter':
    case 'x':
      return scrapeTwitter(url);
    case 'facebook':
      return scrapeFacebook(url);
    case 'weibo':
      return scrapeWeibo(url);
    case 'douyin':
      return scrapeDouyin(url);
    case 'bilibili':
      return scrapeBilibili(url);
    case 'weverse':
      return scrapeWeverse(url);
    case 'mnetplus':
      return scrapeMnetPlus(url);
    default:
      return { success: false, error: `Unknown platform: ${platform}` };
  }
}

export { scrapeYouTube, scrapeInstagram, scrapeTikTok, scrapeTwitter, scrapeFacebook };
