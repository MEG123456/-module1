let savedUser;

  function showModal(message) {
  const modal = document.getElementById("alertModal");
  const msg = document.getElementById("alertText");

  msg.innerText = message;
  modal.classList.add("active");
}

document.addEventListener("DOMContentLoaded", () => {
  savedUser = JSON.parse(localStorage.getItem("loginUser")) || {};

  
  const toggleEye = document.getElementById("toggleEye");
  const nameEl = document.getElementById("profile-name");
  const collegeEl = document.getElementById("profile-college");
  const departmentEl = document.getElementById("profile-department");
  const studentIdEl = document.getElementById("profile-studentId");
  const emailEl = document.getElementById("profile-email");
  const phoneEl = document.getElementById("profile-phone");
  const editBtn = document.querySelector(".profile-edit-btn");
  const modal = document.getElementById("pwModal");
  const pwInput = document.getElementById("pwInput");
  const pwError = document.getElementById("pwError");
  const confirmBtn = document.getElementById("pwConfirmBtn");
  const cancelBtn = document.getElementById("pwCancelBtn");

  if (toggleEye) {
  toggleEye.addEventListener("click", () => {
    if (!pwInput.value.trim()) return;

    if (pwInput.type === "password") {
      pwInput.type = "text";
      toggleEye.src = "/asset/eyeson.svg";
    } else {
      pwInput.type = "password";
      toggleEye.src = "/asset/eyesclose.svg";
    }
  });
}

    function updateEyeState() {
  if (!pwInput.value.trim()) {
    toggleEye.classList.add("disabled");
    toggleEye.src = "/asset/eyesclose.svg"; 
    pwInput.type = "password";
  } else {
    toggleEye.classList.remove("disabled");
  }
}
updateEyeState();


  pwInput.addEventListener("input", () => {
  pwError.innerText = "";
  pwInput.classList.remove("input-error");

  updateEyeState(); 
});





  const alertOkBtn = document.getElementById("alertOkBtn");
  if (alertOkBtn) {
    alertOkBtn.onclick = () => {
      document.getElementById("alertModal").classList.remove("active");
      location.reload();
    };
  }

  if (nameEl) nameEl.textContent = savedUser.name || "";
  if (collegeEl) collegeEl.textContent = convertCollege(savedUser.college) || "";
  if (departmentEl) departmentEl.textContent = savedUser.department || "";
  if (studentIdEl) studentIdEl.textContent = savedUser.studentId || "";
  if (emailEl) emailEl.textContent = savedUser.email || "";
  if (phoneEl) phoneEl.textContent = savedUser.phone || "";

  if (editBtn) {
    editBtn.addEventListener("click", () => {
      modal.classList.add("active");
      pwInput.value = "";
      pwError.innerText = "";
    });
  }

  if (cancelBtn) {
    cancelBtn.onclick = () => {
      modal.classList.remove("active");
    };
  }

  if (confirmBtn) {
  confirmBtn.onclick = () => {

    if (!pwInput.value.trim()) {
      pwError.innerText = "비밀번호를 입력해주세요.";
      pwInput.classList.add("input-error");
      return;
    }

    if (pwInput.value.trim() === String(savedUser.password)) {
      pwInput.classList.remove("input-error");
      modal.classList.remove("active");
      showPasswordChangeUI();
    } else {
      pwError.innerText = "비밀번호가 일치하지 않습니다.";
      pwInput.classList.add("input-error");
    }

  };
}


function showPasswordChangeUI() {
  const container = document.querySelector(".profile-content");

  if (document.getElementById("newPw")) return;

  const editWrap = document.querySelector(".profile-btn-wrap");
  if (editWrap) editWrap.remove();


  container.innerHTML += `
    <div class="profile-row pw-row pw-row-tight">
      <span class="label">비밀번호</span>
      <span class="colon">:</span>
      <div class="pw-field pw-input-wrap">
        <input type="password" id="newPw" class="pw-inline" placeholder="8~12자 이내로 입력해주세요">
        <img src="/asset/eyesclose.svg" class="toggle-eye small-eye" id="newPwEye">
        <p class="pw-msg" id="newPwMsg"></p>
      </div>
    </div>

    <div class="profile-row pw-row pw-row-tight">
      <span class="label">비밀번호 확인</span>
      <span class="colon">:</span>
      <div class="pw-field pw-input-wrap">
        <input type="password" id="confirmPw" class="pw-inline" placeholder="비밀번호를 다시 입력해주세요">
        <img src="/asset/eyesclose.svg" class="toggle-eye small-eye" id="confirmPwEye">
        <p class="pw-msg" id="confirmPwMsg"></p>
      </div>
    </div>

    <div class="profile-btn-wrap">
      <button id="pwSaveBtn">저장</button>
    </div>
  `;
}


document.addEventListener("click", (e) => {

  if (e.target.id === "newPwEye") {
    const input = document.getElementById("newPw");

    if (!input.value.trim()) return;

    input.type = input.type === "password" ? "text" : "password";
    e.target.src = input.type === "text"
      ? "/asset/eyeson.svg"
      : "/asset/eyesclose.svg";
  }

  if (e.target.id === "confirmPwEye") {
    const input = document.getElementById("confirmPw");

    if (!input.value.trim()) return;

    input.type = input.type === "password" ? "text" : "password";
    e.target.src = input.type === "text"
      ? "/asset/eyeson.svg"
      : "/asset/eyesclose.svg";
  }

  if (e.target.id === "pwSaveBtn") {

    const newPwEl = document.getElementById("newPw");
    const confirmPwEl = document.getElementById("confirmPw");

    const newPw = newPwEl.value;
    const confirmPw = confirmPwEl.value;

    document.getElementById("newPwMsg").innerText = "";
    document.getElementById("confirmPwMsg").innerText = "";
    newPwEl.classList.remove("input-error");
    confirmPwEl.classList.remove("input-error");

    if (!newPw.trim() || !confirmPw.trim()) {

  if (!newPw.trim()) {
    document.getElementById("newPwMsg").innerText = "비밀번호를 입력해주세요.";
  }

  if (!confirmPw.trim()) {
    document.getElementById("confirmPwMsg").innerText = "비밀번호를 입력해주세요.";
  }

  newPwEl.classList.remove("input-error");
  confirmPwEl.classList.remove("input-error");

  if (!newPw.trim()) {
    newPwEl.classList.add("input-error");
  }

  return;
}

    if (newPw.length < 8 || newPw.length > 12) {
      document.getElementById("newPwMsg").innerText = "8~12자로 입력해주세요.";
      newPwEl.classList.add("input-error");
      return;
    }

    if (newPw !== confirmPw) {
      document.getElementById("confirmPwMsg").innerText = "비밀번호가 일치하지 않습니다.";
      confirmPwEl.classList.add("input-error");
      return;
    }

    savedUser.password = newPw;
    localStorage.setItem("loginUser", JSON.stringify(savedUser));

    showModal("비밀번호가 변경되었습니다.");

  }
});

document.addEventListener("input", (e) => {

  // 🔥 newPw 실시간 검사
  if (e.target.id === "newPw") {
    const value = e.target.value;
    const msgEl = document.getElementById("newPwMsg");

    msgEl.innerText = "";
    e.target.classList.remove("input-error");

    // 👉 12자 초과
    if (value.length > 12) {
      msgEl.innerText = "12자 이하로 입력해주세요.";
      e.target.classList.add("input-error");
    }

    // 👉 8자 미만 (선택)
    else if (value.length > 0 && value.length < 8) {
      msgEl.innerText = "8자 이상 입력해주세요.";
      e.target.classList.add("input-error");
    }
  }

  // 🔥 confirmPw 기존 유지
  if (e.target.id === "confirmPw") {
    document.getElementById("confirmPwMsg").innerText = "";
    e.target.classList.remove("input-error");
  }

});
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


