// 1. HTML 불러오기
fetch("/pages/student/stuLecList.html")
  .then((response) => response.text())
  .then((responseText) => {
    document.querySelector(".container-main").insertAdjacentHTML("afterbegin", responseText);
    
    // HTML이 화면에 그려진 "직후"에 필터 초기화 함수 실행!
    initFilters();
  });

// 2. 데이터 정의
const majorData = {
  "hightech": ["빅데이터인공지능학과", "글로벌AI학과"],
  "nature": ["식품영양전공", "의료공학전공", "안전공학전공", "화장품과학전공"],
  "human": ["사회복지전공", "중독상담전공", "장례산업전공", "레저산업전공"]
};

// 3. 필터 제어 함수
function initFilters() {
  // 함수 안에서 요소를 찾아야 fetch로 불러온 HTML 안의 요소들을 잡을 수 있어.
  const collegeSelect = document.querySelector('select[name="college"]');
  const majorSelect = document.getElementById('major-filter');
  const gradeSelect = document.getElementById('grade-filter');
  const sortSelect = document.querySelector('select[name="sort"]');
  const weekSelect = document.querySelector('select[name="week"]');

  // [조건 1] 학부 -> 학과 -> 학년
  collegeSelect.addEventListener('change', function() {
    const selectedCollege = this.value;
    majorSelect.innerHTML = '<option value="all-major" selected>전체</option>';

    if (selectedCollege !== "all-college") {
      const majors = majorData[selectedCollege] || []; 
      majors.forEach(major => {
        const option = document.createElement('option');
        option.value = major;
        option.textContent = major;
        majorSelect.appendChild(option);
      });
      majorSelect.disabled = false;
    } else {
      majorSelect.disabled = true;
    }
    majorSelect.dispatchEvent(new Event('change'));
  });

  majorSelect.addEventListener('change', function() {
    if (this.value !== "all-major" && this.value !== "") {
      gradeSelect.disabled = false;
    } else {
      gradeSelect.disabled = true;
      gradeSelect.value = "all-grade";
    }
  });

  // [조건 2] 구분 -> 요일
  sortSelect.addEventListener('change', function() {
    if (this.value !== "all-sort") {
      weekSelect.disabled = false;
    } else {
      weekSelect.disabled = true;
      weekSelect.value = "all-week";
    }
  });

  // 초기 상태 설정
  weekSelect.disabled = true;
}