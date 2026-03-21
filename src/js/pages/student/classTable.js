const regiBtn = document.querySelector('.regi');

regiBtn.addEventListener('click', function() {
  this.innerText = '완료';
  this.classList.add('done');
  this.disabled = true;
  this.style.cursor = 'default';
});