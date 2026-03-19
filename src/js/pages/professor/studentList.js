document.addEventListener("DOMContentLoaded", () => {

    let selectedIndex = null;
    let isEditing = false;

    const interval = setInterval(() => {
    const target = document.querySelector("#page-content");

        if (target) {
            clearInterval(interval);

            const sidebarLinks = document.querySelectorAll('.student-sidebar li a');
            sidebarLinks.forEach(link => link.classList.remove('active'));
            sidebarLinks[1].classList.add('active'); 

            const buttons = document.querySelectorAll('.menu-btn');
            buttons.forEach(btn => btn.classList.remove('active'));
            buttons[1].classList.add('active');

            let students = JSON.parse(localStorage.getItem("students"));

            if (!students) {
                students = [
                    { id: "20230001", grade: "1", name: "홍길동", major: "컴공" },
                    { id: "20230002", grade: "2", name: "김철수", major: "경영" },
                ];
            }

            target.insertAdjacentHTML("beforeend", `
                <div class="student-layout">

                <div class="student-table-box">
                <div class="table-top">총 ${students.length}명</div>

                <div class="table-wrapper">
                    <table class="student-table">
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>학번</th>
                                <th>학년</th>
                                <th>이름</th>
                                <th>학과</th>
                                <th>메모</th>
                            </tr>
                        </thead>
                        <tbody id="student-tbody"></tbody>
                    </table>
                </div>
            </div>

            <div class="memo-wrapper">

                <div class="top-actions"></div> 

                <div class="memo-box">
                    <div class="memo-title">개인 메모</div>
                    <textarea class="memo-area"></textarea>
                </div>

            </div>

        </div>
    `);

            const tbody = document.getElementById("student-tbody");

            students.forEach((s, i) => {
                tbody.insertAdjacentHTML("beforeend", `
                    <tr>
                        <td>${i + 1}</td>
                        <td>${s.id}</td>
                        <td>${s.grade}</td>
                        <td>${s.name}</td>
                        <td>${s.major}</td>
                        <td>
                            <button class="memo-btn" data-index="${i}">보기</button>
                        </td>
                    </tr>
                `);
            });

            document.querySelectorAll('.memo-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {

                    const index = e.target.dataset.index;
                    selectedIndex = index;

                    document.querySelectorAll('#student-tbody tr').forEach(tr => {
                        tr.classList.remove('selected-row');
                    });

                    const row = e.target.closest('tr');
                    row.classList.add('selected-row');

                    const student = students[index];
                    const textarea = document.querySelector('.memo-area');

                    textarea.value = student.memo || "";
                    textarea.readOnly = true;

                    if (student.memo && student.memo.trim() !== "") {
                        document.querySelector('.top-actions').innerHTML = `
                            <button class="edit-btn">수정</button>
                            <button class="delete-btn">삭제</button>
                        `;
                    } else {
                        document.querySelector('.top-actions').innerHTML = `
                            <button class="save-btn">저장</button>
                        `;
                    }

                    isEditing = false;
                });
            });

            document.querySelector('.top-actions').addEventListener('click', (e) => {

                const textarea = document.querySelector('.memo-area');

                if (e.target.classList.contains('save-btn')) {

                    textarea.readOnly = true;

                    const value = textarea.value;

                    students[selectedIndex].memo = value;

                    localStorage.setItem("students", JSON.stringify(students));

                    alert("메모가 성공적으로 등록되었습니다");

                    e.currentTarget.innerHTML = `
                        <button class="edit-btn">수정</button>
                        <button class="delete-btn">삭제</button>
                    `;
                }

                if (e.target.classList.contains('edit-btn')) {

                    isEditing = true;

                    textarea.readOnly = false;

                    e.currentTarget.innerHTML = `
                        <button class="save-btn">저장</button>
                        <button class="cancel-btn">취소</button>
                    `;
                }

                if (e.target.classList.contains('cancel-btn')) {

                    const student = students[selectedIndex];
                    textarea.value = student.memo || "";
                    textarea.readOnly = true;

                    isEditing = false;

                    e.currentTarget.innerHTML = `
                        <button class="edit-btn">수정</button>
                        <button class="delete-btn">삭제</button>
                    `;
                }

                if (e.target.classList.contains('delete-btn')) {

                    if (confirm("정말 삭제하시겠습니까?")) {

                        students[selectedIndex].memo = "";

                        localStorage.setItem("students", JSON.stringify(students));

                        textarea.value = "";

                        e.currentTarget.innerHTML = `
                            <button class="save-btn">저장</button>
                        `;
                    }
                }

            });

        }
    }, 50);
});