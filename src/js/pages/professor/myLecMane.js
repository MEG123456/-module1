document.addEventListener("DOMContentLoaded", () => {
    // 1. 현재 사용자가 교수인지 학생인지 확인 (로그인 시 저장된 정보를 활용)
    // 예: localStorage.setItem("userRole", "professor");
    const userRole = localStorage.getItem("userRole");

    const renderMyLectures = () => {
        // 1. 데이터 가져오기 (키값이 'lectures'인지 다시 확인!)
        const lectures = JSON.parse(localStorage.getItem("lectures")) || [];
        const listContainer = document.querySelector("#my-lecture-list");

        if (!listContainer) return false; // 아직 요소가 없으면 false 반환

        if (lectures.length === 0) {
            listContainer.innerHTML = "<li>등록된 강의가 없습니다.</li>";
        } else {
            listContainer.innerHTML = lectures.map(lec => `<li>${lec.title}</li>`).join("");
        }
        return true; // 성공적으로 그렸으면 true 반환
    };

    // 요소가 나타날 때까지 반복 확인
    const checkExist = setInterval(() => {
        if (renderMyLectures()) {
            clearInterval(checkExist); // 요소를 찾아서 그렸다면 반복 중단
        }
    }, 100);
});

document.addEventListener("DOMContentLoaded", () => {

    let selectedIndex = null;
    let isEditing = false;

    const interval = setInterval(() => {
    const target = document.querySelector("#page-content");

        if (target) {
            clearInterval(interval);

            const sidebarLinks = document.querySelectorAll('.student-sidebar li a');
            sidebarLinks.forEach(link => link.classList.remove('active'));
            sidebarLinks[1].classList.add('active'); 

        }
    }, 50);


});