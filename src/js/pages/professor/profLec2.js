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
        $('input[name="lecture-max"]').value = data.max || "";
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
        const max = $('input[name="lecture-max"]').value;
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
            e.preventDefault(); // 폼 제출 기본 동작 방지
            
            // 유효성 검사 실행 (여기서 비어있으면 alert가 뜸)
            const data = getFormData(); 

            if (!data) {
                return; 
            }

            // 2. 데이터가 정상적으로 있을 때만 모달 관련 로직 실행
            tempLectureData = data; 
            
            const modalText = $(".modal-text");
            if (editIndex !== null) {
                modalText.innerText = "변경사항을 저장하시겠습니까?";
            } else {
                modalText.innerText = "새 강좌를 등록하시겠습니까?";
            }
            
            // 3. 모든 조건이 만족될 때만 모달을 화면에 표시
            $("#modalOverlay").style.display = "flex";
        });

        // 2. 모달 내 [확인] 버튼 클릭 시
        $("#confirmBtn").addEventListener("click", () => {
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

        // 3. 모달 내 [취소] 버튼
        $("#cancelBtn").addEventListener("click", () => {
            tempLectureData = null;
            $("#modalOverlay").style.display = "none";
        });
    };
}

const lectureManager = new LectureManager();
lectureManager.init();