const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

const STORAGE_KEY = "nova-demo-state";

const money = (value, currency = "RUB") =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "RUB" ? 0 : 2
  }).format(value);

const contacts = [
  { name: "Мария", initials: "М", color: "linear-gradient(135deg,#d4ff3a,#6bbf2a)" },
  { name: "Дмитрий", initials: "Д", color: "linear-gradient(135deg,#ff8a5c,#d43c6a)" },
  { name: "Анна", initials: "А", color: "linear-gradient(135deg,#3aa7ff,#2251c9)" },
  { name: "Илья", initials: "И", color: "linear-gradient(135deg,#b28cff,#5b3bd6)" },
  { name: "Соня", initials: "С", color: "linear-gradient(135deg,#ffd166,#e08a1e)" }
];

const categories = [
  { name: "Еда", value: 18400, color: "#7c5cff" },
  { name: "Транспорт", value: 6200, color: "#d4ff3a" },
  { name: "Покупки", value: 12900, color: "#3aa7ff" },
  { name: "Досуг", value: 7800, color: "#ff8a5c" }
];

const weeks = [
  { label: "1 нед", value: 11200 },
  { label: "2 нед", value: 16800 },
  { label: "3 нед", value: 9400 },
  { label: "4 нед", value: 7900 }
];

const defaultState = () => ({
  balance: 284650,
  transactions: [
    { icon: "☕", title: "Кофейня «Зерно»", note: "Сегодня, 09:12", amount: -340 },
    { icon: "💼", title: "Зарплата", note: "Вчера", amount: 145000 },
    { icon: "🛒", title: "Супермаркет", note: "Вчера", amount: -3870 },
    { icon: "🎬", title: "Кинотеатр", note: "14 ноября", amount: -1200 },
    { icon: "↩", title: "Кэшбэк за октябрь", note: "12 ноября", amount: 2340 }
  ],
  goals: [
    { emoji: "🏝", title: "Отпуск на Бали", saved: 148000, target: 250000 },
    { emoji: "💻", title: "Новый ноутбук", saved: 62000, target: 180000 },
    { emoji: "🛟", title: "Подушка безопасности", saved: 310000, target: 500000 }
  ]
});

let state = loadState();

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultState();
  } catch {
    return defaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 2800);
}

