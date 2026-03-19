const college = document.getElementById("college");
const department = document.getElementById("department");
const grade = document.getElementById("grade");
const studentId = document.getElementById("studentId");

const nextBtn = document.querySelector(".next-btn");

const collegeError = document.getElementById("college-error");
const departmentError = document.getElementById("department-error");
const gradeError = document.getElementById("grade-error");
const studentIdError = document.getElementById("studentId-error");

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

function validateGrade() {
    if (grade.value === "") {
        showError(grade, gradeError, "학년을 선택해 주세요");
        return false;
    }
    clearError(grade, gradeError);
    return true;
}

function validateStudentId() {
    const value = studentId.value.trim();

    if (value === "") {
        showError(studentId, studentIdError, "학번을 입력해 주세요");
        return false;
    }

    if (!/^\d{10}$/.test(value)) {
        showError(studentId, studentIdError, "학번을 다시 확인해 주세요");
        return false;
    }

    clearError(studentId, studentIdError);
    return true;
}

function updateButtonState() {
    const isValid =
        college.value !== "" &&
        department.value !== "" &&
        grade.value !== "" &&
        /^\d{10}$/.test(studentId.value.trim());

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

grade.addEventListener("change", () => {
    validateGrade();
    updateButtonState();
});

studentId.addEventListener("input", () => {
    studentId.value = studentId.value.replace(/[^0-9]/g, "");
    validateStudentId();
    updateButtonState();
});

nextBtn.addEventListener("click", () => {
    const isCollegeValid = validateCollege();
    const isDepartmentValid = validateDepartment();
    const isGradeValid = validateGrade();
    const isStudentIdValid = validateStudentId();

    updateButtonState();

    if (isCollegeValid && isDepartmentValid && isGradeValid && isStudentIdValid) {
        const signup2Data = {
            college: college.value,
            department: department.value,
            grade: grade.value,
            studentId: studentId.value.trim()
        };

        localStorage.setItem("signup2Data", JSON.stringify(signup2Data));
        window.location.href = "/pages/signup4.html";
    }
});

resetDepartmentOptions();
updateButtonState();