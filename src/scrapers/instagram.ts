import axios from 'axios';
import { ScraperResult } from '../types';
import { parseFollowerCount, delay } from '../utils/helpers';

export async function scrapeInstagram(url: string): Promise<ScraperResult> {
  try {
    await delay(1000); // Rate limiting

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const html = response.data;

    // Instagram embeds data in meta tags and script tags
    // Look for follower count in the page source
    const followerMatch = html.match(/"edge_followed_by":\s*{\s*"count":\s*(\d+)/);

    if (followerMatch) {
      const followerCount = parseInt(followerMatch[1], 10);
      return { success: true, followerCount };
    }

    return { success: false, error: 'Could not find follower count' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
