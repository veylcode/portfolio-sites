const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const photo = (id, width = 600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;

const schedule = [
  { day: "Воскресенье", short: "Вс", open: 13, close: 23 },
  { day: "Понедельник", short: "Пн", open: null, close: null },
  { day: "Вторник", short: "Вт", open: 18, close: 24 },
  { day: "Среда", short: "Ср", open: 18, close: 24 },
  { day: "Четверг", short: "Чт", open: 18, close: 24 },
  { day: "Пятница", short: "Пт", open: 18, close: 26 },
  { day: "Суббота", short: "Сб", open: 13, close: 26 }
];

const menu = {
  starters: [
    { name: "Хлеб из дровяной печи", desc: "Закваска 48 часов, масло с золой лука-порея", price: 450, tags: ["veg", "sign"], img: "1509440159596-0249088772ff" },
    { name: "Устрицы на углях", desc: "Облепиховое масло, зелёный лук", price: 1400, tags: [], img: "1467003909585-2f8a72700288" },
    { name: "Печёная свёкла", desc: "Козий сыр, лесной орех, мёд с чабрецом", price: 780, tags: ["veg"], img: "1546069901-ba9599a7e63c" },
    { name: "Тартар из говядины", desc: "Копчёный желток, хрустящий каперс", price: 1190, tags: [], img: "1551218808-94e220e084d2" },
    { name: "Перцы падрон", desc: "Морская соль, лимон, обожжённые на решётке", price: 620, tags: ["veg", "spicy"], img: "1504674900247-0877df9cc836" },
    { name: "Форель холодного дыма", desc: "Пахта, огурец, укропное масло", price: 990, tags: ["sign"], img: "1476224203421-9ac39bcb3327" }
  ],
  fire: [
    { name: "Рибай сухой выдержки", desc: "45 дней выдержки, костный мозг, перечный соус", price: 4200, tags: ["sign"], img: "1600891964092-4316c288032e" },
    { name: "Утка на вишнёвых дровах", desc: "Печёная груша, можжевеловый соус", price: 2600, tags: [], img: "1544025162-d76694265947" },
    { name: "Осьминог с решётки", desc: "Копчёная паприка, картофель конфи", price: 2900, tags: ["spicy"], img: "1565299624946-b28f40a0ae38" },
    { name: "Цветная капуста в золе", desc: "Тахини, гранат, зелёная харисса", price: 890, tags: ["veg", "spicy"], img: "1512621776951-a57141f2eefd" },
    { name: "Цыплёнок под кирпичом", desc: "Лимон, чеснок, травы с террасы", price: 1650, tags: [], img: "1598103442097-8b74394b95c6" },
    { name: "Сибас целиком", desc: "Фенхель, оливки, обжаренный лимон", price: 2400, tags: [], img: "1519708227418-c8fd9a32b7a2" }
  ],
  desserts: [
    { name: "Тлеющее мороженое", desc: "Дымная карамель, сосновая хвоя", price: 690, tags: ["sign", "veg"], img: "1563805042-7684c019e1cb" },
    { name: "Баскский чизкейк", desc: "Обожжённая корочка, вишня из печи", price: 640, tags: ["veg"], img: "1533134242443-d4fd215305ad" },
    { name: "Печёное яблоко", desc: "Овсяный крамбл, крем-фреш", price: 560, tags: ["veg"], img: "1488477181946-6428a0291777" },
    { name: "Шоколад и угли", desc: "Тёмный ганаш, копчёная соль, бисквит", price: 720, tags: ["veg"], img: "1606313564200-e75d5e30476c" }
  ],
  drinks: [
    { name: "Smoked Old Fashioned", desc: "Бурбон, копчёный кленовый сироп", price: 890, tags: ["sign"], img: "1514362545857-3bc16c4c7d1b" },
    { name: "Бокал крымского красного", desc: "Каберне, Севастополь, 2021", price: 750, tags: [], img: "1510812431401-41d2bd2722f3" },
    { name: "Ферментированный лимонад", desc: "Облепиха, розмарин, мёд", price: 450, tags: ["veg"], img: "1513558161293-cdaf765ed2fd" },
    { name: "Иван-чай с дымком", desc: "Чайник на двоих, сушёные ягоды", price: 520, tags: ["veg"], img: "1544787219-7f47ccb76574" }
  ]
};

const tagIcons = {
  spicy: `<b class="tag tag--spicy" title="Острое">◆</b>`,
  veg: `<b class="tag tag--veg" title="Вегетарианское">●</b>`,
  sign: `<b class="tag tag--sign" title="Блюдо-подпись">★</b>`
};

const pad = (value) => String(value).padStart(2, "0");
const formatHour = (hour) => `${pad(Math.floor(hour) % 24)}:${pad(Math.round((hour % 1) * 60))}`;

function initSparks() {
  const canvas = $("#sparks");
  const context = canvas.getContext("2d");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let sparks = [];
  let width = 0;
  let height = 0;
  let isVisible = true;

  const resize = () => {
    const ratio = Math.min(devicePixelRatio, 2);
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const createSpark = () => ({
    x: width * (0.3 + Math.random() * 0.7),
    y: height + 10,
    radius: Math.random() * 2 + 0.6,
    speed: Math.random() * 1.4 + 0.6,
    drift: (Math.random() - 0.5) * 0.6,
    phase: Math.random() * Math.PI * 2,
    life: 1,
    decay: Math.random() * 0.004 + 0.002
  });

  const draw = () => {
    if (!isVisible) return;
    context.clearRect(0, 0, width, height);
    context.globalCompositeOperation = "lighter";

    if (sparks.length < (width < 700 ? 60 : 130)) sparks.push(createSpark());

    sparks = sparks.filter((spark) => spark.life > 0 && spark.y > -20);
    sparks.forEach((spark) => {
      spark.phase += 0.03;
      spark.y -= spark.speed;
      spark.x += spark.drift + Math.sin(spark.phase) * 0.5;
      spark.life -= spark.decay;

      const glow = context.createRadialGradient(spark.x, spark.y, 0, spark.x, spark.y, spark.radius * 5);
      glow.addColorStop(0, `rgba(255, 200, 120, ${spark.life})`);
      glow.addColorStop(0.3, `rgba(255, 91, 31, ${spark.life * 0.6})`);
      glow.addColorStop(1, "rgba(255, 91, 31, 0)");
      context.fillStyle = glow;
      context.beginPath();
      context.arc(spark.x, spark.y, spark.radius * 5, 0, Math.PI * 2);
      context.fill();
    });

    requestAnimationFrame(draw);
  };

  if (reduceMotion) return;
  resize();
  addEventListener("resize", resize);
  new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
    if (isVisible) draw();
  }).observe(canvas);
}

