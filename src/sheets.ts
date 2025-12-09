import { google } from 'googleapis';
import { FollowerData } from './types';
import { formatDate, formatDateTime } from './utils/helpers';
import * as fs from 'fs';
import * as path from 'path';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

export class GoogleSheetsManager {
  private sheets: any;
  private spreadsheetId: string;

  constructor(spreadsheetId: string) {
    this.spreadsheetId = spreadsheetId;
  }

  async initialize() {
    try {
      // Load credentials from credentials.json file
      const credentialsPath = path.join(process.cwd(), 'credentials.json');

      if (!fs.existsSync(credentialsPath)) {
        throw new Error('credentials.json not found. Please add your Google Service Account credentials.');
      }

      const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));

      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: SCOPES,
      });

      const authClient = await auth.getClient();
      this.sheets = google.sheets({ version: 'v4', auth: authClient });

      console.log('Google Sheets API initialized successfully');
    } catch (error: any) {
      console.error('Error initializing Google Sheets:', error.message);
      throw error;
    }
  }

  async ensureSheetExists(sheetName: string) {
    try {
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
      });

      const sheet = response.data.sheets?.find(
        (s: any) => s.properties.title === sheetName
      );

      if (!sheet) {
        // Create the sheet
        await this.sheets.spreadsheets.batchUpdate({
          spreadsheetId: this.spreadsheetId,
          requestBody: {
            requests: [{
              addSheet: {
                properties: {
                  title: sheetName,
                },
              },
            }],
          },
        });

        // Add headers
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: this.spreadsheetId,
          range: `${sheetName}!A1:F1`,
          valueInputOption: 'RAW',
          requestBody: {
            values: [['Date', 'Group', 'Platform', 'Label', 'Follower Count', 'Timestamp']],
          },
        });

        console.log(`Created sheet: ${sheetName}`);
      }
    } catch (error: any) {
      console.error(`Error ensuring sheet exists:`, error.message);
      throw error;
    }
  }

  async appendData(followerDataList: FollowerData[]) {
    try {
      const today = formatDate(new Date());
      const sheetName = `Data_${today.replace(/-/g, '_')}`;

      await this.ensureSheetExists(sheetName);

      const rows = followerDataList.map(data => [
        formatDate(data.timestamp),
        data.group,
        data.platform,
        data.label || '',
        data.error ? `ERROR: ${data.error}` : data.followerCount,
        formatDateTime(data.timestamp)
      ]);

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A:F`,
        valueInputOption: 'RAW',
        requestBody: {
          values: rows,
        },
      });

      console.log(`Appended ${rows.length} rows to ${sheetName}`);
    } catch (error: any) {
      console.error('Error appending data:', error.message);
      throw error;
    }
  }

  async updateSummarySheet(followerDataList: FollowerData[]) {
    try {
      const sheetName = 'Summary';
      await this.ensureSheetExists(sheetName);

      // Create a summary with latest follower counts
      const headers = ['Group', 'Platform', 'Label', 'Follower Count', 'Last Updated'];
      const rows = [headers];

      followerDataList.forEach(data => {
        rows.push([
          data.group,
          data.platform,
          data.label || '',
          data.error ? `ERROR: ${data.error}` : data.followerCount.toString(),
          formatDateTime(data.timestamp)
        ]);
      });

      // Clear and update the summary sheet
      await this.sheets.spreadsheets.values.clear({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A:E`,
      });

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: rows,
        },
      });

      console.log(`Updated summary sheet`);
    } catch (error: any) {
      console.error('Error updating summary sheet:', error.message);
      throw error;
    }
  }
}
