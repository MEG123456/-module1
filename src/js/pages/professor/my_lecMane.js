document.addEventListener("DOMContentLoaded", () => {

    const renderMyLectures = () => {
        const lectures = JSON.parse(localStorage.getItem("lectures")) || [];
        const listContainer = document.querySelector("#my-lecture-list");
        const menuButtons = document.querySelectorAll(".menu-btn");
        
        if (!listContainer) return false;
    
        const savedIndex = localStorage.getItem("selectedLecIndex");
        const isFromLectureClick = sessionStorage.getItem("fromLectureClick");

        // 1. 강의 목록 생성
        listContainer.innerHTML = lectures.map((lec, index) => {

            return `
                <li class="lec-item ${savedIndex == index && isFromLectureClick ? 'active' : ''}" 
                data-index="${index}" 
                style="cursor:pointer;">
                ${lec.title}
            </li>
        `;
    }).join("");

        // 2. 선택 상태 복원
        // 버튼만 활성화 (선택 표시 X)
        if (localStorage.getItem("selectedLecIndex") !== null) {
            menuButtons.forEach(btn => btn.classList.add("enabled"));   
        }

        // 3. 클릭 이벤트
        listContainer.replaceWith(listContainer.cloneNode(true));
        const newListContainer = document.querySelector("#my-lecture-list");

        newListContainer.addEventListener("click", (e) => {
            const target = e.target.closest(".lec-item");
            if (!target) return;

            const index = target.dataset.index;
            localStorage.setItem("selectedLecIndex", index);
            sessionStorage.setItem("fromLectureClick", "true");
            window.location.href = "/pages/professor/my_lecNotice.html";
        });

        // 4. 메뉴 버튼
        if (menuButtons.length >= 2) {
            menuButtons[0].onclick = () => {
                if(menuButtons[0].classList.contains("enabled")) {
                    location.href = "/pages/professor/my_lecNotice.html";
                } else {
                    alert("과목을 선택해주세요.");
                }
            };

            menuButtons[1].onclick = () => {
                if(menuButtons[1].classList.contains("enabled")) {
                    location.href = "/pages/professor/my_studentList.html";
                } else {
                    alert("과목을 선택해주세요.");
                }
            };
        }

        return true;
    };

    const checkExist = setInterval(() => {
        if (renderMyLectures()) clearInterval(checkExist);
    }, 100);
});