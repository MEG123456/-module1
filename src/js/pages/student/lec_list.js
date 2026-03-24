import { filterLectures } from './lec_filter.js'; 

const $ = (selector) => document.querySelector(selector);

const KR_NAMES = {
    // 학부
    "medical": "의과대학", "nursing": "간호대학",
    "health_science": "보건과학대학", "free_major": "자유전공학부",
    "hightech": "첨단학부", "nature": "자연계열학부",
    "human": "인문사회계열학부",

    // 학년
    "first": "1학년", "second": "2학년",
    "third": "3학년", "fourth": "4학년",

    // 구분
    "sort-major": "전공",
    "sort-etc": "교양",

    // 요일
    "mon": "월요일",
    "tue": "화요일",
    "wed": "수요일",
    "thu": "목요일",
    "fri": "금요일",

    // 학점
    "one": "1학점",
    "two": "2학점",
    "three": "3학점",    
};

const store = {
    getLocalStorage() {
        return JSON.parse(localStorage.getItem("lectures")) || [];
    }
};

function StudentLectureList() {
    this.allLectures = [];      // 전체 원본 데이터 보관용
    this.displayLectures = [];  // 화면에 보여줄 필터링된 데이터용

    this.init = () => {
        const localData = store.getLocalStorage();
        
        // 데이터가 없을 경우를 위한 테스트용 더미 데이터
        if (localData.length === 0) {
            console.warn("테스트용 데이터");
            this.allLectures = [
                { title: "자바스크립트 입문", college: "hightech", type: "sort-major", credit: "three", day: "mon", time: "09:00-12:00" },
                { title: "서양 미술사", college: "human", type: "sort-etc", credit: "two", day: "wed", time: "13:00-15:00" },
                { title: "데이터 구조", college: "hightech", type: "sort-major", credit: "three", day: "fri", time: "10:00-13:00" }

                // 예시 데이터 구성
                // { 
                //     title: "자바스크립트 입문", 
                //     college: "hightech", 
                //     collegeName: "첨단학부",
                //     major: "software",
                //     majorName: "소프트웨어학과",
                //     grade: "first",
                //     gradeName: "1학년",
                //     // ...
                // }

            ];
        } else {
            this.allLectures = localData;
        }

        this.displayLectures = [...this.allLectures];
        this.render();
        this.initEventListeners();
    };

    this.render = () => {
        const tableBody = $("#allLecTableBody");
        
        if (this.displayLectures.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">조건에 맞는 강의가 없습니다.</td></tr>';
            return;
        }

        const template = this.displayLectures.map((lecture, index) => {
            // KR_NAMES를 사용하여 영문 value를 한국어로 변환
            const krType = KR_NAMES[lecture.type] || lecture.type;
            const krCredit = KR_NAMES[lecture.credit] || lecture.credit;
            const krDay = KR_NAMES[lecture.day] ? KR_NAMES[lecture.day] + " " : "";

            return `
                <tr>
                    <td>${100000 + index}</td> 
                    <td class="lecture-link" data-index="${index}" style="cursor:pointer;">
                        ${lecture.title}
                    </td>
                    <td>${krType}</td>
                    <td>${krCredit}</td>
                    <td>${krDay}${lecture.time}</td>
                </tr>
            `;
        }).join("");
        tableBody.innerHTML = template;
    };

    this.initEventListeners = () => {
        // 조회 버튼 클릭 시 필터링 실행
        const checkBtn = $(".check-btn");
        if (checkBtn) {
            checkBtn.addEventListener("click", () => {
                this.displayLectures = filterLectures(this.allLectures);
                this.render();
            });
        }


        const searchBtn = $(".lecSearch_btn");
    if (searchBtn) {
        searchBtn.addEventListener("click", () => {
            this.displayLectures = filterLectures(this.allLectures);
            this.render();
        });
    }

    const searchInput = $(".lecture-search");
    if (searchInput) {
        searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                this.displayLectures = filterLectures(this.allLectures);
                this.render();
            }
        });
    }

        // 상세 페이지 이동 로직
        $("#allLecTableBody").addEventListener("click", (e) => {
            const index = e.target.dataset.index;
            if (index === undefined) return;
            if (e.target.classList.contains("lecture-link")) {
                window.location.href = `/pages/student/lec_Detail.html?index=${index}`;
            }
        });
    };
}

const studentLec = new StudentLectureList();
studentLec.init();