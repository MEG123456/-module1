document.addEventListener("DOMContentLoaded", () => {
  const savedUser = JSON.parse(localStorage.getItem("loginUser")) || {};

  const nameEl = document.getElementById("profile-name");
  const collegeEl = document.getElementById("profile-college");
  const departmentEl = document.getElementById("profile-department");
  const studentIdEl = document.getElementById("profile-studentId");
  const emailEl = document.getElementById("profile-email");
  const phoneEl = document.getElementById("profile-phone");
  const editBtn = document.getElementById("editProfileBtn");

  if (nameEl) nameEl.textContent = savedUser.name || "";
  if (collegeEl)
    collegeEl.textContent = convertCollege(savedUser.college) || "";
  if (departmentEl)
    departmentEl.textContent = savedUser.department || "";
  if (studentIdEl) studentIdEl.textContent = savedUser.professorCode || "";
  if (emailEl) emailEl.textContent = savedUser.email || "";
  if (phoneEl) phoneEl.textContent = savedUser.phone || "";
  if (editBtn) {
    editBtn.addEventListener("click", () => {
      window.location.href = "/pages/my/edit_profile/edit_profile.html";
    });
  }
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


