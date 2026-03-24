document.addEventListener("DOMContentLoaded", () => {

    const currentPath = window.location.pathname;

    if (currentPath.includes("my_classRoom.html")) {
        localStorage.removeItem("selectedStuLecIndex");
    }

    window.renderStudentLectures = () => {

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

    const rawIndex = localStorage.getItem("selectedStuLecIndex");
    const savedIndex = rawIndex !== null ? parseInt(rawIndex) : null;
    listContainer.innerHTML = stuLectures.map((lec, index) =>
    `<li class="lec-item ${
        savedIndex !== null && !isNaN(savedIndex) && savedIndex === index ? 'active' : ''
    }"
        data-index="${index}"
        style="cursor:pointer;">
        ${lec.title}
    </li>`
).join("");

    const newListContainer = document.querySelector("#my-lecture-list");
    if (!isNaN(savedIndex)) {
        menuButtons.forEach(btn => btn.classList.add("enabled"));
    } else {
        menuButtons.forEach(btn => btn.classList.remove("enabled"));
    }



// if (!isNaN(savedIndex)) {
//     const items = newListContainer.querySelectorAll(".lec-item");

//     if (items[savedIndex]) {
//         items[savedIndex].style.fontWeight = "700";
//         items[savedIndex].style.textDecoration = "underline";
//         menuButtons.forEach(btn => btn.classList.add("enabled"));
//     }
// } else {
//     menuButtons.forEach(btn => btn.classList.remove("enabled"));
// }

    newListContainer.addEventListener("click", (e) => {
        const target = e.target.closest(".lec-item");
        if (!target) return;

        const index = target.dataset.index;
        localStorage.setItem("selectedStuLecIndex", index);

        window.location.href = "/pages/student/my_lecNotice.html";
    });

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