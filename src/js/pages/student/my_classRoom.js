document.addEventListener("DOMContentLoaded", () => {

    const renderStudentLectures = () => {
        // 1. 수강신청 데이터가 없으므로 임의의 테스트 과목 생성
        let stuLectures = JSON.parse(localStorage.getItem("student_lectures"));
        
        if (!stuLectures) {
            stuLectures = [
                { title: "자바스크립트 프로그래밍", prof: "이교수" },
                { title: "데이터베이스 기초", prof: "박교수" },
                { title: "UI/UX 디자인", prof: "최교수" }
            ];
            localStorage.setItem("student_lectures", JSON.stringify(stuLectures));
        }

        const listContainer = document.querySelector("#my-lecture-list");
        const menuButtons = document.querySelectorAll(".menu-btn"); // 공지사항, 수강평 버튼
        
        if (!listContainer) return false;

        // 중복 실행 방지 (이미 리스트가 있으면 중단)
        if (listContainer.children.length > 0) return true;

        // 2. 강의 목록 생성
        listContainer.innerHTML = stuLectures.map((lec, index) =>
            `<li class="lec-item" data-index="${index}" style="cursor:pointer; font-weight:normal;">${lec.title}</li>`
        ).join("");

        // 현재 페이지 확인 (메인 페이지인지 상세 페이지인지)
        const currentPage = window.location.pathname.split("/").pop();
        // 학생용 강의 목록 메인 파일명을 여기에 적으세요
        const isMainPage = (currentPage === "/pages/student/my_classRoom.html" || currentPage === "stuLec");

        // 메인 페이지 진입 시에는 선택 기록 초기화
        if (isMainPage) {
            localStorage.removeItem("selectedStuLecIndex");
        }

        // 3. 클릭 이벤트: 과목을 누르면 인덱스 저장 후 학생 공지사항으로 이동
        listContainer.addEventListener("click", (e) => {
            const target = e.target.closest(".lec-item");
            if (!target) return;

            const index = target.dataset.index;
            localStorage.setItem("selectedStuLecIndex", index);
            
            // 학생 공지사항 페이지로 이동
            window.location.href = "/pages/student/my_lecNotice.html";
        });

        // 4. 페이지 로드 시 기존 선택 상태 복원 (메인이 아닐 때만)
        const savedIndex = localStorage.getItem("selectedStuLecIndex");
        if (!isMainPage && savedIndex !== null) {
            const items = listContainer.querySelectorAll(".lec-item");
            if (items[savedIndex]) {
                items[savedIndex].style.fontWeight = "700";
                items[savedIndex].style.textDecoration = "underline";
                
                // 상단 버튼(공지사항, 수강평) 활성화
                menuButtons.forEach(btn => btn.classList.add("enabled"));
            }
        } else {
            menuButtons.forEach(btn => btn.classList.remove("enabled"));
        }

        // 5. 학생용 상단 메뉴 버튼(공지사항/수강평) 클릭 이벤트
        if (menuButtons.length >= 2) {
            // 첫 번째 버튼: 공지사항
            menuButtons[0].onclick = () => {
                if(menuButtons[0].classList.contains("enabled")) {
                    location.href = "/pages/student/my_lecNotice.html";
                } else {
                    alert("강의를 먼저 선택해주세요.");
                }
            };
            // 두 번째 버튼: 수강평
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

    const checkExist = setInterval(() => {
        if (renderStudentLectures()) clearInterval(checkExist);
    }, 100);
});

document.addEventListener("DOMContentLoaded", () => {
    const interval = setInterval(() => {
        const target = document.querySelector(".professor-sidebar") || document.querySelector(".sidebar");

        if (target) {
            clearInterval(interval);

            const sidebarLinks = target.querySelectorAll('li a');

            // 1. 모든 메뉴에서 active 제거
            sidebarLinks.forEach(link => link.classList.remove('active'));
            if (sidebarLinks[2]) {
                sidebarLinks[2].classList.add('active');
            }
        }
    }, 50);
});