#!/usr/bin/env python3
"""
SNS 팔로워 수 수집 메인 스크립트
"""
import json
import os
import sys
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

# 플랫폼별 스크래퍼 import
from platforms.youtube import scrape_youtube
from platforms.instagram import scrape_instagram
from platforms.tiktok import scrape_tiktok
from platforms.twitter import scrape_twitter

# 설정 import
from config import ACCOUNTS, HEADLESS, TIMEOUT


def setup_driver():
    """
    Selenium WebDriver 설정
    """
    chrome_options = Options()

    if HEADLESS:
        chrome_options.add_argument('--headless')

    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--window-size=1920,1080')
    chrome_options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

    # GitHub Actions 환경 감지
    if os.getenv('CI'):
        chrome_options.add_argument('--disable-extensions')
        chrome_options.add_argument('--disable-software-rasterizer')

    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()),
        options=chrome_options
    )
    driver.set_page_load_timeout(TIMEOUT)

    return driver


def scrape_platform(driver, platform, url):
    """
    플랫폼별 스크래핑 함수 호출
    """
    scrapers = {
        'youtube': scrape_youtube,
        'instagram': scrape_instagram,
        'tiktok': scrape_tiktok,
        'twitter': scrape_twitter
    }

    scraper = scrapers.get(platform)
    if not scraper:
        print(f"⚠️  알 수 없는 플랫폼: {platform}")
        return None

    return scraper(driver, url, TIMEOUT)


def main():
    """
    메인 실행 함수
    """
    print("=" * 60)
    print("🎵 K-POP SNS 팔로워 수집 시작")
    print("=" * 60)

    driver = None
    results = []

    try:
        driver = setup_driver()
        print("✅ WebDriver 설정 완료\n")

        total_accounts = sum(len(accounts) for accounts in ACCOUNTS.values())
        current = 0

        for group, accounts in ACCOUNTS.items():
            print(f"\n📊 {group} 데이터 수집 중...")
            print("-" * 60)

            for platform, url in accounts.items():
                current += 1
                print(f"[{current}/{total_accounts}] {platform.upper()}: {url}")

                followers = scrape_platform(driver, platform, url)

                result = {
                    "group": group,
                    "platform": platform,
                    "url": url,
                    "followers": followers,
                    "timestamp": datetime.now().isoformat()
                }

                results.append(result)

                if followers is not None:
                    print(f"    ✅ 팔로워 수: {followers:,}")
                else:
                    print(f"    ❌ 수집 실패")

        print("\n" + "=" * 60)
        print("💾 데이터 저장 중...")

        # data.json 저장
        output_dir = os.path.join(os.path.dirname(__file__), '..', 'docs')
        os.makedirs(output_dir, exist_ok=True)

        output_file = os.path.join(output_dir, 'data.json')

        output_data = {
            "last_updated": datetime.now().isoformat(),
            "data": results
        }

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, ensure_ascii=False, indent=2)

        print(f"✅ 데이터 저장 완료: {output_file}")

        # 통계 출력
        successful = sum(1 for r in results if r['followers'] is not None)
        failed = len(results) - successful

        print("\n" + "=" * 60)
        print("📈 수집 결과")
        print("=" * 60)
        print(f"총 계정 수: {len(results)}")
        print(f"성공: {successful} ✅")
        print(f"실패: {failed} ❌")
        print(f"성공률: {(successful/len(results)*100):.1f}%")
        print("=" * 60)

        return 0 if failed == 0 else 1

    except Exception as e:
        print(f"\n❌ 오류 발생: {str(e)}")
        import traceback
        traceback.print_exc()
        return 1

    finally:
        if driver:
            driver.quit()
            print("\n🔒 WebDriver 종료")


if __name__ == '__main__':
    sys.exit(main())
