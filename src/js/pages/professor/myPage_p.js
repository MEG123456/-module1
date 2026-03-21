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

        if (profileContainer) {
            clearInterval(interval);

            const user = JSON.parse(localStorage.getItem("loginUser"));

            profileContainer.innerHTML = `
                <div class="profile-line">
                    <span>${collegeMap[user.college] || user.college}</span>
                    <span>${user.department}</span>
                </div>

                <div class="profile-line">
                    <span>${user.professorCode}</span>
                    <span>${user.name}</span>
                </div>
            `;
        }
    }, 50);

});