// /src/js/pages/student/lec_filter.js

export const filterLectures = (allLectures) => {
    // 1. 모든 필터 요소의 현재 값 가져오기 (공백 제거 및 소문자 변환)
    const searchText = document.querySelector('.lecture-search').value.trim().toLowerCase();
    const college = document.querySelector('select[name="college"]').value;
    const major = document.querySelector('#major-filter').value;
    const grade = document.querySelector('#grade-filter').value;
    const sort = document.querySelector('select[name="sort"]').value;
    const week = document.querySelector('select[name="week"]').value;
    const score = document.querySelector('select[name="score"]').value;

    // [콘솔 확인] 현재 선택된 필터 조건 출력
    console.log("--- 필터 조건 확인 ---");
    console.log(`검색어: "${searchText}", 대학: ${college}, 학과: ${major}, 학년: ${grade}, 구분: ${sort}, 요일: ${week}, 학점: ${score}`);

    // 2. 필터링 로직 실행
    const filteredData = allLectures.filter(lec => {
        
        // [수정 사항 1 & 2] 통합 검색 로직 (한국어 및 모든 필드 대응)
        // 객체의 모든 값(title, college, major 등)을 하나의 문자열로 합쳐 검색어가 포함되었는지 확인합니다.
        const allValueString = Object.values(lec).join(" ").toLowerCase();
        const matchesSearch = !searchText || allValueString.includes(searchText);
        
        // 드롭다운 필터 조건 (각 항목이 '전체'이거나 데이터와 일치해야 함)
        const matchesCollege = college === 'all-college' || lec.college === college;
        const matchesMajor = major === 'all-major' || lec.major === major;
        const matchesGrade = grade === 'all-grade' || lec.grade === grade;
        const matchesSort = sort === 'all-sort' || lec.type === sort;
        const matchesWeek = week === 'all-week' || lec.day === week;
        const matchesScore = score === 'all-score' || lec.credit === score;

        // 모든 조건을 동시에 만족(AND)하는 데이터만 반환
        return matchesSearch && matchesCollege && matchesMajor && matchesGrade && matchesSort && matchesWeek && matchesScore;
    });

    // [콘솔 확인] 필터링된 최종 결과 데이터 출력
    console.log("필터링 결과 데이터:", filteredData);
    console.log(`총 ${filteredData.length}건이 검색되었습니다.`);
    
    return filteredData;
};