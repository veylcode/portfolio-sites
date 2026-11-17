const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const { profile, projects } = window.PORTFOLIO;
const DEFAULT_ACCENT = "#ededf0";
const PREVIEW_WIDTH = 1440;

const devices = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 820, height: 1180 },
  mobile: { width: 390, height: 844 }
};

const plural = (count, forms) => {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
  return forms[2];
};

const escapeHtml = (text) =>
  String(text).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

const setAccent = (color) => document.documentElement.style.setProperty("--accent", color);

function showToast(text) {
  const toast = $("#toast");
  toast.textContent = text;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const field = document.createElement("textarea");
    field.value = text;
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.append(field);
    field.select();
    const isCopied = document.execCommand("copy");
    field.remove();
    return isCopied;
  }
}

async function share(title, url) {
  if (navigator.share && /^https?:/.test(location.protocol)) {
    try {
      await navigator.share({ title, url });
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }
  showToast((await copyText(url)) ? "Ссылка скопирована" : url);
}

const workUrl = (project) => `${location.href.split("#")[0]}#work/${project.id}`;

function renderProfile() {
  document.title = `${profile.name} — ${profile.role}`;
  $("#logoName").textContent = profile.name;
  $("#heroRole").textContent = `${profile.role} · открыт к новым проектам`;
  $("#footerName").textContent = `© ${new Date().getFullYear()} ${profile.name}`;
  $("#footerCount").textContent = `${projects.length} ${plural(projects.length, ["работа", "работы", "работ"])} в портфолио`;
  $("#aboutText").textContent = profile.about;
  $("#skills").innerHTML = profile.skills.map((skill) => `<li>${escapeHtml(skill)}</li>`).join("");

  const words = profile.headline.split(" ");
  $("#heroTitle").innerHTML = words
    .map((word, index) => {
      const isAccent = index >= words.length - 2;
      return `<span class="word ${isAccent ? "word--accent" : ""}"><span style="--i:${index}">${escapeHtml(word)}</span></span>`;
    })
    .join(" ");

  const categories = new Set(projects.map((project) => project.category));
  const stats = [
    [projects.length, plural(projects.length, ["готовая работа", "готовые работы", "готовых работ"])],
    [categories.size, plural(categories.size, ["сфера", "сферы", "сфер"])],
    [3, "типа экранов в каждой"]
  ];
  $("#heroStats").innerHTML = stats.map(([value, label]) => `<div><dt data-count="${value}">0</dt><dd>${label}</dd></div>`).join("");

  const tickerItems = [...categories].flatMap((category) => [category, "✦"]);
  $("#ticker").innerHTML = [...tickerItems, ...tickerItems].map((item) => `<span>${escapeHtml(item)}</span>`).join("");

  $("#contacts").innerHTML = profile.contacts
    .map((contact, index) => {
      const tag = contact.href ? "a" : "button";
      const attributes = contact.href
        ? `href="${escapeHtml(contact.href)}" target="_blank" rel="noopener"`
        : `type="button" data-copy="${escapeHtml(contact.copy)}" aria-label="Скопировать номер ${escapeHtml(contact.label)} ${escapeHtml(contact.value)}"`;
      return `
      <li class="reveal" style="transition-delay:${index * 80}ms">
        <${tag} class="contact__item" ${attributes}>
          <small>${escapeHtml(contact.label)}</small>
          <b>${escapeHtml(contact.value)}</b>
          ${contact.copy ? '<span class="contact__hint">Скопировать номер</span>' : ""}
        </${tag}>
      </li>`;
    })
    .join("");

  $("#contacts").addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-copy]");
    if (!button) return;
    showToast((await copyText(button.dataset.copy)) ? "Номер MAX скопирован" : button.dataset.copy);
  });
}

let activeCategory = "Все";

function visibleProjects() {
  return activeCategory === "Все" ? projects : projects.filter((project) => project.category === activeCategory);
}

