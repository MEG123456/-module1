document.addEventListener("DOMContentLoaded", () => {

    const renderMyLectures = () => {
        // 1. my_classRoom.js에서 저장한 'student_lectures' 데이터를 그대로 가져옴
        const stuLectures = JSON.parse(localStorage.getItem("student_lectures")) || [];
        
        const listContainer = document.querySelector("#my-lecture-list");
        const menuButtons = document.querySelectorAll(".menu-btn");
        
        if (!listContainer) return false;

        // 리스트가 이미 그려져 있다면 중복 실행 방지
        if (listContainer.children.length > 0) return true;

        // 2. 가져온 데이터로 목록 생성
        if (stuLectures.length === 0) {
            listContainer.innerHTML = `<li style="color: #898A8D; padding: 10px;">수강 중인 강의가 없습니다.</li>`;
        } else {
            listContainer.innerHTML = stuLectures.map((lec, index) =>
                `<li class="lec-item" data-index="${index}" style="cursor:pointer; font-weight:normal;">${lec.title}</li>`
            ).join("");
        }

        // 3. 클릭 이벤트: 과목 선택 시 인덱스 저장 및 이동
        listContainer.addEventListener("click", (e) => {
            const target = e.target.closest(".lec-item");
            if (!target) return;

            const index = target.dataset.index;
            // 학생용 선택 키인 'selectedStuLecIndex' 사용
            localStorage.setItem("selectedStuLecIndex", index);
            
            // 클릭 시 해당 과목의 공지사항으로 이동
            window.location.href = "/pages/student/my_lecNotice.html";
        });

        // 4. 기존 선택 상태 복원 (굵게 + 밑줄)
        const savedIndex = localStorage.getItem("selectedStuLecIndex");
        if (savedIndex !== null) {
            const items = listContainer.querySelectorAll(".lec-item");
            if (items[savedIndex]) {
                items[savedIndex].style.fontWeight = "700";
                items[savedIndex].style.textDecoration = "underline";
                
                // 공지사항/수강평 버튼 활성화
                menuButtons.forEach(btn => btn.classList.add("enabled"));
            }
        }

        // 5. 상단 메뉴 버튼(공지사항/수강평) 클릭 이벤트
        if (menuButtons.length >= 2) {
            menuButtons[0].onclick = () => {
                if(menuButtons[0].classList.contains("enabled")) {
                    location.href = "/pages/student/my_lecNotice.html";
                } else {
                    alert("강의를 먼저 선택해주세요.");
                }
            };
            menuButtons[1].onclick = () => {
                if(menuButtons[1].classList.contains("enabled")) {
                    location.href = "/pages/student/my_lecReview.html";
                } else {
                    alert("강의를 먼저 선택해주세요.");
                }
            };
        }

        return true;
    };

    // 요소가 렌더링될 때까지 확인
    const checkExist = setInterval(() => {
        if (renderMyLectures()) clearInterval(checkExist);
    }, 100);
});

// 사이드바 active 설정 (강의실 메뉴)
document.addEventListener("DOMContentLoaded", () => {
    const interval = setInterval(() => {
        const target = document.querySelector(".student-sidebar") || document.querySelector(".sidebar");
        if (target) {
            clearInterval(interval);
            const sidebarLinks = target.querySelectorAll('li a');
            sidebarLinks.forEach(link => link.classList.remove('active'));
            if (sidebarLinks[2]) sidebarLinks[2].classList.add('active');
        }
    }, 50);
});