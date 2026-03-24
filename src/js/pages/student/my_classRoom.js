document.addEventListener("DOMContentLoaded", () => {

    const renderStudentLectures = () => {
        // 1. 임의의 테스트 과목 데이터
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
        const menuButtons = document.querySelectorAll(".menu-btn"); 
        
        if (!listContainer) return false;
        if (listContainer.children.length > 0) return true;

        // 2. 강의 목록 생성
        listContainer.innerHTML = stuLectures.map((lec, index) =>
            `<li class="lec-item" data-index="${index}" style="cursor:pointer; font-weight:normal;">${lec.title}</li>`
        ).join("");


        // 현재 파일의 경로를 확인합니다.
        const currentPath = window.location.pathname;
        
        // 'my_classRoom.html' 페이지에 막 진입한 경우 
        // 기존에 저장된 '선택된 강의 인덱스'를 무조건 삭제하여 초기화합니다.
        if (currentPath.includes("my_classRoom.html")) {
            localStorage.removeItem("selectedStuLecIndex");
        }

        // 3. 클릭 이벤트: 과목을 누르면 인덱스 저장 후 학생 공지사항으로 이동
        listContainer.addEventListener("click", (e) => {
            const target = e.target.closest(".lec-item");
            if (!target) return;

            const index = target.dataset.index;
            localStorage.setItem("selectedStuLecIndex", index);
            
            // 과목 선택 시 공지사항 페이지로 이동
            window.location.href = "/pages/student/my_lecNotice.html";
        });

        // 4. 페이지 로드 시 상태 복원 (선택된 인덱스가 있을 때만 활성화)
        const savedIndex = localStorage.getItem("selectedStuLecIndex");
        if (savedIndex !== null) {
            const items = listContainer.querySelectorAll(".lec-item");
            if (items[savedIndex]) {
                items[savedIndex].style.fontWeight = "700";
                items[savedIndex].style.textDecoration = "underline";
                menuButtons.forEach(btn => btn.classList.add("enabled"));
            }
        } else {
            // 선택된 게 없으면 상단 메뉴(공지사항/수강평) 비활성화
            menuButtons.forEach(btn => btn.classList.remove("enabled"));
        }

        // 5. 상단 메뉴 클릭 이벤트
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
            sidebarLinks.forEach(link => link.classList.remove('active'));
            if (sidebarLinks[2]) {
                sidebarLinks[2].classList.add('active');
            }
        }
    }, 50);
});