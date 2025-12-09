# SNS Follower Tracker

K-pop 그룹의 SNS 계정 팔로워 수를 매일 자동으로 수집하여 구글 시트에 업데이트하는 시스템입니다.

## 주요 기능

- **자동 수집**: 매일 오전 8시 (KST) 기준으로 자동 수집
- **다양한 플랫폼 지원**:
  - YouTube
  - Instagram
  - TikTok
  - X (Twitter)
  - Facebook
  - Weibo
  - Douyin
  - Bilibili
  - Weverse
  - Mnet Plus
- **구글 시트 연동**: 수집된 데이터를 자동으로 구글 시트에 저장
- **일별 데이터**: 날짜별로 시트를 생성하여 히스토리 관리
- **요약 시트**: 최신 팔로워 수를 한눈에 볼 수 있는 요약 시트 제공

## 추적 중인 그룹

1. **BOYNEXTDOOR** - 10개 계정
2. **RIIZE** - 11개 계정
3. **ZB1 (ZEROBASEONE)** - 9개 계정
4. **TWS** - 9개 계정

총 39개의 SNS 계정을 추적합니다.

## 설치 방법

### 1. 필수 요구사항

- Node.js 18.x 이상
- npm 또는 yarn
- Google Cloud 프로젝트 및 Service Account

### 2. 프로젝트 클론 및 설치

```bash
git clone <repository-url>
cd Followercheck
npm install
```

### 3. Google Sheets API 설정

#### 3.1 Google Cloud Console에서 프로젝트 생성

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성
3. "APIs & Services" > "Enable APIs and Services"로 이동
4. "Google Sheets API" 검색 후 활성화

#### 3.2 Service Account 생성

1. "APIs & Services" > "Credentials"로 이동
2. "Create Credentials" > "Service Account" 선택
3. Service Account 이름 입력 후 생성
4. Service Account 생성 후 "Keys" 탭으로 이동
5. "Add Key" > "Create new key" > "JSON" 선택
6. 다운로드한 JSON 파일을 프로젝트 루트에 `credentials.json`으로 저장

#### 3.3 Google Sheets 생성 및 공유

1. 새 Google Sheets 문서 생성
2. 문서 URL에서 Spreadsheet ID 복사
   - URL 형식: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`
3. Service Account 이메일 주소와 시트 공유 (편집자 권한)
   - Service Account 이메일은 `credentials.json` 파일에서 확인 가능

### 4. 환경 변수 설정

`.env.example`을 `.env`로 복사하고 설정:

```bash
cp .env.example .env
```

`.env` 파일 수정:

```env
GOOGLE_SHEET_ID=your_actual_spreadsheet_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email@project.iam.gserviceaccount.com
```

### 5. TypeScript 컴파일

```bash
npm run build
```

## 사용 방법

### 즉시 실행 (테스트용)

```bash
npm run collect
```

또는 개발 모드:

```bash
npm run dev
```

### 스케줄러 실행 (프로덕션)

매일 오전 8시에 자동으로 실행되도록 설정:

```bash
npm start
```

또는 컴파일된 코드 직접 실행:

```bash
node dist/index.js
```

### PM2로 백그라운드 실행 (권장)

```bash
# PM2 설치 (global)
npm install -g pm2

# 앱 시작
pm2 start dist/index.js --name sns-follower-tracker

# 로그 확인
pm2 logs sns-follower-tracker

# 앱 상태 확인
pm2 status

# 앱 중지
pm2 stop sns-follower-tracker

# 앱 재시작
pm2 restart sns-follower-tracker
```

## 프로젝트 구조

```
Followercheck/
├── src/
│   ├── scrapers/          # 각 플랫폼별 스크래퍼
│   │   ├── youtube.ts
│   │   ├── instagram.ts
│   │   ├── tiktok.ts
│   │   ├── twitter.ts
│   │   ├── facebook.ts
│   │   ├── weibo.ts
│   │   ├── douyin.ts
│   │   ├── bilibili.ts
│   │   ├── weverse.ts
│   │   ├── mnetplus.ts
│   │   └── index.ts
│   ├── utils/             # 유틸리티 함수
│   │   └── helpers.ts
│   ├── config.ts          # 그룹 및 계정 설정
│   ├── types.ts           # TypeScript 타입 정의
│   ├── sheets.ts          # Google Sheets API 연동
│   ├── collect.ts         # 데이터 수집 로직
│   └── index.ts           # 메인 스케줄러
├── dist/                  # 컴파일된 JavaScript 파일
├── credentials.json       # Google Service Account 인증 정보
├── .env                   # 환경 변수
├── package.json
├── tsconfig.json
└── README.md
```

## Google Sheets 데이터 구조

### Summary 시트 (요약)

| Group | Platform | Label | Follower Count | Last Updated |
|-------|----------|-------|----------------|--------------|
| BOYNEXTDOOR | youtube | | 1,234,567 | 2024-01-15T08:00:00Z |
| ... | ... | ... | ... | ... |

### Data_YYYY_MM_DD 시트 (일별 데이터)

| Date | Group | Platform | Label | Follower Count | Timestamp |
|------|-------|----------|-------|----------------|-----------|
| 2024-01-15 | BOYNEXTDOOR | youtube | | 1,234,567 | 2024-01-15T08:00:00Z |
| ... | ... | ... | ... | ... | ... |

## 주의사항

### 웹 스크래핑 제한사항

1. **Rate Limiting**: 각 플랫폼은 과도한 요청을 차단할 수 있습니다. 현재 각 요청 사이에 1초의 지연을 두고 있습니다.

2. **플랫폼별 제한**:
   - **Instagram**: 로그인 없이는 제한적인 정보만 접근 가능
   - **Weverse**: 인증이 필요하여 현재 구현은 플레이스홀더
   - **Mnet Plus**: 특정 API 구현 필요

3. **HTML 구조 변경**: 플랫폼들이 HTML 구조를 변경하면 스크래퍼 업데이트가 필요할 수 있습니다.

### 권장 사항

- 프로덕션 환경에서는 Puppeteer를 사용한 브라우저 자동화 고려
- 각 플랫폼의 공식 API 사용 권장 (가능한 경우)
- 정기적으로 로그 확인하여 에러 모니터링

## 문제 해결

### 스크래핑 실패

특정 플랫폼에서 데이터를 가져오지 못하는 경우:

1. 해당 플랫폼의 웹사이트가 정상적으로 접근 가능한지 확인
2. 스크래퍼 코드의 HTML 파싱 로직 업데이트 필요 여부 확인
3. 로그를 확인하여 구체적인 에러 메시지 확인

### Google Sheets 연동 실패

1. `credentials.json` 파일이 올바른 위치에 있는지 확인
2. Service Account에 시트 편집 권한이 있는지 확인
3. `.env` 파일의 `GOOGLE_SHEET_ID`가 정확한지 확인

## 향후 개선 사항

- [ ] Puppeteer를 사용한 더 안정적인 스크래핑
- [ ] 공식 API 사용 (YouTube Data API 등)
- [ ] 에러 알림 시스템 (이메일, Slack 등)
- [ ] 데이터 시각화 대시보드
- [ ] 증감률 계산 및 알림
- [ ] 더 많은 플랫폼 추가

## 라이선스

MIT

## 기여

이슈 및 풀 리퀘스트는 언제나 환영합니다!
