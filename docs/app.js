/**
 * K-POP SNS 팔로워 트래커 - 메인 JavaScript
 */

// 전역 변수
let currentData = null;

/**
 * 페이지 로드 시 초기화
 */
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    setupEventListeners();
});

/**
 * 이벤트 리스너 설정
 */
function setupEventListeners() {
    document.getElementById('refreshBtn').addEventListener('click', function() {
        loadData(true);
    });

    document.getElementById('downloadBtn').addEventListener('click', function() {
        downloadCSV();
    });
}

/**
 * data.json 파일에서 데이터 로드
 */
async function loadData(forceRefresh = false) {
    const lastUpdateElement = document.getElementById('lastUpdate');
    const refreshBtn = document.getElementById('refreshBtn');

    try {
        // 버튼 비활성화
        refreshBtn.disabled = true;
        refreshBtn.innerHTML = '<span class="spinner-small"></span><span>불러오는 중...</span>';

        // 캐시 방지를 위한 타임스탬프 추가
        const timestamp = forceRefresh ? `?t=${new Date().getTime()}` : '';
        const response = await fetch(`data.json${timestamp}`);

        if (!response.ok) {
            throw new Error('데이터를 불러올 수 없습니다');
        }

        const json = await response.json();
        currentData = json;

        // 테이블 렌더링
        renderTable(json.data);

        // 마지막 업데이트 시간 표시
        const updateTime = new Date(json.last_updated);
        lastUpdateElement.innerHTML = `
            <span class="update-label">마지막 업데이트:</span>
            <span class="update-time">${formatDateTime(updateTime)}</span>
        `;

        // 성공 메시지 (선택적)
        if (forceRefresh) {
            showToast('✅ 데이터를 성공적으로 불러왔습니다!');
        }

    } catch (error) {
        console.error('데이터 로딩 실패:', error);
        lastUpdateElement.innerHTML = `
            <span class="error">❌ 데이터 로딩 실패: ${error.message}</span>
        `;

        // 에러 메시지를 테이블에 표시
        document.getElementById('tableBody').innerHTML = `
            <tr>
                <td colspan="5" class="error-row">
                    <p>❌ 데이터를 불러올 수 없습니다.</p>
                    <p>아직 데이터가 수집되지 않았을 수 있습니다. "수집 시작" 버튼을 클릭하여 데이터를 수집해주세요.</p>
                </td>
            </tr>
        `;
    } finally {
        // 버튼 활성화
        refreshBtn.disabled = false;
        refreshBtn.innerHTML = '<span class="icon">🔄</span><span>최신 데이터 불러오기</span>';
    }
}

/**
 * 테이블 렌더링
 */
function renderTable(data) {
    const tbody = document.getElementById('tableBody');

    // 그룹별로 데이터 정리
    const groupedData = groupByName(data);

    let html = '';

    // 그룹 순서
    const groups = ['BOYNEXTDOOR', 'RIIZE', 'ZB1', 'TWS'];

    groups.forEach(group => {
        const groupData = groupedData[group] || {};

        html += `
            <tr>
                <td class="group-name">${group}</td>
                <td class="follower-count">${formatFollowerCount(groupData.youtube)}</td>
                <td class="follower-count">${formatFollowerCount(groupData.instagram)}</td>
                <td class="follower-count">${formatFollowerCount(groupData.tiktok)}</td>
                <td class="follower-count">${formatFollowerCount(groupData.twitter)}</td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

/**
 * 데이터를 그룹별로 정리
 */
function groupByName(data) {
    const grouped = {};

    data.forEach(item => {
        if (!grouped[item.group]) {
            grouped[item.group] = {};
        }
        grouped[item.group][item.platform] = item;
    });

    return grouped;
}

/**
 * 팔로워 수 포맷팅
 */
function formatFollowerCount(item) {
    if (!item || item.followers === null || item.followers === undefined) {
        return '<span class="na">-</span>';
    }

    const count = item.followers;
    const url = item.url;

    return `<a href="${url}" target="_blank" class="follower-link">${count.toLocaleString('ko-KR')}</a>`;
}

/**
 * 날짜/시간 포맷팅
 */
function formatDateTime(date) {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Seoul'
    };

    return date.toLocaleString('ko-KR', options);
}

/**
 * CSV 다운로드
 */
function downloadCSV() {
    if (!currentData || !currentData.data) {
        alert('다운로드할 데이터가 없습니다. 먼저 데이터를 불러와주세요.');
        return;
    }

    // CSV 헤더
    const headers = ['그룹', 'YouTube', 'Instagram', 'TikTok', 'X (Twitter)'];

    // 그룹별로 데이터 정리
    const groupedData = groupByName(currentData.data);
    const groups = ['BOYNEXTDOOR', 'RIIZE', 'ZB1', 'TWS'];

    // CSV 행 생성
    const rows = [headers.join(',')];

    groups.forEach(group => {
        const groupData = groupedData[group] || {};

        const row = [
            group,
            groupData.youtube?.followers || '',
            groupData.instagram?.followers || '',
            groupData.tiktok?.followers || '',
            groupData.twitter?.followers || ''
        ];

        rows.push(row.join(','));
    });

    // CSV 파일 생성 및 다운로드
    const csvContent = '\uFEFF' + rows.join('\n'); // UTF-8 BOM 추가 (Excel 호환)
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    const filename = `kpop_followers_${formatDateForFilename(new Date())}.csv`;
    link.href = URL.createObjectURL(blob);
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('✅ CSV 파일이 다운로드되었습니다!');
}

/**
 * 파일명용 날짜 포맷팅
 */
function formatDateForFilename(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}${month}${day}`;
}

/**
 * 토스트 메시지 표시
 */
function showToast(message) {
    // 기존 토스트 제거
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // 토스트 생성
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    document.body.appendChild(toast);

    // 애니메이션
    setTimeout(() => toast.classList.add('show'), 10);

    // 3초 후 제거
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
