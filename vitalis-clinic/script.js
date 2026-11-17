const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const photo = (id, width = 500) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&h=${width}&q=80&crop=faces`;

const rub = (value) => new Intl.NumberFormat("ru-RU").format(value) + " ₽";
const pad = (value) => String(value).padStart(2, "0");
const formatTime = (hour) => `${pad(Math.floor(hour))}:${pad(Math.round((hour % 1) * 60))}`;

const icon = (path) => `<svg viewBox="0 0 24 24"><path d="${path}"/></svg>`;

const specialties = [
  { id: "therapy", name: "Терапия", desc: "Первичный приём, профилактика и маршрутизация", from: 2900, icon: "M6 3v6a5 5 0 0 0 10 0V3M11 14v1a5 5 0 0 0 10 0v-2M21 11a2 2 0 1 0 0 .01" },
  { id: "cardio", name: "Кардиология", desc: "ЭКГ, ЭхоКГ, контроль давления и ритма", from: 3600, icon: "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10ZM3 12h4l2-3 3 6 2-3h7" },
  { id: "neuro", name: "Неврология", desc: "Головные боли, сон, боли в спине", from: 3400, icon: "M12 5a3 3 0 0 0-5.6-1.5A3 3 0 0 0 4 8a3 3 0 0 0 0 6 3 3 0 0 0 3 5 3 3 0 0 0 5 1V5Zm0 0a3 3 0 0 1 5.6-1.5A3 3 0 0 1 20 8a3 3 0 0 1 0 6 3 3 0 0 1-3 5 3 3 0 0 1-5 1" },
  { id: "derma", name: "Дерматология", desc: "Кожа, родинки, трихология", from: 3200, icon: "M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" },
  { id: "pediatrics", name: "Педиатрия", desc: "Наблюдение детей с рождения до 18 лет", from: 3100, icon: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM9 14s1 1.5 3 1.5 3-1.5 3-1.5M9 10h.01M15 10h.01" },
  { id: "gyn", name: "Гинекология", desc: "Ведение беременности и женское здоровье", from: 3500, icon: "M12 14a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM12 14v7M9 18h6" },
  { id: "ophthalmo", name: "Офтальмология", desc: "Проверка зрения и подбор очков", from: 3000, icon: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" },
  { id: "diagnostics", name: "Диагностика", desc: "УЗИ, МРТ, КТ и функциональные исследования", from: 2400, icon: "M3 12h3l3-8 4 16 3-8h5" }
];

const doctors = [
  { id: 1, name: "Морозова Анна Сергеевна", spec: "therapy", exp: 14, rating: 4.9, reviews: 412, price: 3400, photo: "1559839734-2b71ea197ec2", days: [1, 2, 3, 4, 5], hours: [9, 17] },
  { id: 2, name: "Белов Игорь Андреевич", spec: "cardio", exp: 21, rating: 5.0, reviews: 538, price: 4800, photo: "1612349317150-e413f6a5b16d", days: [1, 3, 5, 6], hours: [10, 18] },
  { id: 3, name: "Ковалёва Мария Олеговна", spec: "neuro", exp: 11, rating: 4.8, reviews: 276, price: 3900, photo: "1594824476967-48c8b964273f", days: [2, 4, 6], hours: [11, 20] },
  { id: 4, name: "Сафронов Денис Петрович", spec: "derma", exp: 9, rating: 4.9, reviews: 198, price: 3600, photo: "1622253692010-333f2da6031d", days: [1, 2, 4, 5], hours: [12, 21] },
  { id: 5, name: "Лебедева Ольга Викторовна", spec: "pediatrics", exp: 17, rating: 5.0, reviews: 624, price: 3500, photo: "1527613426441-4da17471b66d", days: [1, 2, 3, 4, 5, 6], hours: [8, 15] },
  { id: 6, name: "Орлова Екатерина Дмитриевна", spec: "gyn", exp: 15, rating: 4.9, reviews: 357, price: 4200, photo: "1651008376811-b90baee60c1f", days: [2, 3, 5], hours: [9, 18] },
  { id: 7, name: "Тихонов Алексей Юрьевич", spec: "ophthalmo", exp: 12, rating: 4.8, reviews: 221, price: 3300, photo: "1537368910025-700350fe46c7", days: [1, 3, 4, 6], hours: [10, 19] },
  { id: 8, name: "Гришин Павел Сергеевич", spec: "diagnostics", exp: 19, rating: 4.9, reviews: 489, price: 2900, photo: "1582750433449-648ed127bb54", days: [1, 2, 3, 4, 5, 6, 0], hours: [8, 20] },
  { id: 9, name: "Никитина Светлана Игоревна", spec: "cardio", exp: 8, rating: 4.7, reviews: 143, price: 3900, photo: "1638202993928-7267aad84c31", days: [2, 4, 0], hours: [9, 16] },
  { id: 10, name: "Захаров Роман Ильич", spec: "therapy", exp: 10, rating: 4.8, reviews: 264, price: 3100, photo: "1612531386530-97286d97c2d2", days: [1, 3, 5, 6, 0], hours: [13, 21] }
];

const priceGroups = [
  { title: "Консультации", items: [["Приём терапевта", 3400], ["Приём кардиолога", 4800], ["Приём невролога", 3900], ["Повторный приём", 2600], ["Онлайн-консультация", 2200]] },
  { title: "Лабораторные анализы", items: [["Общий анализ крови", 690], ["Биохимия (12 показателей)", 2900], ["Гормоны щитовидной железы", 1800], ["Витамин D", 2300], ["Липидный профиль", 1400]] },
  { title: "УЗИ и диагностика", items: [["УЗИ брюшной полости", 3200], ["УЗИ щитовидной железы", 2400], ["ЭКГ с расшифровкой", 1600], ["Эхокардиография", 4500], ["МРТ головного мозга", 8900]] },
  { title: "Процедуры", items: [["Капельница витаминная", 4900], ["Удаление новообразования", 3800], ["Проверка зрения", 2100], ["Вакцинация (без препарата)", 900]] }
];

const specById = Object.fromEntries(specialties.map((spec) => [spec.id, spec]));
const initials = (name) => name.split(" ").slice(0, 2).map((part) => part[0]).join("");

function seeded(seed) {
  let hash = 2166136261;
  for (const char of seed) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return () => {
    hash = Math.imul(hash ^ (hash >>> 15), 2246822507);
    hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
    return ((hash ^= hash >>> 16) >>> 0) / 4294967296;
  };
}

const today = new Date();
today.setHours(0, 0, 0, 0);

function isDayAvailable(doctor, date) {
  const diff = (date - today) / 86400000;
  if (diff < 0 || diff > 45 || !doctor.days.includes(date.getDay())) return false;
  return seeded(`${doctor.id}-${date.toDateString()}`)() > 0.18;
}

function getSlots(doctor, date) {
  const random = seeded(`${doctor.id}-${date.toDateString()}-slots`);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const currentHour = now.getHours() + now.getMinutes() / 60;
  const slots = [];
  for (let hour = doctor.hours[0]; hour < doctor.hours[1]; hour += 0.5) {
    const isFree = random() > 0.35;
    if (isFree && !(isToday && hour <= currentHour + 1)) slots.push(hour);
  }
  return slots;
}

function nextSlot(doctor) {
  for (let offset = 0; offset < 30; offset += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() + offset);
    if (!isDayAvailable(doctor, date)) continue;
    const slots = getSlots(doctor, date);
    if (!slots.length) continue;
    const label = offset === 0 ? "Сегодня" : offset === 1 ? "Завтра" : date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
    return `${label}, ${formatTime(slots[0])}`;
  }
  return "Уточняйте";
}

function renderServices() {
  $("#servicesGrid").innerHTML = specialties
    .map(
      (spec) => `
      <button class="service reveal" data-service="${spec.id}">
        <span class="service__icon">${icon(spec.icon)}</span>
        <h3>${spec.name}</h3>
        <p>${spec.desc}</p>
        <span class="service__link">от ${rub(spec.from)} →</span>
      </button>`
    )
    .join("");

  $("#servicesGrid").addEventListener("click", (event) => {
    const card = event.target.closest("[data-service]");
    if (!card) return;
    doctorFilter.spec = card.dataset.service;
    renderDoctors();
    $("#doctors").scrollIntoView({ behavior: "smooth" });
  });
}

const doctorFilter = { spec: "all", query: "" };

function renderDoctorFilters() {
  const chips = [{ id: "all", name: "Все врачи" }, ...specialties];
  $("#doctorFilters").innerHTML = chips
    .map((chip) => `<button class="${doctorFilter.spec === chip.id ? "is-active" : ""}" data-spec="${chip.id}">${chip.name}</button>`)
    .join("");
}

function renderDoctors() {
  renderDoctorFilters();
  const query = doctorFilter.query.toLowerCase();
  const list = doctors.filter(
    (doctor) =>
      (doctorFilter.spec === "all" || doctor.spec === doctorFilter.spec) &&
      doctor.name.toLowerCase().includes(query)
  );

  $("#doctorsGrid").innerHTML = list.length
    ? list
        .map(
          (doctor, index) => `
          <article class="doctor" style="--i:${index}">
            <div class="doctor__photo" data-initials="${initials(doctor.name)}">
              <span class="doctor__rating">★ ${doctor.rating.toFixed(1)} · ${doctor.reviews}</span>
              <img src="${photo(doctor.photo)}" alt="${doctor.name}" loading="lazy" onerror="this.remove()">
            </div>
            <div class="doctor__body">
              <span class="doctor__spec">${specById[doctor.spec].name}</span>
              <h3 class="doctor__name">${doctor.name}</h3>
              <span class="doctor__meta">Стаж ${doctor.exp} лет · ${rub(doctor.price)}</span>
              <div class="doctor__slot">
                <div><span>Ближайшая запись</span><b>${nextSlot(doctor)}</b></div>
                <button class="doctor__book" data-book-doctor="${doctor.id}">Записаться</button>
              </div>
            </div>
          </article>`
        )
        .join("")
    : `<p class="doctors__empty">Врачей по запросу не найдено</p>`;
}

function initDoctors() {
  $("#doctorFilters").addEventListener("click", (event) => {
    const chip = event.target.closest("[data-spec]");
    if (!chip) return;
    doctorFilter.spec = chip.dataset.spec;
    renderDoctors();
  });

  $("#doctorSearch").addEventListener("input", (event) => {
    doctorFilter.query = event.target.value.trim();
    renderDoctors();
  });

  $("#doctorsGrid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-book-doctor]");
    if (button) wizard.startWithDoctor(Number(button.dataset.bookDoctor));
  });

  $$("[data-book-service]").forEach((link) =>
    link.addEventListener("click", (event) => {
      event.preventDefault();
      wizard.startWithSpecialty(link.dataset.bookService);
    })
  );

  renderDoctors();
}

const wizard = (() => {
  const state = { step: 1, spec: null, doctor: null, date: null, time: null, month: new Date(today.getFullYear(), today.getMonth(), 1) };
  const panels = $$(".wizard__panel");
  const steps = $$("#wizardSteps li");
  const back = $("#wizardBack");
  const next = $("#wizardNext");
  const error = $("#wizardError");

  const doctorById = (id) => doctors.find((doctor) => doctor.id === id);

  function renderSpecialties() {
    $("#specialtyOptions").innerHTML = specialties
      .map(
        (spec) => `
        <button type="button" class="option ${state.spec === spec.id ? "is-active" : ""}" data-pick-spec="${spec.id}">
          ${icon(spec.icon)}
          <span>${spec.name}<small>от ${rub(spec.from)}</small></span>
        </button>`
      )
      .join("");
  }

  function renderDoctorOptions() {
    $("#doctorOptions").innerHTML = doctors
      .filter((doctor) => doctor.spec === state.spec)
      .map(
        (doctor) => `
        <button type="button" class="option ${state.doctor === doctor.id ? "is-active" : ""}" data-pick-doctor="${doctor.id}">
          <span class="option__avatar"><img src="${photo(doctor.photo, 160)}" alt="" onerror="this.remove()"></span>
          <span>${doctor.name}<small>★ ${doctor.rating.toFixed(1)} · стаж ${doctor.exp} лет · ${rub(doctor.price)}</small><small>Ближайшая: ${nextSlot(doctor)}</small></span>
        </button>`
      )
      .join("");
  }

  function renderCalendar() {
    const doctor = doctorById(state.doctor);
    const { month } = state;
    const firstWeekday = (month.getDay() + 6) % 7;
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const cells = Array.from({ length: firstWeekday }, () => `<span></span>`);

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(month.getFullYear(), month.getMonth(), day);
      const available = doctor && isDayAvailable(doctor, date) && getSlots(doctor, date).length > 0;
      const isActive = state.date && date.toDateString() === state.date.toDateString();
      cells.push(`<button type="button" class="${isActive ? "is-active" : ""}" data-day="${day}" ${available ? "" : "disabled"}>${day}</button>`);
    }

    $("#calendarDays").innerHTML = cells.join("");
    $("#monthLabel").textContent = month.toLocaleDateString("ru-RU", { month: "long", year: "numeric" });

    const minMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastAvailableDate = new Date(today);
    lastAvailableDate.setDate(today.getDate() + 45);
    const maxMonth = new Date(lastAvailableDate.getFullYear(), lastAvailableDate.getMonth(), 1);
    $("#prevMonth").disabled = month <= minMonth;
    $("#nextMonth").disabled = month >= maxMonth;
  }

  function renderTimes() {
    const doctor = doctorById(state.doctor);
    if (!state.date || !doctor) {
      $("#timesLabel").textContent = "Выберите день в календаре";
      $("#timesGrid").innerHTML = "";
      return;
    }
    const slots = getSlots(doctor, state.date);
    $("#timesLabel").textContent = `Свободно ${state.date.toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" })}`;
    $("#timesGrid").innerHTML = slots
      .map((hour, index) => `<button type="button" class="time ${state.time === hour ? "is-active" : ""}" style="--i:${index}" data-time="${hour}">${formatTime(hour)}</button>`)
      .join("");
  }

  function renderRecap() {
    const doctor = doctorById(state.doctor);
    $("#recap").innerHTML = [
      specById[state.spec]?.name,
      doctor?.name,
      state.date?.toLocaleDateString("ru-RU", { day: "numeric", month: "long" }),
      state.time !== null ? formatTime(state.time) : null,
      doctor ? rub(doctor.price) : null
    ]
      .filter(Boolean)
      .map((item) => `<span>${item}</span>`)
      .join("");
  }

  function validate() {
    if (state.step === 1 && !state.spec) return "Выберите направление";
    if (state.step === 2 && !state.doctor) return "Выберите врача";
    if (state.step === 3 && (!state.date || state.time === null)) return "Выберите дату и время";
    if (state.step === 4) {
      const form = $("#patientForm");
      const invalid = $$("[required]", form).filter((input) => !input.checkValidity());
      $$(".field, .check", form).forEach((field) => field.classList.remove("is-invalid"));
      invalid.forEach((input) => input.closest(".field, .check").classList.add("is-invalid"));
      if (invalid.length) return "Заполните обязательные поля";
    }
    return "";
  }

  function goTo(step) {
    state.step = step;
    panels.forEach((panel) => panel.classList.toggle("is-active", Number(panel.dataset.step) === step));
    steps.forEach((item, index) => {
      item.classList.toggle("is-active", index + 1 === step);
      item.classList.toggle("is-done", index + 1 < step);
    });
    $("#wizardProgress").style.width = `${Math.min(step, 4) * 25}%`;
    $("#wizardNav").hidden = step === 5;
    back.disabled = step === 1;
    next.textContent = step === 4 ? "Подтвердить запись" : "Далее";
    error.textContent = "";

    if (step === 1) renderSpecialties();
    if (step === 2) renderDoctorOptions();
    if (step === 3) {
      renderCalendar();
      renderTimes();
    }
    if (step === 4) renderRecap();
  }

  function complete() {
    const doctor = doctorById(state.doctor);
    const form = $("#patientForm");
    const record = {
      doctor: doctor.name,
      date: state.date.toISOString(),
      time: formatTime(state.time),
      patient: form.elements.name.value.trim()
    };
    const saved = JSON.parse(localStorage.getItem("vitalis-bookings") || "[]");
    localStorage.setItem("vitalis-bookings", JSON.stringify([...saved, record]));
    document.dispatchEvent(
      new CustomEvent("appointment:created", {
        detail: { ...record, spec: specById[doctor.spec].name, price: doctor.price, doctorId: doctor.id, at: Date.now() }
      })
    );

    $("#doneText").textContent = `${record.patient}, ждём вас ${state.date.toLocaleDateString("ru-RU", { day: "numeric", month: "long" })} в ${record.time}. Врач: ${doctor.name}, ${specById[doctor.spec].name.toLowerCase()}. Мы пришлём напоминание за сутки.`;
    goTo(5);
  }

  function scrollToWizard() {
    $("#booking").scrollIntoView({ behavior: "smooth" });
  }

  function reset() {
    Object.assign(state, { spec: null, doctor: null, date: null, time: null, month: new Date(today.getFullYear(), today.getMonth(), 1) });
    $("#patientForm").reset();
  }

  function init() {
    $("#specialtyOptions").addEventListener("click", (event) => {
      const option = event.target.closest("[data-pick-spec]");
      if (!option) return;
      if (state.spec !== option.dataset.pickSpec) Object.assign(state, { doctor: null, date: null, time: null });
      state.spec = option.dataset.pickSpec;
      renderSpecialties();
      setTimeout(() => goTo(2), 250);
    });

    $("#doctorOptions").addEventListener("click", (event) => {
      const option = event.target.closest("[data-pick-doctor]");
      if (!option) return;
      const id = Number(option.dataset.pickDoctor);
      if (state.doctor !== id) Object.assign(state, { date: null, time: null });
      state.doctor = id;
      renderDoctorOptions();
      setTimeout(() => goTo(3), 250);
    });

    $("#calendarDays").addEventListener("click", (event) => {
      const day = event.target.closest("[data-day]");
      if (!day || day.disabled) return;
      state.date = new Date(state.month.getFullYear(), state.month.getMonth(), Number(day.dataset.day));
      state.time = null;
      renderCalendar();
      renderTimes();
    });

    $("#timesGrid").addEventListener("click", (event) => {
      const time = event.target.closest("[data-time]");
      if (!time) return;
      state.time = Number(time.dataset.time);
      renderTimes();
      error.textContent = "";
    });

    $("#prevMonth").addEventListener("click", () => {
      state.month = new Date(state.month.getFullYear(), state.month.getMonth() - 1, 1);
      renderCalendar();
    });

    $("#nextMonth").addEventListener("click", () => {
      state.month = new Date(state.month.getFullYear(), state.month.getMonth() + 1, 1);
      renderCalendar();
    });

    next.addEventListener("click", () => {
      const problem = validate();
      error.textContent = problem;
      if (problem) return;
      if (state.step === 4) complete();
      else goTo(state.step + 1);
    });

    back.addEventListener("click", () => goTo(Math.max(state.step - 1, 1)));

    $("#wizardRestart").addEventListener("click", () => {
      reset();
      goTo(1);
    });

    goTo(1);
  }

  return {
    init,
    startWithDoctor(id) {
      reset();
      const doctor = doctorById(id);
      Object.assign(state, { spec: doctor.spec, doctor: id });
      goTo(3);
      scrollToWizard();
    },
    startWithSpecialty(specId) {
      reset();
      state.spec = specId;
      goTo(2);
      scrollToWizard();
    }
  };
})();

