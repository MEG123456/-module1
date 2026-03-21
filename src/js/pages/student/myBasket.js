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

// 그레이박스 사이드바
// const subTarget1 = document.querySelector('.gb-sub');

// fetch('/layout/classSideMenu.html')
//     .then(res => res.text())
//     .then(data => {
//         subTarget1.innerHTML = data;
//     });




// 1. 사이드바를 불러오는 함수
fetch('/layout/classSideMenu.html')
    .then(res => res.text())
    .then(data => {
        const subArea = document.querySelector('.gb-sub');
        subArea.innerHTML = data; // 화면에 사이드바 알맹이 꽂기

        // 2. ★여기서 실행!★ 알맹이가 화면에 생기자마자 현재 주소를 확인해서 체크함
        highlightActiveMenu(); 
    });

function highlightActiveMenu() {
    // 1. 현재 주소창에서 마지막 파일명만 추출 (예: myBasket.html)
    const currentFile = window.location.pathname.split('/').pop(); 
    const menuLinks = document.querySelectorAll('.inner-menu a');

    menuLinks.forEach(link => {
        // 기존에 혹시 붙어있을지 모를 active 클래스를 모두 제거 (초기화)
        link.parentElement.classList.remove('active');

        // 2. 메뉴의 href에서도 파일명만 추출해서 비교
        const linkFile = link.getAttribute('href').split('/').pop();

        // 3. 현재 파일명과 메뉴의 링크 파일명이 일치하면 active 추가
        if (currentFile === linkFile && linkFile !== "") {
            link.parentElement.classList.add('active');
        }
    });
}



// 그레이박스 메인
fetch('/pages/student/classTable.html')
    .then(res => res.text())
    .then(data => {
        document.querySelector('.gb-main').innerHTML = data;

        const regiBtn = document.querySelectorAll('.regi');

        regiBtn.forEach(btn => {
            btn.addEventListener('click', function() {
                this.innerText = '완료';
                this.classList.add('done');
                this.disabled = true;
                this.style.cursor = 'default';
            });
        });
    })
