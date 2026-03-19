// 2. 데이터 정의
const majorData = {
  "hightech": ["빅데이터인공지능학과", "글로벌AI학과"],
  "nature": ["식품영양전공", "의료공학전공", "안전공학전공", "화장품과학전공"],
  "human": ["사회복지전공", "중독상담전공", "장례산업전공", "레저산업전공"]
};


function initFilters() {
  const collegeSelect = document.querySelector('select[name="college"]');
  const majorSelect = document.getElementById('major-filter');
  const gradeSelect = document.getElementById('grade-filter');
  const sortSelect = document.querySelector('select[name="sort"]');
  const weekSelect = document.querySelector('select[name="week"]');

  // 학과 활성화를 결정하는 공통 함수
  function updateMajorStatus() {
    const isCollegeSelected = collegeSelect.value !== "all-college";
    // [수정된 조건] 구분이 '전공(sort-major)'일 때만 활성화 조건에 포함
    const isMajorSortSelected = sortSelect.value === "sort-major";

    // 학부를 선택했거나, 구분에서 '전공'을 선택했다면 학과 활성화
    if (isCollegeSelected || isMajorSortSelected) {
      majorSelect.disabled = false;
    } else {
      // 그 외의 경우(교양 선택 등)에는 학과 비활성화 및 초기화
      majorSelect.disabled = true;
      majorSelect.value = "all-major";
      // 학과가 비활성화되면 연쇄적으로 학년도 비활성화하기 위해 이벤트 발생
      majorSelect.dispatchEvent(new Event('change')); 
    }
  }

  // 1. 학부 변경 시
  collegeSelect.addEventListener('change', function() {
    const selectedCollege = this.value;
    
    // 학과 옵션 초기화 및 데이터 로드
    majorSelect.innerHTML = '<option value="all-major" selected>전체</option>';
    if (selectedCollege !== "all-college") {
      const majors = majorData[selectedCollege] || [];
      majors.forEach(major => {
        const option = document.createElement('option');
        option.value = major;
        option.textContent = major;
        majorSelect.appendChild(option);
      });
    }

    updateMajorStatus();
  });

  // 2. 구분 변경 시
  sortSelect.addEventListener('change', function() {
    // 요일 활성화 (전체만 아니면 활성화)
    if (this.value !== "all-sort") {
      weekSelect.disabled = false;
    } else {
      weekSelect.disabled = true;
      weekSelect.value = "all-week";
    }
    
    // '전공' 선택 여부에 따라 학과 활성화 상태 업데이트
    updateMajorStatus();
  });

  // 3. 학과 변경 시
  majorSelect.addEventListener('change', function() {
    if (this.value !== "all-major" && this.value !== "") {
      gradeSelect.disabled = false;
    } else {
      gradeSelect.disabled = true;
      gradeSelect.value = "all-grade";
    }
  });

  // 초기 실행: 모든 필터 상태 세팅
  updateMajorStatus();
}