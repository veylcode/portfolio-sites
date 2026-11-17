const account = (() => {
  const authModal = $("#authModal");
  const cabinet = $("#cabinet");

  const greetingByTime = () => {
    const hour = new Date().getHours();
    if (hour < 5) return "Доброй ночи";
    if (hour < 12) return "Доброе утро";
    if (hour < 18) return "Добрый день";
    return "Добрый вечер";
  };

  function notify(text) {
    const toast = $("#noteToast");
    toast.textContent = text;
    toast.classList.add("is-visible");
    clearTimeout(notify.timer);
    notify.timer = setTimeout(() => toast.classList.remove("is-visible"), 3000);
  }

  function openAuth(view = "login") {
    Auth.switchView($("[data-auth-root]", authModal), view);
    authModal.classList.add("is-open");
    authModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
  }

  function closeAuth() {
    authModal.classList.remove("is-open");
    authModal.setAttribute("aria-hidden", "true");
    if (!cabinet.classList.contains("is-open")) document.body.classList.remove("is-locked");
  }

  function openCabinet(tab) {
    renderCabinet();
    if (tab) selectTab(tab);
    cabinet.classList.add("is-open");
    cabinet.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
    cabinet.scrollTop = 0;
  }

  function closeCabinet() {
    cabinet.classList.remove("is-open");
    cabinet.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
  }

  function selectTab(name) {
    $$("#cabinetTabs button").forEach((button) => button.classList.toggle("is-active", button.dataset.tab === name));
    $$(".cabinet__panel").forEach((panel) => panel.classList.toggle("is-active", panel.dataset.panel === name));
  }

  function renderFavorites() {
    const items = properties.filter((item) => state.favorites.has(item.id));
    $("#cabFavCount").textContent = items.length;
    $("#cabFavorites").innerHTML = items.length
      ? items.map(renderCard).join("")
      : `<p class="cab-empty">Вы пока ничего не сохранили.<br><button class="link-btn" data-goto-listings>Перейти к коллекции</button></p>`;
  }

  function renderRequests() {
    const requests = Auth.getData("requests", []);
    $("#cabReqCount").textContent = requests.length;
    $("#cabRequests").innerHTML = requests.length
      ? requests
          .map((request) => {
            const isOld = Date.now() - request.at > 1000 * 60 * 60 * 24;
            return `
            <li class="cab-request">
              <time>${new Date(request.at).toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}</time>
              <div>
                <h4>${request.interest || "Индивидуальная подборка"}</h4>
                <p>${request.message || "Без комментария"}</p>
              </div>
              <span class="cab-request__status">${isOld ? "Просмотр назначен" : "На рассмотрении"}</span>
            </li>`;
          })
          .join("")
      : `<li class="cab-empty">Заявок пока нет. Оставьте запрос в разделе «Контакты» — он появится здесь.</li>`;
  }

  function renderCabinet() {
    $("#cabinetGreeting").textContent = greetingByTime();
    renderFavorites();
    renderRequests();
  }

  function syncFavorites() {
    if (!Auth.isLoggedIn()) return;
    const saved = Auth.getData("favorites", []);
    saved.forEach((id) => state.favorites.add(id));
    Auth.setData("favorites", [...state.favorites]);
    $("#favCount").textContent = state.favorites.size;
    renderListings();
  }

  function prefillContact() {
    const user = Auth.current();
    const form = $("#contactForm");
    if (!user) return;
    if (!form.elements.name.value) form.elements.name.value = user.name;
    if (!form.elements.phone.value && user.phone) form.elements.phone.value = user.phone;
  }

  function wrapFavoritesUpdate() {
    const original = updateFavorites;
    updateFavorites = function () {
      original();
      if (Auth.isLoggedIn()) Auth.setData("favorites", [...state.favorites]);
      if (cabinet.classList.contains("is-open")) renderFavorites();
    };
  }

  function init() {
    Auth.init({
      namespace: "aurelia",
      demo: { name: "Анна Демидова", email: "demo@aurelia.estate", password: "Demo2026" }
    });

    wrapFavoritesUpdate();

    $("#accountBtn").addEventListener("click", () => (Auth.isLoggedIn() ? openCabinet() : openAuth("login")));
    $$("[data-close-auth]").forEach((element) => element.addEventListener("click", closeAuth));
    $$("[data-close-cabinet]").forEach((element) => element.addEventListener("click", closeCabinet));

    $("#cabinetTabs").addEventListener("click", (event) => {
      const button = event.target.closest("[data-tab]");
      if (button) selectTab(button.dataset.tab);
    });

    $("#cabFavorites").addEventListener("click", (event) => {
      if (event.target.closest("[data-goto-listings]")) {
        closeCabinet();
        $("#listings").scrollIntoView({ behavior: "smooth" });
        return;
      }
      const favButton = event.target.closest("[data-fav]");
      if (favButton) {
        state.favorites.delete(Number(favButton.dataset.fav));
        updateFavorites();
        renderListings();
        return;
      }
      const card = event.target.closest(".card");
      if (!card) return;
      closeCabinet();
      setTimeout(() => openModal(Number(card.dataset.id)), 400);
    });

    document.addEventListener("auth:success", ({ detail }) => {
      if (detail.type === "login" || detail.type === "register" || detail.type === "demo") {
        closeAuth();
        notify(detail.type === "register" ? `Добро пожаловать, ${detail.user.name.split(" ")[0]}` : `С возвращением, ${detail.user.name.split(" ")[0]}`);
        setTimeout(() => openCabinet(), 500);
      }
      if (detail.type === "logout") {
        closeCabinet();
        notify("Вы вышли из аккаунта");
      }
      if (detail.type === "profile" || detail.type === "password") renderCabinet();
    });

    document.addEventListener("auth:change", () => {
      syncFavorites();
      prefillContact();
    });

    document.addEventListener("lead:sent", ({ detail }) => {
      if (Auth.isLoggedIn()) {
        Auth.pushData("requests", { ...detail, at: Date.now() });
        notify("Заявка сохранена в личном кабинете");
      } else {
        notify("Войдите, чтобы отслеживать заявки в кабинете");
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      if (authModal.classList.contains("is-open")) closeAuth();
      else if (cabinet.classList.contains("is-open") && !$("#modal").classList.contains("is-open")) closeCabinet();
    });

    syncFavorites();
    prefillContact();
  }

  return { init, openAuth, openCabinet };
})();

account.init();
