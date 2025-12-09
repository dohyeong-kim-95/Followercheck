"""
TikTok 팔로워 수 스크래퍼
"""
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import re
import time


def scrape_tiktok(driver, url, timeout=10):
    """
    TikTok 계정의 팔로워 수를 스크래핑합니다.

    Args:
        driver: Selenium WebDriver 인스턴스
        url: TikTok 프로필 URL
        timeout: 대기 시간 (초)

    Returns:
        int: 팔로워 수, 실패시 None
    """
    try:
        driver.get(url)
        time.sleep(4)  # TikTok은 로딩이 조금 더 걸림

        # 팔로워 수를 찾는 여러 방법 시도
        selectors = [
            '[data-e2e="followers-count"]',
            '[title*="Followers"]',
            'strong[data-e2e="followers-count"]',
            'div[data-e2e="followers-count"]'
        ]

        follower_text = None
        for selector in selectors:
            try:
                element = WebDriverWait(driver, timeout).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, selector))
                )
                text = element.get_attribute('title') or element.text
                if text and any(char.isdigit() for char in text):
                    follower_text = text
                    break
            except:
                continue

        # XPath로도 시도
        if not follower_text:
            try:
                elements = driver.find_elements(By.XPATH, "//*[contains(text(), 'Followers')]")
                for elem in elements:
                    # 부모 또는 형제 요소에서 숫자 찾기
                    parent = elem.find_element(By.XPATH, '..')
                    text = parent.text
                    if any(char.isdigit() for char in text):
                        follower_text = text
                        break
            except:
                pass

        if not follower_text:
            print(f"⚠️  TikTok: 팔로워 수를 찾을 수 없습니다 - {url}")
            return None

        return parse_follower_count(follower_text)

    except Exception as e:
        print(f"❌ TikTok 스크래핑 실패: {url}")
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
