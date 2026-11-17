const account = (() => {
  const GUEST_KEY = "skillforge-progress";
  const authModal = $("#authModal");
  const studentModal = $("#studentModal");

  const levels = [
    { name: "Новичок", from: 0 },
    { name: "Подмастерье", from: 1200 },
    { name: "Мастер", from: 3600 },
    { name: "Кузнец навыков", from: 7200 }
  ];

  const clone = (value) => JSON.parse(JSON.stringify(value));

  function openLayer(layer) {
    layer.classList.add("is-open");
    layer.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
  }

  function closeLayer(layer) {
    layer.classList.remove("is-open");
    layer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
  }

  function openAuth(view = "login") {
    Auth.switchView($("[data-auth-root]", authModal), view);
    openLayer(authModal);
  }

  function openStudent() {
    renderStudent();
    selectTab("learning");
    openLayer(studentModal);
  }

  function selectTab(name) {
    $$("#studentTabs button").forEach((button) => button.classList.toggle("is-active", button.dataset.stab === name));
    $$("[data-spanel]", studentModal).forEach((panel) => (panel.hidden = panel.dataset.spanel !== name));
  }

  function guestProgress() {
    try {
      return JSON.parse(localStorage.getItem(GUEST_KEY)) || loadProgress();
    } catch {
      return loadProgress();
    }
  }

  function replaceProgress(source) {
    Object.keys(progress).forEach((key) => delete progress[key]);
    Object.assign(progress, clone(source));
  }

  function loadUserProgress() {
    if (Auth.isLoggedIn()) {
      const saved = Auth.getData("progress", null);
      replaceProgress(saved || guestProgress());
      if (!saved) Auth.setData("progress", clone(progress));
    } else {
      replaceProgress(guestProgress());
    }
    player.select(progress.enrolled[0]);
    renderCatalog();
    renderActivity();
  }

  function totalLessons() {
    return Object.values(progress.activity).reduce((sum, value) => sum + value, 0);
  }

  function renderStudent() {
    if (!Auth.isLoggedIn()) return;
    const xp = totalLessons() * XP_PER_LESSON;
    const index = levels.findLastIndex((level) => xp >= level.from);
    const current = levels[index];
    const next = levels[index + 1];

    $("#studentLevel").textContent = current.name;
    $("#studentXp").textContent = `${xp.toLocaleString("ru-RU")} XP`;
    $("#studentNext").textContent = next ? `до «${next.name}» — ${(next.from - xp).toLocaleString("ru-RU")} XP` : "максимальный уровень";
    $("#studentBar").style.width = next ? `${((xp - current.from) / (next.from - current.from)) * 100}%` : "100%";

    const jsLessons = flatLessons(findCourse("js"));
    const quizPassed = (progress.done.js || []).includes(jsLessons.length - 1);
    const lessonsDone = Object.values(progress.done).reduce((sum, list) => sum + list.length, 0);

    const badges = [
      { icon: "✅", title: "Первый урок", earned: lessonsDone > 0 },
      { icon: "🔥", title: "Серия 3 дня", earned: getStreak() >= 3 },
      { icon: "🎓", title: "Тест сдан", earned: quizPassed },
      { icon: "📚", title: "Три курса", earned: progress.enrolled.length >= 3 }
    ];

    $("#badges").innerHTML = badges
      .map((badge, i) => `<div class="badge-card ${badge.earned ? "is-earned" : "is-locked"}" style="--i:${i}"><span>${badge.icon}</span>${badge.title}</div>`)
      .join("");

    $("#myCourses").innerHTML = progress.enrolled
      .map((id) => {
        const course = findCourse(id);
        const percent = coursePercent(course);
        return `
        <div class="my-course">
          <span class="my-course__emoji" style="--tone:${course.tone}">${course.emoji}</span>
          <div class="my-course__info">
            <b>${course.title}</b>
            <div class="my-course__bar"><span style="width:${percent}%"></span></div>
          </div>
          <button data-continue="${id}">${percent === 100 ? "Повторить" : percent ? `${percent}% · Дальше` : "Начать"}</button>
        </div>`;
      })
      .join("");
  }

  function init() {
    saveProgress = function () {
      if (Auth.isLoggedIn()) Auth.setData("progress", clone(progress));
      else localStorage.setItem(GUEST_KEY, JSON.stringify(progress));
    };

    Auth.init({
      namespace: "skillforge",
      demo: { name: "Кирилл Кузнецов", email: "demo@skillforge.academy", password: "Demo2026" }
    });

    $("#loginBtn").addEventListener("click", () => openAuth());
    $("#studentBtn").addEventListener("click", openStudent);
    $$("[data-close-auth]").forEach((element) => element.addEventListener("click", () => closeLayer(authModal)));
    $$("[data-close-student]").forEach((element) => element.addEventListener("click", () => closeLayer(studentModal)));

    $("#studentTabs").addEventListener("click", (event) => {
      const button = event.target.closest("[data-stab]");
      if (button) selectTab(button.dataset.stab);
    });

    $("#myCourses").addEventListener("click", (event) => {
      const button = event.target.closest("[data-continue]");
      if (!button) return;
      closeLayer(studentModal);
      player.select(button.dataset.continue);
      $("#cabinet").scrollIntoView({ behavior: "smooth" });
    });

    document.addEventListener("auth:change", loadUserProgress);

    document.addEventListener("auth:success", ({ detail }) => {
      if (["login", "register", "demo"].includes(detail.type)) {
        closeLayer(authModal);
        showToast(detail.type === "register" ? "Аккаунт создан — прогресс сохранён в нём" : `Привет, ${detail.user.name.split(" ")[0]}! Продолжим?`);
        setTimeout(openStudent, 400);
      }
      if (detail.type === "logout") {
        closeLayer(studentModal);
        showToast("Вы вышли. До встречи на уроках!");
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      closeLayer(authModal);
      closeLayer(studentModal);
    });

    loadUserProgress();
  }

  return { init, openAuth };
})();

account.init();