function initSearch() {
  const input = $("#searchInput");
  const results = $("#searchResults");

  const priceItems = priceGroups.flatMap((group) => group.items.map(([name, value]) => ({ name, value, group: group.title })));

  const render = () => {
    const query = input.value.trim().toLowerCase();
    if (query.length < 2) {
      results.classList.remove("is-open");
      return;
    }

    const stem = query.length > 4 ? query.slice(0, -2) : query;
    const matches = (text) => text.toLowerCase().includes(stem);

    const specHits = specialties.filter((spec) => matches(`${spec.name} ${spec.desc}`));
    const doctorHits = doctors.filter((doctor) => matches(`${doctor.name} ${specById[doctor.spec].name}`) || specHits.some((spec) => spec.id === doctor.spec));
    const priceHits = priceItems.filter((item) => matches(`${item.name} ${item.group}`));

    const groups = [
      ["Направления", specHits.slice(0, 3).map((spec) => `<button class="search__item" data-hit-spec="${spec.id}">${spec.name}<small>от ${rub(spec.from)}</small></button>`)],
      ["Врачи", doctorHits.slice(0, 4).map((doctor) => `<button class="search__item" data-hit-doctor="${doctor.id}">${doctor.name}<small>${specById[doctor.spec].name}</small></button>`)],
      ["Услуги", priceHits.slice(0, 4).map((item) => `<button class="search__item" data-hit-price>${item.name}<small>${rub(item.value)}</small></button>`)]
    ].filter(([, items]) => items.length);

    results.innerHTML = groups.length
      ? groups.map(([title, items]) => `<p class="search__group">${title}</p>${items.join("")}`).join("")
      : `<p class="search__empty">Ничего не нашли. Позвоните нам — подскажем, к какому врачу обратиться.</p>`;
    results.classList.add("is-open");
  };

  input.addEventListener("input", render);
  input.addEventListener("focus", render);

  document.addEventListener("click", (event) => {
    if (!event.target.closest("#search")) results.classList.remove("is-open");
  });

  results.addEventListener("click", (event) => {
    const spec = event.target.closest("[data-hit-spec]");
    const doctor = event.target.closest("[data-hit-doctor]");
    const priceHit = event.target.closest("[data-hit-price]");
    results.classList.remove("is-open");

    if (spec) wizard.startWithSpecialty(spec.dataset.hitSpec);
    if (doctor) wizard.startWithDoctor(Number(doctor.dataset.hitDoctor));
    if (priceHit) $("#prices").scrollIntoView({ behavior: "smooth" });
  });

  $$("[data-query]").forEach((tag) =>
    tag.addEventListener("click", (event) => {
      event.stopPropagation();
      input.value = tag.dataset.query;
      input.focus();
      render();
    })
  );
}

