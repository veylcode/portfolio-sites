const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const rub = (value) => (value ? new Intl.NumberFormat("ru-RU").format(value) + " ₽" : "Бесплатно");
const XP_PER_LESSON = 120;

const categories = [
  { id: "all", name: "Все" },
  { id: "dev", name: "Разработка" },
  { id: "design", name: "Дизайн" },
  { id: "data", name: "Данные" },
  { id: "marketing", name: "Маркетинг" }
];

const courses = [
  {
    id: "js",
    title: "JavaScript с нуля",
    cat: "dev",
    level: "Новичок",
    hours: 32,
    rating: 4.9,
    students: 12840,
    price: 0,
    tone: "#ffd23f",
    emoji: "⚡",
    author: "Илья Громов, senior frontend",
    desc: "Переменные, функции, массивы и работа со страницей. К концу курса вы соберёте собственное интерактивное приложение.",
    modules: [
      {
        title: "Основы языка",
        lessons: [
          {
            title: "Переменные и типы данных",
            text: [
              "Переменная — это именованная «коробка» для значения. В современном JavaScript используют <code>let</code> для изменяемых значений и <code>const</code> для постоянных.",
              "Основные типы: строки, числа, логические значения, <code>null</code>, <code>undefined</code>, объекты и массивы."
            ],
            code: `const name = "Анна";\nlet age = 27;\n\nage = age + 1;\nconsole.log(\`\${name}, \${age}\`);`
          },
          {
            title: "Условия и сравнения",
            text: [
              "Конструкция <code>if</code> выполняет код, только если условие истинно. Для сравнения используйте строгое равенство <code>===</code> — оно не приводит типы.",
              "Тернарный оператор <code>условие ? a : b</code> удобен для коротких выборов."
            ],
            code: `const temperature = 18;\n\nif (temperature > 25) {\n  console.log("Жарко");\n} else {\n  console.log("Комфортно");\n}\n\nconst label = temperature > 0 ? "плюс" : "минус";`
          },
          {
            title: "Функции",
            text: [
              "Функция — переиспользуемый блок кода. Стрелочные функции дают короткий синтаксис и часто используются в колбэках.",
              "Хорошая функция делает одну вещь и имеет понятное имя."
            ],
            code: `const greet = (name) => \`Привет, \${name}!\`;\n\nfunction sum(a, b) {\n  return a + b;\n}\n\nconsole.log(greet("мир"), sum(2, 3));`
          }
        ]
      },
      {
        title: "Работа с данными",
        lessons: [
          {
            title: "Массивы и их методы",
            text: [
              "Массив хранит упорядоченный список значений. Методы <code>map</code>, <code>filter</code> и <code>reduce</code> позволяют обрабатывать данные без циклов.",
              "Они не изменяют исходный массив, а возвращают новый — это делает код предсказуемым."
            ],
            code: `const prices = [1200, 450, 3200, 980];\n\nconst expensive = prices.filter((price) => price > 1000);\nconst total = prices.reduce((sum, price) => sum + price, 0);\n\nconsole.log(expensive, total);`
          },
          {
            title: "Объекты",
            text: [
              "Объект описывает сущность через пары «ключ — значение». Деструктуризация позволяет быстро достать нужные поля.",
              "Оператор расширения <code>...</code> создаёт копию объекта с изменениями."
            ],
            code: `const user = { name: "Олег", city: "Казань", level: 3 };\n\nconst { name, city } = user;\nconst promoted = { ...user, level: user.level + 1 };`
          },
          {
            title: "События и DOM",
            text: [
              "DOM — это дерево элементов страницы. С помощью <code>querySelector</code> можно найти элемент, а <code>addEventListener</code> — реагировать на действия пользователя.",
              "Именно так работает этот учебный кабинет: каждая кнопка слушает клик и обновляет интерфейс."
            ],
            code: `const button = document.querySelector(".btn");\n\nbutton.addEventListener("click", () => {\n  button.textContent = "Готово!";\n});`
          }
        ]
      }
    ],
    quiz: [
      { q: "Какое ключевое слово объявляет неизменяемую привязку?", options: ["let", "const", "var"], answer: 1 },
      { q: "Что вернёт [1, 2, 3].map((n) => n * 2)?", options: ["[2, 4, 6]", "6", "[1, 2, 3, 2]"], answer: 0 },
      { q: "Какое сравнение не приводит типы?", options: ["==", "=", "==="], answer: 2 }
    ]
  },
  {
    id: "react",
    title: "React и современный фронтенд",
    cat: "dev",
    level: "Средний",
    hours: 44,
    rating: 4.8,
    students: 7420,
    price: 24900,
    tone: "#8fd3ff",
    emoji: "⚛️",
    author: "Мария Лис, tech lead",
    desc: "Компоненты, хуки, состояние и маршрутизация. Собираем SPA с API и деплоем.",
    modules: [
      { title: "Компоненты", lessons: ["JSX и рендеринг", "Пропсы и композиция", "Списки и ключи"] },
      { title: "Состояние", lessons: ["useState и события", "useEffect без боли", "Свои хуки"] },
      { title: "Приложение", lessons: ["Маршрутизация", "Работа с API", "Деплой проекта"] }
    ]
  },
  {
    id: "python",
    title: "Python для автоматизации",
    cat: "dev",
    level: "Новичок",
    hours: 28,
    rating: 4.9,
    students: 9310,
    price: 17900,
    tone: "#3ddc97",
    emoji: "🐍",
    author: "Денис Орлов, backend-разработчик",
    desc: "Скрипты, которые экономят часы: таблицы, файлы, письма и боты.",
    modules: [
      { title: "Старт", lessons: ["Установка и первый скрипт", "Типы и структуры данных", "Циклы и функции"] },
      { title: "Автоматизация", lessons: ["Работа с файлами", "Excel и CSV", "Телеграм-бот за вечер"] }
    ]
  },
  {
    id: "figma",
    title: "UI-дизайн в Figma",
    cat: "design",
    level: "Новичок",
    hours: 26,
    rating: 4.9,
    students: 10560,
    price: 19900,
    tone: "#ff8fab",
    emoji: "🎨",
    author: "Ксения Ветрова, product designer",
    desc: "Сетки, типографика, компоненты и автолейауты. Итог — кейс в портфолио.",
    modules: [
      { title: "Основы", lessons: ["Интерфейс Figma", "Сетки и отступы", "Типографика в интерфейсах"] },
      { title: "Система", lessons: ["Компоненты и варианты", "Auto Layout", "Дизайн-система за неделю"] }
    ]
  },
  {
    id: "ux",
    title: "UX-исследования",
    cat: "design",
    level: "Средний",
    hours: 20,
    rating: 4.7,
    students: 3820,
    price: 21900,
    tone: "#c5b3ff",
    emoji: "🔍",
    author: "Артём Белый, UX researcher",
    desc: "Интервью, юзабилити-тесты и метрики — как принимать решения на основе данных.",
    modules: [
      { title: "Исследования", lessons: ["Гипотезы и цели", "Глубинные интервью", "Юзабилити-тестирование"] },
      { title: "Синтез", lessons: ["Карта пути пользователя", "Приоритизация инсайтов"] }
    ]
  },
  {
    id: "sql",
    title: "SQL и аналитика данных",
    cat: "data",
    level: "Новичок",
    hours: 24,
    rating: 4.8,
    students: 8120,
    price: 16900,
    tone: "#a8f0ff",
    emoji: "📊",
    author: "Ольга Сомова, data analyst",
    desc: "Запросы, джойны, оконные функции и дашборды для бизнеса.",
    modules: [
      { title: "Запросы", lessons: ["SELECT и фильтрация", "Группировки", "JOIN без страха"] },
      { title: "Аналитика", lessons: ["Оконные функции", "Когортный анализ", "Дашборд в BI"] }
    ]
  },
  {
    id: "ml",
    title: "Машинное обучение: практикум",
    cat: "data",
    level: "Продвинутый",
    hours: 56,
    rating: 4.8,
    students: 2940,
    price: 39900,
    tone: "#ffb36b",
    emoji: "🧠",
    author: "Павел Ким, ML engineer",
    desc: "Классические модели, валидация и вывод в продакшн. Много практики на реальных датасетах.",
    modules: [
      { title: "Модели", lessons: ["Линейные модели", "Деревья и бустинг", "Метрики качества"] },
      { title: "Продакшн", lessons: ["Валидация и утечки", "Сервис предсказаний", "Мониторинг модели"] }
    ]
  },
  {
    id: "smm",
    title: "Performance-маркетинг",
    cat: "marketing",
    level: "Средний",
    hours: 22,
    rating: 4.6,
    students: 4510,
    price: 18900,
    tone: "#ffe58f",
    emoji: "📈",
    author: "Виктория Нам, head of growth",
    desc: "Воронки, юнит-экономика и рекламные кабинеты. Учимся считать, а не угадывать.",
    modules: [
      { title: "Стратегия", lessons: ["Юнит-экономика", "Воронка и метрики", "Позиционирование"] },
      { title: "Трафик", lessons: ["Контекстная реклама", "Таргетинг", "A/B-тесты креативов"] }
    ]
  }
];

