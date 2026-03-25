// lec_data.js

// 1. 더미 데이터 정의
const dummyLectures = [
    {
        title: "인공지능 개론",
        prof: "김철수",
        college: "advanced_school",
        major: "빅데이터인공지능학과",
        grade: "second",
        type: "m", // 전공
        day: "mon",
        credit: "3",
        time: "09:00~12:00"
    },
    {
        title: "데이터 구조",
        prof: "이영희",
        college: "advanced_school",
        major: "빅데이터인공지능학과",
        grade: "first",
        type: "m",
        day: "wed",
        credit: "3",
        time: "13:00~16:00"
    },
    {
        title: "기초 간호학",
        prof: "박지성",
        college: "nursing_college",
        major: "간호학과",
        grade: "first",
        type: "m",
        day: "tue",
        credit: "2",
        time: "10:00~12:00"
    },
    {
        title: "심리학의 이해",
        prof: "최유리",
        college: "human_social_school",
        major: "사회복지전공",
        grade: "all-grade",
        type: "e", // 교양
        day: "thu",
        credit: "2",
        time: "15:00~17:00"
    },
    {
        title: "의학 입문",
        prof: "정민수",
        college: "medical_college",
        major: "의예과",
        grade: "first",
        type: "m",
        day: "fri",
        credit: "3",
        time: "09:00~12:00"
    },
    {
        title: "디자인 사고",
        prof: "홍길동",
        college: "human_social_school",
        major: "시각디자인전공",
        grade: "third",
        type: "m",
        day: "mon",
        credit: "3",
        time: "14:00~17:00"
    },
    {
        title: "교양 영어",
        prof: "James",
        college: "all-college",
        major: "all-major",
        grade: "all-grade",
        type: "e",
        day: "tue",
        credit: "1",
        time: "09:00~10:00"
    },
    {
        title: "빅데이터 분석",
        prof: "강호동",
        college: "advanced_school",
        major: "빅데이터인공지능학과",
        grade: "fourth",
        type: "m",
        day: "thu",
        credit: "3",
        time: "10:00~13:00"
    }
];

// 2. LocalStorage에 저장 (기존 데이터가 없을 때만 저장하거나 시연을 위해 새로고침 시 강제 업데이트)
function initDummyData() {
    // 시연을 위해 매번 새로 데이터를 넣고 싶다면 아래 한 줄만 사용
    localStorage.setItem("lectures_all", JSON.stringify(dummyLectures));
    console.log("시연용 강의 데이터가 로드되었습니다.");
}

initDummyData();