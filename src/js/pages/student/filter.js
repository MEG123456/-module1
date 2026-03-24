// 1. 공통 상수 설정
const MAJOR_DATA = {
  "medical_college": ["의예과"],
  "nursing_college": ["간호학과"],
  "health_science_college": ["임상병리학과", "안경광학과", "응급구조학과", "방사선학과", "치위생학과", "물리치료학과", "의료경영학과"],
  "advanced_school": ["빅데이터인공지능학과"],
  "natural_school": ["식품영양전공", "식품생명공학전공", "안전공학전공", "의료공학전공", "화장품과학전공"],
  "human_social_school": ["레저산업전공", "뷰티아트전공", "시각디자인전공", "사회복지전공", "아동청소년상담전공", "중독상담전공", "장례산업전공"]
};

const KR_NAMES = {
    "medical_college": "의과대학", "nursing_college": "간호대학", "health_science_college": "보건과학대학", 
    "free_major_school": "자유전공학부", "advanced_school": "첨단학부", "natural_school": "자연계열학부", "human_social_school": "인문사회계열학부",
    "first": "1학년", "second": "2학년", "third": "3학년", "fourth": "4학년",
    "m": "전공", "e": "교양",
    "mon": "월요일", "tue": "화요일", "wed": "수요일", "thu": "목요일", "fri": "금요일",
    "1": "1", "2": "2", "3": "3"
};

class LectureManager {
    constructor() {
        // DOM 요소 캐싱
        this.els = {
            college: document.querySelector('select[name="college"]'),
            major: document.getElementById('major-filter'),
            grade: document.getElementById('grade-filter'),
            sort: document.querySelector('select[name="sort"]'),
            week: document.querySelector('select[name="week"]'),
            score: document.querySelector('select[name="score"]'),
            search: document.querySelector('.lecture-search'),
            tableBody: document.querySelector("#allLecTableBody"),
            checkBtn: document.querySelector(".check-btn"),
            searchBtn: document.querySelector(".lecSearch_btn"),
            resetBtn: document.querySelector(".reset-btn")
        };

        this.allLectures = [];
        this.displayLectures = [];
    }

    init() {
        this.loadLocalData();
        this.initUIEvents();
        this.updateFilterStatus(); 
        this.render();
    }

    // [수정] 임의 데이터 삭제, 로컬 스토리지에서만 로드
    loadLocalData() {
    const data = JSON.parse(localStorage.getItem("lectures_all")) || [];

    this.allLectures = data;
    this.displayLectures = [...data];

    if (this.allLectures.length === 0) {
        console.info("현재 등록된 강의 데이터가 없습니다.");
    }
}

    // UI 필터 활성화 상태 제어
    updateFilterStatus() {
        const isCollegeSelected = this.els.college.value !== "all-college";
        const isMajorSortSelected = this.els.sort.value === "m";

        this.els.major.disabled = !(isCollegeSelected || isMajorSortSelected);
        if (this.els.major.disabled) {
            this.els.major.value = "all-major";
            this.els.grade.disabled = true;
            this.els.grade.value = "all-grade";
        }

        this.els.week.disabled = (this.els.sort.value === "all-sort");
        if (this.els.week.disabled) this.els.week.value = "all-week";
    }

