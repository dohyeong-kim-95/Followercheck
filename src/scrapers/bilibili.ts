import axios from 'axios';
import { ScraperResult } from '../types';
import { parseFollowerCount, delay } from '../utils/helpers';

export async function scrapeBilibili(url: string): Promise<ScraperResult> {
  try {
    await delay(1000); // Rate limiting

    // Extract UID from URL
    const uidMatch = url.match(/space\.bilibili\.com\/(\d+)/);
    if (!uidMatch) {
      return { success: false, error: 'Invalid Bilibili URL' };
    }

    const uid = uidMatch[1];

    // Use Bilibili's API
    const apiUrl = `https://api.bilibili.com/x/relation/stat?vmid=${uid}`;
    const response = await axios.get(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://space.bilibili.com/'
      }
    });

    if (response.data && response.data.data && response.data.data.follower !== undefined) {
      const followerCount = response.data.data.follower;
      return { success: true, followerCount };
    }

    return { success: false, error: 'Could not find follower count' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
