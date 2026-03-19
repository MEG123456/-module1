// profLecDetail.js 전체 코드
const $ = (selector) => document.querySelector(selector);

const store = {
    getLocalStorage() {
        // profLec2.js와 동일하게 "lectures" 키를 사용해야 합니다.
        return JSON.parse(localStorage.getItem("lectures")) || [];
    }
};

function LectureDetail() {
    this.lectures = [];
    const urlParams = new URLSearchParams(window.location.search);
    const index = urlParams.get('index'); // URL에서 ?index=0 값을 읽음

    this.init = () => {
        this.lectures = store.getLocalStorage();
        
        // 데이터가 있는지 콘솔에서 먼저 확인해보세요 (F12 - Console)
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
                window.location.href = "profLec.html";
            });
        }
    };

    this.renderDetail = (data) => {
        // 필드명이 profLec2.js에서 저장한 것과 일치해야 합니다.
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