function initOpenStatus() {
  const element = $("#openStatus");
  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;
  const today = schedule[now.getDay()];
  const yesterday = schedule[(now.getDay() + 6) % 7];

  const openToday = today.open !== null && hour >= today.open && hour < today.close;
  const openFromYesterday = yesterday.close > 24 && hour < yesterday.close - 24;

  if (openToday || openFromYesterday) {
    const closeHour = openToday ? today.close : yesterday.close;
    element.classList.add("is-open");
    element.lastChild.textContent = `Открыто сейчас · до ${formatHour(closeHour)}`;
    return;
  }

  for (let offset = 0; offset < 7; offset += 1) {
    const day = schedule[(now.getDay() + offset) % 7];
    if (day.open === null || (offset === 0 && hour >= day.open)) continue;
    const when = offset === 0 ? "сегодня" : offset === 1 ? "завтра" : day.day.toLowerCase();
    element.lastChild.textContent = `Сейчас закрыто · откроемся ${when} в ${formatHour(day.open)}`;
    return;
  }
}

function initMenu() {
  const list = $("#menuList");
  const tabs = $$(".tabs__btn");
  const line = $("#tabsLine");
  const preview = $("#menuPreview");
  const previewImage = $("img", preview);

  const moveLine = (tab) => {
    line.style.width = `${tab.offsetWidth}px`;
    line.style.transform = `translateX(${tab.offsetLeft}px)`;
  };

  const render = (category) => {
    list.innerHTML = menu[category]
      .map(
        (dish, index) => `
        <li class="dish" style="--i:${index}" data-img="${dish.img}">
          <div class="dish__top">
            <span class="dish__name">${dish.name}${dish.tags.map((tag) => tagIcons[tag]).join("")}</span>
            <span class="dish__dots"></span>
            <span class="dish__price">${dish.price.toLocaleString("ru-RU")} ₽</span>
          </div>
          <p class="dish__desc">${dish.desc}</p>
        </li>`
      )
      .join("");
  };

  tabs.forEach((tab) =>
    tab.addEventListener("click", () => {
      tabs.forEach((item) => item.classList.toggle("is-active", item === tab));
      moveLine(tab);
      render(tab.dataset.tab);
    })
  );

  if (matchMedia("(pointer: fine)").matches) {
    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;

    list.addEventListener("mouseover", (event) => {
      const dish = event.target.closest(".dish");
      if (!dish) return;
      const src = photo(dish.dataset.img, 480);
      if (previewImage.getAttribute("src") !== src) previewImage.src = src;
      preview.classList.add("is-visible");
    });

    list.addEventListener("mouseleave", () => preview.classList.remove("is-visible"));

    list.addEventListener("mousemove", (event) => {
      targetX = event.clientX + 160;
      targetY = event.clientY;
    });

    const follow = () => {
      x += (targetX - x) * 0.14;
      y += (targetY - y) * 0.14;
      preview.style.left = `${x}px`;
      preview.style.top = `${y}px`;
      requestAnimationFrame(follow);
    };
    follow();
  }

  render("starters");
  moveLine(tabs[0]);
  addEventListener("resize", () => moveLine($(".tabs__btn.is-active")));
  document.fonts?.ready.then(() => moveLine($(".tabs__btn.is-active")));
}

