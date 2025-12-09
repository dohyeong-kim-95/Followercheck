import axios from 'axios';
import { ScraperResult } from '../types';
import { parseFollowerCount, delay } from '../utils/helpers';

export async function scrapeWeibo(url: string): Promise<ScraperResult> {
  try {
    await delay(1000); // Rate limiting

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'zh-CN,zh;q=0.9'
      }
    });

    const html = response.data;

    // Weibo follower count patterns
    const followerMatch = html.match(/"followers_count[\"']?\s*:\s*(\d+)/) ||
                          html.match(/"follow_count[\"']?\s*:\s*(\d+)/);

    if (followerMatch) {
      const followerCount = parseInt(followerMatch[1], 10);
      return { success: true, followerCount };
    }

    return { success: false, error: 'Could not find follower count' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
