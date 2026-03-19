const $ = (selector) => document.querySelector(selector);

const store = {
    getLocalStorage() {
        // profLec2.js와 동일하게 "lectures" 키를 사용
        return JSON.parse(localStorage.getItem("lectures")) || [];
    }
};

function LectureDetail() {
    this.lectures = [];
    const urlParams = new URLSearchParams(window.location.search);
    const index = urlParams.get('index'); // URL에서 ?index=0 값을 읽음

    this.init = () => {
        this.lectures = store.getLocalStorage();

        console.log("불러온 데이터 전체:", this.lectures);
        console.log("선택된 인덱스:", index);

        if (index !== null && this.lectures[index]) {
            this.renderDetail(this.lectures[index]);
        } else {
            alert("강의 정보를 찾을 수 없습니다.");
        }

        const backBtn = $("#backBtn");
        if (backBtn) {
            backBtn.addEventListener("click", () => {
                const prevPage = document.referrer; // 이전 페이지 주소 가져오기

                // 이전 페이지 주소에 'stuLecList'가 포함되어 있다면 학생 페이지로 이동
                if (prevPage.includes("stuLecList.html")) {
                    // 파일 구조에 맞춰 상대 경로 설정 (professor 폴더에서 student 폴더로)
                    window.location.href = "../student/stuLecList.html";
                } else {
                    // 그 외(교수 페이지에서 왔을 때)에는 기존처럼 교수 목록으로 이동
                    window.location.href = "profLec.html";
                }
            });
        }
    };

    this.renderDetail = (data) => {
        $("#view-title").innerText = data.title || "-";
        $("#view-prof").innerText = data.prof || "-";
        $("#view-max").innerText = data.max || "-";
        $("#view-time").innerText = data.time || "-";
        $("#view-type").innerText = data.type || "-";
        $("#view-credit").innerText = data.credit || "-";
        $("#view-room").innerText = data.room || "-";
        $("#view-about").innerText = data.about || "-";
    };
}

const detail = new LectureDetail();
detail.init();