const idInput = document.getElementById("userid");
const pwInput = document.getElementById("userpwd");
const loginBtn = document.getElementById("loginBtn");
const togglePw = document.querySelector(".toggle-pwd");
const idError = document.getElementById("userid-error");
const pwError = document.getElementById("password-error");


function updateToggleState() {
    if (pwInput.value.trim() === "") {
        togglePw.classList.add("disabled");
    } else {
        togglePw.classList.remove("disabled");
    }
}
togglePw.addEventListener("click", () => {
    if (pwInput.value.trim() ==="") return;
    if (pwInput.type === "password") {
        pwInput.type = "text";
        togglePw.src = "/asset/eyeson.svg";
    } else {
        pwInput.type = "password";
        togglePw.src = "/asset/eyesclose.svg";
    }
});

updateToggleState();

pwInput.addEventListener("input", updateToggleState);

function checkInput(input) {
    const box = input.parentElement;

    if (input.value.trim() !== "") {
        box.classList.add("active");
    } else {
        box.classList.remove("active");
    }

    checkButton();
}


function checkButton() {
    const id = idInput.value.trim();
    const pw = pwInput.value.trim();

    if (
        id !== "" &&
        pw.length >= 8 &&
        pw.length <= 12
    ) {
        loginBtn.classList.add("active-btn");
    } else {
        loginBtn.classList.remove("active-btn");
    }
}

idInput.addEventListener("input", () => checkInput(idInput));
pwInput.addEventListener("input", () => checkInput(pwInput));

loginBtn.addEventListener("click", () => {
    const id = idInput.value.trim();
    const pw = pwInput.value.trim();

    let isValid = true;

    if (id === "") {
        idError.textContent = "아이디를 다시 확인해 주세요";
        idInput.parentElement.classList.add("error");
        isValid = false;
    } else {
        idError.textContent = "";
        idInput.parentElement.classList.remove("error");
    }

    if (pw === "") {
        pwError.textContent = "비밀번호를 다시 확인해 주세요";
        pwInput.parentElement.classList.add("error");
    } else if (pw.length < 8 || pw.length > 12) {
        pwError.textContent = "비밀번호는 8~12자리여야 합니다";
        pwInput.parentElement.classList.add("error");
    } else {
        pwError.textContent = "";
        pwInput.parentElement.classList.remove("error");
    }
    if (
        id !== "" &&
        pw.length >= 8 &&
        pw.length <= 12
    ) {
        alert("로그인 시도!"); // 나중에 서버 연결시 지워야댐 확인용임!!!
    } ㅊ   
});    