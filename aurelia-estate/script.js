const unsplash = (id, width = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;

const properties = [
  {
    id: 1,
    title: "Резиденция «Лиственница»",
    type: "house",
    district: "Николина Гора",
    price: 285000000,
    area: 640,
    rooms: 5,
    baths: 4,
    tag: "Эксклюзив",
    images: ["1600596542815-ffad4c1539a9", "1600607687939-ce8a6c25118c", "1600566753190-17f0baa2a6c3"],
    description: "Дом из клеёного бруса и стекла на участке 42 сотки в сосновом бору. Панорамное остекление гостиной, бассейн с подогревом и гостевой флигель."
  },
  {
    id: 2,
    title: "Квартира на Остоженке",
    type: "apartment",
    district: "Остоженка",
    price: 96000000,
    area: 148,
    rooms: 3,
    baths: 2,
    tag: "Новое",
    images: ["1502672260266-1c1ef2d93688", "1522708323590-d24dbb6b0267", "1600210492486-724fe5c67fb0"],
    description: "Светлая квартира в клубном доме 1912 года после реставрации. Потолки 3,6 метра, сохранённая лепнина и окна на тихий переулок."
  },
  {
    id: 3,
    title: "Пентхаус «Северное сияние»",
    type: "penthouse",
    district: "Хамовники",
    price: 340000000,
    area: 412,
    rooms: 4,
    baths: 4,
    tag: "Вид на реку",
    images: ["1600585154340-be6161a56a0c", "1600607687939-ce8a6c25118c", "1502672260266-1c1ef2d93688"],
    description: "Двухуровневый пентхаус с террасой 120 м² и видом на Новодевичий монастырь. Собственный лифт и камин на дровах."
  },
  {
    id: 4,
    title: "Вилла «Белый камень»",
    type: "house",
    district: "Барвиха",
    price: 215000000,
    area: 520,
    rooms: 5,
    baths: 5,
    tag: "Сад",
    images: ["1613490493576-7fde63acd811", "1600566753190-17f0baa2a6c3", "1600210492486-724fe5c67fb0"],
    description: "Средиземноморская вилла с садом, спроектированным ландшафтным бюро из Флоренции. Спа-зона, винный погреб и мастерская."
  },
  {
    id: 5,
    title: "Лофт у Патриарших",
    type: "apartment",
    district: "Патриаршие",
    price: 72000000,
    area: 104,
    rooms: 2,
    baths: 1,
    tag: "Дизайн",
    images: ["1522708323590-d24dbb6b0267", "1502672260266-1c1ef2d93688", "1600607687939-ce8a6c25118c"],
    description: "Бывшая типография, превращённая в лофт с кирпичными стенами, антресолью и дизайнерским интерьером под ключ."
  },
  {
    id: 6,
    title: "Дом «Тихая гавань»",
    type: "house",
    district: "Николина Гора",
    price: 148000000,
    area: 380,
    rooms: 4,
    baths: 3,
    tag: "У воды",
    images: ["1512917774080-9991f1c4c750", "1600210492486-724fe5c67fb0", "1600566753190-17f0baa2a6c3"],
    description: "Дом с собственным выходом к воде и причалом. Минималистичная архитектура, тёплые полы и мастерская в отдельном павильоне."
  },
  {
    id: 7,
    title: "Пентхаус «Атриум»",
    type: "penthouse",
    district: "Остоженка",
    price: 198000000,
    area: 260,
    rooms: 3,
    baths: 3,
    tag: "Терраса",
    images: ["1600210492486-724fe5c67fb0", "1600585154340-be6161a56a0c", "1522708323590-d24dbb6b0267"],
    description: "Пентхаус со световым атриумом над гостиной и зелёной террасой. Вид на храм Христа Спасителя из спальни."
  },
  {
    id: 8,
    title: "Квартира «Галерея»",
    type: "apartment",
    district: "Хамовники",
    price: 124000000,
    area: 186,
    rooms: 4,
    baths: 2,
    tag: "Семейная",
    images: ["1600566753190-17f0baa2a6c3", "1502672260266-1c1ef2d93688", "1600607687939-ce8a6c25118c"],
    description: "Семейная квартира с анфиладой комнат, библиотекой и окнами на две стороны. Закрытый двор с детской площадкой."
  },
  {
    id: 9,
    title: "Резиденция «Графит»",
    type: "house",
    district: "Барвиха",
    price: 390000000,
    area: 870,
    rooms: 6,
    baths: 6,
    tag: "Закрытая продажа",
    images: ["1580587771525-78b9dba3b914", "1600607687939-ce8a6c25118c", "1600210492486-724fe5c67fb0"],
    description: "Архитектурный дом из графитового бетона на участке 80 соток. Крытый бассейн, кинозал, гараж на шесть машин."
  }
];

const typeLabels = {
  house: "Дом",
  apartment: "Квартира",
  penthouse: "Пентхаус"
};

const state = {
  type: "all",
  budget: Infinity,
  rooms: 0,
  sort: "featured",
  favorites: new Set(loadFavorites())
};

function loadFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem("aurelia-favorites"));
    return Array.isArray(saved) ? saved.filter((id) => properties.some((item) => item.id === id)) : [];
  } catch {
    return [];
  }
}

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

