document.addEventListener('DOMContentLoaded', () => {
    const nextBtn = document.querySelector('.next-btn');
    const signupForm = document.querySelector('.signup-box');

    const birthInputs = document.querySelectorAll('.birth-input');
    const phoneInput = document.getElementById('phone');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const birthError = document.getElementById('birth-error');

    const checkAllFilled = () => {
        const textFilled = [nameInput, emailInput, phoneInput].every(input => input && input.value.trim() !== "");
        const birthFilled = Array.from(birthInputs).every(input => input.value.trim() !== "");
        
        const genderRadios = document.getElementsByName('gender');
        const roleRadios = document.getElementsByName('role');
        
        const genderSelected = Array.from(genderRadios).some(radio => radio.checked);
        const roleSelected = Array.from(roleRadios).some(radio => radio.checked);

        if (textFilled && birthFilled && genderSelected && roleSelected) {
            nextBtn.classList.add('active-btn');
            nextBtn.disabled = false;
        } else {
            nextBtn.classList.remove('active-btn');
            nextBtn.disabled = true; 
        }
    };

    const onlyNumber = (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
        checkAllFilled();
    };
    birthInputs.forEach(input => input.addEventListener('input', onlyNumber));
    if (phoneInput) phoneInput.addEventListener('input', onlyNumber);


    const inputConfig = [
        { input: nameInput, msg: "이름을 다시 확인해 주세요", border: true },
        { input: emailInput, msg: "이메일을 다시 확인해 주세요", border: false },
        { input: phoneInput, msg: "전화번호를 다시 확인해 주세요", border: false }
    ];

    inputConfig.forEach(({input, msg, border}) => {
        if (!input) return;
        input.addEventListener('input', () => {
            const errorElement = document.getElementById(`${input.id}-error`);
            const val = input.value.trim();

            if (val === "") {
                if (errorElement) errorElement.textContent = msg;
                if (border) input.classList.add('error-border');
            } else {
                if (errorElement) errorElement.textContent = "";
                input.classList.remove('error-border');
            }
            checkAllFilled();
        });
    });


    ['gender', 'role'].forEach(name => {
        const radios = document.getElementsByName(name);
        radios.forEach(radio => {
            radio.addEventListener('change', () => {
                const errorElement = document.getElementById(`${name}-error`);
                if (errorElement) errorElement.textContent = "";
                checkAllFilled();
            });
        });
    });

    birthInputs.forEach(input => {
        input.addEventListener('input', () => {
            const anyEmpty = Array.from(birthInputs).some(i => i.value.trim() === "");
            const allFilled = !anyEmpty;

            if (anyEmpty) {
                if (birthError) birthError.textContent = "생년월일을 다시 확인해 주세요";
            } else {
                if (birthError) birthError.textContent = "";
            }
            checkAllFilled();
        });
    });


    nextBtn.addEventListener('click', () => {
        let isValid = true;
        let firstErrorInput = null; 

        const handleError = (inputElement, errorElement, message, showBorder = false) => {
            isValid = false;
            if (errorElement) errorElement.textContent = message;
            if (inputElement && !firstErrorInput) firstErrorInput = inputElement;
            if (inputElement && showBorder) inputElement.classList.add('error-border');
        };

        if (nameInput.value.trim() === "") handleError(nameInput, document.getElementById('name-error'), "이름을 다시 확인해 주세요", true);
        
        const genderRadios = document.getElementsByName('gender');
        if (![...genderRadios].some(r => r.checked)) {
            handleError(null, document.getElementById('gender-error'), "성별을 다시 확인해 주세요");
            if (!firstErrorInput) firstErrorInput = genderRadios[0];
        }

        if (Array.from(birthInputs).some(i => i.value.trim() === "")) {
            handleError(birthInputs[0], birthError, "생년월일을 다시 확인해 주세요");
        }

        if (emailInput.value.trim() === "" || !emailInput.value.includes('@')) {
            handleError(emailInput, document.getElementById('email-error'), "이메일을 다시 확인해 주세요");
        }

        if (phoneInput.value.trim() === "") {
            handleError(phoneInput, document.getElementById('phone-error'), "전화번호를 다시 확인해 주세요");
        }

        const roleRadios = document.getElementsByName('role');
        if (![...roleRadios].some(r => r.checked)) {
            handleError(null, document.getElementById('role-error'), "소속을 다시 확인해 주세요");
            if (!firstErrorInput) firstErrorInput = roleRadios[0];
        }

        if (!isValid && firstErrorInput) firstErrorInput.focus();
        if (isValid) alert("성공! 다음 단계로 이동합니다.");
    });
});