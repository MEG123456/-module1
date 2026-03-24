document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".container-main");

if (container && !container.querySelector("#my-lecture-list")) {
    fetch("/pages/student/my_classRoom.html")
        .then(res => res.text())
        .then(data => {
            container.insertAdjacentHTML("beforeend", data);

            if (window.renderStudentLectures) {
                window.renderStudentLectures();
            }
        });
}

    const $ = (selector) => document.querySelector(selector);

    // 학생이 선택한 강의 인덱스 확인
    const selectedLecIndex = localStorage.getItem("selectedStuLecIndex");

    // 과목 미선택 시 안내
    if (selectedLecIndex === null) {
        const checkEmpty = setInterval(() => {
            const mainContainer = $(".gb-main");
            if (mainContainer) {
                clearInterval(checkEmpty);
                mainContainer.innerHTML = `
                    <div style="text-align:center; padding:100px;">
                        <p>왼쪽 [수강 강의 목록]에서 과목을 먼저 선택해 주세요.</p>
                    </div>`;
            }
        }, 50);
        return;
    }

    // 수강평 전용 storageKey (과목별로 구분)
    const storageKey = `lecReviews_${selectedLecIndex}`;
    let reviewList = JSON.parse(localStorage.getItem(storageKey)) || [];

    function saveToLocalStorage() {
        localStorage.setItem(storageKey, JSON.stringify(reviewList));
    }

    // --- 모달 제어 함수 ---
    const showModal = (message, hasButtons = true) => {
        const modal = $("#modalOverlay");
        const confirmBtn = $("#confirmBtn");
        const cancelBtn = $("#cancelBtn");

        $("#modalMessage").innerText = message;

        if (hasButtons) {
            confirmBtn.style.display = "inline-block";
            cancelBtn.style.display = "inline-block";
        } else {
            confirmBtn.style.display = "none";
            cancelBtn.style.display = "none";
        }
        modal.style.display = "flex";
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

    $("#cancelBtn").addEventListener("click", closeModal);

    // HTML 로드 대기 후 렌더링
    const checkExist = setInterval(() => {
        const mainContainer = $(".gb-main");
        if (mainContainer) {
            clearInterval(checkExist);
            renderList();
        }
    }, 50);

    // 1. 수강평 목록 보기
    function renderList() {
        const mainContainer = $(".gb-main");
        if (!mainContainer) return;

        let tableRows = "";
        if (reviewList.length === 0) {
            tableRows = `<tr><td colspan="4" style="padding: 50px; color: #898A8D; text-align:center;">작성된 수강평이 없습니다.</td></tr>`;
        } else {
            tableRows = reviewList.map(item => `
                <tr>
                    <td>${String(item.id).padStart(2, '0')}</td>
                    <td class="txt-title view-detail" data-id="${item.id}" style="cursor:pointer;">
                        ${item.title}
                    </td>
                    <td>${item.date}</td>
                    <td class="btn-td">
                        <button class="edit-btn" data-id="${item.id}" style="cursor:pointer;">수정</button>
                        <button class="delete-btn" data-id="${item.id}" style="cursor:pointer;">삭제</button>
                    </td>
                </tr>
            `).join('');
        }

        const savedIndex = localStorage.getItem("selectedStuLecIndex");
        const isEnabled = savedIndex !== null ? "enabled" : "";

        mainContainer.innerHTML = `
            <div class="top-menu">
                <button class="menu-btn ${isEnabled}" onclick="location.href='/pages/student/my_lecNotice.html'">공지사항</button>
                <button class="menu-btn active ${isEnabled}" onclick="location.href='/pages/student/my_lecReview.html'">수강평</button>
            </div>
            <div id="page-content">
                <div class="notice-container">
                    <div class="notice-top">
                        <div class="total-count">Total <span>${reviewList.length}</span>건</div>
                        <button class="write-btn" id="go-write" style="cursor:pointer;">작성하기</button>
                    </div>
                    <table class="notice-table">
                        <thead>
                            <tr>
                                <th style="width:10%">번호</th>
                                <th style="width:50%">제목</th>
                                <th style="width:20%">작성일</th>
                                <th style="width:20%">관리</th>
                            </tr>
                        </thead>
                        <tbody>${tableRows}</tbody>
                    </table>
                </div>
            </div>
        `;

        document.querySelectorAll(".view-detail").forEach(el => {
            el.addEventListener("click", () => renderDetail(parseInt(el.dataset.id)));
        });
        $("#go-write").addEventListener("click", () => renderWriteForm());

        document.querySelectorAll(".edit-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                renderWriteForm(reviewList.find(item => item.id === parseInt(btn.dataset.id)));
            });
        });

        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const deleteId = parseInt(btn.dataset.id);

                showModal("수강평을 삭제하시겠습니까?");
                initConfirmBtn(() => {
                    reviewList = reviewList.filter(item => item.id !== deleteId);
                    saveToLocalStorage();

                    // 삭제 완료 안내 (버튼 없음)
                    showModal("삭제되었습니다.", false);
                    setTimeout(() => {
                        closeModal();
                        renderList();
                    }, 1000);
                });
            });
        });
    }

    // 2. 수강평 상세 보기
    function renderDetail(id) {
        const review = reviewList.find(item => item.id === id);
        const mainContainer = $(".gb-main");

        mainContainer.innerHTML = `
            <div class="top-menu">
                <button class="menu-btn" onclick="location.href='/pages/student/my_lecNotice.html'">공지사항</button>
                <button class="menu-btn active" onclick="location.href='/pages/student/my_lecReview.html'">수강평</button>
            </div>
            <div id="page-content">
                <div class="notice-detail-view">
                    <div class="detail-back-container">
                        <button class="back-to-list" id="go-list" style="cursor:pointer;">목록으로</button>
                    </div>
                    <div class="detail-table-wrapper">
                        <div class="detail-header-row">
                            <span class="detail-id">${String(review.id).padStart(2, '0')}.</span>
                            <span class="detail-title-text">${review.title}</span>
                            <span class="detail-date-text">${review.date}</span>
                        </div>
                        <div class="detail-content-area">
                            <div class="content-text">${(review.content || "").replace(/\n/g, '<br>')}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        $("#go-list").addEventListener("click", renderList);
    }

    // 3. 수강평 작성/수정 폼
    function renderWriteForm(review = null) {
        const isEdit = review !== null;
        const mainContainer = $(".gb-main");

        mainContainer.innerHTML = `
            <div class="notice-write-container">
                <div class="write-header"><p>수강평 ${isEdit ? '수정' : '작성'}</p></div>
                <div class="write-form">
                    <div class="form-item">
                        <div class="notice-title">
                            <label class="title-label">제목</label>
                            <input type="text" id="review-title" placeholder="수강평 제목을 입력하세요" value="${isEdit ? review.title : ''}">
                        </div>
                    </div>
                    <div class="form-item">
                        <textarea id="review-content" placeholder="강의에 대한 솔직한 후기를 남겨주세요">${isEdit ? review.content : ''}</textarea>
                    </div>
                    <div class="btn-container">
                        <button class="btn-submit" id="btn-save" style="cursor:pointer;">${isEdit ? '수정' : '등록'}</button>
                        <button class="btn-submit" id="btn-cancel" style="background:#888; margin-left:10px; cursor:pointer;">취소</button>
                    </div>
                </div>
            </div>
        `;

        $("#btn-cancel").addEventListener("click", renderList);

        $("#btn-save").addEventListener("click", () => {
            const title = $("#review-title").value;
            const content = $("#review-content").value;

            if (!title || !content) {
                showModal("제목과 내용을 모두 입력해주세요.", true);
                $("#cancelBtn").style.display = "none"; // 경고 시 확인 버튼만
                initConfirmBtn(closeModal);
                return;
            }

            const msg = isEdit ? "수강평을 수정하시겠습니까?" : "수강평을 등록하시겠습니까?";
            showModal(msg);

            initConfirmBtn(() => {
                const dateStr = new Date().toLocaleDateString();
                if (isEdit) {
                    const idx = reviewList.findIndex(r => r.id === review.id);
                    reviewList[idx] = { ...reviewList[idx], title, content, date: dateStr + " (수정됨)" };
                } else {
                    reviewList.unshift({
                        id: reviewList.length > 0 ? Math.max(...reviewList.map(o => o.id)) + 1 : 1,
                        title, content, date: dateStr
                    });
                }
                saveToLocalStorage();

                // 등록/수정 완료 안내 (버튼 없음)
                showModal(isEdit ? "수정되었습니다." : "등록되었습니다.", false);
                setTimeout(() => {
                    closeModal();
                    renderList();
                }, 1000);
            });
        });
    }
});