function animateNumber(element, from, to, format, duration = 1200) {
  const start = performance.now();
  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    element.textContent = format(from + (to - from) * eased);
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

let displayedBalance = 0;

function renderBalance() {
  animateNumber($("#balanceValue"), displayedBalance, state.balance, (value) => money(Math.round(value)));
  displayedBalance = state.balance;
}

function renderTransactions(highlightFirst = false) {
  $("#transactions").innerHTML = state.transactions
    .slice(0, 6)
    .map(
      (tx, index) => `
      <li class="${highlightFirst && index === 0 ? "is-new" : ""}">
        <span class="tx__icon">${tx.icon}</span>
        <div class="tx__info"><b>${escapeHtml(tx.title)}</b><small>${escapeHtml(tx.note)}</small></div>
        <span class="tx__amount ${tx.amount > 0 ? "is-income" : ""}">${tx.amount > 0 ? "+" : "−"}${money(Math.abs(tx.amount))}</span>
      </li>`
    )
    .join("");
}

function renderWeekChart() {
  const max = Math.max(...weeks.map((week) => week.value));
  $("#weekChart").innerHTML = weeks
    .map(
      (week) => `
      <div class="chart__col">
        <div class="chart__bar ${week.value === max ? "is-peak" : ""}" data-value="${money(week.value)}" style="height: 0%" data-height="${(week.value / max) * 100}"></div>
        <span>${week.label}</span>
      </div>`
    )
    .join("");

  requestAnimationFrame(() =>
    $$("#weekChart .chart__bar").forEach((bar) => {
      bar.style.height = `${bar.dataset.height}%`;
    })
  );
}

function renderDonut() {
  const total = categories.reduce((sum, item) => sum + item.value, 0);
  const radius = 15.915;
  let offset = 0;

  $("#donut").innerHTML =
    `<circle cx="21" cy="21" r="${radius}" stroke="rgba(255,255,255,0.06)"></circle>` +
    categories
      .map((item) => {
        const share = (item.value / total) * 100;
        const circle = `<circle cx="21" cy="21" r="${radius}" stroke="${item.color}" stroke-dasharray="${share - 1.5} ${100 - share + 1.5}" stroke-dashoffset="${-offset}" stroke-linecap="round"></circle>`;
        offset += share;
        return circle;
      })
      .join("");

  $("#donutLegend").innerHTML = categories
    .map((item) => `<li><i style="background:${item.color}"></i>${item.name}<b>${Math.round((item.value / total) * 100)}%</b></li>`)
    .join("");

  $("#spentTotal").textContent = money(total);
}

function renderGoals() {
  $("#goals").innerHTML = state.goals
    .map((goal, index) => {
      const percent = Math.min((goal.saved / goal.target) * 100, 100);
      return `
      <article class="goal">
        <div class="goal__head">
          <span class="goal__emoji">${goal.emoji}</span>
          <div><b>${goal.title}</b><small>Цель: ${money(goal.target)}</small></div>
        </div>
        <div class="goal__track"><div class="goal__fill" style="width:${percent}%"></div></div>
        <div class="goal__meta"><span>${money(goal.saved)}</span><span>${Math.round(percent)}%</span></div>
        <div class="goal__actions">
          <button data-goal="${index}" data-add="1000">+1 000 ₽</button>
          <button data-goal="${index}" data-add="10000">+10 000 ₽</button>
        </div>
      </article>`;
    })
    .join("");
}

function addTransaction(tx) {
  state.transactions.unshift(tx);
  state.balance += tx.amount;
  saveState();
  renderBalance();
  renderTransactions(true);
}

function initTabs() {
  $$(".app__tab").forEach((tab) =>
    tab.addEventListener("click", () => {
      $$(".app__tab").forEach((item) => item.classList.toggle("is-active", item === tab));
      $$(".app__panel").forEach((panel) => panel.classList.toggle("is-active", panel.dataset.panel === tab.dataset.tab));
      if (tab.dataset.tab === "overview") renderWeekChart();
    })
  );
}

function initTransfer() {
  const form = $("#transferForm");
  const recipientInput = $("#recipientInput");

  $("#contacts").innerHTML = contacts
    .map(
      (contact) => `
      <button type="button" class="contact" data-name="${contact.name}">
        <span class="avatar" style="background:${contact.color}">${contact.initials}</span>
        ${contact.name}
      </button>`
    )
    .join("");

  $("#contacts").addEventListener("click", (event) => {
    const contact = event.target.closest(".contact");
    if (!contact) return;
    $$(".contact").forEach((item) => item.classList.toggle("is-active", item === contact));
    recipientInput.value = contact.dataset.name;
  });

  recipientInput.addEventListener("input", () => $$(".contact").forEach((item) => item.classList.remove("is-active")));

  $$(".quick-amounts button").forEach((button) =>
    button.addEventListener("click", () => {
      form.elements.amount.value = button.dataset.amount;
    })
  );

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const recipient = form.elements.recipient.value.trim();
    const amount = Number(form.elements.amount.value);
    const message = form.elements.message.value.trim();
    const error = $("#transferError");

    if (!recipient) {
      error.textContent = "Укажите получателя";
      return;
    }
    if (!amount || amount <= 0) {
      error.textContent = "Введите сумму перевода";
      return;
    }
    if (amount > state.balance) {
      error.textContent = "Недостаточно средств на демо-счёте";
      return;
    }

    error.textContent = "";
    addTransaction({
      icon: "↗",
      title: `Перевод: ${recipient}`,
      note: message || "Только что",
      amount: -amount
    });

    form.hidden = true;
    $("#contacts").hidden = true;
    $("#successText").textContent = `${money(amount)} → ${recipient}`;
    $("#transferSuccess").hidden = false;
  });

  $("#successBack").addEventListener("click", () => {
    form.reset();
    form.hidden = false;
    $("#contacts").hidden = false;
    $("#transferSuccess").hidden = true;
    $$(".contact").forEach((item) => item.classList.remove("is-active"));
  });
}

