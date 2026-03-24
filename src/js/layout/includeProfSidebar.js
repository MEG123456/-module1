fetch("/layout/profSidebar.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("sidebar").innerHTML = html;
    applyActiveMenu();
  });

function applyActiveMenu() {
    const currentFile = window.location.pathname
        .split('/')
        .pop()
        .split('?')[0];

    const menuLinks = document.querySelectorAll('#sidebar li a');

    menuLinks.forEach(link => {
        const href = link.getAttribute('href');
        const hrefFile = href.split('/').pop();

        if (
            currentFile.startsWith("lec_") &&
            href.includes("lec_create")
        ) {
            link.classList.add("active");
        }

        else if (
            currentFile.startsWith("my_") &&
            href.includes("my_page")
        ) {
            link.classList.add("active");
        }
    });
}