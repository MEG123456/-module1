// 1. 외부 HTML 가져오기 (이 작업이 완료된 후 리스트를 그려야 안전합니다)
fetch("/pages/professor/myLecMane.html")
    .then(res => res.text())
    .then(data => {
        document.querySelector(".container-main").insertAdjacentHTML("beforeend", data);
        // HTML이 삽입된 직후에 실행되도록 이벤트 발생
        window.dispatchEvent(new Event('mainHtmlLoaded'));
    });

document.addEventListener("DOMContentLoaded", () => {
    // 선택된 과목 인덱스 확인
    const selectedLecIndex = localStorage.getItem("selectedLecIndex");
    
    // 과목 선택이 안 된 경우 안내 메시지 출력
    if (selectedLecIndex === null) {
        const mainContainer = document.querySelector(".gb-main");
        const checkEmpty = setInterval(() => {
            if(document.querySelector(".gb-main")) {
                clearInterval(checkEmpty);
                document.querySelector(".gb-main").innerHTML = `
                    <div style="text-align:center; padding:100px; color:#888;">
                        <p>왼쪽 [내 강의 목록]에서 과목을 먼저 선택해 주세요.</p>
                    </div>`;
            }
        }, 50);
        return; 
    }
    
    const storageKey = `profNotices_${selectedLecIndex || 'default'}`;
    let noticeList = JSON.parse(localStorage.getItem(storageKey)) || [];

    function saveToLocalStorage() {
        localStorage.setItem(storageKey, JSON.stringify(noticeList));
    }

    // HTML이 로드될 때까지 기다렸다가 실행하는 로직
    const checkExist = setInterval(() => {
        const mainContainer = document.querySelector(".gb-main");
        if (mainContainer) {
            clearInterval(checkExist);
            renderList();
            
            // [추가] 왼쪽 과목 리스트 강조 유지 함수 호출 (선택사항)
            if (typeof applySelection === 'function') applySelection();
        }
    }, 50);

    function renderList() {
        const mainContainer = document.querySelector(".gb-main");
        if (!mainContainer) return;

        let tableRows = "";
        if (noticeList.length === 0) {
            tableRows = `<tr><td colspan="4" style="padding: 50px; color: #898A8D; text-align:center;">등록된 공지사항이 없습니다.</td></tr>`;
        } else {
            tableRows = noticeList.map(item => `
                <tr>
                    <td>${String(item.id).padStart(2, '0')}</td>
                    <td class="txt-title view-detail" data-id="${item.id}" style="cursor:pointer;">
                        ${item.title}
                    </td>
                    <td>${item.date}</td>
                    <td class="btn-td">
                        <button class="edit-btn" data-id="${item.id}">수정</button>
                        <button class="delete-btn" data-id="${item.id}">삭제</button>
                    </td>
                </tr>
            `).join('');
        }

        mainContainer.innerHTML = `
            <div class="top-menu">
                <button class="menu-btn active" onclick="location.href='proflecNotice.html'">공지사항</button>
                <button class="menu-btn" onclick="location.href='studentList.html'">수강 학생</button>
            </div>
            <div id="page-content">
                <div class="notice-container">
                    <div class="notice-top">
                        <div class="total-count">Total <span>${noticeList.length}</span>건</div>
                        <button class="write-btn" id="go-write">작성하기</button>
                    </div>
                    <table class="notice-table">
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>제목</th>
                                <th>등록일자</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // 리스너 재등록
        document.querySelectorAll(".view-detail").forEach(el => {
            el.addEventListener("click", () => renderDetail(parseInt(el.dataset.id)));
        });
        document.querySelector("#go-write").addEventListener("click", () => renderWriteForm());
        
        // 수정/삭제 버튼 리스너
        document.querySelectorAll(".edit-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                renderWriteForm(noticeList.find(item => item.id === parseInt(btn.dataset.id)));
            });
        });

        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                if (confirm("정말 삭제하시겠습니까?")) {
                    noticeList = noticeList.filter(item => item.id !== parseInt(btn.dataset.id));
                    saveToLocalStorage();
                    renderList();
                }
            });
        });
    }

    function renderDetail(id) {
        const notice = noticeList.find(item => item.id === id);
        const mainContainer = document.querySelector(".gb-main");

        mainContainer.innerHTML = `
            <div class="top-menu">
                <button class="menu-btn active" onclick="location.href='proflecNotice.html'">공지사항</button>
                <button class="menu-btn" onclick="location.href='studentList.html'">수강 학생</button>
            </div>
            <div id="page-content">
                <div class="notice-detail-view">
                    <div class="detail-back-container">
                        <button class="back-to-list" id="go-list">목록으로 돌아가기</button>
                    </div>
                    <div class="detail-table-wrapper">
                        <div class="detail-header-row">
                            <span class="detail-id">${String(notice.id).padStart(2, '0')}.</span>
                            <span class="detail-title-text">${notice.title}</span>
                            <span class="detail-date-text">${notice.date}</span>
                        </div>
                        <div class="detail-content-area">
                            <div class="content-text">${(notice.content || "").replace(/\n/g, '<br>')}</div>
                            ${notice.fileName ? `
                            <div class="detail-file">
                                <a href="#" class="file-link" id="file-download-link" style="text-decoration:none;">
                                    <span class="file-name" style="cursor:pointer; color:#2E4298;">📁 ${notice.fileName}</span>
                                </a>
                            </div>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.querySelector("#go-list").addEventListener("click", renderList);

        if (notice.fileName) {
            document.querySelector("#file-download-link").addEventListener("click", (e) => {
                e.preventDefault();
                // [에러 수정] confirmAction 대신 직접 confirm 사용
                if (confirm(`${notice.fileName} 파일을 여시겠습니까?`)) {
                    alert("서버 연결 시 파일이 다운로드됩니다.");
                }
            });
        }
    }

    function renderWriteForm(notice = null) {
        const isEdit = notice !== null;
        const mainContainer = document.querySelector(".gb-main");

        mainContainer.innerHTML = `
            <div class="notice-write-container">
                <div class="write-header"><p>공지사항 ${isEdit ? '수정' : '등록'}</p></div>
                <div class="write-form">
                    <div class="form-item">
                        <div class="notice-title">
                            <label class="title-label">제목</label>
                            <input type="text" id="notice-title" value="${isEdit ? notice.title : ''}">
                        </div>
                    </div>
                    <div class="form-item">
                        <textarea id="notice-content">${isEdit ? notice.content : ''}</textarea>
                    </div>
                    <div class="form-item">
                        <div class="file-box">
                            <label class="title-label">파일 첨부</label>
                            <input type="text" id="file-name-display" readonly value="${isEdit && notice.fileName ? notice.fileName : ''}">
                            <label for="file-upload" class="file-label">찾아보기</label>
                            <input type="file" id="file-upload" style="display:none">
                        </div>
                    </div>
                    <div class="btn-container">
                        <button class="btn-submit" id="btn-save">${isEdit ? '수정' : '등록'}</button>
                    </div>
                </div>
            </div>
        `;

        document.querySelector("#file-upload").addEventListener("change", (e) => {
            document.querySelector("#file-name-display").value = e.target.files[0]?.name || "";
        });

        document.querySelector("#btn-save").addEventListener("click", () => {
            const title = document.querySelector("#notice-title").value;
            const content = document.querySelector("#notice-content").value;
            const fileName = document.querySelector("#file-name-display").value;

            if (!title) return alert("제목을 입력하세요.");

            const dateStr = new Date().toLocaleDateString();

            if (isEdit) {
                const idx = noticeList.findIndex(n => n.id === notice.id);
                noticeList[idx] = { ...noticeList[idx], title, content, fileName, date: dateStr + " (수정)" };
            } else {
                noticeList.unshift({
                    id: noticeList.length > 0 ? Math.max(...noticeList.map(o => o.id)) + 1 : 1,
                    title, content, fileName, date: dateStr, views: 0
                });
            }
            saveToLocalStorage();
            renderList();
        });
    }
});