// 1. 사용할 요소들 가져오기
const saveBtn = document.getElementById('saveBtn');      // 메인 저장 버튼
const modal = document.getElementById('modalOverlay');   // 모달 전체
const confirmBtn = document.getElementById('confirmBtn'); // 모달 안 확인 버튼
const cancelBtn = document.getElementById('cancelBtn');   // 모달 안 취소 버튼

// 2. 저장 버튼 클릭 시 -> 모달 나타남
saveBtn.addEventListener('click', () => {
    modal.classList.add('active'); 
});

// 3. 취소 버튼 클릭 시 -> 모달 사라짐
cancelBtn.addEventListener('click', () => {
    modal.classList.remove('active');
});

// 4. 확인 버튼 클릭 시 -> 알림창 띄우고 모달 사라짐
confirmBtn.addEventListener('click', () => {
    alert("저장되었습니다!");
    modal.classList.remove('active');
});