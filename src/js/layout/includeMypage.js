fetch("/layout/mypage.html")
    .then(res => res.text())
    .then(data => {
    document.querySelector(".container-main").insertAdjacentHTML("beforeend", data);
    });