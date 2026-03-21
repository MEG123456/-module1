const subTarget1 = document.querySelector('.gb-sub');

fetch('/layout/classSideMenu.html')
    .then(res => res.text())
    .then(data => {
        subTarget1.innerHTML = data;
    });