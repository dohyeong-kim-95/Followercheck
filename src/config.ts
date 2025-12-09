export interface SNSAccount {
  platform: string;
  url: string;
  label?: string;
}

export interface Group {
  name: string;
  accounts: SNSAccount[];
}

export const groups: Group[] = [
  {
    name: 'BOYNEXTDOOR',
    accounts: [
      { platform: 'youtube', url: 'https://www.youtube.com/@boynextdoor_official' },
      { platform: 'instagram', url: 'https://www.instagram.com/BOYNEXTDOOR_official' },
      { platform: 'tiktok', url: 'https://www.tiktok.com/@boynextdoor_official' },
      { platform: 'twitter', url: 'https://twitter.com/BOYNEXTDOOR_KOZ', label: '공식' },
      { platform: 'twitter', url: 'https://twitter.com/BOYNEXTDOOR_twt', label: '멤버' },
      { platform: 'twitter', url: 'https://twitter.com/BOYNEXTDOOR_JP', label: '일본' },
      { platform: 'facebook', url: 'https://www.facebook.com/BOYNEXTDOOR.official' },
      { platform: 'weibo', url: 'https://weibo.com/BOYNEXTDOORKOZ' },
      { platform: 'douyin', url: 'https://www.douyin.com/user/MS4wLjABAAAA0CSLB34RAtfO29TaIrHvjI8y6NaKP73__PDqtqWdsZ4j6pbLUbqPZ_4128EMqGO-' },
      { platform: 'weverse', url: 'https://weverse.io/boynextdoor/feed' }
    ]
  },
  {
    name: 'RIIZE',
    accounts: [
      { platform: 'youtube', url: 'https://www.youtube.com/@RIIZE_official' },
      { platform: 'instagram', url: 'https://www.instagram.com/riize_official/' },
      { platform: 'instagram', url: 'https://www.instagram.com/riize_jpn/', label: '일본' },
      { platform: 'tiktok', url: 'https://www.tiktok.com/@riize_official' },
      { platform: 'tiktok', url: 'https://www.tiktok.com/@riize_jpn', label: '일본' },
      { platform: 'twitter', url: 'https://twitter.com/riize_official', label: '공식' },
      { platform: 'twitter', url: 'https://twitter.com/RIIZE_JPN', label: '일본' },
      { platform: 'facebook', url: 'https://www.facebook.com/RIIZE.official' },
      { platform: 'weibo', url: 'https://weibo.com/riize/' },
      { platform: 'douyin', url: 'https://www.douyin.com/user/MS4wLjABAAAAZwPGEvhkml15SSsUnWWpb8IlOJMCJjK5s9V7ob0kNi1_CAuN81FzIp-v7J4XPfco' },
      { platform: 'weverse', url: 'https://weverse.io/riize/feed' }
    ]
  },
  {
    name: 'ZB1',
    accounts: [
      { platform: 'youtube', url: 'https://www.youtube.com/@ZB1_official' },
      { platform: 'instagram', url: 'https://www.instagram.com/zb1official' },
      { platform: 'tiktok', url: 'https://www.tiktok.com/@zb1_official' },
      { platform: 'twitter', url: 'https://twitter.com/ZB1_official', label: '공식' },
      { platform: 'twitter', url: 'https://twitter.com/zb1_jp', label: '일본' },
      { platform: 'weibo', url: 'https://weibo.com/zerobaseone' },
      { platform: 'douyin', url: 'https://www.douyin.com/user/MS4wLjABAAAAHOmZPy4pYElbVhbilSL4dMs4vfD4nF4E1wMrFdfLE8TgVF0Ivwkj-vVUBRyP4AJM' },
      { platform: 'bilibili', url: 'https://space.bilibili.com/1414351987/' },
      { platform: 'mnetplus', url: 'https://www.mnetplus.world/c/zerobaseone' }
    ]
  },
  {
    name: 'TWS',
    accounts: [
      { platform: 'youtube', url: 'https://www.youtube.com/@TWS_PLEDIS' },
      { platform: 'instagram', url: 'https://www.instagram.com/tws_pledis/' },
      { platform: 'tiktok', url: 'https://www.tiktok.com/@tws_pledis' },
      { platform: 'twitter', url: 'https://twitter.com/TWS_PLEDIS', label: '공식' },
      { platform: 'facebook', url: 'https://www.facebook.com/TWS.PLEDIS' },
      { platform: 'weibo', url: 'https://www.weibo.com/u/7891649784' },
      { platform: 'douyin', url: 'https://www.douyin.com/user/MS4wLjABAAAA0R0PZzok8dcLly40vvOonaIVRxholhSIzX0Q7sfUIca4IKuorF0Pi1IawfWa7dZ6' },
      { platform: 'bilibili', url: 'https://space.bilibili.com/3546595603777730' },
      { platform: 'weverse', url: 'https://weverse.io/tws/feed' }
    ]
  }
];

export const config = {
  googleSheetId: process.env.GOOGLE_SHEET_ID || '',
  scheduleTime: '0 8 * * *', // Daily at 8:00 AM KST
  timezone: 'Asia/Seoul'
};