const findCourse = (id) => courses.find((course) => course.id === id);

const dayKey = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

function flatLessons(course) {
  const list = course.modules.flatMap((module) =>
    module.lessons.map((lesson) => ({
      module: module.title,
      ...(typeof lesson === "string" ? { title: lesson } : lesson)
    }))
  );
  if (course.quiz) list.push({ module: "Проверка", title: "Итоговый тест", quiz: course.quiz });
  return list;
}

function seededHistory() {
  const history = {};
  let seed = 7;
  const random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let offset = 83; offset >= 1; offset -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    const roll = random();
    if (roll > 0.45) history[dayKey(date)] = Math.ceil(random() * 4);
  }
  for (let offset = 1; offset <= 4; offset += 1) {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    history[dayKey(date)] = history[dayKey(date)] || 1;
  }
  return history;
}

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem("skillforge-progress"));
    if (saved) return saved;
  } catch {}
  return { enrolled: ["js"], done: { js: [] }, activity: seededHistory(), current: { js: 0 }, quiz: {} };
}

const progress = loadProgress();

function saveProgress() {
  localStorage.setItem("skillforge-progress", JSON.stringify(progress));
}

function showToast(text) {
  const toast = $("#toast");
  toast.textContent = text;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function coursePercent(course) {
  const total = flatLessons(course).length;
  return Math.round(((progress.done[course.id]?.length || 0) / total) * 100);
}

function initTyped() {
  const words = ["код", "дизайн", "данные", "маркетинг"];
  const element = $("#typed");
  let wordIndex = 0;
  let length = words[0].length;
  let deleting = true;

  const step = () => {
    const word = words[wordIndex];
    length += deleting ? -1 : 1;
    element.textContent = word.slice(0, length) || "\u200b";

    let delay = deleting ? 60 : 110;
    if (!deleting && length === word.length) {
      deleting = true;
      delay = 2200;
    } else if (deleting && length === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 300;
    }

    setTimeout(step, delay);
  };

  setTimeout(step, 2200);
}

function initHeroCode() {
  const segments = [
    ["tok-com", "// Урок 1: первая функция\n"],
    ["tok-key", "const "],
    ["tok-fn", "forge"],
    ["", " = ("],
    ["", "skill"],
    ["", ") => {\n  "],
    ["tok-key", "let "],
    ["", "level = "],
    ["tok-num", "0"],
    ["", ";\n  "],
    ["tok-key", "while "],
    ["", "(level < "],
    ["tok-num", "100"],
    ["", ") {\n    level += "],
    ["tok-fn", "practice"],
    ["", "(skill);\n  }\n  "],
    ["tok-key", "return "],
    ["tok-str", "`Мастер: ${skill}`"],
    ["", ";\n};\n\n"],
    ["tok-fn", "forge"],
    ["", "("],
    ["tok-str", "\"JavaScript\""],
    ["", ");"]
  ];

  const code = $("#heroCode");
  const cursor = document.createElement("span");
  cursor.className = "cursor";

  const run = () => {
    code.textContent = "";
    code.append(cursor);
    let segmentIndex = 0;
    let charIndex = 0;
    let span = null;

    const type = () => {
      if (segmentIndex >= segments.length) {
        setTimeout(run, 4000);
        return;
      }
      const [className, text] = segments[segmentIndex];
      if (charIndex === 0) {
        span = document.createElement("span");
        if (className) span.className = className;
        code.insertBefore(span, cursor);
      }
      span.textContent += text[charIndex];
      charIndex += 1;
      if (charIndex >= text.length) {
        segmentIndex += 1;
        charIndex = 0;
      }
      setTimeout(type, text[charIndex - 1] === "\n" ? 140 : 28 + Math.random() * 40);
    };
    type();
  };

  run();
}

const catalog = { cat: "all", level: "all", query: "" };

function renderCatalog() {
  $("#categoryTabs").innerHTML = categories
    .map((cat) => `<button class="tab ${catalog.cat === cat.id ? "is-active" : ""}" data-cat="${cat.id}">${cat.name}</button>`)
    .join("");

  const query = catalog.query.toLowerCase();
  const list = courses.filter(
    (course) =>
      (catalog.cat === "all" || course.cat === catalog.cat) &&
      (catalog.level === "all" || course.level === catalog.level) &&
      `${course.title} ${course.desc} ${course.author}`.toLowerCase().includes(query)
  );

  $("#coursesGrid").innerHTML = list
    .map((course, index) => {
      const isEnrolled = progress.enrolled.includes(course.id);
      const percent = coursePercent(course);
      return `
        <button class="course" style="--i:${index}" data-course="${course.id}">
          <div class="course__cover" style="--tone:${course.tone}">
            <span class="course__level">${course.level}</span>
            ${isEnrolled ? `<span class="course__enrolled">${percent}%</span>` : ""}
            <span class="course__emoji">${course.emoji}</span>
          </div>
          <div class="course__body">
            <span class="course__cat">${categories.find((cat) => cat.id === course.cat).name}</span>
            <h3 class="course__title">${course.title}</h3>
            <div class="course__meta">
              <span>${flatLessons(course).length} уроков</span>
              <span>${course.hours} ч</span>
              <span>${course.students.toLocaleString("ru-RU")} студентов</span>
            </div>
            ${isEnrolled ? `<div class="course__bar"><span style="width:${percent}%"></span></div>` : ""}
            <div class="course__foot">
              <span class="course__price">${rub(course.price)}</span>
              <span class="course__rating">★ ${course.rating}</span>
            </div>
          </div>
        </button>`;
    })
    .join("");

  $("#coursesEmpty").hidden = list.length > 0;
}

function initCatalog() {
  $("#categoryTabs").addEventListener("click", (event) => {
    const tab = event.target.closest("[data-cat]");
    if (!tab) return;
    catalog.cat = tab.dataset.cat;
    renderCatalog();
  });

  $("#levelSelect").addEventListener("change", (event) => {
    catalog.level = event.target.value;
    renderCatalog();
  });

  $("#courseSearch").addEventListener("input", (event) => {
    catalog.query = event.target.value.trim();
    renderCatalog();
  });

  $("#coursesGrid").addEventListener("click", (event) => {
    const card = event.target.closest("[data-course]");
    if (card) openCourse(card.dataset.course);
  });

  renderCatalog();
}

function openCourse(id) {
  const course = findCourse(id);
  const isEnrolled = progress.enrolled.includes(id);

  $("#modalCover").style.setProperty("--tone", course.tone);
  $("#modalCover").textContent = course.emoji;
  $("#modalMeta").textContent = `${course.level} · ${course.author}`;
  $("#modalTitle").textContent = course.title;
  $("#modalDesc").textContent = course.desc;
  $("#modalFacts").innerHTML = [
    `${flatLessons(course).length} уроков`,
    `${course.hours} часов`,
    `★ ${course.rating}`,
    `${course.students.toLocaleString("ru-RU")} студентов`,
    "Сертификат"
  ]
    .map((fact) => `<span>${fact}</span>`)
    .join("");
  $("#modalCurriculum").innerHTML = course.modules
    .map(
      (module, index) =>
        `<li><b>Модуль ${index + 1}. ${module.title}</b><small>${module.lessons.map((lesson) => (typeof lesson === "string" ? lesson : lesson.title)).join(" · ")}</small></li>`
    )
    .join("");
  $("#modalPrice").textContent = rub(course.price);

  const button = $("#modalEnroll");
  button.textContent = isEnrolled ? "Продолжить обучение" : course.price ? "Начать с бесплатного урока" : "Записаться бесплатно";
  button.onclick = () => {
    if (!isEnrolled) {
      progress.enrolled.push(id);
      progress.done[id] = [];
      progress.current[id] = 0;
      saveProgress();
      showToast(`Вы записаны на «${course.title}»`);
    }
    closeModal();
    player.select(id);
    renderCatalog();
    $("#cabinet").scrollIntoView({ behavior: "smooth" });
  };

  $("#courseModal").classList.add("is-open");
  $("#courseModal").setAttribute("aria-hidden", "false");
  document.body.classList.add("is-locked");
}

function closeModal() {
  $("#courseModal").classList.remove("is-open");
  $("#courseModal").setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-locked");
}

function initModal() {
  $$("#courseModal [data-close]").forEach((element) => element.addEventListener("click", closeModal));
  document.addEventListener("keydown", (event) => event.key === "Escape" && closeModal());
}

const player = (() => {
  let courseId = progress.enrolled[0];

  const genericLesson = (lesson, course) => ({
    text: [
      `В этом уроке курса «${course.title}» разбираем тему <code>${lesson.title}</code>: от базовых понятий к практическому применению.`,
      "Сначала — короткое видео на 8–12 минут, затем конспект и практическое задание. Наставник проверит его в течение суток.",
      "Совет: не переходите к следующему уроку, пока не выполните задание — так знания закрепляются в три раза лучше."
    ]
  });

  function renderList() {
    const course = findCourse(courseId);
    const lessons = flatLessons(course);
    const done = progress.done[courseId] || [];
    const current = progress.current[courseId] || 0;
    let lastModule = "";

    $("#lessonsList").innerHTML = lessons
      .map((lesson, index) => {
        const header = lesson.module !== lastModule ? `<li class="lessons__module">${lesson.module}</li>` : "";
        lastModule = lesson.module;
        const classes = [done.includes(index) && "is-done", index === current && "is-current"].filter(Boolean).join(" ");
        return `${header}<li><button class="lesson-item ${classes}" data-lesson="${index}"><span class="lesson-item__check">${done.includes(index) ? "✓" : index + 1}</span>${lesson.title}</button></li>`;
      })
      .join("");

    const percent = coursePercent(course);
    $("#courseRing").style.setProperty("--p", percent);
    $("#courseRingValue").textContent = `${percent}%`;
    $("#courseLessonsDone").textContent = `${done.length} из ${lessons.length}`;
  }

  function renderLesson() {
    const course = findCourse(courseId);
    const lessons = flatLessons(course);
    const index = progress.current[courseId] || 0;
    const lesson = lessons[index];
    const isDone = (progress.done[courseId] || []).includes(index);
    const view = $("#lessonView");

    view.style.animation = "none";
    void view.offsetWidth;
    view.style.animation = "";

    if (lesson.quiz) {
      view.innerHTML = `
        <p class="lesson__label">${lesson.module} · урок ${index + 1} из ${lessons.length}</p>
        <h3 class="lesson__title">${lesson.title}</h3>
        <div class="quiz" id="quiz">
          ${lesson.quiz
            .map(
              (item, qIndex) => `
              <div class="quiz__q" data-q="${qIndex}">
                <p>${qIndex + 1}. ${item.q}</p>
                <div class="quiz__options">
                  ${item.options.map((option, oIndex) => `<button class="quiz__option" data-option="${oIndex}">${option}</button>`).join("")}
                </div>
              </div>`
            )
            .join("")}
          <div id="quizResult"></div>
        </div>`;
      bindQuiz(lesson, index);
      return;
    }

    const content = lesson.text ? lesson : genericLesson(lesson, course);
    view.innerHTML = `
      <p class="lesson__label">${lesson.module} · урок ${index + 1} из ${lessons.length}</p>
      <h3 class="lesson__title">${lesson.title}</h3>
      <div class="lesson__text">
        ${content.text.map((paragraph) => `<p>${paragraph}</p>`).join("")}
        ${content.code ? `<pre class="lesson__code">${content.code.replace(/</g, "&lt;")}</pre>` : ""}
      </div>
      <div class="lesson__actions">
        <button class="btn ${isDone ? "btn--success" : ""}" id="completeLesson">${isDone ? "✓ Пройдено" : `Отметить пройденным · +${XP_PER_LESSON} XP`}</button>
        ${index < lessons.length - 1 ? `<button class="btn btn--ghost" id="nextLesson">Следующий урок →</button>` : ""}
      </div>`;

    $("#completeLesson").addEventListener("click", () => complete(index));
    $("#nextLesson")?.addEventListener("click", () => open(index + 1));
  }

  function bindQuiz(lesson, lessonIndex) {
    const answers = {};
    $("#quiz").addEventListener("click", (event) => {
      const option = event.target.closest(".quiz__option");
      if (!option || option.disabled) return;
      const question = option.closest(".quiz__q");
      const qIndex = Number(question.dataset.q);
      const chosen = Number(option.dataset.option);
      const correct = lesson.quiz[qIndex].answer;

      answers[qIndex] = chosen === correct;
      $$(".quiz__option", question).forEach((button, i) => {
        button.disabled = true;
        if (i === correct) button.classList.add("is-right");
        if (i === chosen && chosen !== correct) button.classList.add("is-wrong");
      });

      if (Object.keys(answers).length === lesson.quiz.length) {
        const score = Object.values(answers).filter(Boolean).length;
        const passed = score >= lesson.quiz.length - 1;
        $("#quizResult").innerHTML = `
          <div class="quiz__result">
            ${score} из ${lesson.quiz.length} верно. ${passed ? "Тест пройден — отличная работа! 🎉" : "Почти! Повторите уроки и попробуйте снова."}
          </div>
          <div class="lesson__actions">
            <button class="btn btn--ghost" id="retryQuiz">Пройти заново</button>
          </div>`;
        $("#retryQuiz").addEventListener("click", renderLesson);
        if (passed) complete(lessonIndex, false);
      }
    });
  }

  function complete(index, rerender = true) {
    const done = (progress.done[courseId] ||= []);
    if (done.includes(index)) return;
    done.push(index);
    const key = dayKey();
    progress.activity[key] = (progress.activity[key] || 0) + 1;
    saveProgress();
    renderList();
    if (rerender) renderLesson();
    renderActivity();
    renderCatalog();
    showToast(`+${XP_PER_LESSON} XP · так держать!`);

    const streak = $(".streak");
    streak.classList.remove("is-bump");
    void streak.offsetWidth;
    streak.classList.add("is-bump");

    if (coursePercent(findCourse(courseId)) === 100) {
      setTimeout(() => showToast(`🏆 Курс «${findCourse(courseId).title}» завершён!`), 1400);
    }
  }

  function open(index) {
    progress.current[courseId] = index;
    saveProgress();
    renderList();
    renderLesson();
  }

  function renderSelect() {
    $("#enrolledSelect").innerHTML = progress.enrolled
      .map((id) => `<option value="${id}" ${id === courseId ? "selected" : ""}>${findCourse(id).title}</option>`)
      .join("");
  }

  function select(id) {
    courseId = id;
    renderSelect();
    renderList();
    renderLesson();
  }

  function init() {
    $("#enrolledSelect").addEventListener("change", (event) => select(event.target.value));
    $("#lessonsList").addEventListener("click", (event) => {
      const item = event.target.closest("[data-lesson]");
      if (item) open(Number(item.dataset.lesson));
    });
    select(courseId);
  }

  return { init, select };
})();

function getStreak() {
  let streak = 0;
  const date = new Date();
  if (!progress.activity[dayKey(date)]) date.setDate(date.getDate() - 1);
  while (progress.activity[dayKey(date)]) {
    streak += 1;
    date.setDate(date.getDate() - 1);
  }
  return streak;
}

function renderActivity() {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - 83 - ((today.getDay() + 6) % 7));
  const cells = [];

  for (let date = new Date(start), i = 0; date <= today; date.setDate(date.getDate() + 1), i += 1) {
    const count = progress.activity[dayKey(date)] || 0;
    const level = Math.min(count, 4);
    const isToday = dayKey(date) === dayKey(today);
    const label = `${date.toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}: ${count} ур.`;
    cells.push(`<i class="l${level} ${isToday ? "is-today" : ""}" style="--i:${i}" title="${label}"></i>`);
  }

  $("#heatmap").innerHTML = cells.join("");

  const lessons = Object.values(progress.activity).reduce((sum, value) => sum + value, 0);
  const streak = getStreak();
  $("#statLessons").textContent = lessons;
  $("#statXp").textContent = (lessons * XP_PER_LESSON).toLocaleString("ru-RU");
  $("#statStreak").textContent = streak;
  $("#streakCount").textContent = streak;
}

function initHeader() {
  const burger = $("#burger");
  const nav = $("#nav");
  burger.addEventListener("click", () => {
    burger.classList.toggle("is-open");
    nav.classList.toggle("is-open");
  });
  $$("a", nav).forEach((link) =>
    link.addEventListener("click", () => {
      burger.classList.remove("is-open");
      nav.classList.remove("is-open");
    })
  );
}

function initReveal() {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }),
    { threshold: 0.12 }
  );
  $$(".reveal").forEach((element) => observer.observe(element));
}

initTyped();
initHeroCode();
initCatalog();
initModal();
player.init();
renderActivity();
initHeader();
initReveal();
