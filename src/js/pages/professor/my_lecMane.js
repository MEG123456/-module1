document.addEventListener("DOMContentLoaded", () => {

    const renderMyLectures = () => {
        const lectures = JSON.parse(localStorage.getItem("lectures")) || [];
        const listContainer = document.querySelector("#my-lecture-list");
        const menuButtons = document.querySelectorAll(".menu-btn");
        
        if (!listContainer) return false;

        // 중복 렌더링 방지
        if (listContainer.children.length > 0) return true;

        // 1. 강의 목록 생성
        listContainer.innerHTML = lectures.map((lec, index) =>
            `<li class="lec-item" data-index="${index}" style="cursor:pointer; font-weight:normal;">${lec.title}</li>`
        ).join("");


        // 현재 페이지 경로 확인
        const currentPath = window.location.pathname;
        
        // 상세 페이지(Notice, studentList)가 아닌 '강의 관리 메인' 페이지인 경우
        // 이전에 저장된 '선택된 강의 인덱스'를 무조건 삭제하여 초기화합니다.
        if (currentPath.includes("my_lecMane.html")) {
            localStorage.removeItem("selectedLecIndex");
        }

        // 2. 클릭 이벤트: 과목을 누르면 인덱스 저장 후 공지사항으로 이동
        listContainer.addEventListener("click", (e) => {
            const target = e.target.closest(".lec-item");
            if (!target) return;

            const index = target.dataset.index;
            localStorage.setItem("selectedLecIndex", index);
            
            // 과목을 새로 선택하면 해당 과목의 공지사항 페이지로 이동
            window.location.href = "/pages/professor/my_lecNotice.html";
        });

        // 3. 페이지 로드 시 상태 복원 (인덱스가 있을 때만 활성화)
        const savedIndex = localStorage.getItem("selectedLecIndex");
        if (savedIndex !== null) {
            const items = document.querySelectorAll(".lec-item");
            if (items[savedIndex]) {
                items[savedIndex].style.fontWeight = "700";
                items[savedIndex].style.textDecoration = "underline";
                
                // 버튼들 활성화
                menuButtons.forEach(btn => btn.classList.add("enabled"));
            }
        } else {
            // 선택된 게 없으면 메뉴 버튼 비활성화 상태 유지
            menuButtons.forEach(btn => btn.classList.remove("enabled"));
            
            // 오른쪽 메인 영역에 안내 문구 표시
            const mainContent = document.querySelector("#page-content");
            if (mainContent) {
                mainContent.innerHTML = `
                    <div style="text-align:center; padding:100px; color:#898A8D;">
                        <p>왼쪽 [내 강의 목록]에서 과목을 먼저 선택해 주세요.</p>
                    </div>`;
            }
        }

        // 4. 상단 메뉴 버튼(공지사항/수강학생) 클릭 이벤트
        if (menuButtons.length >= 2) {
            menuButtons[0].onclick = () => {
                if(menuButtons[0].classList.contains("enabled")) location.href = "/pages/professor/my_lecNotice.html";
                else alert("과목을 먼저 선택해주세요.");
            };
            menuButtons[1].onclick = () => {
                if(menuButtons[1].classList.contains("enabled")) location.href = "/pages/professor/my_studentList.html";
                else alert("과목을 먼저 선택해주세요.");
            };
        }

        return true;
    };

    const checkExist = setInterval(() => {
        if (renderMyLectures()) clearInterval(checkExist);
    }, 100);
});

document.addEventListener("DOMContentLoaded", () => {
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
});