function renderPrices() {
  $("#priceList").innerHTML = priceGroups
    .map(
      (group, index) => `
      <div class="price-group reveal ${index === 0 ? "is-open" : ""}">
        <button class="price-group__head">${group.title}<i>+</i></button>
        <div class="price-group__body">
          <ul>${group.items.map(([name, value]) => `<li><span>${name}</span><b>${rub(value)}</b></li>`).join("")}</ul>
        </div>
      </div>`
    )
    .join("");

  $("#priceList").addEventListener("click", (event) => {
    const head = event.target.closest(".price-group__head");
    if (head) head.parentElement.classList.toggle("is-open");
  });
}

function initReviews() {
  const track = $("#reviewsTrack");
  const slides = $$(".review", track);
  const dots = $("#reviewsDots");
  let index = 0;
  let timer;

  const perView = () => (innerWidth <= 900 ? 1 : 2);
  const pages = () => slides.length - perView() + 1;

  const go = (target) => {
    index = (target + pages()) % pages();
    track.style.transform = `translateX(-${(index * 100) / perView()}%)`;
    $$("button", dots).forEach((dot, i) => dot.classList.toggle("is-active", i === index));
  };

  const buildDots = () => {
    dots.innerHTML = Array.from({ length: pages() }, (_, i) => `<button aria-label="Отзыв ${i + 1}"></button>`).join("");
    go(Math.min(index, pages() - 1));
  };

  const autoplay = () => {
    clearInterval(timer);
    timer = setInterval(() => go(index + 1), 5000);
  };

  dots.addEventListener("click", (event) => {
    const dot = event.target.closest("button");
    if (!dot) return;
    go($$("button", dots).indexOf(dot));
    autoplay();
  });

  addEventListener("resize", buildDots);
  buildDots();
  autoplay();
}

function initEcg() {
  const path = $("#ecgPath");
  path.style.setProperty("--length", path.getTotalLength());
  const bpm = $("#bpm");
  setInterval(() => {
    bpm.textContent = 68 + Math.round(Math.random() * 8);
  }, 3000);
}

function initCounters() {
  const observer = new IntersectionObserver((entries) =>
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      const target = Number(element.dataset.count);
      const suffix = element.dataset.suffix || "";
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / 1500, 1);
        element.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3))) + suffix;
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

  addEventListener("scroll", () => header.classList.toggle("is-scrolled", scrollY > 20), { passive: true });

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

renderServices();
renderPrices();
initDoctors();
wizard.init();
initSearch();
initReviews();
initEcg();
initCounters();
initHeader();
initReveal();
