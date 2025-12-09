import * as dotenv from 'dotenv';
import * as cron from 'node-cron';
import { config } from './config';
import { collectFollowerData, saveToGoogleSheets } from './collect';

dotenv.config();

async function runCollection() {
  console.log('\n=================================');
  console.log(`Collection started at ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })} KST`);
  console.log('=================================\n');

  try {
    const data = await collectFollowerData();
    console.log(`\nCollected data for ${data.length} accounts`);

    await saveToGoogleSheets(data);

    console.log('\n=================================');
    console.log('Collection completed successfully!');
    console.log('=================================\n');
  } catch (error: any) {
    console.error('\n=================================');
    console.error('Error during collection:', error.message);
    console.error('=================================\n');
  }
}

function startScheduler() {
  console.log('SNS Follower Tracker Started');
  console.log('============================');
  console.log(`Schedule: Daily at 8:00 AM KST`);
  console.log(`Timezone: ${config.timezone}`);
  console.log(`Google Sheet ID: ${config.googleSheetId || 'NOT CONFIGURED'}`);
  console.log('============================\n');

  if (!config.googleSheetId) {
    console.error('WARNING: GOOGLE_SHEET_ID is not configured in .env file');
    console.error('Please configure it before running the scheduler\n');
  }

  // Schedule for 8:00 AM KST (23:00 UTC the previous day, if KST = UTC+9)
  // Note: node-cron uses system timezone, so we need to adjust
  // For 8 AM KST, if server is in UTC, it's 11 PM (23:00) previous day
  cron.schedule(
    config.scheduleTime,
    () => {
      runCollection();
    },
    {
      scheduled: true,
      timezone: config.timezone
    }
  );

  console.log('Scheduler is running. Waiting for scheduled time...');
  console.log('Press Ctrl+C to stop.\n');

  // Run immediately on startup (optional, comment out if not needed)
  console.log('Running initial collection...\n');
  runCollection();
}

// Start the scheduler
startScheduler();