const formatRub = (value) =>
  new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(Math.round(value)) + " ₽";

const formatMillions = (value) =>
  `${(value / 1_000_000).toLocaleString("ru-RU", { maximumFractionDigits: 1 })} млн ₽`;

const pluralize = (count, forms) => {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
  return forms[2];
};

const heartIcon = `<svg viewBox="0 0 24 24"><path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2Z"/></svg>`;

function getVisibleProperties() {
  const filtered = properties.filter(
    (item) =>
      (state.type === "all" || item.type === state.type) &&
      item.price <= state.budget &&
      item.rooms >= state.rooms
  );

  const sorters = {
    featured: () => 0,
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    "area-desc": (a, b) => b.area - a.area
  };

  return filtered.sort(sorters[state.sort]);
}

function renderCard(item) {
  const isFavorite = state.favorites.has(item.id);
  return `
    <article class="card" data-id="${item.id}">
      <div class="card__media">
        <img src="${unsplash(item.images[0], 900)}" alt="${item.title}" loading="lazy">
        <span class="card__tag">${item.tag}</span>
        <button class="card__fav ${isFavorite ? "is-active" : ""}" data-fav="${item.id}" aria-label="В избранное">${heartIcon}</button>
        <span class="card__view">Смотреть</span>
      </div>
      <p class="card__district">${typeLabels[item.type]} · ${item.district}</p>
      <h3 class="card__title">${item.title}</h3>
      <div class="card__meta">
        <span class="card__price">${formatMillions(item.price)}</span>
        <span class="card__specs">${item.area} м² · ${item.rooms} сп.</span>
      </div>
    </article>`;
}

function renderListings() {
  const items = getVisibleProperties();
  $("#listingsGrid").innerHTML = items.map(renderCard).join("");
  $("#emptyState").hidden = items.length > 0;
  $("#listingsSummary").textContent = `${items.length} ${pluralize(items.length, ["объект", "объекта", "объектов"])} в подборке`;
  bindCursorTargets();
}

function setType(type) {
  state.type = type;
  $$("#typeChips .chip").forEach((chip) => chip.classList.toggle("is-active", chip.dataset.type === type));
  $("#searchForm").elements.type.value = type;
}

function updateFavorites() {
  localStorage.setItem("aurelia-favorites", JSON.stringify([...state.favorites]));
  const counter = $("#favCounter");
  $("#favCount").textContent = state.favorites.size;
  counter.classList.remove("is-bump");
  void counter.offsetWidth;
  counter.classList.add("is-bump");
}

