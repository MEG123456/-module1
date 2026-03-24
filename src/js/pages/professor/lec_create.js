const user = JSON.parse(localStorage.getItem("loginUser")) || {};
const LECTURE_KEY = `lectures_${user.id || user.email || "guest"}`;

const $ = (selector) => document.querySelector(selector);

const store = {
    getLocalStorage(key) {
        return JSON.parse(localStorage.getItem(key)) || [];
    },
    setLocalStorage(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
};

function LectureList() {
    this.lectures = [];
    let currentIndex = null;

    this.init = () => {
        this.lectures = store.getLocalStorage(LECTURE_KEY);
        renderLectures();
        initEventListeners();
    };

    const renderLectures = () => {
        if (this.lectures.length === 0) {
            $("#profLecListBody").innerHTML = `
                <tr>
                    <td colspan="6" style="color: #898A8D;">등록된 강의가 없습니다.</td>
                </tr>`;
            return;
        }

        const KR_NAMES = { "m": "전공", "e": "교양" };


        const lectureTemplate = this.lectures.map((lecture, index) => {
        // 2. 데이터가 'm'이면 '전공'으로 변환, 이미 '전공'이면 그대로 유지
        const displayType = KR_NAMES[lecture.type] || lecture.type;

        return `
        <tr>
            <td>${100000 + index}</td> 
            <td class="lecture-link" data-index="${index}" style="cursor:pointer;">
                ${lecture.title}
            </td>
            <td>${displayType}</td> <td>${lecture.credit}</td>
            <td>${lecture.time}</td>
            <td>
                <button class="edit-btn" data-index="${index}">수정</button>
                <button class="delete-btn" data-index="${index}">삭제</button>
            </td>
        </tr>
    `;
    }).join("");

    $("#profLecListBody").innerHTML = lectureTemplate;
};

    const initEventListeners = () => {
        $("#enrollBtn").addEventListener("click", () => {
            window.location.href = "lec_createDetail.html";
        });

        $("#profLecListBody").addEventListener("click", (e) => {
            // dataset.index를 가져올 때 숫자로 변환하여 저장
            const index = e.target.dataset.index;
            if (index === undefined) return;

            // 강의명을 클릭했을 경우 상세 페이지로 이동
            if (e.target.classList.contains("lecture-link")) {
                window.location.href = `lec_detail.html?index=${index}`;
            }

            if (e.target.classList.contains("delete-btn")) {
                currentIndex = Number(index); // 인덱스 저장
                $("#modalMessage").innerText = "정말 이 강의를 삭제하시겠습니까?";
                $("#modalOverlay").style.display = "flex";
            }
            else if (e.target.classList.contains("edit-btn")) {
                window.location.href = `lec_createDetail.html?editIndex=${index}`;
            }
        });

        // 2. 화살표 함수를 사용하여 'this'가 LectureList 객체를 가리키도록 고정
        $("#confirmBtn").addEventListener("click", () => {
            if (currentIndex !== null) {
                // 1. 데이터 삭제
                this.lectures.splice(currentIndex, 1);
                store.setLocalStorage(LECTURE_KEY, this.lectures);
                
                // 2. "삭제되었습니다" 안내 모달로 전환
                $("#modalMessage").innerText = "삭제되었습니다.";
                // 확인/취소 버튼을 잠시 숨김 (안내만 보여주기 위함)
                $("#confirmBtn").style.display = "none";
                $("#cancelBtn").style.display = "none";

                // 3. 1초 뒤에 모달을 닫고 화면을 다시 그림
                setTimeout(() => {
                    $("#modalOverlay").style.display = "none";
                    // 버튼들 다시 원래대로 보이게 복구 (다음 모달을 위해)
                    $("#confirmBtn").style.display = "inline-block";
                    $("#cancelBtn").style.display = "inline-block";
                    
                    renderLectures();
                    currentIndex = null;
                }, 1000); // 1초 동안 보여줌
            }
        });
        
        $("#cancelBtn").addEventListener("click", () => {
            $("#modalOverlay").style.display = "none";
            currentIndex = null;
        });
        
    };
}

const list = new LectureList();
list.init();