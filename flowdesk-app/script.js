const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const STORAGE_KEY = "flowdesk-state";
const CURRENT_USER = "am";

const members = [
  { id: "am", name: "Алина Морозова", role: "Продакт-менеджер", color: "#5b5bf7", capacity: 32, away: false },
  { id: "dk", name: "Денис Ким", role: "Frontend-разработчик", color: "#16a36a", capacity: 40, away: false },
  { id: "es", name: "Ева Соколова", role: "UI/UX-дизайнер", color: "#e0618f", capacity: 36, away: false },
  { id: "ib", name: "Игорь Белов", role: "Backend-разработчик", color: "#e0921b", capacity: 40, away: true },
  { id: "mr", name: "Марк Романов", role: "Аккаунт-менеджер", color: "#0ea5c6", capacity: 30, away: false },
  { id: "ov", name: "Ольга Ветрова", role: "QA-инженер", color: "#8b5cf6", capacity: 36, away: false }
];

const statuses = [
  { id: "backlog", name: "Бэклог", color: "#9198a6" },
  { id: "progress", name: "В работе", color: "#5b5bf7" },
  { id: "review", name: "На проверке", color: "#e0921b" },
  { id: "done", name: "Готово", color: "#16a36a" }
];

const priorities = { high: "Высокий", medium: "Средний", low: "Низкий" };
const clientStatuses = { active: "Активный", lead: "Лид", paused: "Пауза" };
const clientColors = ["#5b5bf7", "#16a36a", "#e0618f", "#e0921b", "#0ea5c6", "#8b5cf6", "#ef4444", "#14b8a6"];

const memberById = (id) => members.find((member) => member.id === id);
const initials = (name) => name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase();

const toKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const shiftDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toKey(date);
};

const todayKey = () => toKey(new Date());

const rub = (value) => new Intl.NumberFormat("ru-RU").format(value) + " ₽";

const shortDate = (key) => {
  if (!key) return "без срока";
  const diff = Math.round((new Date(key) - new Date(todayKey())) / 86400000);
  if (diff === 0) return "сегодня";
  if (diff === 1) return "завтра";
  if (diff === -1) return "вчера";
  return new Date(key).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
};

const isOverdue = (task) => task.due && task.status !== "done" && task.due < todayKey();

const escapeHtml = (text) =>
  String(text).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

function createDefaultState() {
  const clients = [
    { id: "c1", company: "Северсталь Digital", contact: "Павел Зуев", email: "zuev@severdigital.ru", status: "active", value: 2400000, industry: "Промышленность" },
    { id: "c2", company: "Лавка Вкуса", contact: "Мария Ткач", email: "maria@lavka.ru", status: "active", value: 860000, industry: "Ритейл" },
    { id: "c3", company: "Orbita Fitness", contact: "Глеб Арсеньев", email: "gleb@orbita.fit", status: "lead", value: 540000, industry: "Спорт" },
    { id: "c4", company: "Банк «Пульс»", contact: "Наталья Ким", email: "n.kim@pulsebank.ru", status: "active", value: 3900000, industry: "Финансы" },
    { id: "c5", company: "Город Книг", contact: "Илья Ростов", email: "ilya@gorodknig.ru", status: "paused", value: 310000, industry: "Медиа" },
    { id: "c6", company: "Medica Plus", contact: "Анна Лурье", email: "anna@medicaplus.ru", status: "lead", value: 1200000, industry: "Медицина" },
    { id: "c7", company: "Тёплый Дом", contact: "Олег Савин", email: "savin@teplydom.ru", status: "active", value: 720000, industry: "Строительство" }
  ].map((client, index) => ({ ...client, color: clientColors[index % clientColors.length], updated: shiftDays(-index * 2) }));

  const task = (id, title, status, priority, assignee, client, dueOffset, estimate, description = "") => ({
    id,
    title,
    description,
    status,
    priority,
    assignee,
    client,
    due: dueOffset === null ? "" : shiftDays(dueOffset),
    estimate,
    createdAt: shiftDays(-10)
  });

  const tasks = [
    task("t1", "Согласовать структуру личного кабинета", "progress", "high", "am", "c4", 0, 4, "Встреча с продуктовой командой банка, подготовить карту экранов."),
    task("t2", "Дизайн экрана онбординга", "review", "medium", "es", "c4", 1, 10),
    task("t3", "API каталога товаров", "progress", "high", "ib", "c2", -1, 16, "Пагинация, фильтры, кеширование."),
    task("t4", "Вёрстка корзины и чекаута", "progress", "medium", "dk", "c2", 3, 14),
    task("t5", "Регрессионное тестирование релиза 2.4", "backlog", "medium", "ov", "c1", 5, 12),
    task("t6", "Коммерческое предложение для Orbita", "backlog", "high", "mr", "c3", 2, 6),
    task("t7", "Исследование: интервью с тренерами", "backlog", "low", "es", "c3", 8, 8),
    task("t8", "Настроить CI для мобильного приложения", "review", "medium", "dk", "c1", 0, 6),
    task("t9", "Ретроспектива спринта", "backlog", "low", "am", null, 4, 2),
    task("t10", "Дашборд аналитики продаж", "done", "medium", "dk", "c7", -2, 12),
    task("t11", "Аудит доступности сайта", "done", "low", "ov", "c6", -3, 6),
    task("t12", "Подготовить демо для Medica Plus", "progress", "high", "am", "c6", 1, 5),
    task("t13", "Миграция базы данных", "backlog", "high", "ib", "c1", 6, 20),
    task("t14", "Иллюстрации для лендинга", "done", "low", "es", "c2", -5, 8)
  ];

  tasks.filter((item) => item.status === "done").forEach((item, index) => (item.completedAt = shiftDays(-index - 1)));

  const history = {};
  let seed = 11;
  const random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let offset = 40; offset >= 1; offset -= 1) {
    const weekday = new Date(shiftDays(-offset)).getDay();
    const base = weekday === 0 || weekday === 6 ? 0.5 : 3;
    history[shiftDays(-offset)] = Math.round(base + random() * 4);
  }

  const feed = [
    { who: "es", text: "отправила «Дизайн экрана онбординга» на проверку", at: Date.now() - 1000 * 60 * 25 },
    { who: "dk", text: "завершил «Дашборд аналитики продаж»", at: Date.now() - 1000 * 60 * 60 * 3 },
    { who: "mr", text: "добавил клиента Medica Plus", at: Date.now() - 1000 * 60 * 60 * 20 },
    { who: "ov", text: "нашла 3 бага в релизе 2.3", at: Date.now() - 1000 * 60 * 60 * 26 }
  ];

  return { clients, tasks, history, feed };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved?.tasks) return saved;
  } catch {}
  return createDefaultState();
}