function initListings() {
  $("#typeChips").addEventListener("click", (event) => {
    const chip = event.target.closest(".chip");
    if (!chip) return;
    setType(chip.dataset.type);
    renderListings();
  });

  $("#sortSelect").addEventListener("change", (event) => {
    state.sort = event.target.value;
    renderListings();
  });

  $("#searchForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.target.elements;
    setType(form.type.value);
    state.budget = Number(form.budget.value);
    state.rooms = Number(form.rooms.value);
    renderListings();
    $("#listings").scrollIntoView({ behavior: "smooth" });
  });

  $("#resetFilters").addEventListener("click", () => {
    $("#searchForm").reset();
    Object.assign(state, { budget: Infinity, rooms: 0 });
    setType("all");
    renderListings();
  });

  $("#listingsGrid").addEventListener("click", (event) => {
    const favButton = event.target.closest("[data-fav]");
    if (favButton) {
      const id = Number(favButton.dataset.fav);
      state.favorites.has(id) ? state.favorites.delete(id) : state.favorites.add(id);
      favButton.classList.toggle("is-active");
      updateFavorites();
      return;
    }
    const card = event.target.closest(".card");
    if (card) openModal(Number(card.dataset.id));
  });

  $("#favCounter").addEventListener("click", () => {
    if (!state.favorites.size) return;
    $("#listingsGrid").innerHTML = properties
      .filter((item) => state.favorites.has(item.id))
      .map(renderCard)
      .join("");
    $("#listingsSummary").textContent = "Ваше избранное";
    $("#emptyState").hidden = true;
    $("#listings").scrollIntoView({ behavior: "smooth" });
  });

  $("#favCount").textContent = state.favorites.size;
  renderListings();
}

