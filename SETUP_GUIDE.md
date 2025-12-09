# 설치 및 설정 가이드

이 가이드는 SNS Follower Tracker를 처음 설정하는 분들을 위한 단계별 안내입니다.

## 1단계: 시스템 요구사항 확인

다음 소프트웨어가 설치되어 있어야 합니다:

- **Node.js**: 버전 18.x 이상
  - 설치 확인: `node --version`
  - 다운로드: https://nodejs.org/

- **npm**: Node.js와 함께 설치됨
  - 설치 확인: `npm --version`

## 2단계: 프로젝트 다운로드 및 패키지 설치

```bash
# 프로젝트 디렉토리로 이동
cd Followercheck

# 필요한 패키지 설치
npm install
```

설치가 완료되면 `node_modules` 폴더가 생성됩니다.

## 3단계: Google Cloud 프로젝트 설정

### 3-1. Google Cloud Console 접속

1. https://console.cloud.google.com/ 접속
2. Google 계정으로 로그인

### 3-2. 새 프로젝트 생성

1. 상단의 프로젝트 선택 드롭다운 클릭
2. "새 프로젝트" 클릭
3. 프로젝트 이름 입력 (예: "SNS-Follower-Tracker")
4. "만들기" 클릭

### 3-3. Google Sheets API 활성화

1. 왼쪽 메뉴 > "APIs & Services" > "라이브러리" 클릭
2. "Google Sheets API" 검색
3. "Google Sheets API" 클릭 후 "사용 설정" 클릭

### 3-4. Service Account 생성

1. 왼쪽 메뉴 > "APIs & Services" > "사용자 인증 정보" 클릭
2. 상단의 "+ 사용자 인증 정보 만들기" > "서비스 계정" 선택
3. 서비스 계정 세부정보 입력:
   - 이름: `sns-tracker-service`
   - ID: 자동 생성됨
   - 설명: "SNS follower data collection service"
4. "만들기 및 계속하기" 클릭
5. 역할 선택: "편집자" 또는 "기본" > "편집자" (선택 사항)
6. "계속" 클릭
7. "완료" 클릭

### 3-5. 서비스 계정 키 생성

1. 방금 생성한 서비스 계정 클릭
2. "키" 탭 클릭
3. "키 추가" > "새 키 만들기" 클릭
4. 키 유형: "JSON" 선택
5. "만들기" 클릭
6. JSON 파일이 자동으로 다운로드됨

### 3-6. 인증 파일 설정

1. 다운로드한 JSON 파일을 프로젝트 루트 디렉토리로 복사
2. 파일 이름을 `credentials.json`으로 변경

```bash
# 예시
mv ~/Downloads/sns-tracker-service-xxxxx.json ./credentials.json
```

## 4단계: Google Sheets 설정

### 4-1. 새 스프레드시트 생성

1. https://sheets.google.com/ 접속
2. "빈 스프레드시트" 클릭하여 새 시트 생성
3. 시트 이름을 "SNS Follower Data"로 변경 (선택 사항)

### 4-2. Spreadsheet ID 확인

URL에서 ID를 복사합니다:
```
https://docs.google.com/spreadsheets/d/1AbC2DeF3GhI4JkL5MnO6PqR7StU8VwX9YzA/edit
                                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                      이 부분이 Spreadsheet ID입니다
```

### 4-3. Service Account와 공유

1. 스프레드시트 우측 상단의 "공유" 버튼 클릭
2. `credentials.json` 파일을 열어서 `client_email` 값 복사
   - 형식: `xxx@xxx.iam.gserviceaccount.com`
3. 복사한 이메일을 공유 대상에 입력
4. 권한: "편집자" 선택
5. "전송" 클릭

**중요**: 알림 보내기 체크 해제 (Service Account는 이메일을 받을 수 없음)

## 5단계: 환경 변수 설정

### 5-1. .env 파일 생성

```bash
cp .env.example .env
```

### 5-2. .env 파일 수정

텍스트 에디터로 `.env` 파일을 열고 다음 내용을 입력:

```env
GOOGLE_SHEET_ID=여기에_복사한_Spreadsheet_ID_입력
GOOGLE_SERVICE_ACCOUNT_EMAIL=xxx@xxx.iam.gserviceaccount.com
```