function renderFilters() {
  const counts = projects.reduce((acc, project) => ({ ...acc, [project.category]: (acc[project.category] || 0) + 1 }), {});
  const items = [["Все", projects.length], ...Object.entries(counts)];
  $("#filters").innerHTML = items
    .map(([name, count]) => `<button class="filter ${name === activeCategory ? "is-active" : ""}" data-category="${escapeHtml(name)}">${escapeHtml(name)}<sup>${count}</sup></button>`)
    .join("");
}

function renderGrid() {
  $("#grid").innerHTML = visibleProjects()
    .map((project, index) => {
      const number = projects.indexOf(project) + 1;
      const cover = project.cover ? `<img src="${project.cover}" alt="" loading="lazy">` : "";
      return `
        <article class="card" style="--i:${index}; --tone:${project.tone}; --tone2:${project.tone2}" data-id="${project.id}" tabindex="0" role="button" aria-label="Открыть ${escapeHtml(project.title)}">
          <div class="card__media">
            <div class="card__cover">
              ${cover}
              <span class="card__index">${number} / ${projects.length}</span>
              <span class="card__name">${escapeHtml(project.title)}</span>
            </div>
            <div class="card__live"></div>
            <span class="card__badge"><i></i>Живой сайт</span>
            <span class="card__view">Смотреть</span>
          </div>
          <div class="card__info">
            <div>
              <h3 class="card__title">${escapeHtml(project.title)}</h3>
              <p class="card__desc">${escapeHtml(project.description)}</p>
              <div class="card__tags">${project.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
            </div>
            <div class="card__meta">
              <span>${escapeHtml(project.category)}</span>
              <span>${project.year}</span>
            </div>
          </div>
        </article>`;
    })
    .join("");
}

function initWorks() {
  const grid = $("#grid");
  const canPreview = matchMedia("(hover: hover) and (pointer: fine)").matches;

  $("#filters").addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button || button.dataset.category === activeCategory) return;
    activeCategory = button.dataset.category;
    renderFilters();
    renderGrid();
  });

  grid.addEventListener("click", (event) => {
    const card = event.target.closest(".card");
    if (card) viewer.open(card.dataset.id);
  });

  grid.addEventListener("keydown", (event) => {
    const card = event.target.closest(".card");
    if (card && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      viewer.open(card.dataset.id);
    }
  });

  grid.addEventListener("mouseover", (event) => {
    const card = event.target.closest(".card");
    if (!card || card.contains(event.relatedTarget)) return;
    const project = projects.find((item) => item.id === card.dataset.id);
    setAccent(project.tone);
    if (canPreview) startPreview(card, project);
  });

  grid.addEventListener("mouseout", (event) => {
    const card = event.target.closest(".card");
    if (!card || card.contains(event.relatedTarget)) return;
    stopPreview(card);
  });

  renderFilters();
  renderGrid();
}

function startPreview(card, project) {
  const live = $(".card__live", card);
  clearTimeout(card.stopTimer);
  card.startTimer = setTimeout(() => {
    if (live.firstChild) {
      live.classList.add("is-ready");
      return;
    }
    const frame = document.createElement("iframe");
    frame.src = project.url;
    frame.tabIndex = -1;
    frame.setAttribute("aria-hidden", "true");
    live.style.setProperty("--scale", live.offsetWidth / PREVIEW_WIDTH);
    frame.addEventListener("load", () => setTimeout(() => live.classList.add("is-ready"), 500));
    live.append(frame);
  }, 350);
}

function stopPreview(card) {
  const live = $(".card__live", card);
  clearTimeout(card.startTimer);
  live.classList.remove("is-ready");
  card.stopTimer = setTimeout(() => (live.innerHTML = ""), 700);
}

