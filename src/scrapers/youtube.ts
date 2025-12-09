import axios from 'axios';
import * as cheerio from 'cheerio';
import { ScraperResult } from '../types';
import { parseFollowerCount, delay } from '../utils/helpers';

export async function scrapeYouTube(url: string): Promise<ScraperResult> {
  try {
    await delay(1000); // Rate limiting

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const html = response.data;

    // Try to find subscriber count in the page source
    // YouTube embeds this data in JSON-LD or initial data
    const subscriberMatch = html.match(/"subscriberCountText":\s*{\s*"accessibility":\s*{\s*"accessibilityData":\s*{\s*"label":\s*"([^"]+)"/);

    if (subscriberMatch) {
      const subscriberText = subscriberMatch[1];
      const followerCount = parseFollowerCount(subscriberText);
      return { success: true, followerCount };
    }

    // Alternative: Look for simpleText
    const simpleMatch = html.match(/"subscriberCountText":\s*{\s*"simpleText":\s*"([^"]+)"/);
    if (simpleMatch) {
      const subscriberText = simpleMatch[1];
      const followerCount = parseFollowerCount(subscriberText);
      return { success: true, followerCount };
    }

    return { success: false, error: 'Could not find subscriber count' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