function openModal(id) {
  const item = properties.find((property) => property.id === id);
  if (!item) return;

  $("#modalDistrict").textContent = `${typeLabels[item.type]} · ${item.district}`;
  $("#modalTitle").textContent = item.title;
  $("#modalPrice").textContent = formatRub(item.price);
  $("#modalDesc").textContent = item.description;
  $("#modalSpecs").innerHTML = [
    ["Площадь", `${item.area} м²`],
    ["Спальни", item.rooms],
    ["Санузлы", item.baths],
    ["Цена за м²", formatRub(item.price / item.area)]
  ]
    .map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`)
    .join("");

  const showImage = (index) => {
    const image = $("#modalImage");
    image.src = unsplash(item.images[index], 1400);
    image.alt = item.title;
    image.style.animation = "none";
    void image.offsetWidth;
    image.style.animation = "";
    $$("#modalThumbs button").forEach((thumb, i) => thumb.classList.toggle("is-active", i === index));
  };

  $("#modalThumbs").innerHTML = item.images
    .map((imageId, index) => `<button data-index="${index}" aria-label="Фото ${index + 1}"><img src="${unsplash(imageId, 400)}" alt=""></button>`)
    .join("");
  $("#modalThumbs").onclick = (event) => {
    const thumb = event.target.closest("button");
    if (thumb) showImage(Number(thumb.dataset.index));
  };
  showImage(0);

  $("#modalRequest").onclick = () => {
    closeModal();
    $("#interestField").value = item.title;
    $("#contact").scrollIntoView({ behavior: "smooth" });
  };

  $("#modal").classList.add("is-open");
  $("#modal").setAttribute("aria-hidden", "false");
  document.body.classList.add("is-locked");
}

function closeModal() {
  $("#modal").classList.remove("is-open");
  $("#modal").setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-locked");
}

function initModal() {
  $$("[data-close]").forEach((element) => element.addEventListener("click", closeModal));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();
  });
}

function initMortgage() {
  const inputs = {
    price: $("#priceInput"),
    down: $("#downInput"),
    term: $("#termInput"),
    rate: $("#rateInput")
  };

  const paintTrack = (input) => {
    const percent = ((input.value - input.min) / (input.max - input.min)) * 100;
    input.style.setProperty("--fill", `${percent}%`);
  };

  const calculate = () => {
    const price = Number(inputs.price.value);
    const downPercent = Number(inputs.down.value);
    const years = Number(inputs.term.value);
    const rate = Number(inputs.rate.value);

    const principal = price * (1 - downPercent / 100);
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    const payment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
    const interest = payment * months - principal;

    $("#priceOut").textContent = formatMillions(price);
    $("#downOut").textContent = `${downPercent}% · ${formatMillions(price - principal)}`;
    $("#termOut").textContent = `${years} ${pluralize(years, ["год", "года", "лет"])}`;
    $("#rateOut").textContent = `${rate.toLocaleString("ru-RU")}%`;
    $("#paymentOut").textContent = formatRub(payment);
    $("#principalOut").textContent = formatMillions(principal);
    $("#interestOut").textContent = formatMillions(interest);
    $("#principalBar").style.width = `${(principal / (principal + interest)) * 100}%`;

    Object.values(inputs).forEach(paintTrack);
  };

  Object.values(inputs).forEach((input) => input.addEventListener("input", calculate));
  calculate();
}

function initContactForm() {
  const form = $("#contactForm");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let isValid = true;

    $$("input[required]", form).forEach((input) => {
      const field = input.closest(".form__field");
      const valid = input.checkValidity();
      field.classList.toggle("is-invalid", !valid);
      if (!valid) isValid = false;
    });

    if (!isValid) return;

    document.dispatchEvent(
      new CustomEvent("lead:sent", {
        detail: {
          interest: form.elements.interest.value.trim(),
          message: form.elements.message.value.trim(),
          phone: form.elements.phone.value.trim()
        }
      })
    );
    $("#formSuccess").hidden = false;
    setTimeout(() => {
      form.reset();
      $("#formSuccess").hidden = true;
    }, 5000);
  });

  form.addEventListener("input", (event) => {
    event.target.closest(".form__field")?.classList.remove("is-invalid");
  });
}

function initDistricts() {
  const section = $("#districts");
  const track = $("#districtsTrack");
  const progress = $("#districtsProgress");
  const mobileQuery = matchMedia("(max-width: 860px)");

  const setHeight = () => {
    if (mobileQuery.matches) {
      section.style.height = "";
      return;
    }
    const distance = track.scrollWidth - innerWidth;
    section.style.height = `${distance + innerHeight}px`;
  };

  const update = () => {
    if (mobileQuery.matches) return;
    const distance = track.scrollWidth - innerWidth;
    const scrolled = Math.min(Math.max(-section.getBoundingClientRect().top, 0), distance);
    const ratio = distance > 0 ? scrolled / distance : 0;
    track.style.transform = `translate3d(${-scrolled}px, 0, 0)`;
    progress.style.transform = `scaleX(${ratio})`;
  };

  setHeight();
  addEventListener("resize", () => {
    setHeight();
    update();
  });
  addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
  addEventListener("load", setHeight);
}

function initHeader() {
  const header = $("#header");
  const nav = $("#nav");
  const burger = $("#burger");

  addEventListener(
    "scroll",
    () => header.classList.toggle("is-scrolled", scrollY > 40),
    { passive: true }
  );

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
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );
  $$(".reveal").forEach((element) => observer.observe(element));
}

function initCounters() {
  const animate = (element) => {
    const target = Number(element.dataset.count);
    const start = performance.now();
    const duration = 1800;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      element.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animate(entry.target);
      observer.unobserve(entry.target);
    });
  });
  $$("[data-count]").forEach((element) => observer.observe(element));
}

function initHeroParallax() {
  const image = $("#heroImage img");
  addEventListener(
    "scroll",
    () => {
      if (scrollY > innerHeight) return;
      image.style.translate = `0 ${scrollY * 0.12}px`;
    },
    { passive: true }
  );
}

const cursor = $("#cursor");

function bindCursorTargets() {
  $$("a, button, .card, select, input[type=range]").forEach((element) => {
    if (element.dataset.cursorBound) return;
    element.dataset.cursorBound = "true";
    element.addEventListener("mouseenter", () => cursor.classList.add("is-hover"));
    element.addEventListener("mouseleave", () => cursor.classList.remove("is-hover"));
  });
}

function initCursor() {
  if (!matchMedia("(pointer: fine)").matches) return;
  let x = innerWidth / 2;
  let y = innerHeight / 2;
  let currentX = x;
  let currentY = y;

  addEventListener("mousemove", (event) => {
    x = event.clientX;
    y = event.clientY;
  });

  const loop = () => {
    currentX += (x - currentX) * 0.2;
    currentY += (y - currentY) * 0.2;
    cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  };
  loop();
  bindCursorTargets();
}

function initLoader() {
  const loader = $("#loader");
  loader.addEventListener("transitionend", () => loader.remove(), { once: true });
  let isDone = false;
  const finish = () => {
    if (isDone) return;
    isDone = true;
    loader.classList.add("is-done");
    document.body.classList.add("is-ready");
    setTimeout(() => loader.remove(), 1400);
  };
  addEventListener("load", () => setTimeout(finish, 700));
  setTimeout(finish, 2600);
}

initLoader();
initHeader();
initListings();
initModal();
initDistricts();
initMortgage();
initContactForm();
initReveal();
initCounters();
initHeroParallax();
initCursor();