    initUIEvents() {
        // 학부 선택 시 학과 리스트 업데이트
        this.els.college.addEventListener('change', () => {
            const selectedCollege = this.els.college.value;
            let majors = [];

            if (selectedCollege === "free_major") {
                majors = [
                    ...MAJOR_DATA["advanced_school"],
                    ...MAJOR_DATA["natural_school"],
                    ...MAJOR_DATA["human_social_school"]
                ];
            } else if (selectedCollege !== "all-college") {
                majors = MAJOR_DATA[selectedCollege] || [];
            }

            this.els.major.innerHTML = '<option value="all-major" selected>전체</option>';
            majors.forEach(m => {
                const opt = document.createElement('option');
                opt.value = opt.textContent = m;
                this.els.major.appendChild(opt);
            });


            this.updateFilterStatus();
        });

        this.els.sort.addEventListener('change', () => this.updateFilterStatus());

        this.els.major.addEventListener('change', () => {
            const hasValue = this.els.major.value !== "all-major" && this.els.major.value !== "";
            this.els.grade.disabled = !hasValue;
            if (!hasValue) this.els.grade.value = "all-grade";
        });

        // 통합 검색/필터 실행 함수
        const runFilter = () => {
            this.displayLectures = this.applyFilters();
            this.render();
        };

        if (this.els.checkBtn) this.els.checkBtn.addEventListener("click", runFilter);
        if (this.els.searchBtn) this.els.searchBtn.addEventListener("click", runFilter);
        if (this.els.search) {
            this.els.search.addEventListener("keypress", (e) => {
                if (e.key === "Enter") runFilter();
            });
        }


        if (this.els.resetBtn) {
            this.els.resetBtn.addEventListener("click", () => this.resetFilters());
        }


    if (this.els.tableBody) {
    this.els.tableBody.addEventListener("click", (e) => {

        // 1. 강의 클릭
        const lecTarget = e.target.closest(".lecture-link");
        if (lecTarget) {
            const index = lecTarget.dataset.index;
            window.location.href = `/pages/professor/lec_Detail.html?index=${index}`;
            return;
        }

        // 2. 신청 버튼 클릭
        const btn = e.target.closest(".apply-btn");
        if (btn) {
            const index = btn.dataset.index;
            const lecture = this.displayLectures[index];

            const user = JSON.parse(localStorage.getItem("loginUser")) || {};
            const STORAGE_KEY = `myCourses_${user.id || user.email}`;

            let myCourses = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

            const exists = myCourses.some(l => l.title === lecture.title);
            if (exists) {
                alert("이미 신청한 강의입니다.");
                return;
            }

            myCourses.push({
                ...lecture,
                profIndex: index
            });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(myCourses));

            btn.innerText = "완료";
            btn.disabled = true;
            btn.classList.add("done");
        }

    });
}
    }

    // 실제 필터링 로직
    applyFilters() {
        const searchText = this.els.search.value.trim().toLowerCase();

        const filters = {
            college: this.els.college.value,
            major: this.els.major.value,
            grade: this.els.grade.value,
            sort: this.els.sort.value,
            week: this.els.week.value,
            score: this.els.score.value
        };

        return this.allLectures.filter(lec => {
            // 모든 필드 기반 통합 검색
            const targetTitle = (lec.title || "").toLowerCase();
            const targetProf = (lec.prof || "").toLowerCase(); // 교수명도 검색 대상에 포함
        
            const matchesSearch = !searchText || 
                             targetTitle.includes(searchText) || 
                             targetProf.includes(searchText);
            
            const matchesCollege = filters.college === 'all-college' || lec.college === filters.college;
            const matchesMajor = filters.major === 'all-major' || lec.major === filters.major;
            const matchesGrade = filters.grade === 'all-grade' || lec.grade === filters.grade;
            
            const matchesSort = filters.sort === 'all-sort' || 
                       lec.type === filters.sort || 
                       (filters.sort === 'm' && lec.type === '전공') || 
                       (filters.sort === 'e' && lec.type === '교양');

            const matchesWeek = filters.week === 'all-week' || lec.day === filters.week;
            const matchesScore = filters.score === 'all-score' || lec.credit === filters.score;

            return matchesSearch && matchesCollege && matchesMajor && 
                   matchesGrade && matchesSort && matchesWeek && matchesScore;
        });
    }

    // 결과 렌더링
    render() {
        if (!this.els.tableBody) return;
        if (this.displayLectures.length === 0) {
            this.els.tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">조건에 맞는 강의가 없습니다.</td></tr>';
            return;
        }

        this.els.tableBody.innerHTML = this.displayLectures.map((lec, index) => {
            const krType = KR_NAMES[lec.type] || lec.type;
            const krCredit = KR_NAMES[lec.credit] || lec.credit;
            const krDay = KR_NAMES[lec.day] ? KR_NAMES[lec.day] + " " : "";

            return `
                <tr>
                    <td>${100000 + index}</td> 
                    <td class="lecture-link" data-index="${index}" style="cursor:pointer; font-weight:bold;">
                        ${lec.title}
                    </td>
                    <td>${krType}</td>
                    <td>${krCredit}</td>
                    <td>${krDay}${lec.time}</td>
                    <td>
                        <button class="apply-btn" data-index="${index}">신청</button>
                    </td>
                </tr>
            `;
            }).join("");
    }

        resetFilters() {
            this.els.college.value = "all-college";
            this.els.major.innerHTML = '<option value="all-major" selected>전체</option>';
            this.els.major.value = "all-major";

            this.els.grade.value = "all-grade";
            this.els.sort.value = "all-sort";
            this.els.week.value = "all-week";
            this.els.score.value = "all-score";

            this.els.search.value = "";

            this.updateFilterStatus();

            this.displayLectures = [...this.allLectures];
            this.render();
        }
    }


            

// 앱 실행
document.addEventListener('DOMContentLoaded', () => {
    const app = new LectureManager();
    app.init();
});
