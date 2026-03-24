const user = JSON.parse(localStorage.getItem("loginUser")) || {};
const LECTURE_KEY = `lectures_${user.id || user.email || "guest"}`;

const $ = (selector) => document.querySelector(selector);

const store = {
    setLocalStorage(lectures) {
        localStorage.setItem(LECTURE_KEY, JSON.stringify(lectures));
    },
    getLocalStorage() {
        return JSON.parse(localStorage.getItem(LECTURE_KEY)) || [];
    }
};

function LectureManager() {
    this.lectures = [];
    let tempLectureData = null; 

    const urlParams = new URLSearchParams(window.location.search);
    const editIndex = Number(urlParams.get('editIndex'));

    this.init = () => {
    this.lectures = store.getLocalStorage();
    if (urlParams.has('editIndex') && this.lectures[editIndex]) {
        fillEditForm(this.lectures[editIndex]);
        if ($(".body-title")) $(".body-title").innerText = "내 강의 수정";
    }

    initEventListeners();
};

    const fillEditForm = (data) => {
        $('input[name="lecture-title"]').value = data.title || "";
        $('input[name="prof-name"]').value = data.prof || "";
        $('input[name="lecture-max"]').value = data.max || "";
        $('input[name="lecture-time"]').value = data.time || "";
        $('input[name="credit"]').value = data.credit || "";
        $('input[name="classroom"]').value = data.room || "";
        $('textarea[name="about"]').value = data.about || "";

        if (data.type === 'm' || data.type === '전공') $("#major").checked = true;
        else $("#etc").checked = true;
    };

    // --- 모달 제어 함수 ---
    const showModal = (message, hasButtons = true) => {
        const modal = $("#modalOverlay");
        const confirmBtn = $("#confirmBtn");
        const cancelBtn = $("#cancelBtn");
        
        $(".modal-text").innerText = message;
        
        if (hasButtons) {
            confirmBtn.style.display = "inline-block";
            cancelBtn.style.display = "inline-block";
        } else {
            confirmBtn.style.display = "none";
            cancelBtn.style.display = "none";
        }
        modal.style.display = "flex";
    };

    const closeModal = () => {
        $("#modalOverlay").style.display = "none";
    };

    const getFormData = () => {
        const title = $('input[name="lecture-title"]').value;
        const prof = $('input[name="prof-name"]').value;
        const max = $('input[name="lecture-max"]').value;
        const time = $('input[name="lecture-time"]').value;
        const subject = $('input[name="subject"]:checked');
        const type = subject ? (subject.id === 'major' ? '전공' : '교양') : '';
        const credit = $('input[name="credit"]').value;
        const room = $('input[name="classroom"]').value;
        const about = $('textarea[name="about"]').value;

        // [수정] alert 대신 확인 버튼만 있는 모달 표시
        if (!title.trim() || !prof.trim() || !max.trim() || !time.trim() || !type) {
            showModal("강의 정보를 모두 입력해주세요!", true);
            $("#cancelBtn").style.display = "none"; // 확인 버튼만 남김
            
            const confirmBtn = $("#confirmBtn");
            const newConfirmBtn = confirmBtn.cloneNode(true);
            confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
            newConfirmBtn.onclick = closeModal;
            return null;
        }

        return { title, prof, max, time, type, credit, room, about };
    };

    const initEventListeners = () => {
        // 1. [저장] 버튼 클릭 시
        $("#saveBtn").addEventListener("click", (e) => {
            e.preventDefault();
            const data = getFormData();
            if (!data) return;

            tempLectureData = data;
            const isEdit = urlParams.has('editIndex');
            const msg = isEdit ? "변경사항을 저장하시겠습니까?" : "새 강좌를 등록하시겠습니까?";
            showModal(msg, true);

            // 확인 버튼 이벤트 재설정 (중복 방지)
            const confirmBtn = $("#confirmBtn");
            const newConfirmBtn = confirmBtn.cloneNode(true);
            confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

            newConfirmBtn.addEventListener("click", () => {
                if (tempLectureData) {
                    const editIndex = Number(urlParams.get('editIndex'));
                    const isEdit = urlParams.has('editIndex');
                    if (isEdit) {
                        this.lectures[editIndex] = tempLectureData;
                    } else {
                        this.lectures.push(tempLectureData);
                    }
                    store.setLocalStorage(this.lectures);

localStorage.setItem("lectures_all", JSON.stringify(this.lectures));
                    // [추가] 등록/수정 완료 후 버튼 없는 모달 1초 띄우기
                    const finishMsg = isEdit ? "수정되었습니다." : "등록되었습니다.";
                    showModal(finishMsg, false);

                    setTimeout(() => {
                        window.location.replace("lec_create.html");
                    }, 1000);
                }
            });
        });

        // 3. 모달 내 [취소] 버튼
        $("#cancelBtn").addEventListener("click", () => {
            tempLectureData = null;
            closeModal();
        });
    };
}

const lectureManager = new LectureManager();
lectureManager.init();

document.addEventListener("DOMContentLoaded", () => {
    const interval = setInterval(() => {
        const target = document.querySelector(".professor-sidebar") || document.querySelector(".sidebar");
        if (target) {
            clearInterval(interval);
            const sidebarLinks = target.querySelectorAll('li a');
            sidebarLinks.forEach(link => link.classList.remove('active'));
            if (sidebarLinks[0]) {
                sidebarLinks[0].classList.add('active');
            }
        }
    }, 50);
});