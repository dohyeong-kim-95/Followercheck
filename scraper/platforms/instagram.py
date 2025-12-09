"""
Instagram 팔로워 수 스크래퍼
"""
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import re
import time


def scrape_instagram(driver, url, timeout=10):
    """
    Instagram 계정의 팔로워 수를 스크래핑합니다.

    Args:
        driver: Selenium WebDriver 인스턴스
        url: Instagram 프로필 URL
        timeout: 대기 시간 (초)

    Returns:
        int: 팔로워 수, 실패시 None
    """
    try:
        driver.get(url)
        time.sleep(3)  # 페이지 로딩 대기

        # 팔로워 수를 찾는 여러 방법 시도
        selectors = [
            'meta[property="og:description"]',  # 메타 태그
            'a[href*="followers"] span',
            'header section ul li a span'
        ]

        follower_text = None

        # 메타 태그에서 먼저 시도
        try:
            meta = driver.find_element(By.CSS_SELECTOR, 'meta[property="og:description"]')
            content = meta.get_attribute('content')
            if 'Followers' in content:
                follower_text = content
        except:
            pass

        # 메타 태그에서 실패하면 페이지 요소에서 시도
        if not follower_text:
            try:
                # "Followers" 텍스트를 포함한 요소 찾기
                elements = driver.find_elements(By.XPATH, "//*[contains(text(), 'followers')]")
                for elem in elements:
                    text = elem.text
                    if text and any(char.isdigit() for char in text):
                        follower_text = text
                        break
            except:
                pass

        if not follower_text:
            print(f"⚠️  Instagram: 팔로워 수를 찾을 수 없습니다 - {url}")
            return None

        return parse_follower_count(follower_text)

    except Exception as e:
        print(f"❌ Instagram 스크래핑 실패: {url}")
        print(f"   에러: {str(e)}")
        return None


def parse_follower_count(text):
    """
    팔로워 수 텍스트를 숫자로 변환
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
