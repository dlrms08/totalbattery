function changeLanguage(lang) {
    // 변경된 코드: 텍스트 링크에 active 추가/제거
    document.querySelectorAll(".language-selector a").forEach(el => el.classList.remove("active"));
    document.querySelector(`[onclick="changeLanguage('${lang}')"]`).classList.add("active");

    // 다국어 텍스트 변경 기능은 그대로 유지
    document.querySelectorAll("[data-lang]").forEach(el => {
        let translations = JSON.parse(el.getAttribute("data-lang"));
        el.innerHTML = translations[lang];
    });
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
    fetch(url)
        .then(res => res.json())
        .then(items => {
            const container = document.getElementById(containerId);
            items.forEach(item => container.appendChild(builder(item)));
        });
}

loadData({
    url: "data/games.json",
    containerId: "game-list",
    builder: createGameElement
});

loadData({
    url: "data/prototypes.json",
    containerId: "prototype-list",
    builder: createGameElement
});

loadData({
    url: "data/projects.json",
    containerId: "project-list",
    builder: createProjectCard
});
