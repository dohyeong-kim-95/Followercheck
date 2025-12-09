"""
YouTube 구독자 수 스크래퍼
"""
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import re
import time


def scrape_youtube(driver, url, timeout=10):
    """
    YouTube 채널의 구독자 수를 스크래핑합니다.

    Args:
        driver: Selenium WebDriver 인스턴스
        url: YouTube 채널 URL
        timeout: 대기 시간 (초)

    Returns:
        int: 구독자 수 (숫자로 변환), 실패시 None
    """
    try:
        driver.get(url)
        time.sleep(3)  # 페이지 로딩 대기

        # 구독자 수를 찾는 여러 방법 시도
        selectors = [
            '#subscriber-count',  # 기본 선택자
            'yt-formatted-string#subscriber-count',
            '#subscribers #text',
            'ytd-c4-tabbed-header-renderer #subscriber-count'
        ]

        subscriber_text = None
        for selector in selectors:
            try:
                element = WebDriverWait(driver, timeout).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, selector))
                )
                subscriber_text = element.get_attribute('aria-label') or element.text
                if subscriber_text and ('구독자' in subscriber_text or 'subscriber' in subscriber_text.lower()):
                    break
            except:
                continue

        if not subscriber_text:
            print(f"⚠️  YouTube: 구독자 수를 찾을 수 없습니다 - {url}")
            return None

        # 숫자 추출 (예: "1.2M subscribers" -> 1200000)
        return parse_follower_count(subscriber_text)

    except Exception as e:
        print(f"❌ YouTube 스크래핑 실패: {url}")
        print(f"   에러: {str(e)}")
        return None


def parse_follower_count(text):
    """
    팔로워 수 텍스트를 숫자로 변환
    예: "1.2M subscribers" -> 1200000
        "50.3K subscribers" -> 50300
        "1,234 subscribers" -> 1234
    """
    text = text.upper().replace(',', '')

    # 숫자 추출
    match = re.search(r'([\d.]+)\s*([KMB]?)', text)
    if not match:
        return None

    number = float(match.group(1))
    suffix = match.group(2)

    multipliers = {
        'K': 1_000,
        'M': 1_000_000,
        'B': 1_000_000_000,
        '': 1
    }

    return int(number * multipliers.get(suffix, 1))
