fetch("/pages/professor/my_lecMane.html")
    .then(res => res.text())
    .then(data => {
        document.querySelector(".container-main").insertAdjacentHTML("beforeend", data);
        window.dispatchEvent(new Event('mainHtmlLoaded'));
    });

document.addEventListener("DOMContentLoaded", () => {
    const $ = (selector) => document.querySelector(selector);

    const selectedLecIndex = localStorage.getItem("selectedLecIndex");

    if (selectedLecIndex === null) {
        const checkEmpty = setInterval(() => {
            const mainContainer = $(".gb-main");
            if (mainContainer) {
                clearInterval(checkEmpty);
                mainContainer.innerHTML = `
                    <div style="text-align:center; padding:100px;">
                        <p>왼쪽 [내 강의 목록]에서 과목을 먼저 선택해 주세요.</p>
                    </div>`;
            }
        }, 50);
        return;
    }

    const storageKey = `profNotices_${selectedLecIndex || 'default'}`;
    let noticeList = JSON.parse(localStorage.getItem(storageKey)) || [];
    let tempNoticeData = null;
    let isEditing = false;

    function saveToLocalStorage() {
        localStorage.setItem(storageKey, JSON.stringify(noticeList));
    }

    // --- 모달 제어 로직 ---
    const showModal = (message, showCancel = true, showConfirm = true) => {
        const modal = $("#modalOverlay");
        const msg = $("#modalMessage");
        const confirmBtn = $("#confirmBtn");
        const cancelBtn = $("#cancelBtn");

        if (modal && msg) {
            msg.innerText = message;
            cancelBtn.style.display = showCancel ? "inline-block" : "none";
            confirmBtn.style.display = showConfirm ? "inline-block" : "none";
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

    $("#cancelBtn").addEventListener("click", () => {
        closeModal();
        tempNoticeData = null;
    });

    const checkExist = setInterval(() => {
        const mainContainer = $(".gb-main");
        if (mainContainer) {
            clearInterval(checkExist);
            renderList();
            if (typeof applySelection === 'function') applySelection();
        }
    }, 50);

    function renderList() {
        const mainContainer = $(".gb-main");
        if (!mainContainer) return;

        let tableRows = noticeList.length === 0
            ? `<tr><td colspan="4" style="padding: 50px; color: #898A8D; text-align:center;">등록된 공지사항이 없습니다.</td></tr>`
            : noticeList.map(item => `
                <tr>
                    <td>${String(item.id).padStart(2, '0')}</td>
                    <td class="txt-title view-detail" data-id="${item.id}" style="cursor:pointer;">${item.title}</td>
                    <td>${item.date}</td>
                    <td class="btn-td">
                        <button class="edit-btn" data-id="${item.id}" style="cursor:pointer;">수정</button>
                        <button class="delete-btn" data-id="${item.id}" style="cursor:pointer;">삭제</button>
                    </td>
                </tr>`).join('');

        const savedIndex = localStorage.getItem("selectedLecIndex");
        const isEnabled = savedIndex !== null ? "enabled" : "";

        mainContainer.innerHTML = `
            <div class="top-menu">
                <button class="menu-btn active ${isEnabled}" onclick="location.href='/pages/professor/my_lecNotice.html'">공지사항</button>
                <button class="menu-btn ${isEnabled}" onclick="location.href='/pages/professor/my_studentList.html'">수강 학생</button>
            </div>
            <div id="page-content">
                <div class="notice-container">
                    <div class="notice-top">
                        <div class="total-count">Total <span>${noticeList.length}</span>건</div>
                        <button class="write-btn" id="go-write" style="cursor:pointer;">작성하기</button>
                    </div>
                    <table class="notice-table">
                        <thead><tr><th>번호</th><th>제목</th><th>등록일자</th><th></th></tr></thead>
                        <tbody>${tableRows}</tbody>
                    </table>
                </div>
            </div>`;

        $("#go-write").addEventListener("click", () => renderWriteForm());
        document.querySelectorAll(".view-detail").forEach(el => el.addEventListener("click", () => renderDetail(parseInt(el.dataset.id))));
        document.querySelectorAll(".edit-btn").forEach(btn => btn.addEventListener("click", (e) => {
            e.stopPropagation();
            renderWriteForm(noticeList.find(item => item.id === parseInt(btn.dataset.id)));
        }));

        document.querySelectorAll(".delete-btn").forEach(btn => btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const deleteId = parseInt(btn.dataset.id);
            showModal("정말 삭제하시겠습니까?");
            initConfirmBtn(() => {
                noticeList = noticeList.filter(item => item.id !== deleteId);
                saveToLocalStorage();

                // [삭제 완료 모달] 1초 노출
                showModal("삭제되었습니다.", false, false);
                setTimeout(() => {
                    closeModal();
                    renderList();
                }, 1000);
            });
        }));
    }

    function renderDetail(id) {
        const notice = noticeList.find(item => item.id === id);
        const mainContainer = $(".gb-main");

        mainContainer.innerHTML = `
            <div class="top-menu">
                <button class="menu-btn active" onclick="location.href='/pages/professor/my_lecNotice.html'">공지사항</button>
                <button class="menu-btn" onclick="location.href='/pages/professor/my_studentList.html'">수강 학생</button>
            </div>
            <div id="page-content">
                <div class="notice-detail-view">
                    <div class="detail-back-container"><button class="back-to-list" id="go-list" style="cursor:pointer;">목록으로 돌아가기</button></div>
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
            </div>`;

        $("#go-list").addEventListener("click", renderList);

        if (notice.fileName) {
            $("#file-download-link").addEventListener("click", (e) => {
                e.preventDefault();
                showModal(`${notice.fileName} 파일을 다운로드하시겠습니까?`);
                initConfirmBtn(() => {
                    showModal("서버 연결 시 파일이 다운로드됩니다.", false, false);
                    setTimeout(() => {
                        closeModal();
                    }, 1000);
                });
            });
        }
    }

    function renderWriteForm(notice = null) {
        const isEditMode = notice !== null;
        const mainContainer = $(".gb-main");

        mainContainer.innerHTML = `
            <div class="notice-write-container">
                <div class="write-header"><p>공지사항 ${isEditMode ? '수정' : '등록'}</p></div>
                <div class="write-form">
                    <div class="form-item"><div class="notice-title"><label class="title-label">제목</label>
                    <input type="text" id="notice-title" placeholder="공지사항 제목을 입력해주세요." value="${isEditMode ? notice.title : ''}"></div></div>
                    <div class="form-item"><textarea id="notice-content" placeholder="상세 내용을 입력해주세요.">${isEditMode ? notice.content : ''}</textarea></div>
                    <div class="form-item"><div class="file-box">
                    <input type="text" id="file-name-display" readonly placeholder="선택된 파일이 없습니다." value="${isEditMode && notice.fileName ? notice.fileName : ''}">
                    <label for="file-upload" class="file-label" style="cursor:pointer;">찾아보기</label><input type="file" id="file-upload" style="display:none"></div></div>
                    <div class="btn-container"><button class="btn-submit" id="btn-save" style="cursor:pointer;">${isEditMode ? '수정' : '등록'}</button></div>
                </div>
            </div>`;

        $("#file-upload").addEventListener("change", (e) => {
            $("#file-name-display").value = e.target.files[0]?.name || "";
        });

        $("#btn-save").addEventListener("click", () => {
            const titleInput = $("#notice-title").value;
            const content = $("#notice-content").value;
            const fileName = $("#file-name-display").value;

            if (!titleInput) {
                showModal("제목을 입력하세요.", false, true);
                initConfirmBtn(closeModal);
                return;
            }

            const dateStr = new Date().toLocaleDateString();
            isEditing = isEditMode;

            if (isEditMode) {
                let updatedDate = dateStr;
                if (!updatedDate.includes("(수정됨)")) updatedDate += " (수정됨)";
                tempNoticeData = { ...notice, title: titleInput, content, fileName, date: updatedDate };
                showModal("공지사항을 수정하시겠습니까?");
            } else {
                tempNoticeData = {
                    id: noticeList.length > 0 ? Math.max(...noticeList.map(o => o.id)) + 1 : 1,
                    title: titleInput, content, fileName, date: dateStr, views: 0
                };
                showModal("공지사항을 등록하시겠습니까?");
            }

            initConfirmBtn(() => {
                if (tempNoticeData) {
                    if (isEditing) {
                        const idx = noticeList.findIndex(n => n.id === tempNoticeData.id);
                        if (idx !== -1) noticeList[idx] = tempNoticeData;
                    } else {
                        noticeList.unshift(tempNoticeData);
                    }
                    saveToLocalStorage();

                    // [등록/수정 완료 모달] 1초 노출
                    const finishMsg = isEditing ? "수정되었습니다." : "등록되었습니다.";
                    showModal(finishMsg, false, false);

                    setTimeout(() => {
                        closeModal();
                        tempNoticeData = null;
                        renderList();
                    }, 1000);
                }
            });
        });
    }
});