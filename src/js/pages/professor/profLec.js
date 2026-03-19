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
    // 1. 변수를 함수 스코프 상단에 명시적으로 선언
    let currentIndex = null; 

    this.init = () => {
        this.lectures = store.getLocalStorage("lectures");
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

        const lectureTemplate = this.lectures.map((lecture, index) => {
            return `
                <tr>
                    <td>${400960 + index}</td> 
                    <td>${lecture.title}</td>
                    <td>${lecture.type}</td>
                    <td>${lecture.credit}</td>
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
            window.location.href = "profLec2.html";
        });

        $("#profLecListBody").addEventListener("click", (e) => {
            // dataset.index를 가져올 때 숫자로 변환하여 저장
            const index = e.target.dataset.index;
            if (index === undefined) return;

            if (e.target.classList.contains("delete-btn")) {
                currentIndex = Number(index); // 인덱스 저장
                $("#modalMessage").innerText = "정말 이 강의를 삭제하시겠습니까?";
                $("#modalOverlay").style.display = "flex";
            } 
            else if (e.target.classList.contains("edit-btn")) {
                window.location.href = `profLec2.html?editIndex=${index}`;
            }
        });

        // 2. 화살표 함수를 사용하여 'this'가 LectureList 객체를 가리키도록 고정
        $("#confirmBtn").addEventListener("click", () => {
            if (currentIndex !== null) {
                // 선택한 인덱스의 데이터를 삭제
                this.lectures.splice(currentIndex, 1);
                // 로컬 스토리지 업데이트
                store.setLocalStorage("lectures", this.lectures);
                // 화면 다시 그리기
                renderLectures();
                // 모달 닫기 및 인덱스 초기화
                $("#modalOverlay").style.display = "none";
                currentIndex = null;
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