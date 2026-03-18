fetch("/pages/profLec2.html")
  .then((response) => response.text())
  .then((responseText) => {
    document.querySelector(".container-main").insertAdjacentHTML("afterbegin", responseText);
  })