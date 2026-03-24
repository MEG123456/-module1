// // 선택한 메뉴바 유지
// document.addEventListener("DOMContentLoaded", () => {
//     const interval = setInterval(() => {
//         const target = document.querySelector(".professor-sidebar") || document.querySelector(".sidebar"); 

//         if (target) {
//             clearInterval(interval);

//             const sidebarLinks = target.querySelectorAll('li a');
            
//             sidebarLinks.forEach(link => link.classList.remove('active'));

//             if (sidebarLinks[1]) {
//                 sidebarLinks[1].classList.add('active');
//             }
//         }
//     }, 50);
// });


// const subTarget1 = document.querySelector('.inner-filter');

// fetch('/pages/student/filter.html')
//     .then(res => res.text())
//     .then(data => {
//         subTarget1.innerHTML = data;

//         if (typeof window.initFilters === 'function') {
//             window.initFilters();
//         }
//     })

// const subTarget2 = document.querySelector('.inner-table2');

// fetch('/pages/student/class_table.html')
//     .then(res => res.text())
//     .then(data => {
//         subTarget2.innerHTML = data;

//         const regiBtns = subTarget2.querySelectorAll('.regi');

//         regiBtns.forEach(btn => {
//             btn.addEventListener('click', function() {
//                 this.innerText = '완료';
//                 this.classList.add('done');
//                 this.disabled = true;
//                 this.style.cursor = 'default';
//             });
//         });
//     })


// const subTarget3 = document.querySelector('.inner-table3');

// fetch('/pages/student/class_table.html')
//     .then(res => res.text())
//     .then(data => {
//         subTarget3.innerHTML = data;

//         const regiBtns = subTarget3.querySelectorAll('.regi');

//         regiBtns.forEach(btn => {
//             btn.addEventListener('click', function() {
//                 this.innerText = '완료';
//                 this.classList.add('done');
//                 this.disabled = true;
//                 this.style.cursor = 'default';
//             });
//         });
//     })




// // 그레이박스 사이드바 유지
// fetch('/layout/classSideMenu.html')
//     .then(res => res.text())
//     .then(data => {
//         const subArea = document.querySelector('.gb-sub');
//         subArea.innerHTML = data;

//         highlightActiveMenu(); 
//     });

// function highlightActiveMenu() {

//     const currentFile = window.location.pathname.split('/').pop(); 
//     const menuLinks = document.querySelectorAll('.inner-menu a');

//     menuLinks.forEach(link => {
//         link.parentElement.classList.remove('active');

//         const linkFile = link.getAttribute('href').split('/').pop();

//         if (currentFile === linkFile && linkFile !== "") {
//             link.parentElement.classList.add('active');
//         }
//     });
// }



/**
 * 수강신청 및 수강취소 공통 로직
 * 요소가 있는지 체크하는 if문을 통해 regi.html과 cancel.html 모두에서 에러 없이 동작합니다.
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. 사이드바 활성화 상태 유지 (기존 로직)
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

    // 2. 필터 영역 로드 (regi.html에 .inner-filter가 있을 때만 실행)
    const filterArea = document.querySelector('.inner-filter');
    if (filterArea) {
        fetch('/pages/student/filter.html')
            .then(res => res.text())
            .then(data => {
                filterArea.innerHTML = data;
                // filter.js에서 정의한 초기화 함수 호출
                if (typeof window.initFilters === 'function') {
                    window.initFilters();
                }
            })
            .catch(err => console.log("필터를 불러오는 중 오류 발생:", err));
    }

    // 3. 테이블 영역 로드 (공통으로 사용하는 .inner-table3 요소 기준)
    const tableArea = document.querySelector('.gb-main');
    if (tableArea) {
        // 공통 테이블 HTML 호출
        fetch('/pages/student/class_table.html') 
            .then(res => res.text())
            .then(data => {
                tableArea.innerHTML = data;

                // 테이블 내부 버튼(신청/취소) 이벤트 바인딩
                const regiBtns = tableArea.querySelectorAll('.regi');
                regiBtns.forEach(btn => {
                    btn.addEventListener('click', function() {
                        this.innerText = '완료';
                        this.classList.add('done');
                        this.disabled = true;
                        this.style.cursor = 'default';
                    });
                });
            })
            .catch(err => console.log("테이블을 불러오는 중 오류 발생:", err));
    }

    // 4. 그레이박스 왼쪽 메뉴(내 바구니, 수강신청 등) 유지 및 하이라이트
    const subArea = document.querySelector('.gb-sub');
    if (subArea) {
        fetch('/layout/classSideMenu.html')
            .then(res => res.text())
            .then(data => {
                subArea.innerHTML = data;
                highlightActiveMenu(); 
            });
    }
});

// 메뉴 하이라이트 함수
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