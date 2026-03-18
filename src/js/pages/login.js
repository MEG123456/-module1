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

idInput.addEventListener("input", () => {
    checkInput(idInput);
    const id = idInput.value.trim();
    if (id === "") {
        idError.textContent = "아이디를 다시 확인해 주세요";
        idInput.parentElement.classList.add("error");
    } else {
        idError.textContent = "";
        idInput.parentElement.classList.remove("error");
    }
});

pwInput.addEventListener("input", () => {
    checkInput(pwInput);
    updateToggleState();

    const pw = pwInput.value.trim();
    
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
});

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
    
    
    if (!isValid) return;
        const savedUser = JSON.parse(localStorage.getItem("user"));

        if (!savedUser) {
            alert("회원가입을 먼저 해주세요");
            return;
        }

        if (id === savedUser.id && pw === savedUser.password) {
            alert("로그인 성공!");

        localStorage.setItem("isLogin", "true");
        //이동 (원하는 페이지로 바꿔도 됨)
        // window.location.href = ""
        } else {
            pwError.textContent = "아이디 또는 비밀번호가 일치하지 않습니다";
            pwInput.parentElement.classList.add("error");
        }
    });
