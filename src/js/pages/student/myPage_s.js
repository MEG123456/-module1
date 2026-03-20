document.addEventListener("DOMContentLoaded", () => {

    const interval = setInterval(() => {
        const profileContainer = document.querySelector(".info-text-group");

        if (profileContainer) {
            clearInterval(interval);

            const user = JSON.parse(localStorage.getItem("loginUser"));

            profileContainer.innerHTML = `
                <div class="profile-line">
                    <span>${user.college}</span>
                    <span>${user.department}</span>
                </div>

                <div class="profile-line">
                    <span>${user.studentId}</span>
                    <span>${user.name}</span>
                </div>
            `;
        }
    }, 50);

});