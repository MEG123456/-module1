fetch("/layout/stuSidebar.html")
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

      if (
        currentFile.startsWith("lec_") &&
        href.includes("stuLecList")
      ) {
        link.classList.add("active");
      }

      else if (
        currentFile.startsWith("class_") &&
        href.includes("classMain")
      ) {
        link.classList.add("active");
      }

      else if (
        currentFile.startsWith("my_") &&
        href.includes("my_")
      ) {
        link.classList.add("active");
      }

      else if (href.includes(currentFile)) {
        link.classList.add("active");
      }
    });
  })
  .catch(error => console.error('사이드바 로드 실패:', error));