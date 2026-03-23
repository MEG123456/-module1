// 선택한 메뉴바 유지
document.addEventListener("DOMContentLoaded", () => {
    const interval = setInterval(() => {
        const target = document.querySelector(".professor-sidebar") || document.querySelector(".sidebar"); 

        if (target) {
            clearInterval(interval);

            const sidebarLinks = target.querySelectorAll('li a');
            
            sidebarLinks.forEach(link => link.classList.remove('active'));

            if (sidebarLinks[1]) {
                sidebarLinks[1].classList.add('active');
            }
        }
    }, 50);
});


const subTarget1 = document.querySelector('.inner-filter');

fetch('/pages/student/filter.html')
    .then(res => res.text())
    .then(data => {
        subTarget1.innerHTML = data;

        if (typeof window.initFilters === 'function') {
            window.initFilters();
        }
    })

const subTarget2 = document.querySelector('.inner-table2');

fetch('/pages/student/class_basketTable.html')
    .then(res => res.text())
    .then(data => {
        subTarget2.innerHTML = data;

        const regiBtns = subTarget2.querySelectorAll('.regi');

        regiBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                this.innerText = '완료';
                this.classList.add('done');
                this.disabled = true;
                this.style.cursor = 'default';
            });
        });
    })


const subTarget3 = document.querySelector('.inner-table3');

fetch('/pages/student/class_table.html')
    .then(res => res.text())
    .then(data => {
        subTarget3.innerHTML = data;

        const regiBtns = subTarget3.querySelectorAll('.regi');

        regiBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                this.innerText = '완료';
                this.classList.add('done');
                this.disabled = true;
                this.style.cursor = 'default';
            });
        });
    })




// 그레이박스 사이드바 유지
fetch('/layout/classSideMenu.html')
    .then(res => res.text())
    .then(data => {
        const subArea = document.querySelector('.gb-sub');
        subArea.innerHTML = data;

        highlightActiveMenu(); 
    });

function highlightActiveMenu() {

    const currentFile = window.location.pathname.split('/').pop(); 
    const menuLinks = document.querySelectorAll('.inner-menu a');

    menuLinks.forEach(link => {
        link.parentElement.classList.remove('active');

        const linkFile = link.getAttribute('href').split('/').pop();

        if (currentFile === linkFile && linkFile !== "") {
            link.parentElement.classList.add('active');
        }
    });
}