function initGoals() {
  $("#goals").addEventListener("click", (event) => {
    const button = event.target.closest("[data-goal]");
    if (!button) return;
    const goal = state.goals[button.dataset.goal];
    const amount = Number(button.dataset.add);

    if (amount > state.balance) {
      showToast("Недостаточно средств на демо-счёте");
      return;
    }

    goal.saved += amount;
    addTransaction({ icon: goal.emoji, title: `В копилку «${goal.title}»`, note: "Только что", amount: -amount });
    renderGoals();
    showToast(goal.saved >= goal.target ? `🎉 Цель «${goal.title}» достигнута!` : `Отложено ${money(amount)}`);
  });
}

function initReset() {
  $("#resetDemo").addEventListener("click", () => {
    state = defaultState();
    saveState();
    renderBalance();
    renderTransactions();
    renderGoals();
    showToast("Демо-данные сброшены");
  });
}

function initCardTilt() {
  const stage = $("#cardStage");
  const card = $("#bankCard");
  if (!matchMedia("(pointer: fine)").matches) return;

  addEventListener("mousemove", (event) => {
    const rect = stage.getBoundingClientRect();
    const x = (event.clientX - (rect.left + rect.width / 2)) / innerWidth;
    const y = (event.clientY - (rect.top + rect.height / 2)) / innerHeight;
    card.style.transform = `rotateY(${x * 28}deg) rotateX(${-y * 28}deg)`;
    card.style.setProperty("--shine", `${50 + x * 120}%`);
  });
}

function initDesigner() {
  const cards = [$("#bankCard"), $("#previewCard")];
  let saved = {};
  try {
    const value = JSON.parse(localStorage.getItem("nova-card"));
    if (value && typeof value === "object" && !Array.isArray(value)) saved = value;
  } catch {
    saved = {};
  }

  const applyTheme = (theme) => {
    cards.forEach((card) => (card.dataset.theme = theme));
    $$(".swatch").forEach((swatch) => swatch.classList.toggle("is-active", swatch.dataset.theme === theme));
  };

  const applyName = (name) => {
    const value = name.trim().toUpperCase() || "YOUR NAME";
    $("#cardHolder").textContent = value;
    $("#previewHolder").textContent = value;
  };

  $("#swatches").addEventListener("click", (event) => {
    const swatch = event.target.closest(".swatch");
    if (!swatch) return;
    applyTheme(swatch.dataset.theme);
    saved.theme = swatch.dataset.theme;
    localStorage.setItem("nova-card", JSON.stringify(saved));
  });

  $("#holderInput").addEventListener("input", (event) => {
    applyName(event.target.value);
    saved.name = event.target.value;
    localStorage.setItem("nova-card", JSON.stringify(saved));
  });

  if (saved.theme) applyTheme(saved.theme);
  if (typeof saved.name === "string" && saved.name) {
    $("#holderInput").value = saved.name;
    applyName(saved.name);
  }
}

