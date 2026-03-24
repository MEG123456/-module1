fetch("/pages/student/my_classRoom.html")
    .then(res => res.text())
    .then(data => {
        document.querySelector(".container-main").insertAdjacentHTML("beforeend", data);
    });

document.addEventListener("DOMContentLoaded", () => {
    const $ = (selector) => document.querySelector(selector);

    // 교수용과 동일한 인덱스 키를 사용해야 데이터를 가져옴
    const selectedLecIndex = localStorage.getItem("selectedStuLecIndex"); // 학생용으로 저장된 인덱스
    
    if (selectedLecIndex === null) {
        const checkEmpty = setInterval(() => {
            const mainContainer = $(".gb-main");
            if(mainContainer) {
                clearInterval(checkEmpty);
                mainContainer.innerHTML = `
                    <div style="text-align:center; padding:100px;">
                        <p>왼쪽 [수강 강의 목록]에서 과목을 먼저 선택해 주세요.</p>
                    </div>`;
            }
        }, 50);
        return; 
    }
    
    // 교수가 저장한 키값(`profNotices_인덱스`)과 동일하게 맞춤
    const storageKey = `profNotices_${selectedLecIndex}`;
    let noticeList = JSON.parse(localStorage.getItem(storageKey)) || [];

    // --- 모달 제어 함수 ---
    const showModal = (message, showCancel = true) => {
        const modal = $("#modalOverlay");
        const msg = $("#modalMessage");
        const cancelBtn = $("#cancelBtn");
        if (modal && msg) {
            msg.innerText = message;
            cancelBtn.style.display = showCancel ? "inline-block" : "none";
            modal.style.display = "flex";
        }
    };

    const closeModal = () => {
        const modal = $("#modalOverlay");
        if (modal) modal.style.display = "none";
    };

    const initConfirmBtn = (callback) => {
        const confirmBtn = $("#confirmBtn");
        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
        newConfirmBtn.addEventListener("click", callback);
    };

    // 모달 취소 버튼 이벤트 바인딩
    const cancelBtn = $("#cancelBtn");
    if (cancelBtn) {
        cancelBtn.onclick = closeModal;
    }

    const checkExist = setInterval(() => {
        const mainContainer = $(".gb-main");
        if (mainContainer) {
            clearInterval(checkExist);
            renderList();
        }
    }, 50);

    // 목록 렌더링
    function renderList() {
        const mainContainer = $(".gb-main");
        if (!mainContainer) return;

        let tableRows = "";
        if (noticeList.length === 0) {
            tableRows = `<tr><td colspan="3" style="padding: 50px; color: #898A8D; text-align:center;">등록된 공지사항이 없습니다.</td></tr>`;
        } else {
            tableRows = noticeList.map(item => `
                <tr>
                    <td>${String(item.id).padStart(2, '0')}</td>
                    <td class="txt-title view-detail" data-id="${item.id}" style="cursor:pointer;">
                        ${item.title}
                    </td>
                    <td>${item.date}</td>
                </tr>
            `).join('');
        }

        const savedIndex = localStorage.getItem("selectedLecIndex");
        const isEnabled = savedIndex !== null ? "enabled" : "";

        mainContainer.innerHTML = `
            <div class="top-menu">
                <button class="menu-btn active ${isEnabled}" onclick="location.href='/pages/student/my_lecNotice.html'">공지사항</button>
                <button class="menu-btn ${isEnabled}" onclick="location.href='/pages/student/my_lecReview.html'">수강평</button>
            </div>
            <div id="page-content">
                <div class="notice-container">
                    <div class="notice-top">
                        <div class="total-count">Total <span>${noticeList.length}</span>건</div>
                        </div>
                    <table class="notice-table">
                        <thead>
                            <tr>
                                <th style="width:10%">번호</th>
                                <th style="width:70%">제목</th>
                                <th style="width:20%">등록일자</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // 상세 보기 클릭 이벤트
        document.querySelectorAll(".view-detail").forEach(el => {
            el.addEventListener("click", () => renderDetail(parseInt(el.dataset.id)));
        });
    }

    // 상세 보기 렌더링
    function renderDetail(id) {
        const notice = noticeList.find(item => item.id === id);
        const mainContainer = $(".gb-main");

        mainContainer.innerHTML = `
            <div class="top-menu">
                <button class="menu-btn active" onclick="location.href='/pages/student/my_lecNotice.html'">공지사항</button>
                <button class="menu-btn" onclick="location.href='/pages/student/my_lecReview.html'">수강평</button>
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

        $("#go-list").addEventListener("click", renderList);

        if (notice.fileName) {
            $("#file-download-link").addEventListener("click", (e) => {
                e.preventDefault();
                
                // confirm 모달 사용
                showModal(`${notice.fileName} 파일을 다운로드하시겠습니까?`);
                
                initConfirmBtn(() => {
                    closeModal();
                    // 모달 안내 (취소 버튼 없음)
                    setTimeout(() => {
                        showModal("파일 다운로드가 시작됩니다.", false);
                        initConfirmBtn(closeModal);
                    }, 200);
                });
            });
        }
    }
});