fetch("/layout/profSidebar.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("sidebar").innerHTML = html;

    const currentFile = window.location.pathname
  .split('/')
  .pop()
  .split('?')[0];

    const menuLinks = document.querySelectorAll('#sidebar li a');

    menuLinks.forEach(link => {
  const href = link.getAttribute('href');

  // 강의 관련 페이지 묶기
  if (
    currentFile.startsWith("lec_") &&
    href.includes("profLec")
  ) {
    link.classList.add("active");
  }

  // 기본 매칭
  else if (href.includes(currentFile)) {
    link.classList.add("active");
  }
});
  })
  .catch(error => console.error('사이드바 로드 실패:', error));