const viewer = (() => {
  const element = $("#viewer");
  const frame = $("#frame");
  const iframe = $("#viewerFrame");
  const loader = $("#frameLoader");
  const stage = $("#viewerStage");
  let index = 0;
  let device = "desktop";

  const current = () => projects[index];

  function fit() {
    const size = devices[device];
    const padding = innerWidth < 600 ? 28 : 48;
    const ring = device === "desktop" ? 0 : 26;
    const scale = Math.min((stage.clientWidth - padding - ring) / size.width, (stage.clientHeight - padding - ring) / size.height, 1);
    frame.style.width = `${size.width}px`;
    frame.style.height = `${size.height}px`;
    frame.style.transform = `translate(-50%, -50%) scale(${scale})`;
    frame.classList.toggle("is-mobile", device === "mobile");
    frame.classList.toggle("is-tablet", device === "tablet");
  }

  function load() {
    const project = current();
    loader.classList.remove("is-hidden");
    iframe.src = project.url;
    $("#viewerTitle").textContent = project.title;
    $("#viewerCategory").textContent = `${project.category} · ${index + 1} из ${projects.length}`;
    $("#viewerOpen").href = project.siteUrl || project.url;
    setAccent(project.tone);
    history.replaceState(null, "", `#work/${project.id}`);
  }

  function setDevice(name) {
    device = name;
    $$("#devices button").forEach((button) => button.classList.toggle("is-active", button.dataset.device === name));
    fit();
  }

  function open(id) {
    const found = projects.findIndex((project) => project.id === id);
    if (found < 0) return;
    index = found;
    setDevice(innerWidth < 600 ? "mobile" : innerWidth < 1000 ? "tablet" : "desktop");
    load();
    element.classList.add("is-open");
    element.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
  }

  function close() {
    if (!element.classList.contains("is-open")) return;
    element.classList.remove("is-open");
    element.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
    history.replaceState(null, "", location.pathname + location.search);
    setTimeout(() => {
      if (!element.classList.contains("is-open")) iframe.removeAttribute("src");
    }, 700);
  }

  function step(direction) {
    index = (index + direction + projects.length) % projects.length;
    load();
  }

  function init() {
    iframe.addEventListener("load", () => {
      if (iframe.getAttribute("src")) loader.classList.add("is-hidden");
    });
    $("#devices").addEventListener("click", (event) => {
      const button = event.target.closest("[data-device]");
      if (button) setDevice(button.dataset.device);
    });
    $("#viewerClose").addEventListener("click", close);
    $("#viewerPrev").addEventListener("click", () => step(-1));
    $("#viewerNext").addEventListener("click", () => step(1));
    $("#viewerShare").addEventListener("click", () => share(current().title, workUrl(current())));
    addEventListener("resize", () => element.classList.contains("is-open") && fit());

    document.addEventListener("keydown", (event) => {
      if (!element.classList.contains("is-open")) return;
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    });
  }

  return { init, open, close };
})();

function openFromHash() {
  const match = location.hash.match(/^#work\/([\w-]+)/);
  if (match) viewer.open(match[1]);
}

function initHeader() {
  const header = $("#header");
  addEventListener("scroll", () => header.classList.toggle("is-scrolled", scrollY > 30), { passive: true });
  $("#shareBtn").addEventListener("click", () => share(document.title, location.href.split("#")[0]));
  $("#logo").addEventListener("click", () => setAccent(DEFAULT_ACCENT));
}

function initSpotlight() {
  if (!matchMedia("(pointer: fine)").matches) return;
  const light = $("#spotlight");
  let targetX = innerWidth / 2;
  let targetY = innerHeight / 2;
  let x = targetX;
  let y = targetY;

  addEventListener("mousemove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
  });

  const loop = () => {
    x += (targetX - x) * 0.08;
    y += (targetY - y) * 0.08;
    light.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    requestAnimationFrame(loop);
  };
  loop();
}

function initCounters() {
  const observer = new IntersectionObserver((entries) =>
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      const target = Number(element.dataset.count);
      const start = performance.now() + 1100;
      const tick = (now) => {
        const progress = Math.min(Math.max((now - start) / 1200, 0), 1);
        element.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3)));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.unobserve(element);
    })
  );
  $$("[data-count]").forEach((element) => observer.observe(element));
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

renderProfile();
initWorks();
viewer.init();
initHeader();
initSpotlight();
initCounters();
initReveal();
openFromHash();
addEventListener("hashchange", openFromHash);
