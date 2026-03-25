document.addEventListener("DOMContentLoaded", () => {
    // 1. 사이드바 활성화 상태 유지 (기존 로직)
    const interval = setInterval(() => {
        const target = document.querySelector(".professor-sidebar") || document.querySelector(".sidebar"); 
        if (target) {
            clearInterval(interval);
            const sidebarLinks = target.querySelectorAll('li a');
            sidebarLinks.forEach(link => link.classList.remove('active'));
            if (sidebarLinks[1]) {
                sidebarLinks[1].classList.add('active');
            }
        }
    }, 50);

    // 2. 필터 영역 로드 (regi.html에 .inner-filter가 있을 때만 실행)
    const filterArea = document.querySelector('.inner-filter');
    if (filterArea) {
        fetch('/pages/student/filter.html')
            .then(res => res.text())
            .then(data => {
                filterArea.innerHTML = data;
                // filter.js에서 정의한 초기화 함수 호출
                if (typeof window.initFilters === 'function') {
                    window.initFilters();
                }

                renderLectures();
            })
            .catch(err => console.log("필터를 불러오는 중 오류 발생:", err));
    }

    // 3. 테이블 영역 로드 (공통으로 사용하는 .inner-table3 요소 기준)
    // 3. 테이블 영역 로드
function renderLectures() {
    const lectures = JSON.parse(localStorage.getItem("lectures_all")) || [];
    const tbody = document.querySelector('.allLec-table tbody');

    console.log("🔥 렌더 실행됨", tbody);

    if (!tbody) return;

    tbody.innerHTML = lectures.map((lec, index) => `
        <tr>
            <td>${100000 + index}</td>
            <td>${lec.title}</td>
            <td>${lec.type}</td>
            <td>${lec.credit}</td>
            <td>${lec.time}</td>
            <td>
                <button class="regi" data-index="${index}">신청</button>
            </td>
        </tr>
    `).join('');

    // 버튼 이벤트 여기서 다시 연결
    const regiBtns = document.querySelectorAll('.regi');

    regiBtns.forEach(btn => {
        btn.addEventListener('click', function() {

            const index = parseInt(this.dataset.index);

            const user = JSON.parse(localStorage.getItem("loginUser")) || {};
            const STORAGE_KEY = `myCourses_${user.id || user.email}`;

            const lectures = JSON.parse(localStorage.getItem("lectures_all")) || [];
            const lecture = lectures[index];

            if (!lecture) {
                alert("강의 정보를 찾을 수 없습니다.");
                return;
            }

            let myCourses = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

            const exists = myCourses.some(l => l.title === lecture.title);
            if (exists) {
                alert("이미 신청한 강의입니다.");
                return;
            }

            myCourses.push({
                ...lecture,
                profIndex: index,
                lecId: lecture.id || index 
            });

            localStorage.setItem(STORAGE_KEY, JSON.stringify(myCourses));

            this.innerText = '완료';
            this.classList.add('done');
            this.disabled = true;
        });
    });
}



    // 4. 그레이박스 왼쪽 메뉴(내 바구니, 수강신청 등) 유지 및 하이라이트
    const subArea = document.querySelector('.gb-sub');
    if (subArea) {
        fetch('/layout/classSideMenu.html')
            .then(res => res.text())
            .then(data => {
                subArea.innerHTML = data;
                highlightActiveMenu(); 
            });
    }
});

// 메뉴 하이라이트 함수
function highlightActiveMenu() {
    const currentFile = window.location.pathname.split('/').pop(); 
    const menuLinks = document.querySelectorAll('.inner-menu a');

    menuLinks.forEach(link => {
        link.parentElement.classList.remove('active');
        const linkFile = link.getAttribute('href').split('/').pop();
        if (currentFile === linkFile && linkFile !== "") {
            link.parentElement.classList.add('active');
        }
    });
} 