let state = loadState();
let currentView = "dashboard";

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function avatar(memberId, extraClass = "") {
  const member = memberById(memberId);
  if (!member) return "";
  return `<span class="avatar ${extraClass}" style="--color:${member.color}" title="${member.name}">${initials(member.name)}</span>`;
}

function timeAgo(timestamp) {
  const minutes = Math.round((Date.now() - timestamp) / 60000);
  if (minutes < 1) return "только что";
  if (minutes < 60) return `${minutes} мин назад`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} ч назад`;
  return `${Math.round(hours / 24)} дн назад`;
}

function addFeed(text, who = CURRENT_USER) {
  state.feed.unshift({ who, text, at: Date.now() });
  state.feed = state.feed.slice(0, 30);
}

function toast(message, action) {
  const element = document.createElement("div");
  element.className = "toast";
  element.innerHTML = `<span>${message}</span>`;
  if (action) {
    const button = document.createElement("button");
    button.textContent = action.label;
    button.addEventListener("click", () => {
      action.run();
      dismiss();
    });
    element.append(button);
  }
  $("#toasts").append(element);

  const dismiss = () => {
    element.classList.add("is-leaving");
    setTimeout(() => element.remove(), 300);
  };
  setTimeout(dismiss, action ? 5000 : 2800);
}

function setTaskStatus(task, status) {
  if (task.status === status) return;
  const wasDone = task.status === "done";
  task.status = status;

  if (status === "done" && !wasDone) {
    task.completedAt = todayKey();
    state.history[todayKey()] = (state.history[todayKey()] || 0) + 1;
    addFeed(`завершил(а) «${task.title}»`);
  } else if (wasDone && status !== "done") {
    if (task.completedAt === todayKey()) state.history[todayKey()] = Math.max((state.history[todayKey()] || 1) - 1, 0);
    delete task.completedAt;
    addFeed(`вернул(а) в работу «${task.title}»`);
  } else {
    addFeed(`перенёс(ла) «${task.title}» в «${statuses.find((item) => item.id === status).name}»`);
  }
}

function renderAll() {
  $("#openBadge").textContent = state.tasks.filter((task) => task.status !== "done").length;
  renderNotifications();
  ({ dashboard: renderDashboard, board: renderBoard, clients: renderClients, team: renderTeam })[currentView]();
}

const viewTitles = { dashboard: "Обзор", board: "Задачи", clients: "Клиенты", team: "Команда" };

function showView(view) {
  currentView = view;
  $$(".view").forEach((section) => section.classList.toggle("is-active", section.dataset.view === view));
  $$(".menu__item").forEach((item) => item.classList.toggle("is-active", item.dataset.view === view));
  $("#viewTitle").textContent = viewTitles[view];
  closeSidebar();
  renderAll();
}

function historySeries(days) {
  return Array.from({ length: days }, (_, index) => {
    const key = shiftDays(index - days + 1);
    return { key, value: state.history[key] || 0 };
  });
}

function sparkline(values) {
  const max = Math.max(...values, 1);
  const points = values.map((value, index) => `${(index / (values.length - 1)) * 64},${22 - (value / max) * 20}`).join(" ");
  return `<svg class="spark" viewBox="0 0 64 22"><polyline points="${points}"/></svg>`;
}

function renderDashboard() {
  const hour = new Date().getHours();
  const greeting = hour < 5 ? "Доброй ночи" : hour < 12 ? "Доброе утро" : hour < 18 ? "Добрый день" : "Добрый вечер";
  $("#greeting").textContent = `${greeting}, ${memberById(CURRENT_USER).name.split(" ")[0]}`;

  const mine = state.tasks.filter((task) => task.assignee === CURRENT_USER && task.status !== "done");
  const dueToday = mine.filter((task) => task.due === todayKey()).length;
  const overdue = state.tasks.filter(isOverdue).length;
  $("#greetingSub").textContent = `Сегодня ${new Date().toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" })} · у вас ${dueToday} задач со сроком на сегодня${overdue ? ` · ${overdue} просрочено в команде` : ""}`;

  const last14 = historySeries(14).map((item) => item.value);
  const thisWeek = last14.slice(7).reduce((a, b) => a + b, 0);
  const prevWeek = last14.slice(0, 7).reduce((a, b) => a + b, 0) || 1;
  const trend = Math.round(((thisWeek - prevWeek) / prevWeek) * 100);
  const open = state.tasks.filter((task) => task.status !== "done").length;
  const activeClients = state.clients.filter((client) => client.status === "active").length;
  const pipeline = state.clients.filter((client) => client.status !== "paused").reduce((sum, client) => sum + client.value, 0);

  const kpis = [
    { label: "Открытые задачи", value: open, note: `${overdue} просрочено`, down: overdue > 0, spark: last14.map((v) => 10 - v) },
    { label: "Выполнено за неделю", value: thisWeek, note: `${trend >= 0 ? "+" : ""}${trend}% к прошлой`, down: trend < 0, spark: last14 },
    { label: "Активные клиенты", value: activeClients, note: `${state.clients.filter((c) => c.status === "lead").length} лида в работе`, spark: [3, 4, 4, 5, 4, 5, 6, activeClients] },
    { label: "Сумма в работе", value: `${(pipeline / 1_000_000).toLocaleString("ru-RU", { maximumFractionDigits: 1 })} млн ₽`, note: "активные и лиды", spark: [5, 6, 6, 7, 8, 7, 9, 10] }
  ];

  $("#kpis").innerHTML = kpis
    .map(
      (kpi, index) => `
      <article class="kpi" style="--i:${index}">
        <div class="kpi__label"><span>${kpi.label}</span>${sparkline(kpi.spark)}</div>
        <span class="kpi__value">${kpi.value}</span>
        <span class="kpi__trend ${kpi.down ? "is-down" : ""}">${kpi.note}</span>
      </article>`
    )
    .join("");

  renderChart();

  const myList = state.tasks
    .filter((task) => task.assignee === CURRENT_USER && (task.status !== "done" || task.completedAt === todayKey()))
    .sort((a, b) => (a.due || "9999").localeCompare(b.due || "9999"));

  $("#myTasks").innerHTML = myList.length
    ? myList
        .map(
          (task) => `
          <li class="${task.status === "done" ? "is-done" : ""}">
            <button class="check ${task.status === "done" ? "is-checked" : ""}" data-toggle="${task.id}" aria-label="Отметить выполненной"><svg viewBox="0 0 24 24"><path d="m5 12 5 5 9-9"/></svg></button>
            <span class="todo__title" data-edit="${task.id}">${escapeHtml(task.title)}</span>
            <span class="todo__due ${isOverdue(task) ? "is-overdue" : ""}">${shortDate(task.due)}</span>
          </li>`
        )
        .join("")
    : `<li class="empty">Все задачи выполнены 🎉</li>`;

  const total = state.tasks.length || 1;
  $("#statusBars").innerHTML = statuses
    .map((status) => {
      const count = state.tasks.filter((task) => task.status === status.id).length;
      return `
        <div>
          <div class="status-bar__row"><span>${status.name}</span><b>${count}</b></div>
          <div class="status-bar__track"><div class="status-bar__fill" style="width:${(count / total) * 100}%; background:${status.color}"></div></div>
        </div>`;
    })
    .join("");

  $("#feed").innerHTML = state.feed
    .slice(0, 6)
    .map((item, index) => `<li style="animation-delay:${index * 40}ms">${avatar(item.who)}<div><b>${memberById(item.who).name.split(" ")[0]}</b> ${escapeHtml(item.text)}<small>${timeAgo(item.at)}</small></div></li>`)
    .join("");
}

