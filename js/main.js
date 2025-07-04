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
    gameDiv.innerHTML = `
        <img src="${game.img}" alt="${game.alt}">
        <div class="card-title" data-lang='${JSON.stringify(game.title)}'>${game.title.ko}</div>
        <a href="${game.link}" target="_blank" class="game-links" data-lang='${JSON.stringify({ko:"자세히 보기", en:"More Info", ja:"詳細を見る"})}'>자세히 보기</a>
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
    div.innerHTML = `
        <img src="${project.img}" alt="${project.alt}">
        <div class="card-title" data-lang='${JSON.stringify(project.title)}'>${project.title.ko}</div>
        <div class="platform-links">${platformLinks}</div>
    `;
    return div;
}

fetch("data/games.json")
    .then(res => res.json())
    .then(games => {
        const container = document.querySelector(".game-list");
        games.forEach(game => container.appendChild(createGameElement(game)));
    });

fetch("data/prototypes.json")
    .then(res => res.json())
    .then(games => {
        const container = document.querySelector(".prototype-list");
        games.forEach(game => container.appendChild(createGameElement(game)));
    });

fetch("data/projects.json")
    .then(res => res.json())
    .then(projects => {
        const container = document.getElementById("project-list");
        projects.forEach(project => container.appendChild(createProjectCard(project)));
    });
