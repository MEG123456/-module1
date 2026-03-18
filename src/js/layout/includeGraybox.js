fetch("/layout/grayBox.html")
  .then((response) => response.text())
  .then((responseText) => {
    document.querySelector(".container-body").insertAdjacentHTML("afterbegin", responseText);
  })