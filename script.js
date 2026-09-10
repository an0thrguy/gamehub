const canvas = document.getElementById("heart");
const ctx = canvas.getContext("2d");
const container = document.querySelector(".heart-container");

let width, height;

function resize() {
    width = canvas.width = container.clientWidth || 650;
    height = canvas.height = container.clientHeight || 650;
}

window.addEventListener("resize", resize);
resize();

const heartPointsCount = 2000;
const pointsOrigin = [];
const targetPoints = [];
let time = 0;

// Математическая формула сердца
const heartPosition = function (rad) {
    return [
        16 * Math.pow(Math.sin(rad), 3),
        -(13 * Math.cos(rad) - 5 * Math.cos(2 * rad) - 2 * Math.cos(3 * rad) - Math.cos(4 * rad))
    ];
};

// Инициализация точек
for (let i = 0; i < heartPointsCount; i++) {
    const rad = Math.random() * Math.PI * 2;
    pointsOrigin.push(heartPosition(rad));
}

// Функция пульсации
const pulse = function (kx, ky) {
    for (let i = 0; i < pointsOrigin.length; i++) {
        targetPoints[i] = [
            kx * pointsOrigin[i][0] * 12 + width / 2, // 12 - масштаб под контейнер
            ky * pointsOrigin[i][1] * 12 + height / 2
        ];
    }
};

// Главный цикл отрисовки
const loop = function () {
    // Очистка с прозрачностью для создания мягкого шлейфа
    ctx.clearRect(0, 0, width, height);

    time += 0.05;
    const n = -Math.cos(time);
    const scale = 1 + (n * 0.15); // Коэффициент пульсации

    pulse(scale, scale);

    ctx.fillStyle = "#ff2b6d"; // Розовый акцентный цвет под стиль GameHub
    for (let i = 0; i < targetPoints.length; i++) {
        ctx.beginPath();
        ctx.arc(targetPoints[i][0], targetPoints[i][1], 1.2, 0, Math.PI * 2);
        ctx.fill();
    }

    window.requestAnimationFrame(loop);
};

loop();

// =========================
// ПОИСК И ФИЛЬТРАЦИЯ ИГР
// =========================

const searchInput = document.getElementById("game-search");
const filterBtns = document.querySelectorAll(".filter-btn");
const gameCards = document.querySelectorAll(".game-card");

if (searchInput && gameCards.length > 0) {

    let currentCategory = "all";
    let searchQuery = "";

    function filterGames() {
        gameCards.forEach(card => {
            const categories = card.dataset.category || "";
            const title = card.querySelector("h3").textContent.toLowerCase();

            const matchesCategory = currentCategory === "all" || categories.includes(currentCategory);
            const matchesSearch = title.includes(searchQuery);

            if (matchesCategory && matchesSearch) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }
        });
    }

    // Обработчик кнопок фильтра
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            currentCategory = btn.dataset.category;
            filterGames();
        });
    });

    // Обработчик текстового поиска
    searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        filterGames();
    });
}

// =========================
// ФУНКЦИОНАЛ КНОПОК И МОДАЛЬНОГО ОКНА
// =========================

const modal = document.getElementById("game-modal");
const closeModalBtns = document.querySelectorAll("#modal-close, #modal-close-btn");

// Данные об играх для модального окна
const gamesData = {
    "Brawl Stars": {
        badge: "Экшен / Мобильные",
        desc: "Brawl Stars — динамичная многопользовательская игра 3 на 3 и королевская битва, где вы можете сражаться с друзьями или в одиночку в разнообразных режимах.",
        rating: "★ 4.8",
        platforms: "Android / iOS"
    },
    "Clash Royale": {
        badge: "Стратегия / Карты",
        desc: "Clash Royale — стратегия в реальном времени с элементами коллекционных карточных игр. Собирайте карты, создавайте колоды и уничтожайте башни соперников.",
        rating: "★ 4.6",
        platforms: "Android / iOS"
    },
    "World of Tanks": {
        badge: "Экшен / ММО",
        desc: "World of Tanks — командная массовая многопользовательская онлайн-игра, посвященная бронированным машинам середины XX века.",
        rating: "★ 4.5",
        platforms: "PC / Консоли"
    },
    "Call of Duty": {
        badge: "Шутер / Экшен",
        desc: "Call of Duty — всемирно известная серия шутеров от первого лица, предлагающая масштабные кинематографичные кампании и затягивающий мультиплеер.",
        rating: "★ 4.7",
        platforms: "PC / Консоли / Mobile"
    }
};

// Открытие модального окна при клике на "Подробнее"
document.querySelectorAll(".card-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        
        const card = btn.closest(".game-card");
        const title = card.querySelector("h3").textContent;
        const data = gamesData[title];

        if (data && modal) {
            document.getElementById("modal-title").textContent = title;
            document.getElementById("modal-badge").textContent = data.badge;
            document.getElementById("modal-desc").textContent = data.desc;
            document.getElementById("modal-rating").textContent = data.rating;
            document.getElementById("modal-platforms").textContent = data.platforms;

            modal.classList.add("active");
        }
    });
});

// Закрытие модального окна
closeModalBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        if (modal) modal.classList.remove("active");
    });
});

// Закрытие по клику вне окна
if (modal) {
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("active");
        }
    });
}