function initCourses() {
  const container = $("#courses");
  const courses = $$(".course", container);

  const update = () => {
    const rect = container.getBoundingClientRect();
    const progress = Math.min(Math.max((innerHeight * 0.6 - rect.top) / rect.height, 0), 1);
    container.style.setProperty("--progress", progress);
    courses.forEach((course, index) => course.classList.toggle("is-lit", progress >= index / courses.length));
  };

  addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
  update();
}

function seededRandom(seed) {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return () => {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff;
    return hash / 0x7fffffff;
  };
}

function initBooking() {
  const form = $("#bookingForm");
  const datesContainer = $("#dates");
  const slotsContainer = $("#slots");
  const months = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];

  const booking = { date: null, time: null, guests: 2 };
  let confirmedBooking = null;
  const submitButton = $('[type="submit"][form="bookingForm"]');

  const setSummary = (id, value) => {
    const element = $(id);
    if (element.textContent === String(value)) return;
    element.textContent = value;
    element.classList.remove("is-updated");
    void element.offsetWidth;
    element.classList.add("is-updated");
  };

  const days = Array.from({ length: 14 }, (_, offset) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + offset);
    return date;
  });

  datesContainer.innerHTML = days
    .map((date, index) => {
      const info = schedule[date.getDay()];
      const label = index === 0 ? "Сегодня" : index === 1 ? "Завтра" : info.short;
      return `
        <button type="button" class="date" data-index="${index}" ${info.open === null ? "disabled title='Выходной'" : ""}>
          <small>${label}</small><b>${date.getDate()}</b><small>${months[date.getMonth()]}</small>
        </button>`;
    })
    .join("");

  const renderSlots = () => {
    if (!booking.date) {
      slotsContainer.innerHTML = `<p class="muted">Сначала выберите дату</p>`;
      return;
    }

    const info = schedule[booking.date.getDay()];
    const random = seededRandom(booking.date.toDateString() + booking.guests);
    const now = new Date();
    const isToday = booking.date.toDateString() === now.toDateString();
    const currentHour = now.getHours() + now.getMinutes() / 60;
    const lastSeating = Math.min(info.close - 1.5, 23.5);
    const slots = [];

    for (let hour = info.open; hour <= lastSeating; hour += 0.5) {
      const tooLate = isToday && hour <= currentHour + 0.5;
      const busy = random() < 0.25 + booking.guests * 0.04;
      slots.push({ hour, available: !tooLate && !busy });
    }

    slotsContainer.innerHTML = slots
      .map(
        (slot, index) => `
        <button type="button" class="slot ${booking.time === slot.hour ? "is-active" : ""}" style="--i:${index}" data-hour="${slot.hour}" ${slot.available ? "" : "disabled"}>
          ${formatHour(slot.hour)}
        </button>`
      )
      .join("");

    if (!slots.some((slot) => slot.available)) {
      slotsContainer.innerHTML += `<p class="muted" style="grid-column: 1 / -1">На этот день мест нет — попробуйте другую дату</p>`;
    }
  };

  datesContainer.addEventListener("click", (event) => {
    const button = event.target.closest(".date");
    if (!button || button.disabled) return;
    $$(".date", datesContainer).forEach((item) => item.classList.toggle("is-active", item === button));
    booking.date = days[button.dataset.index];
    booking.time = null;
    setSummary("#sumDate", booking.date.toLocaleDateString("ru-RU", { day: "numeric", month: "long", weekday: "short" }));
    setSummary("#sumTime", "—");
    renderSlots();
  });

  slotsContainer.addEventListener("click", (event) => {
    const button = event.target.closest(".slot");
    if (!button || button.disabled) return;
    $$(".slot", slotsContainer).forEach((item) => item.classList.toggle("is-active", item === button));
    booking.time = Number(button.dataset.hour);
    setSummary("#sumTime", formatHour(booking.time));
  });

  $$("[data-guests]").forEach((button) =>
    button.addEventListener("click", () => {
      booking.guests = Math.min(Math.max(booking.guests + Number(button.dataset.guests), 1), 12);
      $("#guestsOut").textContent = booking.guests;
      setSummary("#sumGuests", booking.guests);
      booking.time = null;
      setSummary("#sumTime", "—");
      renderSlots();
    })
  );

  form.elements.occasion.addEventListener("change", (event) => setSummary("#sumOccasion", event.target.value || "Просто ужин"));

  form.addEventListener("input", (event) => event.target.closest(".input")?.classList.remove("is-invalid"));

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (confirmedBooking) return;
    const error = $("#bookingError");
    const invalidInputs = $$("input[required]", form).filter((input) => !input.checkValidity());
    invalidInputs.forEach((input) => input.closest(".input").classList.add("is-invalid"));

    const problem = !booking.date
      ? "Выберите дату визита"
      : booking.time === null
        ? "Выберите свободное время"
        : invalidInputs.length
          ? "Укажите имя и телефон для связи"
          : "";

    error.textContent = problem;
    if (problem) return;

    const code = `EM-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const dateLabel = booking.date.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
    const name = form.elements.name.value.trim();
    confirmedBooking = { ...booking, date: new Date(booking.date) };
    submitButton.disabled = true;

    $("#ticketCode").textContent = code;
    $("#ticketText").textContent = `${name}, ждём вас ${dateLabel} в ${formatHour(booking.time)}. Стол на ${booking.guests} ${booking.guests === 1 ? "гостя" : "гостей"}.`;
    $(".summary__inner").hidden = true;
    $("#ticket").hidden = false;

    $("#icsBtn").onclick = () => downloadCalendar(confirmedBooking, code);
    document.dispatchEvent(
      new CustomEvent("booking:created", {
        detail: {
          code,
          date: booking.date.toISOString(),
          time: formatHour(booking.time),
          guests: booking.guests,
          occasion: form.elements.occasion.value || "Ужин",
          at: Date.now()
        }
      })
    );
    if (innerWidth < 1024) $("#summary").scrollIntoView({ behavior: "smooth", block: "center" });
  });

  $("#newBooking").addEventListener("click", () => {
    confirmedBooking = null;
    submitButton.disabled = false;
    form.reset();
    Object.assign(booking, { date: null, time: null, guests: 2 });
    $("#guestsOut").textContent = 2;
    ["#sumDate", "#sumTime"].forEach((id) => ($(id).textContent = "—"));
    $("#sumGuests").textContent = 2;
    $("#sumOccasion").textContent = "Просто ужин";
    $$(".date").forEach((item) => item.classList.remove("is-active"));
    renderSlots();
    $(".summary__inner").hidden = false;
    $("#ticket").hidden = true;
  });

  renderSlots();
}

function downloadCalendar(booking, code) {
  const start = new Date(booking.date);
  start.setHours(Math.floor(booking.time), (booking.time % 1) * 60);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const stamp = (date) => date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//EMBER//Booking//RU",
    "BEGIN:VEVENT",
    `UID:${code}@ember.rest`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:Ужин в EMBER (${booking.guests} чел.)`,
    "LOCATION:Москва\\, ул. Бауманская\\, 11с4",
    `DESCRIPTION:Номер брони ${code}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  link.download = `ember-${code}.ics`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function initHours() {
  const todayIndex = new Date().getDay();
  const order = [1, 2, 3, 4, 5, 6, 0];
  $("#hours").innerHTML = order
    .map((index) => {
      const day = schedule[index];
      const time = day.open === null ? "выходной" : `${formatHour(day.open)} — ${formatHour(day.close)}`;
      return `<li class="${index === todayIndex ? "is-today" : ""}"><span>${day.day}</span><span>${time}</span></li>`;
    })
    .join("");
}

function initCounters() {
  const observer = new IntersectionObserver((entries) =>
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      const target = Number(element.dataset.count);
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / 1600, 1);
        element.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3)));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.unobserve(element);
    })
  );
  $$("[data-count]").forEach((element) => observer.observe(element));
}

function initHeader() {
  const header = $("#header");
  const burger = $("#burger");
  const nav = $("#nav");

  addEventListener("scroll", () => header.classList.toggle("is-scrolled", scrollY > 60), { passive: true });

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
    { threshold: 0.15 }
  );
  $$(".reveal").forEach((element) => observer.observe(element));
}

initSparks();
initOpenStatus();
initMenu();
initCourses();
initBooking();
initHours();
initCounters();
initHeader();
initReveal();
