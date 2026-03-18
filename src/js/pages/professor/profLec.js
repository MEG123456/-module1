// + 등록 버튼 누르면 profLec2랑 연결
// - profLec2에서 강의 정보 입력 받고 저장 버튼 누르면 모달 뜨고 저장
//         - 강의명, 교수명, 정원, 요일/시간, 구분(전공/교양), 학점, 강의실, 설명을 입력 후 
//         "확인" 버튼 클릭하면 도서가 추가된다.
//         - 입력된 도서명 또는 가격 값이 누락되었을 경우 추가되지 않는다. (예외사항)
//         - 도서 추가가 완료되면 입력 필드는 초기화(?)
// - 저장된 정보를 profLec의 표에 맞춰 반영

document.getElementById('enrollBtn').addEventListener('click', function() {
    window.location.href = "profLec2.html";
});



const $ = (selector) => document.querySelector(selector);
