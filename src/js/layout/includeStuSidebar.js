fetch("/layout/stuSidebar.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("sidebar").innerHTML = html;
  });