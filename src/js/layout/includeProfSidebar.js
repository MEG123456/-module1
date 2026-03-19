fetch("/layout/profSidebar.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("sidebar").innerHTML = html;
  });