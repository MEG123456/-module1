document.addEventListener("DOMContentLoaded", () => {
    const collegeMap = { 
        medical_college: "의과대학", nursing_college: "간호대학", health_science_college: "보건과학대학",
        advanced_school: "첨단학부", natural_school: "자연과학부", human_social_school: "인문사회학부",
        free_major_school: "자유전공학부"
    };

    const interval = setInterval(() => {
        const profileContainer = document.querySelector(".info-text-group");
        const lectureListContainer = document.querySelector("#lecture-list");

        if (profileContainer && lectureListContainer) {
            clearInterval(interval);
            const user = JSON.parse(localStorage.getItem("loginUser"));

            // 1. 프로필 렌더링
            profileContainer.innerHTML = `
                <div class="profile-line">
                    <span>${collegeMap[user.college] || user.college}</span>
                    <span>${user.department}</span>
                </div>
                <div class="profile-line">
                    <span>${user.studentId}</span>
                    <span>${user.name}</span>
                </div>
            `;

            // 2. 로컬스토리지에서 데이터 가져오기
            const stuLectures = JSON.parse(localStorage.getItem("student_lectures")) || [];

            // 3. 강의 목록 생성
            lectureListContainer.innerHTML = stuLectures.map((lec, index) => `
                <li class="lecture-item" data-title="${lec.title}" data-index="${index}" style="cursor:pointer;">
                    <span class="lecture-title">${lec.title}</span>
                </li>
            `).join('');

            // 4. 클릭 이벤트 - 인덱스와 제목을 둘 다 저장
            const items = lectureListContainer.querySelectorAll(".lecture-item");
            items.forEach((item) => {
                item.onclick = function() {
                    const title = this.getAttribute("data-title");
                    const index = this.getAttribute("data-index");
                    
                    // 공지사항 페이지에서 인식할 수 있게 값 저장
                    localStorage.setItem("selectedStuLecTitle", title); // 제목 저장
                    localStorage.setItem("selectedStuLecIndex", index); // 인덱스 저장
                    
                    window.location.href = "/pages/student/my_lecNotice.html";
                };
            });
        }
    }, 50);
});