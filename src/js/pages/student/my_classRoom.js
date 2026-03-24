document.addEventListener("DOMContentLoaded", () => {

    const currentPath = window.location.pathname;

    if (currentPath.includes("my_classRoom.html")) {
        localStorage.removeItem("selectedStuLecIndex");
    }

    const renderStudentLectures = () => {

    const user = JSON.parse(localStorage.getItem("loginUser")) || {};
    const STORAGE_KEY = `myCourses_${user.id || user.email}`;

    let stuLectures = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    const listContainer = document.querySelector("#my-lecture-list");
    const menuButtons = document.querySelectorAll(".menu-btn"); 
        
    if (!listContainer) return false;

    if (stuLectures.length === 0) {
    listContainer.innerHTML = `<li style="color:gray;">신청한 강의가 없습니다.</li>`;
    return true;
    }

    // 강의 목록
    listContainer.innerHTML = stuLectures.map((lec, index) =>
        `<li class="lec-item" data-index="${index}" style="cursor:pointer;">${lec.title}</li>`
    ).join("");
        
        

        listContainer.replaceWith(listContainer.cloneNode(true));
        const newListContainer = document.querySelector("#my-lecture-list");

        // 3. 클릭 이벤트: 과목을 누르면 인덱스 저장 후 학생 공지사항으로 이동
        newListContainer.addEventListener("click", (e) => {
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
            const items = newListContainer.querySelectorAll(".lec-item");
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
    renderStudentLectures();
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