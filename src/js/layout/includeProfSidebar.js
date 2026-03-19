fetch("/layout/profSidebar.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("sidebar").innerHTML = html;

  const currentPath = window.location.pathname;
    const menuLinks = document.querySelectorAll('.student-sidebar li a');

    menuLinks.forEach(link => {
        const linkHref = link.getAttribute('href').split('/').pop();
        const currentFile = currentPath.split('/').pop();

        if (linkHref === currentFile) {
            link.classList.add('active');
        }
    });
  })
  .catch(error => console.error('사이드바 로드 실패:', error));