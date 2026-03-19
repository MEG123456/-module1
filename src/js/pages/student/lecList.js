const $ = (selector) => document.querySelector(selector);

const store = {
    getLocalStorage() {
        return JSON.parse(localStorage.getItem("lectures")) || [];
    }
};

function StudentLectureList() {
    this.lectures = [];

    this.init = () => {
        this.lectures = store.getLocalStorage();
        this.render();
        initEventListeners(); // 이벤트 리스너를 실행시켜야 클릭이 작동
    };

    this.render = () => {
        const tableBody = $("#allLecTableBody");
        if (this.lectures.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">등록된 강의가 없습니다.</td></tr>';
            return;
        }

        const template = this.lectures.map((lecture, index) => {
            return `
                <tr>
                    <td>${100000 + index}</td> 
                    <td class="lecture-link" data-index="${index}" style="cursor:pointer;">
                        ${lecture.title}
                    </td>
                    <td>${lecture.type}</td>
                    <td>${lecture.credit}</td>
                    <td>${lecture.time}</td>
                </tr>
            `;
        }).join("");
        tableBody.innerHTML = template;
    };

    // 내부 함수로 정의
    const initEventListeners = () => {
        $("#allLecTableBody").addEventListener("click", (e) => {
            const index = e.target.dataset.index;
            if (index === undefined) return;

            if (e.target.classList.contains("lecture-link")) {
                window.location.href = `../professor/profLecDetail.html?index=${index}`;
            }
        });
    };
}

const studentLec = new StudentLectureList();
studentLec.init();