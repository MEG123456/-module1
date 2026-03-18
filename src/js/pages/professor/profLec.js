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
        // 등록 버튼 이벤트
        $("#enrollBtn").addEventListener("click", () => {
            window.location.href = "profLec2.html";
        });

        // 표 내부 버튼 클릭 이벤트 (삭제 & 수정)
        $("#profLecListBody").addEventListener("click", (e) => {
            const index = e.target.dataset.index; // 클릭된 버튼의 데이터 인덱스 가져오기

            // 1. 삭제 버튼 클릭 시
            if (e.target.classList.contains("delete-btn")) {
                if (confirm("정말 이 강의를 삭제하시겠습니까?")) {
                    this.lectures.splice(index, 1);
                    store.setLocalStorage("lectures", this.lectures);
                    renderLectures();
                }
                return; // 처리 완료 후 종료
            }

            // 2. 수정 버튼 클릭 시 (추가된 부분)
            if (e.target.classList.contains("edit-btn")) {
                // 주소창 뒤에 ?editIndex=숫자 형태로 붙여서 수정 페이지로 이동
                window.location.href = `profLec2.html?editIndex=${index}`;
            }
        });
    };
}

const list = new LectureList();
list.init();