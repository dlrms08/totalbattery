// 🌍 페이지 오픈시 자동 언어 감지 (기본: 영어)
function detectAndSetLanguage() {
    // 브라우저 언어 감지
    const browserLanguage = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    
    // 한국어, 일본어만 감지, 나머지는 모두 영어 (기본값)
    let detectedLang = 'en';
    if (browserLanguage.startsWith('ko')) {
        detectedLang = 'ko';
    } else if (browserLanguage.startsWith('ja')) {
        detectedLang = 'ja';
    }
    
    // 감지된 언어로 설정
    changeLanguage(detectedLang);
}

function changeLanguage(lang) {
    // 텍스트 링크에 active 추가/제거
    document.querySelectorAll(".language-selector a").forEach(el => el.classList.remove("active"));
    document.querySelector(`[onclick="changeLanguage('${lang}')"]`).classList.add("active");

    // 다국어 텍스트 변경
    document.querySelectorAll("[data-lang]").forEach(el => {
        let translations = JSON.parse(el.getAttribute("data-lang"));
        el.innerHTML = translations[lang];
    });

    // HTML lang 속성 업데이트
    document.documentElement.lang = lang;
}

function createGameElement(game) {
    const gameDiv = document.createElement("div");
    gameDiv.classList.add("card");

    // 플레이 버튼 생성 (조건부)
    const playButton = game.embed
        ? `<a href="${game.embed}" target="_blank" class="game-links" data-lang='${JSON.stringify({ko:"플레이", en:"Play", ja:"プレイ"})}'>플레이</a><span> | </span>`
        : "";

    // disc가 비어 있으면 추가하지 않음
    const discHTML = game.disc && game.disc.ko.trim() !== ""
        ? `<div class="card-desc" data-lang='${JSON.stringify(game.disc)}'>${game.disc.ko}</div>`
        : "";

    gameDiv.innerHTML = `
        <img src="${game.img}" alt="${game.alt}">
        <div class="card-title" data-lang='${JSON.stringify(game.title)}'>${game.title.ko}</div>
        <div class="card-actions">
            ${playButton}
            <a href="${game.link}" target="_blank" class="game-links" data-lang='${JSON.stringify({ko:"자세히 보기", en:"More Info", ja:"詳細を見る"})}'>자세히 보기</a>
        </div>
        ${discHTML}
    `;
    
    return gameDiv;
}


function createProjectCard(project) {
    const div = document.createElement("div");
    div.className = "card";
    // 플랫폼 링크들 동적으로 생성
    const platformLinks = project.platforms
        .map(p => `<a href="${p.url}" target="_blank" class="platform-link">${p.label}</a>`)
        .join(" | ");

        // disc가 비어 있으면 추가하지 않음
    const discHTML = project.disc && project.disc.ko.trim() !== ""
        ? `<div class="card-desc" data-lang='${JSON.stringify(project.disc)}'>${project.disc.ko}</div>`
        : "";

    div.innerHTML = `
        <img src="${project.img}" alt="${project.alt}">
        <div class="card-title" data-lang='${JSON.stringify(project.title)}'>${project.title.ko}</div>
        <div class="platform-links">${platformLinks}</div>
        ${discHTML}
    `;
    return div;
}

function loadData({ url, containerId, builder }) {
    return fetch(url)
        .then(res => res.json())
        .then(items => {
            const container = document.getElementById(containerId);
            items.forEach(item => container.appendChild(builder(item)));
        });
}

// 모든 데이터 로드가 완료된 후 언어 설정
Promise.all([
    loadData({
        url: "data/games.json",
        containerId: "game-list",
        builder: createGameElement
    }),
    loadData({
        url: "data/prototypes.json",
        containerId: "prototype-list",
        builder: createGameElement
    }),
    loadData({
        url: "data/projects.json",
        containerId: "project-list",
        builder: createProjectCard
    })
]).then(() => {
    // 모든 데이터 로드 완료 후 자동 언어 감지
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", detectAndSetLanguage);
    } else {
        detectAndSetLanguage();
    }
});
