const college = document.getElementById("college");
const department = document.getElementById("department");
const professorCode = document.getElementById("professorCode");

const nextBtn = document.querySelector(".next-btn");

const collegeError = document.getElementById("college-error");
const departmentError = document.getElementById("department-error");
const professorCodeError = document.getElementById("professorCode-error");

const departmentMap = {
    medical_college: ["의예과"],
    nursing_college: ["간호학과"],
    health_science_college: [
        "임상병리학과",
        "안경광학과",
        "응급구조학과",
        "방사선학과",
        "치위생학과",
        "물리치료학과",
        "의료경영학과"
    ],
    advanced_school: ["빅데이터인공지능전공"],
    natural_school: [
        "식품영양전공",
        "식품생명공학전공",
        "안전공학전공",
        "의료공학전공",
        "화장품과학전공"
    ],
    human_social_school: [
        "레저산업전공",
        "뷰티아트전공",
        "시각디자인전공",
        "사회복지전공",
        "아동청소년상담전공",
        "중독상담전공",
        "장례산업전공"
    ]
};

departmentMap.free_major_school = [
    ...departmentMap.advanced_school,
    ...departmentMap.natural_school,
    ...departmentMap.human_social_school
];

function resetDepartmentOptions() {
    department.innerHTML = '<option value="">선택</option>';
}

function setDepartmentOptions(collegeValue) {
    resetDepartmentOptions();

    if (!collegeValue || !departmentMap[collegeValue]) return;

    departmentMap[collegeValue].forEach((major) => {
        const option = document.createElement("option");
        option.value = major;
        option.textContent = major;
        department.appendChild(option);
    });
}

function showError(target, errorTarget, message) {
    if (target.id === "college") {
        target.classList.add("error");
    }
    errorTarget.textContent = message;
}

function clearError(target, errorTarget) {
    if (target.id === "college") {
        target.classList.remove("error");
    }
    errorTarget.textContent = "";
}

function validateCollege() {
    if (college.value === "") {
        showError(college, collegeError, "학부를 선택해 주세요");
        return false;
    }
    clearError(college, collegeError);
    return true;
}

function validateDepartment() {
    if (department.value === "") {
        showError(department, departmentError, "학과를 선택해 주세요");
        return false;
    }
    clearError(department, departmentError);
    return true;
}

function validateProfessorCode() {
    const value = professorCode.value.trim();

    if (value === "") {
        showError(professorCode, professorCodeError, "교수 코드를 입력해 주세요");
        return false;
    }

    if (!/^\d{10}$/.test(value)) {
        showError(professorCode, professorCodeError, "교수 코드를 다시 확인해 주세요");
        return false;
    }

    clearError(professorCode, professorCodeError);
    return true;
}

function updateButtonState() {
    const isValid =
        college.value !== "" &&
        department.value !== "" &&
        /^\d{10}$/.test(professorCode.value.trim());

    if (isValid) {
        nextBtn.classList.add("active-btn");
    } else {
        nextBtn.classList.remove("active-btn");
    }
}

college.addEventListener("change", () => {
    setDepartmentOptions(college.value);
    department.value = "";
    validateCollege();
    validateDepartment();
    updateButtonState();
});

department.addEventListener("change", () => {
    validateDepartment();
    updateButtonState();
});

professorCode.addEventListener("input", () => {
    professorCode.value = professorCode.value.replace(/[^0-9]/g, "");
    validateProfessorCode();
    updateButtonState();
});

nextBtn.addEventListener("click", () => {
    const isCollegeValid = validateCollege();
    const isDepartmentValid = validateDepartment();
    const isProfessorCodeValid = validateProfessorCode();

    updateButtonState();

    if (isCollegeValid && isDepartmentValid && isProfessorCodeValid) {
        const signup3Data = {
            college: college.value,
            department: department.value,
            professorCode: professorCode.value.trim()
        };

        localStorage.setItem("signup3Data", JSON.stringify(signup3Data));
        window.location.href = "/pages/signup4.html";
    }
});

resetDepartmentOptions();
updateButtonState();