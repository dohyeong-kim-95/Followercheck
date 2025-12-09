import * as dotenv from 'dotenv';
import { groups, config } from './config';
import { FollowerData } from './types';
import { scrapeFollowerCount } from './scrapers';
import { GoogleSheetsManager } from './sheets';

dotenv.config();

export async function collectFollowerData(): Promise<FollowerData[]> {
  const results: FollowerData[] = [];

  console.log('Starting follower data collection...');
  console.log(`Total groups: ${groups.length}`);

  for (const group of groups) {
    console.log(`\nProcessing group: ${group.name}`);

    for (const account of group.accounts) {
      console.log(`  Scraping ${account.platform}${account.label ? ` (${account.label})` : ''}...`);

      try {
        const result = await scrapeFollowerCount(account.platform, account.url);

        const data: FollowerData = {
          group: group.name,
          platform: account.platform,
          label: account.label,
          url: account.url,
          followerCount: result.followerCount || 0,
          timestamp: new Date(),
          error: result.success ? undefined : result.error
        };

        results.push(data);

        if (result.success) {
          console.log(`    ✓ Follower count: ${result.followerCount?.toLocaleString()}`);
        } else {
          console.log(`    ✗ Error: ${result.error}`);
        }
      } catch (error: any) {
        console.error(`    ✗ Exception: ${error.message}`);
        results.push({
          group: group.name,
          platform: account.platform,
          label: account.label,
          url: account.url,
          followerCount: 0,
          timestamp: new Date(),
          error: error.message
        });
      }
    }
  }

  return results;
}

export async function saveToGoogleSheets(data: FollowerData[]) {
  const sheetId = config.googleSheetId;

  if (!sheetId) {
    console.error('GOOGLE_SHEET_ID not configured in .env file');
    return;
  }

  console.log('\nSaving to Google Sheets...');

  const sheetsManager = new GoogleSheetsManager(sheetId);
  await sheetsManager.initialize();
  await sheetsManager.appendData(data);
  await sheetsManager.updateSummarySheet(data);

  console.log('Data saved successfully!');
}

// Main execution when run directly
if (require.main === module) {
  (async () => {
    try {
      const data = await collectFollowerData();
      console.log(`\nCollected data for ${data.length} accounts`);

      await saveToGoogleSheets(data);

      console.log('\nCollection complete!');
    } catch (error: any) {
      console.error('Error during collection:', error);
      process.exit(1);
    }
  })();
}
