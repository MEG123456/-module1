document.addEventListener("DOMContentLoaded", () => {

    const renderMyLectures = () => {
        const lectures = JSON.parse(localStorage.getItem("lectures")) || [];
        const listContainer = document.querySelector("#my-lecture-list");
        const menuButtons = document.querySelectorAll(".menu-btn");
        
        if (!listContainer) return false;

        // 1. 강의 목록 생성
        listContainer.innerHTML = lectures.map((lec, index) =>
            `<li class="lec-item" data-index="${index}" style="cursor:pointer;">${lec.title}</li>`
        ).join("");

        // 2. 클릭 이벤트: 과목을 누르면 인덱스 저장 후 공지사항으로 이동
        listContainer.addEventListener("click", (e) => {
            const target = e.target.closest(".lec-item");
            if (!target) return;

            const index = target.dataset.index;
            localStorage.setItem("selectedLecIndex", index);
            
            // 과목을 새로 선택하면 무조건 해당 과목의 공지사항 첫 페이지로 보냄
            window.location.href = "proflecNotice.html";
        });

        // 3. 페이지 로드 시 기존 선택 상태 복원
        const savedIndex = localStorage.getItem("selectedLecIndex");
        if (savedIndex !== null) {
            const items = document.querySelectorAll(".lec-item");
            if (items[savedIndex]) {
                items[savedIndex].style.fontWeight = "700";
                items[savedIndex].style.textDecoration = "underline";
                
                // 버튼들 활성화
                menuButtons.forEach(btn => btn.classList.add("enabled"));
            }
        }

        // 4. 상단 메뉴 버튼(공지사항/수강학생) 클릭 이벤트
        if (menuButtons.length >= 2) {
            menuButtons[0].onclick = () => {
                if(menuButtons[0].classList.contains("enabled")) location.href = "proflecNotice.html";
                else alert("과목을 선택해주세요.");
            };
            menuButtons[1].onclick = () => {
                if(menuButtons[1].classList.contains("enabled")) location.href = "studentList.html";
                else alert("과목을 선택해주세요.");
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
        // 사이드바가 로드되었는지 확인 (클래스명을 확인해 보세요!)
        const target = document.querySelector(".professor-sidebar") || document.querySelector(".sidebar");

        if (target) {
            clearInterval(interval);

            const sidebarLinks = target.querySelectorAll('li a');

            // 1. 모든 메뉴에서 active 제거
            sidebarLinks.forEach(link => link.classList.remove('active'));

            // 2. '강의 목록'이 두 번째 메뉴라면 1번 인덱스에 active 추가
            // 등록/수정 페이지에 들어와 있어도 부모 메뉴인 '강의 목록'에 불이 들어오게 합니다.
            if (sidebarLinks[1]) {
                sidebarLinks[1].classList.add('active');
            }
        }
    }, 50);
});