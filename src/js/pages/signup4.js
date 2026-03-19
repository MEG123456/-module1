document.addEventListener('DOMContentLoaded', () => {
    const nextBtn = document.querySelector('.next-btn');

    const idInput = document.getElementById('id');
    const pwdInput = document.getElementById('password');
    const pwdCheckInput = document.getElementById('pwd-check');

    const idError = document.getElementById('id-error');
    const pwdError = document.getElementById('pwd-error');
    const pwdCheckError = document.getElementById('pwd-check-error');

    const checkAllFilled = () => {
        const idVal = idInput.value.trim();
        const pwdVal = pwdInput.value;
        const pwdCheckVal = pwdCheckInput.value;

        const isIdValid = idVal !== "";
        const isPwdValid = pwdVal.length >= 8 && pwdVal.length <= 12;
        const isPwdMatch = pwdVal === pwdCheckVal && pwdCheckVal !== "";

        if (isIdValid && isPwdValid && isPwdMatch) {
            nextBtn.classList.add('active-btn');
        } else {
            nextBtn.classList.remove('active-btn');
        }
    };

    const toggleBtn = document.getElementById('togglePwd');

    toggleBtn.addEventListener('click', () => {
        const isPassword = pwdCheckInput.type === "password";
        pwdCheckInput.type = isPassword ? "text" : "password";
        toggleBtn.src = isPassword
            ? "/asset/eyeson.svg"
            : "/asset/eyesclose.svg";
    });

    idInput.addEventListener('input', () => {
        const val = idInput.value.trim();

        if (val === "") {
            idError.textContent = "아이디를 다시 확인해 주세요";
            idInput.classList.add('error-border');
        } else {
            idError.textContent = "";
            idInput.classList.remove('error-border');
        }
        checkAllFilled();
    });

    pwdInput.addEventListener('input', () => {
        const val = pwdInput.value;

        if (val.length === 0) {
            pwdError.textContent = "비밀번호를 입력해 주세요";
            pwdInput.classList.add('error-border');
        } else if (val.length < 8 || val.length > 12) {
            pwdError.textContent = "비밀번호는 8~12자리로 입력해 주세요";
            pwdInput.classList.add('error-border');
        } else {
            pwdError.textContent = "";
            pwdInput.classList.remove('error-border');
        }
        checkAllFilled();
    });

    pwdCheckInput.addEventListener('input', () => {
        const pwd = pwdInput.value;
        const val = pwdCheckInput.value;

        if (val === "") {
            pwdCheckError.textContent = "비밀번호를 다시 확인해 주세요";
            pwdCheckInput.classList.add('error-border');
        } else if (pwd !== val) {
            pwdCheckError.textContent = "비밀번호가 일치하지 않습니다";
            pwdCheckInput.classList.add('error-border');
        } else {
            pwdCheckError.textContent = "";
            pwdCheckInput.classList.remove('error-border');
        }
        checkAllFilled();
    });

    nextBtn.addEventListener('click', () => {
        let isValid = true;
        let firstErrorInput = null;

        [idError, pwdError, pwdCheckError].forEach(el => el.textContent = "");
        [idInput, pwdInput, pwdCheckInput].forEach(input => input.classList.remove('error-border'));

        const handleError = (input, errorEl, message) => {
            if (!firstErrorInput) {
                input.classList.add('error-border');
                input.focus();
                firstErrorInput = input;
            }
            errorEl.textContent = message;
            isValid = false;
        };

        if (idInput.value.trim() === "") {
            handleError(idInput, idError, "아이디를 다시 확인해 주세요");
        }

        const pwd = pwdInput.value.trim();

        if (pwd === "") {
            handleError(pwdInput, pwdError, "비밀번호를 입력해 주세요");
        } else if (pwd.length < 8 || pwd.length > 12) {
            handleError(pwdInput, pwdError, "비밀번호는 8~12자리로 입력해 주세요");
        }

        const pwdCheck = pwdCheckInput.value.trim();

        if (pwdCheck === "") {
            handleError(pwdCheckInput, pwdCheckError, "비밀번호를 다시 확인해 주세요");
        } else if (pwd !== pwdCheck) {
            handleError(pwdCheckInput, pwdCheckError, "비밀번호가 일치하지 않습니다");
        }

        if (isValid) {
            const signup1Data = JSON.parse(localStorage.getItem("signup1Data")) || {};
            const signup2Data = JSON.parse(localStorage.getItem("signup2Data")) || {};
            const signup3Data = JSON.parse(localStorage.getItem("signup3Data")) || {};

            const userData = {
                ...signup1Data,
                ...signup2Data,
                ...signup3Data,
                id: idInput.value.trim(),
                password: pwdInput.value
            };

            localStorage.setItem("user", JSON.stringify(userData));
            window.location.href = "/pages/signup5.html";
        }
    });
});