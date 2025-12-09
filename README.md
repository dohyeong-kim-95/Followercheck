# 🎵 K-POP SNS 팔로워 트래커

> BOYNEXTDOOR, RIIZE, ZB1, TWS의 주요 SNS 팔로워 수를 자동으로 수집하고 시각화하는 웹 애플리케이션

## 📌 프로젝트 개요

이 프로젝트는 K-POP 그룹들의 SNS 팔로워 수를 자동으로 수집하여 한눈에 확인할 수 있는 웹 대시보드입니다.

### 주요 기능

✅ **4개 그룹 × 4개 플랫폼 = 16개 계정 추적**
- 그룹: BOYNEXTDOOR, RIIZE, ZB1, TWS
- 플랫폼: YouTube, Instagram, TikTok, X (Twitter)

✅ **완전 자동화**
- GitHub Actions를 통한 자동 데이터 수집
- 매일 오전 8시 KST 자동 실행 (설정 가능)
- 수동 실행도 클릭 한 번으로 가능

✅ **무료 호스팅**
- GitHub Pages를 통한 완전 무료 배포
- 별도 서버 불필요

✅ **사용자 친화적**
- 깔끔한 웹 인터페이스
- CSV 다운로드 기능
- 모바일 반응형 디자인

---

## 🚀 빠른 시작

### 1️⃣ 저장소 포크 또는 복제

```bash
git clone https://github.com/dohyeong-kim-95/Followercheck.git
cd Followercheck
```

### 2️⃣ GitHub Pages 활성화

1. GitHub 저장소 페이지에서 **Settings** 클릭
2. 좌측 메뉴에서 **Pages** 클릭
3. **Source** 섹션에서:
   - Branch: `main` (또는 현재 브랜치) 선택
   - Folder: `/docs` 선택
4. **Save** 클릭

약 1-2분 후, GitHub Pages URL이 생성됩니다:
```
https://YOUR_USERNAME.github.io/Followercheck
```

### 3️⃣ 데이터 수집 시작

#### 방법 1: 웹 페이지에서 (권장)
1. GitHub Pages URL 접속
2. **"수집 시작 (GitHub Actions)"** 버튼 클릭
3. GitHub Actions 페이지에서 **"Run workflow"** 버튼 클릭
4. 약 2-3분 후 완료

#### 방법 2: GitHub에서 직접
1. 저장소의 **Actions** 탭 클릭
2. 좌측에서 **"Scrape SNS Followers"** 워크플로우 선택
3. **"Run workflow"** 드롭다운 클릭
4. **"Run workflow"** 버튼 클릭

---

## 📖 사용 방법

### 웹 대시보드 기능

#### 🔄 최신 데이터 불러오기
- 페이지를 새로고침하거나 버튼 클릭으로 최신 데이터 표시

#### 📥 CSV 다운로드
- 현재 표시된 데이터를 CSV 파일로 다운로드
- Excel에서 바로 열기 가능

#### ▶️ 수집 시작
- GitHub Actions로 이동하여 새로운 데이터 수집 시작

### 자동 스케줄링

기본 설정은 **매일 오전 8시 KST**에 자동 실행됩니다.

스케줄을 변경하려면 `.github/workflows/scrape.yml` 파일을 수정하세요:

```yaml
schedule:
  - cron: '0 23 * * *'  # 매일 오전 8시 KST (23:00 UTC)
```

cron 표현식 예시:
- `0 23 * * *` - 매일 오전 8시 KST
- `0 */6 * * *` - 6시간마다
- `0 0 * * 0` - 매주 일요일 오전 9시 KST

> **참고**: GitHub Actions는 UTC 기준이므로 KST -9시간 필요

---

## 🛠️ 프로젝트 구조

```
Followercheck/
│
├── .github/
│   └── workflows/
│       └── scrape.yml              # GitHub Actions 워크플로우
│
├── scraper/                        # Python 스크래퍼
│   ├── main.py                     # 메인 스크립트
│   ├── config.py                   # 계정 설정
│   ├── requirements.txt            # Python 의존성
│   └── platforms/                  # 플랫폼별 스크래퍼
│       ├── youtube.py
│       ├── instagram.py
│       ├── tiktok.py
│       └── twitter.py
│
├── docs/                           # GitHub Pages (웹 사이트)
│   ├── index.html                  # 메인 페이지
│   ├── style.css                   # 스타일시트
│   ├── app.js                      # JavaScript 로직
│   └── data.json                   # 수집된 데이터 (자동 생성)
│
└── README.md                       # 이 파일
```

---

## ⚙️ 커스터마이징

### 다른 그룹 추가하기

