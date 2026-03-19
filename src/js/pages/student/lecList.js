const $ = (selector) => document.querySelector(selector);

const store = {
    getLocalStorage() {
        // 교수용 페이지(profLec2.js)에서 저장한 키값과 동일해야 합니다.
        return JSON.parse(localStorage.getItem("lectures")) || [];
    }
};

function StudentLectureList() {
    this.lectures = [];

    this.init = () => {
        // 1. 데이터 가져오기
        this.lectures = store.getLocalStorage();
        // 2. 화면에 그리기
        this.render();
    };

    this.render = () => {
        const tableBody = $("#allLecTableBody");
        
        // 데이터가 없을 때 처리
        if (this.lectures.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">등록된 강의가 없습니다.</td></tr>';
            return;
        }

        // 3. 데이터를 표 행(tr)으로 변환
        const template = this.lectures.map((lecture, index) => {
            return `
                <tr>
                    <td>${400960 + index}</td> 
                    <td>${lecture.title}</td>
                    <td>${lecture.type}</td>
                    <td>${lecture.credit}</td>
                    <td>${lecture.time}</td>
                </tr>
            `;
        }).join("");

        tableBody.innerHTML = template;
    };
}

const studentLec = new StudentLectureList();
studentLec.init();