let chartRange = 14;

function renderChart() {
  const container = $("#chart");
  const width = container.clientWidth || 600;
  const height = container.clientHeight || 240;
  const padding = { top: 16, right: 12, bottom: 24, left: 28 };
  const series = historySeries(chartRange);
  const max = Math.max(...series.map((item) => item.value), 4);
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const points = series.map((item, index) => ({
    ...item,
    x: padding.left + (index / (series.length - 1)) * innerWidth,
    y: padding.top + innerHeight - (item.value / max) * innerHeight
  }));

  const path = points.reduce((acc, point, index, list) => {
    if (index === 0) return `M${point.x},${point.y}`;
    const prev = list[index - 1];
    const midX = (prev.x + point.x) / 2;
    return `${acc} C${midX},${prev.y} ${midX},${point.y} ${point.x},${point.y}`;
  }, "");

  const area = `${path} L${points.at(-1).x},${padding.top + innerHeight} L${points[0].x},${padding.top + innerHeight} Z`;
  const gridLines = [0, 0.5, 1]
    .map((ratio) => {
      const y = padding.top + innerHeight * (1 - ratio);
      return `<line class="chart__grid" x1="${padding.left}" x2="${width - padding.right}" y1="${y}" y2="${y}"/><text class="chart__label" x="0" y="${y + 3}">${Math.round(max * ratio)}</text>`;
    })
    .join("");

  const labelEvery = Math.ceil(series.length / 7);
  const labels = points
    .filter((_, index) => index % labelEvery === 0 || index === points.length - 1)
    .map((point) => `<text class="chart__label" x="${point.x}" y="${height - 4}" text-anchor="middle">${new Date(point.key).getDate()}</text>`)
    .join("");

  const step = innerWidth / (series.length - 1);
  const hits = points
    .map((point, index) => `<rect class="chart__hit" data-index="${index}" x="${point.x - step / 2}" y="${padding.top}" width="${step}" height="${innerHeight}"/>`)
    .join("");

  container.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.28"/>
          <stop offset="100%" stop-color="var(--accent)" stop-opacity="0"/>
        </linearGradient>
      </defs>
      ${gridLines}
      <path class="chart__area" d="${area}"/>
      <path class="chart__line" d="${path}"/>
      ${labels}
      <circle class="chart__dot" r="5" cx="0" cy="0"/>
      ${hits}
    </svg>
    <div class="chart__tooltip"></div>`;

  const line = $(".chart__line", container);
  line.style.setProperty("--len", line.getTotalLength());

  const dot = $(".chart__dot", container);
  const tip = $(".chart__tooltip", container);
  container.onmousemove = (event) => {
    const hit = event.target.closest(".chart__hit");
    if (!hit) return;
    const point = points[hit.dataset.index];
    dot.setAttribute("cx", point.x);
    dot.setAttribute("cy", point.y);
    dot.style.opacity = 1;
    tip.style.left = `${point.x}px`;
    tip.style.top = `${point.y}px`;
    tip.style.opacity = 1;
    tip.textContent = `${new Date(point.key).toLocaleDateString("ru-RU", { day: "numeric", month: "short" })} · ${point.value} задач`;
  };
  container.onmouseleave = () => {
    dot.style.opacity = 0;
    tip.style.opacity = 0;
  };
}

const boardFilter = { assignee: null, priority: "all" };

function renderBoard() {
  $("#assigneeFilter").classList.toggle("has-filter", Boolean(boardFilter.assignee));
  $("#assigneeFilter").innerHTML = members
    .map((member) => `<button class="${boardFilter.assignee === member.id ? "is-active" : ""}" data-assignee="${member.id}">${avatar(member.id)}</button>`)
    .join("");

  const visible = state.tasks.filter(
    (task) =>
      (!boardFilter.assignee || task.assignee === boardFilter.assignee) &&
      (boardFilter.priority === "all" || task.priority === boardFilter.priority)
  );

  $("#board").innerHTML = statuses
    .map((status) => {
      const tasks = visible.filter((task) => task.status === status.id);
      return `
        <div class="column" data-status="${status.id}">
          <div class="column__head">
            <span class="column__dot" style="--color:${status.color}"></span>
            ${status.name}
            <span class="column__count">${tasks.length}</span>
            <button class="column__add" data-add="${status.id}" aria-label="Добавить задачу">+</button>
          </div>
          <div class="column__list">
            ${tasks.map(cardTemplate).join("")}
          </div>
        </div>`;
    })
    .join("");
}

function cardTemplate(task) {
  const client = state.clients.find((item) => item.id === task.client);
  return `
    <article class="card" draggable="true" data-id="${task.id}">
      <div class="card__top">
        <span class="tag tag--${task.priority}">${priorities[task.priority]}</span>
        ${client ? `<span class="tag">${escapeHtml(client.company)}</span>` : ""}
      </div>
      <p class="card__title">${escapeHtml(task.title)}</p>
      <div class="card__foot">
        <div class="card__meta">
          <span class="${isOverdue(task) ? "is-overdue" : ""}">◷ ${shortDate(task.due)}</span>
          <span>${task.estimate} ч</span>
        </div>
        ${avatar(task.assignee)}
      </div>
    </article>`;
}

function initBoard() {
  const board = $("#board");
  let draggedId = null;

  board.addEventListener("dragstart", (event) => {
    const card = event.target.closest(".card");
    if (!card) return;
    draggedId = card.dataset.id;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", draggedId);
    requestAnimationFrame(() => card.classList.add("is-dragging"));
  });

  board.addEventListener("dragend", (event) => {
    event.target.closest(".card")?.classList.remove("is-dragging");
    $$(".column", board).forEach((column) => column.classList.remove("is-over"));
  });

  board.addEventListener("dragover", (event) => {
    const column = event.target.closest(".column");
    if (!column || !draggedId) return;
    event.preventDefault();
    $$(".column", board).forEach((item) => item.classList.toggle("is-over", item === column));
  });

  board.addEventListener("drop", (event) => {
    const column = event.target.closest(".column");
    if (!column || !draggedId) return;
    event.preventDefault();
    const task = state.tasks.find((item) => item.id === draggedId);
    const status = column.dataset.status;
    draggedId = null;
    if (!task || task.status === status) {
      renderBoard();
      return;
    }
    setTaskStatus(task, status);
    save();
    renderAll();
    $(`.card[data-id="${task.id}"]`)?.classList.add("is-dropped");
    toast(`«${task.title}» → ${statuses.find((item) => item.id === status).name}`);
  });

  board.addEventListener("click", (event) => {
    const add = event.target.closest("[data-add]");
    const card = event.target.closest(".card");
    if (add) openTaskModal(null, { status: add.dataset.add });
    else if (card) openTaskModal(card.dataset.id);
  });

  $("#assigneeFilter").addEventListener("click", (event) => {
    const button = event.target.closest("[data-assignee]");
    if (!button) return;
    boardFilter.assignee = boardFilter.assignee === button.dataset.assignee ? null : button.dataset.assignee;
    renderBoard();
  });

  $("#priorityFilter").addEventListener("click", (event) => {
    const button = event.target.closest("[data-priority]");
    if (!button) return;
    boardFilter.priority = button.dataset.priority;
    $$("button", $("#priorityFilter")).forEach((item) => item.classList.toggle("is-active", item === button));
    renderBoard();
  });
}

const clientView = { query: "", status: "all", sort: "value", dir: -1 };

function clientTaskCount(clientId) {
  return state.tasks.filter((task) => task.client === clientId && task.status !== "done").length;
}

function renderClients() {
  const query = clientView.query.toLowerCase();
  const rows = state.clients
    .filter(
      (client) =>
        (clientView.status === "all" || client.status === clientView.status) &&
        `${client.company} ${client.contact} ${client.email}`.toLowerCase().includes(query)
    )
    .map((client) => ({ ...client, tasks: clientTaskCount(client.id) }))
    .sort((a, b) => {
      const first = a[clientView.sort];
      const second = b[clientView.sort];
      const result = typeof first === "number" ? first - second : String(first).localeCompare(String(second), "ru");
      return result * clientView.dir;
    });

  $$(".table th button").forEach((button) => {
    button.classList.toggle("is-asc", button.dataset.sort === clientView.sort && clientView.dir === 1);
    button.classList.toggle("is-desc", button.dataset.sort === clientView.sort && clientView.dir === -1);
  });

  $("#clientsBody").innerHTML = rows.length
    ? rows
        .map(
          (client, index) => `
          <tr data-client="${client.id}" style="animation-delay:${index * 30}ms">
            <td><div class="company"><span class="company__logo" style="--color:${client.color}">${initials(client.company)}</span><div>${escapeHtml(client.company)}<small>${escapeHtml(client.industry || "—")}</small></div></div></td>
            <td>${escapeHtml(client.contact)}</td>
            <td><span class="status status--${client.status}">${clientStatuses[client.status]}</span></td>
            <td class="mono">${rub(client.value)}</td>
            <td class="mono">${client.tasks}</td>
            <td class="mono">${shortDate(client.updated)}</td>
          </tr>`
        )
        .join("")
    : `<tr><td colspan="6" class="empty">Клиентов не найдено</td></tr>`;
}

function initClients() {
  $("#clientSearch").addEventListener("input", (event) => {
    clientView.query = event.target.value.trim();
    renderClients();
  });

  $("#clientStatusFilter").addEventListener("click", (event) => {
    const button = event.target.closest("[data-status]");
    if (!button) return;
    clientView.status = button.dataset.status;
    $$("button", $("#clientStatusFilter")).forEach((item) => item.classList.toggle("is-active", item === button));
    renderClients();
  });

  $$(".table th button").forEach((button) =>
    button.addEventListener("click", () => {
      const key = button.dataset.sort;
      clientView.dir = clientView.sort === key ? -clientView.dir : 1;
      clientView.sort = key;
      renderClients();
    })
  );

  $("#clientsBody").addEventListener("click", (event) => {
    const row = event.target.closest("[data-client]");
    if (row) openClientDrawer(row.dataset.client);
  });

  $("#newClientBtn").addEventListener("click", openClientModal);

  $("#clientForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.target;
    const invalid = $$("[required]", form).filter((input) => !input.checkValidity());
    $$(".field", form).forEach((field) => field.classList.remove("is-invalid"));
    invalid.forEach((input) => input.closest(".field").classList.add("is-invalid"));
    $("#clientError").textContent = invalid.length ? "Заполните компанию, контакт и корректный e-mail" : "";
    if (invalid.length) return;

    const data = Object.fromEntries(new FormData(form));
    const client = {
      id: `c${Date.now()}`,
      company: data.company.trim(),
      contact: data.contact.trim(),
      email: data.email.trim(),
      status: data.status,
      value: Number(data.value) || 0,
      industry: data.industry.trim(),
      color: clientColors[state.clients.length % clientColors.length],
      updated: todayKey()
    };
    state.clients.unshift(client);
    addFeed(`добавил(а) клиента ${client.company}`);
    save();
    closeModals();
    renderAll();
    toast(`Клиент «${client.company}» добавлен`);
  });
}

function openClientDrawer(clientId) {
  const client = state.clients.find((item) => item.id === clientId);
  const tasks = state.tasks.filter((task) => task.client === clientId);

  $("#drawerTitle").textContent = client.company;
  $("#drawerBody").innerHTML = `
    <div class="company"><span class="company__logo" style="--color:${client.color}; width:52px; height:52px; font-size:18px">${initials(client.company)}</span><div><b>${escapeHtml(client.company)}</b><small>${escapeHtml(client.industry || "Отрасль не указана")}</small></div></div>
    <dl class="info-list">
      <div><dt>Контакт</dt><dd>${escapeHtml(client.contact)}</dd></div>
      <div><dt>E-mail</dt><dd>${escapeHtml(client.email)}</dd></div>
      <div><dt>Статус</dt><dd><span class="status status--${client.status}">${clientStatuses[client.status]}</span></dd></div>
      <div><dt>Сумма сделок</dt><dd class="mono">${rub(client.value)}</dd></div>
    </dl>
    <div class="drawer__section">
      <h4>Задачи · ${tasks.length}</h4>
      ${
        tasks.length
          ? tasks
              .map(
                (task) => `<button class="mini-task" data-edit="${task.id}"><span class="column__dot" style="--color:${statuses.find((s) => s.id === task.status).color}"></span><span>${escapeHtml(task.title)}</span>${avatar(task.assignee)}</button>`
              )
              .join("")
          : `<p class="empty">Задач пока нет</p>`
      }
    </div>
    <button class="btn btn--primary" data-new-for="${client.id}">+ Задача для клиента</button>`;

  $("#clientDrawer").classList.add("is-open");
  $("#clientDrawer").setAttribute("aria-hidden", "false");
}

function closeDrawer() {
  $("#clientDrawer").classList.remove("is-open");
  $("#clientDrawer").setAttribute("aria-hidden", "true");
}

function initDrawer() {
  $("[data-close-drawer]").addEventListener("click", closeDrawer);
  $("#drawerBody").addEventListener("click", (event) => {
    const edit = event.target.closest("[data-edit]");
    const create = event.target.closest("[data-new-for]");
    if (edit) openTaskModal(edit.dataset.edit);
    if (create) openTaskModal(null, { client: create.dataset.newFor });
  });
}

function renderTeam() {
  $("#team").innerHTML = members
    .map((member, index) => {
      const tasks = state.tasks.filter((task) => task.assignee === member.id);
      const open = tasks.filter((task) => task.status !== "done");
      const hours = open.reduce((sum, task) => sum + Number(task.estimate || 0), 0);
      const load = Math.round((hours / member.capacity) * 100);
      const loadClass = load > 100 ? "is-over" : load > 75 ? "is-busy" : "";
      return `
        <article class="member" style="--i:${index}">
          <div class="member__head">
            ${avatar(member.id, "avatar--lg")}
            <div><b>${member.name}</b><small>${member.role}</small></div>
            <span class="member__status ${member.away ? "is-away" : ""}" title="${member.away ? "Не на месте" : "В сети"}"></span>
          </div>
          <div class="load"><span>Загрузка</span><b>${hours} / ${member.capacity} ч · ${load}%</b></div>
          <div class="load__track"><div class="load__fill ${loadClass}" style="width:${Math.min(load, 100)}%"></div></div>
          <div class="member__stats">
            <div><b>${open.length}</b><small>в работе</small></div>
            <div><b>${tasks.filter((task) => task.status === "done").length}</b><small>готово</small></div>
            <div><b>${open.filter(isOverdue).length}</b><small>просрочено</small></div>
          </div>
        </article>`;
    })
    .join("");
}

let editingTaskId = null;

function openTaskModal(taskId, preset = {}) {
  const form = $("#taskForm");
  const task = state.tasks.find((item) => item.id === taskId);
  editingTaskId = task ? task.id : null;

  $("#taskStatus").innerHTML = statuses.map((status) => `<option value="${status.id}">${status.name}</option>`).join("");
  $("#taskAssignee").innerHTML = members.map((member) => `<option value="${member.id}">${member.name}</option>`).join("");
  $("#taskClient").innerHTML = `<option value="">Без клиента</option>` + state.clients.map((client) => `<option value="${client.id}">${escapeHtml(client.company)}</option>`).join("");

  const values = task || {
    title: "",
    description: "",
    status: "backlog",
    priority: "medium",
    assignee: CURRENT_USER,
    client: "",
    due: shiftDays(3),
    estimate: 4,
    ...preset
  };

  form.elements.title.value = values.title;
  form.elements.description.value = values.description || "";
  form.elements.status.value = values.status;
  form.elements.priority.value = values.priority;
  form.elements.assignee.value = values.assignee;
  form.elements.client.value = values.client || "";
  form.elements.due.value = values.due || "";
  form.elements.estimate.value = values.estimate;

  $("#taskModalTitle").textContent = task ? "Редактирование задачи" : "Новая задача";
  $("#deleteTask").hidden = !task;
  $("#taskError").textContent = "";
  $(".field--title", form).classList.remove("is-invalid");

  openModal($("#taskModal"));
  setTimeout(() => form.elements.title.focus(), 100);
}

function initTaskForm() {
  const form = $("#taskForm");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = form.elements.title.value.trim();
    if (title.length < 3) {
      $("#taskError").textContent = "Название должно быть не короче 3 символов";
      $(".field--title", form).classList.add("is-invalid");
      return;
    }

    const data = {
      title,
      description: form.elements.description.value.trim(),
      priority: form.elements.priority.value,
      assignee: form.elements.assignee.value,
      client: form.elements.client.value || null,
      due: form.elements.due.value,
      estimate: Number(form.elements.estimate.value) || 1
    };
    const status = form.elements.status.value;

    if (editingTaskId) {
      const task = state.tasks.find((item) => item.id === editingTaskId);
      Object.assign(task, data);
      setTaskStatus(task, status);
      toast("Изменения сохранены");
    } else {
      const task = { id: `t${Date.now()}`, ...data, status: "backlog", createdAt: todayKey() };
      state.tasks.unshift(task);
      addFeed(`создал(а) задачу «${task.title}»`);
      if (status !== "backlog") setTaskStatus(task, status);
      toast(`Задача «${task.title}» создана`);
    }

    save();
    closeModals();
    renderAll();
    if ($("#clientDrawer").classList.contains("is-open") && data.client) openClientDrawer(data.client);
  });

  $("#deleteTask").addEventListener("click", () => {
    const index = state.tasks.findIndex((item) => item.id === editingTaskId);
    if (index < 0) return;
    const [removed] = state.tasks.splice(index, 1);
    save();
    closeModals();
    closeDrawer();
    renderAll();
    toast(`Задача удалена`, {
      label: "Отменить",
      run: () => {
        state.tasks.splice(index, 0, removed);
        save();
        renderAll();
      }
    });
  });

  $("#newTaskBtn").addEventListener("click", () => openTaskModal(null));
}

function openClientModal() {
  $("#clientForm").reset();
  $("#clientError").textContent = "";
  $$("#clientForm .field").forEach((field) => field.classList.remove("is-invalid"));
  openModal($("#clientModal"));
  setTimeout(() => $("#clientForm").elements.company.focus(), 100);
}

function openModal(modal) {
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-locked");
}

function closeModals() {
  $$(".modal").forEach((modal) => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  });
  document.body.classList.remove("is-locked");
}

function initModals() {
  $$("[data-close-modal]").forEach((element) => element.addEventListener("click", closeModals));
}

const palette = (() => {
  const element = $("#palette");
  const input = $("#paletteInput");
  const list = $("#paletteList");
  let items = [];
  let selected = 0;

  const actions = () => [
    { group: "Действия", icon: "+", label: "Новая задача", run: () => openTaskModal(null) },
    { group: "Действия", icon: "+", label: "Новый клиент", run: openClientModal },
    { group: "Действия", icon: "◐", label: "Переключить тему", run: toggleTheme },
    ...Object.entries(viewTitles).map(([view, title]) => ({ group: "Перейти", icon: "→", label: title, run: () => showView(view) }))
  ];

  const build = () => {
    const query = input.value.trim().toLowerCase();
    const match = (text) => text.toLowerCase().includes(query);

    const taskItems = state.tasks
      .filter((task) => query && match(task.title))
      .slice(0, 6)
      .map((task) => ({ group: "Задачи", icon: "☐", label: task.title, hint: statuses.find((s) => s.id === task.status).name, run: () => openTaskModal(task.id) }));

    const clientItems = state.clients
      .filter((client) => query && match(`${client.company} ${client.contact}`))
      .slice(0, 4)
      .map((client) => ({
        group: "Клиенты",
        icon: "◆",
        label: client.company,
        hint: client.contact,
        run: () => {
          showView("clients");
          openClientDrawer(client.id);
        }
      }));

    items = [...actions().filter((action) => !query || match(action.label)), ...taskItems, ...clientItems];
    selected = 0;
    render();
  };

  const render = () => {
    if (!items.length) {
      list.innerHTML = `<li class="palette__empty">Ничего не найдено</li>`;
      return;
    }
    let lastGroup = "";
    list.innerHTML = items
      .map((item, index) => {
        const header = item.group !== lastGroup ? `<li class="palette__group">${item.group}</li>` : "";
        lastGroup = item.group;
        return `${header}<li class="palette__item ${index === selected ? "is-selected" : ""}" data-index="${index}"><span class="palette__icon">${item.icon}</span>${escapeHtml(item.label)}${item.hint ? `<small>${item.hint}</small>` : ""}</li>`;
      })
      .join("");
    $(".palette__item.is-selected", list)?.scrollIntoView({ block: "nearest" });
  };

  const choose = (index) => {
    const item = items[index];
    if (!item) return;
    close();
    item.run();
  };

  function open() {
    element.classList.add("is-open");
    element.setAttribute("aria-hidden", "false");
    input.value = "";
    build();
    setTimeout(() => input.focus(), 50);
  }

  function close() {
    element.classList.remove("is-open");
    element.setAttribute("aria-hidden", "true");
  }

  function init() {
    input.addEventListener("input", build);
    input.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        selected = (selected + 1) % items.length;
        render();
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        selected = (selected - 1 + items.length) % items.length;
        render();
      } else if (event.key === "Enter") {
        event.preventDefault();
        choose(selected);
      }
    });
    list.addEventListener("click", (event) => {
      const item = event.target.closest(".palette__item");
      if (item) choose(Number(item.dataset.index));
    });
    list.addEventListener("mousemove", (event) => {
      const item = event.target.closest(".palette__item");
      if (!item || Number(item.dataset.index) === selected) return;
      selected = Number(item.dataset.index);
      render();
    });
    $("[data-close-palette]").addEventListener("click", close);
    $("#openPalette").addEventListener("click", open);
  }

  return { init, open, close, isOpen: () => element.classList.contains("is-open") };
})();

function renderNotifications() {
  const overdue = state.tasks.filter(isOverdue);
  const review = state.tasks.filter((task) => task.status === "review");
  const items = [
    ...overdue.map((task) => ({ icon: "⚠", text: `Просрочена: «${task.title}»`, sub: `${memberById(task.assignee).name} · срок ${shortDate(task.due)}`, id: task.id })),
    ...review.map((task) => ({ icon: "👀", text: `Ждёт проверки: «${task.title}»`, sub: memberById(task.assignee).name, id: task.id }))
  ];

  $("#notifications").innerHTML = items.length
    ? items.map((item) => `<button class="dropdown__item" data-edit="${item.id}"><span>${item.icon}</span><span>${escapeHtml(item.text)}<small>${item.sub}</small></span></button>`).join("")
    : `<p class="empty">Новых уведомлений нет</p>`;

  const seen = sessionStorage.getItem("flowdesk-seen") === String(items.length);
  $("#bellDot").hidden = !items.length || seen;
  renderNotifications.count = items.length;
}

function initNotifications() {
  const dropdown = $("#notifications");
  $("#bellBtn").addEventListener("click", (event) => {
    event.stopPropagation();
    dropdown.classList.toggle("is-open");
    sessionStorage.setItem("flowdesk-seen", String(renderNotifications.count));
    $("#bellDot").hidden = true;
  });
  dropdown.addEventListener("click", (event) => {
    const item = event.target.closest("[data-edit]");
    if (!item) return;
    dropdown.classList.remove("is-open");
    openTaskModal(item.dataset.edit);
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".notifications")) dropdown.classList.remove("is-open");
  });
}

function toggleTheme() {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next);
  localStorage.setItem("flowdesk-theme", next);
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  $("#themeLabel").textContent = theme === "dark" ? "Светлая тема" : "Тёмная тема";
}

function initTheme() {
  const saved = localStorage.getItem("flowdesk-theme");
  applyTheme(saved || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  $("#themeToggle").addEventListener("click", toggleTheme);
}

function closeSidebar() {
  $("#sidebar").classList.remove("is-open");
  $("#sidebarBackdrop").classList.remove("is-visible");
}

function initNavigation() {
  $("#menu").addEventListener("click", (event) => {
    const item = event.target.closest("[data-view]");
    if (item) showView(item.dataset.view);
  });

  $$("[data-goto]").forEach((button) => button.addEventListener("click", () => showView(button.dataset.goto)));

  $("#openSidebar").addEventListener("click", () => {
    $("#sidebar").classList.add("is-open");
    $("#sidebarBackdrop").classList.add("is-visible");
  });
  $("#sidebarBackdrop").addEventListener("click", closeSidebar);

  $("#chartRange").addEventListener("click", (event) => {
    const button = event.target.closest("[data-range]");
    if (!button) return;
    chartRange = Number(button.dataset.range);
    $$("button", $("#chartRange")).forEach((item) => item.classList.toggle("is-active", item === button));
    renderChart();
  });

  $("#myTasks").addEventListener("click", (event) => {
    const toggle = event.target.closest("[data-toggle]");
    const edit = event.target.closest("[data-edit]");
    if (toggle) {
      const task = state.tasks.find((item) => item.id === toggle.dataset.toggle);
      setTaskStatus(task, task.status === "done" ? "progress" : "done");
      save();
      renderAll();
      if (task.status === "done") toast(`✓ «${task.title}» выполнена`);
    }
    if (edit) openTaskModal(edit.dataset.edit);
  });

  $("#resetData").addEventListener("click", () => {
    state = createDefaultState();
    save();
    renderAll();
    toast("Демо-данные восстановлены");
  });

  let resizeTimer;
  addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => currentView === "dashboard" && renderChart(), 150);
  });

  document.addEventListener("keydown", (event) => {
    const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName);

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      palette.isOpen() ? palette.close() : palette.open();
      return;
    }

    if (event.key === "Escape") {
      palette.close();
      closeModals();
      closeDrawer();
      closeSidebar();
      return;
    }

    if (typing || palette.isOpen() || $(".modal.is-open")) return;
    if (event.key.toLowerCase() === "n" || event.key.toLowerCase() === "т") {
      event.preventDefault();
      openTaskModal(null);
    }
  });
}

initTheme();
initModals();
initBoard();
initClients();
initDrawer();
initTaskForm();
initNotifications();
palette.init();
initNavigation();
renderAll();