`scraper/config.py` 파일을 수정하세요:

```python
ACCOUNTS = {
    "YOUR_GROUP_NAME": {
        "youtube": "https://www.youtube.com/@channel_name",
        "instagram": "https://www.instagram.com/account_name",
        "tiktok": "https://www.tiktok.com/@account_name",
        "twitter": "https://twitter.com/account_name"
    },
    # 기존 그룹들...
}
```

그리고 `docs/app.js`의 `groups` 배열도 업데이트하세요:

```javascript
const groups = ['YOUR_GROUP_NAME', 'BOYNEXTDOOR', 'RIIZE', 'ZB1', 'TWS'];
```

### 플랫폼 추가/제거

특정 플랫폼을 제거하려면:
1. `config.py`에서 해당 플랫폼 항목 삭제
2. `docs/index.html`에서 해당 열(`<th>`) 삭제
3. `docs/app.js`에서 해당 플랫폼 처리 코드 수정

---

## 🔧 로컬 테스트

### 필요 사항
- Python 3.9 이상
- Chrome 브라우저

### 설치 및 실행

```bash
# 1. Python 의존성 설치
cd scraper
pip install -r requirements.txt

# 2. 스크래퍼 실행
python main.py

# 3. 결과 확인
cat ../docs/data.json
```

### 로컬 웹 서버 실행

```bash
cd docs
python -m http.server 8000
```

브라우저에서 `http://localhost:8000` 접속

---

## 📊 데이터 구조

`docs/data.json` 파일 형식:

```json
{
  "last_updated": "2024-12-09T08:00:00+09:00",
  "data": [
    {
      "group": "BOYNEXTDOOR",
      "platform": "youtube",
      "url": "https://www.youtube.com/@boynextdoor_official",
      "followers": 1234567,
      "timestamp": "2024-12-09T08:00:00+09:00"
    }
    // ... 총 16개 항목
  ]
}
```

---

## 🚨 문제 해결

### ❌ GitHub Actions 실행 실패

**증상**: 워크플로우가 실패하고 빨간색 X 표시

**해결 방법**:
1. Actions 탭에서 실패한 워크플로우 클릭
2. 에러 로그 확인
3. 주요 원인:
   - 플랫폼 UI 변경 → `platforms/*.py` 파일의 선택자 업데이트 필요
   - 네트워크 타임아웃 → `config.py`의 `TIMEOUT` 값 증가
   - 계정 URL 오류 → `config.py`의 URL 확인

### ❌ 웹 페이지에 "데이터를 불러올 수 없습니다" 표시

**원인**: 아직 데이터가 수집되지 않음

**해결 방법**:
1. GitHub Actions에서 워크플로우 수동 실행
2. 완료될 때까지 대기 (2-3분)
3. 웹 페이지 새로고침

### ❌ 일부 플랫폼 데이터가 "-"로 표시

**원인**: 해당 플랫폼 스크래핑 실패

**해결 방법**:
1. Actions 로그에서 구체적인 에러 확인
2. 해당 플랫폼의 스크래퍼 코드 확인
3. 계정 URL이 정확한지 확인

---

## 🔐 보안 및 제한 사항

### ⚠️ Rate Limiting
- 각 플랫폼은 자동화된 요청에 제한이 있을 수 있습니다
- 너무 자주 실행하지 마세요 (하루 1-2회 권장)

### ⚠️ 공개 데이터만 수집
- 로그인이 필요한 데이터는 수집하지 않습니다
- 공개적으로 표시된 팔로워 수만 수집합니다

### ⚠️ 플랫폼 변경
- SNS 플랫폼이 UI를 변경하면 스크래퍼가 작동하지 않을 수 있습니다
- 주기적으로 업데이트가 필요할 수 있습니다

---

## 📈 향후 계획 (Phase 2)

- [ ] 데이터 히스토리 (지난 30일 추이)
- [ ] 증감률 계산 및 표시
- [ ] 차트 시각화 (Chart.js)
- [ ] 추가 플랫폼 (Facebook, Weibo, Douyin)
- [ ] Google Sheets 자동 연동
- [ ] Discord/Telegram 알림 봇

---

## 🤝 기여

이슈, PR, 피드백 모두 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

---

## 💡 크레딧

**개발자**: dohyeong-kim-95
**GitHub**: [https://github.com/dohyeong-kim-95/Followercheck](https://github.com/dohyeong-kim-95/Followercheck)

---

## 📞 문의

질문이나 제안사항이 있으시면 GitHub Issues를 통해 연락주세요!

---

**⭐ 이 프로젝트가 유용하다면 Star를 눌러주세요!**
