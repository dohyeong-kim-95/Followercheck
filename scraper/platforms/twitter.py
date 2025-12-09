"""
X (Twitter) 팔로워 수 스크래퍼
"""
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import re
import time


def scrape_twitter(driver, url, timeout=10):
    """
    X (Twitter) 계정의 팔로워 수를 스크래핑합니다.

    Args:
        driver: Selenium WebDriver 인스턴스
        url: Twitter 프로필 URL
        timeout: 대기 시간 (초)

    Returns:
        int: 팔로워 수, 실패시 None
    """
    try:
        driver.get(url)
        time.sleep(3)

        # 팔로워 수를 찾는 여러 방법 시도
        selectors = [
            'a[href$="/verified_followers"] span span',
            'a[href$="/followers"] span span',
            '[data-testid="undefined-count"]'
        ]

        follower_text = None

        # XPath로 "Followers" 링크 찾기
        try:
            # "Followers" 또는 "팔로워" 텍스트가 포함된 링크 찾기
            follower_links = driver.find_elements(By.XPATH, "//a[contains(@href, '/followers')]")
            for link in follower_links:
                text = link.text
                # 숫자가 포함된 경우
                if text and re.search(r'\d', text):
                    follower_text = text.split('\n')[0] if '\n' in text else text
                    break
        except:
            pass

        # CSS 선택자로도 시도
        if not follower_text:
            for selector in selectors:
                try:
                    elements = driver.find_elements(By.CSS_SELECTOR, selector)
                    for elem in elements:
                        text = elem.text
                        if text and re.search(r'\d', text) and not any(word in text.lower() for word in ['following', '팔로잉']):
                            follower_text = text
                            break
                    if follower_text:
                        break
                except:
                    continue

        if not follower_text:
            print(f"⚠️  Twitter: 팔로워 수를 찾을 수 없습니다 - {url}")
            return None

        return parse_follower_count(follower_text)

    except Exception as e:
        print(f"❌ Twitter 스크래핑 실패: {url}")
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
