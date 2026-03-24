const user = JSON.parse(localStorage.getItem("loginUser")) || {};
const LECTURE_KEY = `lectures_${user.id || user.email || "guest"}`;

document.addEventListener("DOMContentLoaded", () => {

    const collegeMap = { 
        medical_college: "의과대학",
        nursing_college: "간호대학",
        health_science_college: "보건과학대학",
        advanced_school: "첨단학부",
        natural_school: "자연과학부",
        human_social_school: "인문사회학부",
        free_major_school: "자유전공학부"
    };

    const interval = setInterval(() => {
        const profileContainer = document.querySelector(".info-text-group");
        const lectureListContainer = document.querySelector(".lecture-list");

        if (!user || !user.name) return;
        if (profileContainer && lectureListContainer) {
            clearInterval(interval);


            const lectures = JSON.parse(localStorage.getItem(LECTURE_KEY)) || [];
            const myLectures = lectures;

            if (myLectures.length === 0) {
                lectureListContainer.innerHTML = `
                    <li style="color:#898A8D; padding:10px;">
                        등록된 강의가 없습니다.
                    </li>
                `;
            } else {
                lectureListContainer.innerHTML = myLectures.map((lec, index) => `
                    <li class="lecture-item" data-id="${index}">
                        ${lec.title}
                    </li>
                `).join('');
            }

            if (myLectures.length > 0) {
                document.querySelectorAll(".lecture-item").forEach((item, index) => {
                    item.addEventListener("click", () => {
                        localStorage.setItem("selectedLecIndex", index);
                        window.location.href = "/pages/professor/my_lecNotice.html";
                    });
                });
            }

            profileContainer.innerHTML = `
                <div class="profile-line">
                    <span>${collegeMap[user.college] || user.college}</span>
                    <span>${user.department}</span>
                </div>

                <div class="profile-line">
                    <span>${user.professorCode}</span>
                    <span>${user.name} (교수) </span>
                </div>
            `;
        }
    }, 50);

});