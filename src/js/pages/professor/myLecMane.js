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