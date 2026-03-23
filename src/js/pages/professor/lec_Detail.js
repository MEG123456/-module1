const $ = (selector) => document.querySelector(selector);

const store = {
    getLocalStorage() {
        // profLec2.js와 동일하게 "lectures" 키를 사용
        return JSON.parse(localStorage.getItem("lectures")) || [];
    }
};

function LectureDetail() {
    this.lectures = [];
    const urlParams = new URLSearchParams(window.location.search);
    const index = urlParams.get('index');

    // 사이드바를 통합 관리하는 함수
    const setupSidebar = () => {
        const interval = setInterval(() => {
            // 교수용, 공통, 학생용 사이드바 클래스를 모두 체크
            const target = document.querySelector(".professor-sidebar") || 
                           document.querySelector(".sidebar") || 
                           document.querySelector(".student-sidebar");

            if (target) {
                clearInterval(interval);
                const referrer = document.referrer;

                // 1. 학생 페이지에서 왔다면 내용을 통째로 바꿈
                if (referrer.includes("stuLecList.html")) {
                    target.className = "student-sidebar"; // 클래스명 교체
                    target.innerHTML = `
                        <li><a href="../student/stuLecList.html">강의</a></li>
                        <li><a href="#">수강</a></li>
                        <li><a href="../student/myPage.html">마이페이지</a></li>
                    `;
                    
                    
                    const links = target.querySelectorAll('li a');
                    links.forEach(link => link.classList.remove('active'));
                    if (links[0]) links[0].classList.add('active');

                } else {
                    // 2. 교수 페이지에서 왔을 때 (기존 로직 유지)
                    const links = target.querySelectorAll('li a');
                    links.forEach(link => link.classList.remove('active'));
                    // 교수용에서 '강의 목록'이 1번이라면 [1]로 수정하세요.
                    if (links[1]) links[1].classList.add('active'); 
                }
            }
        }, 50);
    };

    this.init = () => {
        setupSidebar(); // 사이드바 설정 호출

        this.lectures = store.getLocalStorage();
        if (index !== null && this.lectures[index]) {
            this.renderDetail(this.lectures[index]);
        } else {
            alert("강의 정보를 찾을 수 없습니다.");
        }

        // 목록으로 버튼 로직 (기존과 동일)
        const backBtn = $("#backBtn");
        if (backBtn) {
            backBtn.addEventListener("click", () => {
                const prevPage = document.referrer;
               if (prevPage.includes("stuLecList.html")) {
                    window.location.href = "../student/stuLecList.html";
                } else {
                    window.location.href = "profLec.html";
                }
            });
        }
    };

    this.renderDetail = (data) => {
        $("#view-title").innerText = data.title || "-";
        $("#view-prof").innerText = data.prof || "-";
        $("#view-max").innerText = data.max || "-";
        $("#view-time").innerText = data.time || "-";
        $("#view-type").innerText = data.type || "-";
        $("#view-credit").innerText = data.credit || "-";
        $("#view-room").innerText = data.room || "-";
        $("#view-about").innerText = data.about || "-";
    };
}

const detail = new LectureDetail();
detail.init();

document.addEventListener("DOMContentLoaded", () => {
    const interval = setInterval(() => {
        // 사이드바가 로드되었는지 확인 (클래스명을 확인해 보세요!)
        const target = document.querySelector(".professor-sidebar") || document.querySelector(".sidebar");

        if (target) {
            clearInterval(interval);

            const sidebarLinks = target.querySelectorAll('li a');

            // 1. 모든 메뉴에서 active 제거
            sidebarLinks.forEach(link => link.classList.remove('active'));

            // 2. '강의 목록'이 두 번째 메뉴라면 1번 인덱스에 active 추가
            // 등록/수정 페이지에 들어와 있어도 부모 메뉴인 '강의 목록'에 불이 들어오게 합니다.
            if (sidebarLinks[0]) {
                sidebarLinks[0].classList.add('active');
            }
        }
    }, 50);
});