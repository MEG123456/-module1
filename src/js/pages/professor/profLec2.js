const $ = (selector) => document.querySelector(selector);

const store = {
    setLocalStorage(lectures) {
        localStorage.setItem("lectures", JSON.stringify(lectures));
    },
    getLocalStorage() {
        return JSON.parse(localStorage.getItem("lectures")) || [];
    }
};

function LectureManager() {
    this.lectures = [];
    let tempLectureData = null; // 유효성 검사를 통과한 데이터를 임시 저장할 변수
    
    const urlParams = new URLSearchParams(window.location.search);
    const editIndex = urlParams.get('editIndex');

    this.init = () => {
        this.lectures = store.getLocalStorage();
        if (editIndex !== null && this.lectures[editIndex]) {
            fillEditForm(this.lectures[editIndex]);
            if ($(".body-title")) $(".body-title").innerText = "내 강의 수정";
        }
        initEventListeners();
    };

    const fillEditForm = (data) => {
        $('input[name="lecture-title"]').value = data.title || "";
        $('input[name="prof-name"]').value = data.prof || "";
        $('input[name="lecture_max"]').value = data.max || "";
        $('input[name="lecture-time"]').value = data.time || "";
        $('input[name="credit"]').value = data.credit || "";
        $('input[name="classroom"]').value = data.room || "";
        $('textarea[name="about"]').value = data.about || "";
        
        if (data.type === '전공') $("#major").checked = true;
        else $("#etc").checked = true;
    };

    const getFormData = () => {
        const title = $('input[name="lecture-title"]').value;
        const prof = $('input[name="prof-name"]').value;
        const max = $('input[name="lecture_max"]').value;
        const time = $('input[name="lecture-time"]').value;
        const type = $('input[name="subject"]:checked').id === 'major' ? '전공' : '교양';
        const credit = $('input[name="credit"]').value;
        const room = $('input[name="classroom"]').value;
        const about = $('textarea[name="about"]').value;

        // 유효성 검사: 필수 항목이 비었는지 확인
        if (!title.trim() || !prof.trim() || !max.trim() || !time.trim()) {
            alert("강의 정보를 모두 입력해주세요!");
            return null;
        }

        return { title, prof, max, time, type, credit, room, about };
    };

    const initEventListeners = () => {
        // 1. [저장] 버튼 클릭 시
        $("#saveBtn").addEventListener("click", (e) => {
            e.preventDefault();
            const data = getFormData(); // 여기서 알람창이 뜸
            
            if (data) { 
                // 모든 값이 있을 때만! 데이터를 임시 저장하고 모달을 띄움
                tempLectureData = data; 
                $("#modalOverlay").style.display = "flex";
            } else {
                // 값이 누락되었다면 모달을 띄우지 않음
                tempLectureData = null;
                $("#modalOverlay").style.display = "none";
            }
        });

        // 2. 모달 내 [확인] 버튼 클릭 시
        $("#confirmBtn").addEventListener("click", () => {
            // 이미 위에서 검증된 tempLectureData가 있을 때만 실행
            if (tempLectureData) {
                if (editIndex !== null) {
                    this.lectures[editIndex] = tempLectureData;
                } else {
                    this.lectures.push(tempLectureData);
                }
                
                store.setLocalStorage(this.lectures);
                window.location.href = "profLec.html"; 
            }
        });

        // 3. 모달 내 [취소] 버튼 클릭 시
        $("#cancelBtn").addEventListener("click", () => {
            tempLectureData = null; // 데이터 비우기
            $("#modalOverlay").style.display = "none";
        });
    };
}

const lectureManager = new LectureManager();
lectureManager.init();