function initExchange() {
  const rates = { RUB: 1, USD: 92.4, EUR: 99.8, CNY: 12.7, GBP: 116.2, AED: 25.15 };
  const previous = { ...rates };
  const codes = Object.keys(rates);
  const from = $("#fromCurrency");
  const to = $("#toCurrency");
  const amountInput = $("#fromAmount");

  const options = codes.map((code) => `<option value="${code}">${code}</option>`).join("");
  from.innerHTML = options;
  to.innerHTML = options;
  from.value = "RUB";
  to.value = "USD";

  const convert = () => {
    const amount = Number(amountInput.value) || 0;
    const result = (amount * rates[from.value]) / rates[to.value];
    const unit = rates[from.value] / rates[to.value];
    $("#toAmount").textContent = result.toLocaleString("ru-RU", { maximumFractionDigits: 2 });
    $("#rateLine").textContent = `1 ${from.value} = ${unit.toLocaleString("ru-RU", { maximumFractionDigits: 4 })} ${to.value}`;
  };

  const renderRates = () => {
    $("#ratesList").innerHTML = codes
      .filter((code) => code !== "RUB")
      .map((code) => {
        const direction = rates[code] >= previous[code] ? "up" : "down";
        return `<li><span class="muted">${code}/RUB</span><b>${rates[code].toFixed(2)}</b><span class="${direction}">${direction === "up" ? "▲" : "▼"} ${Math.abs(rates[code] - previous[code]).toFixed(2)}</span></li>`;
      })
      .join("");
  };

  [amountInput, from, to].forEach((element) => element.addEventListener("input", convert));

  $("#swapCurrency").addEventListener("click", () => {
    [from.value, to.value] = [to.value, from.value];
    convert();
  });

  setInterval(() => {
    codes.forEach((code) => {
      if (code === "RUB") return;
      previous[code] = rates[code];
      rates[code] = +(rates[code] * (1 + (Math.random() - 0.5) * 0.004)).toFixed(2);
    });
    renderRates();
    convert();
  }, 4000);

  renderRates();
  convert();
}

function initBilling() {
  const toggle = $("#billingToggle");
  const thumb = $(".billing-toggle__thumb", toggle);
  const buttons = $$("button", toggle);

  const moveThumb = (button) => {
    thumb.style.width = `${button.offsetWidth}px`;
    thumb.style.transform = `translateX(${button.offsetLeft - 4}px)`;
  };

  buttons.forEach((button) =>
    button.addEventListener("click", () => {
      buttons.forEach((item) => item.classList.toggle("is-active", item === button));
      moveThumb(button);
      $$("[data-month]").forEach((price) => {
        const target = Number(price.dataset[button.dataset.billing]);
        const current = Number(price.textContent.replace(/\s/g, ""));
        animateNumber(price, current, target, (value) => Math.round(value).toLocaleString("ru-RU"), 600);
      });
    })
  );

  moveThumb(buttons[0]);
  addEventListener("resize", () => moveThumb($("button.is-active", toggle)));
}

function initGlow() {
  $$("[data-glow]").forEach((tile) =>
    tile.addEventListener("pointermove", (event) => {
      const rect = tile.getBoundingClientRect();
      tile.style.setProperty("--x", `${event.clientX - rect.left}px`);
      tile.style.setProperty("--y", `${event.clientY - rect.top}px`);
    })
  );
  $$(".mini-bars i").forEach((bar, index) => bar.style.setProperty("--i", index));
}

function initCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      const decimals = Number(element.dataset.decimals || 0);
      const suffix = element.dataset.suffix || "";
      animateNumber(
        element,
        0,
        Number(element.dataset.count),
        (value) => value.toLocaleString("ru-RU", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix,
        1600
      );
      observer.unobserve(element);
    });
  });
  $$("[data-count]").forEach((element) => observer.observe(element));
}

function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        if (entry.target.classList.contains("app")) renderWeekChart();
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );
  $$(".reveal").forEach((element) => observer.observe(element));
}

function initNav() {
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

renderBalance();
renderTransactions();
renderDonut();
renderGoals();
initTabs();
initTransfer();
initGoals();
initReset();
initCardTilt();
initDesigner();
initExchange();
initBilling();
initGlow();
initCounters();
initReveal();
initNav();