예시:
```env
GOOGLE_SHEET_ID=1AbC2DeF3GhI4JkL5MnO6PqR7StU8VwX9YzA
GOOGLE_SERVICE_ACCOUNT_EMAIL=sns-tracker-service@project-12345.iam.gserviceaccount.com
```

## 6단계: 프로젝트 빌드

TypeScript 코드를 JavaScript로 컴파일:

```bash
npm run build
```

성공하면 `dist` 폴더가 생성됩니다.

## 7단계: 테스트 실행

### 7-1. 즉시 실행 테스트

```bash
npm run collect
```

이 명령어는 즉시 데이터 수집을 시작합니다. 다음과 같은 출력이 표시됩니다:

```
Starting follower data collection...
Total groups: 4

Processing group: BOYNEXTDOOR
  Scraping youtube...
    ✓ Follower count: 1,234,567
  Scraping instagram...
    ✓ Follower count: 987,654
  ...

Collected data for 39 accounts

Saving to Google Sheets...
Google Sheets API initialized successfully
Appended 39 rows to Data_2024_01_15
Updated summary sheet
Data saved successfully!

Collection complete!
```

### 7-2. Google Sheets 확인

1. Google Sheets로 돌아가기
2. 새로운 시트 탭 확인:
   - `Summary`: 최신 데이터 요약
   - `Data_YYYY_MM_DD`: 오늘 날짜의 상세 데이터

## 8단계: 스케줄러 실행

### 옵션 A: 직접 실행 (테스트용)

```bash
npm start
```

이 방법은 터미널을 닫으면 프로그램도 종료됩니다.

### 옵션 B: PM2 사용 (프로덕션 권장)

PM2는 Node.js 프로세스 관리자로, 백그라운드에서 안정적으로 실행됩니다.

```bash
# PM2 설치
npm install -g pm2

# 앱 시작
pm2 start dist/index.js --name sns-follower-tracker

# 시스템 재부팅 후에도 자동 시작 설정
pm2 startup
pm2 save

# 로그 확인
pm2 logs sns-follower-tracker

# 상태 확인
pm2 status
```

## 9단계: 모니터링

### 로그 확인

PM2 사용 시:
```bash
pm2 logs sns-follower-tracker
```

직접 실행 시: 터미널 출력 확인

### 예상 스케줄

- 매일 오전 8시 (KST)에 자동 실행
- 첫 실행 시 즉시 한 번 실행됨 (테스트용)

## 문제 해결

### credentials.json 파일을 찾을 수 없음

```
Error: credentials.json not found
```

**해결책**: `credentials.json` 파일이 프로젝트 루트 디렉토리에 있는지 확인

### Google Sheets 권한 오류

```
Error: The caller does not have permission
```

**해결책**:
1. Service Account 이메일이 스프레드시트에 공유되었는지 확인
2. 편집자 권한이 부여되었는지 확인

### 스크래핑 실패

```
✗ Error: Could not find follower count
```

**원인**: 해당 플랫폼의 HTML 구조가 변경되었거나, 네트워크 문제

**해결책**:
1. 인터넷 연결 확인
2. 해당 SNS 사이트가 정상 접근 가능한지 확인
3. 일시적인 문제일 수 있으므로 다음 스케줄 실행 대기

### GOOGLE_SHEET_ID가 설정되지 않음

```
WARNING: GOOGLE_SHEET_ID is not configured
```

**해결책**: `.env` 파일의 `GOOGLE_SHEET_ID` 값 확인

## 추가 도움말

### 새로운 그룹 추가

`src/config.ts` 파일을 수정하여 새로운 그룹과 계정을 추가할 수 있습니다.

### 수집 시간 변경

`src/config.ts` 파일의 `scheduleTime` 값을 수정:

```typescript
export const config = {
  scheduleTime: '0 8 * * *',  // 매일 8시
  // 다른 예시:
  // '0 9 * * *' - 매일 9시
  // '0 8,20 * * *' - 매일 8시와 20시 (하루 2번)
  // '0 8 * * 1' - 매주 월요일 8시
};
```

## 완료!

이제 시스템이 매일 자동으로 SNS 팔로워 데이터를 수집하여 Google Sheets에 저장합니다.

정기적으로 다음을 확인하세요:
- Google Sheets에 데이터가 잘 쌓이는지
- PM2 로그에 에러가 없는지
- 각 플랫폼의 스크래핑이 정상 작동하는지
