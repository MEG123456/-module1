document.addEventListener("DOMContentLoaded", () => {
  const savedUser = JSON.parse(localStorage.getItem("user")) || {};

  const nameEl = document.getElementById("profile-name");
  const collegeEl = document.getElementById("profile-college");
  const departmentEl = document.getElementById("profile-department");
  const studentIdEl = document.getElementById("profile-studentId");
  const emailEl = document.getElementById("profile-email");
  const phoneEl = document.getElementById("profile-phone");

  if (nameEl) nameEl.textContent = savedUser.name || "홍길동";
  if (collegeEl)
    collegeEl.textContent = convertCollege(savedUser.college) || "첨단학부";
  if (departmentEl)
    departmentEl.textContent = savedUser.department || "의료 IT";
  if (studentIdEl) studentIdEl.textContent = savedUser.studentId || "-";
  if (emailEl) emailEl.textContent = savedUser.email || "gildong@eulji.ac.kr";
  if (phoneEl) phoneEl.textContent = savedUser.phone || "010 - xxxx - xxxx";
});

function convertCollege(collegeValue) {
  const collegeMap = {
    medical_college: "의과대학",
    nursing_college: "간호대학",
    health_science_college: "보건과학대학",
    free_major_school: "자유전공학부",
    advanced_school: "첨단학부",
    natural_school: "자연계열학부",
    human_social_school: "인문사회계열학부",
  };

  return collegeMap[collegeValue] || collegeValue;
}


//로컬 연동 해주세요 + 수정 버튼 동작 되게 수정 페이지 만들어주세요