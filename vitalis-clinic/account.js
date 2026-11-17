const account = (() => {
  const authModal = $("#authModal");
  const cabinetModal = $("#cabinetModal");

  function notify(text) {
    const toast = $("#vToast");
    toast.textContent = text;
    toast.classList.add("is-visible");
    clearTimeout(notify.timer);
    notify.timer = setTimeout(() => toast.classList.remove("is-visible"), 3000);
  }

  function openLayer(layer) {
    layer.classList.add("is-open");
    layer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLayer(layer) {
    layer.classList.remove("is-open");
    layer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function openAuth(view = "login") {
    Auth.switchView($("[data-auth-root]", authModal), view);
    openLayer(authModal);
  }

  function openCabinet(tab = "visits") {
    renderCabinet();
    const medcard = Auth.getData("medcard", {});
    $("#birthInput").value = medcard.birth || "";
    $("#allergyInput").value = medcard.allergy || "";
    selectTab(tab);
    openLayer(cabinetModal);
  }

  function selectTab(name) {
    $$("#cabinetTabs button").forEach((button) => button.classList.toggle("is-active", button.dataset.ctab === name));
    $$("[data-cpanel]", cabinetModal).forEach((panel) => (panel.hidden = panel.dataset.cpanel !== name));
  }

  function visitTime(visit) {
    const date = new Date(visit.date);
    const [hours, minutes] = visit.time.split(":").map(Number);
    date.setHours(hours, minutes);
    return date;
  }

  function renderCabinet() {
    const user = Auth.current();
    if (!user) return;
    const visits = Auth.getData("visits", []).sort((a, b) => visitTime(a) - visitTime(b));
    const now = new Date();
    const upcoming = visits.filter((visit) => visitTime(visit) >= now);
    const past = visits.filter((visit) => visitTime(visit) < now);

    $("#cardNumber").textContent = `VT-${user.id.slice(0, 6).toUpperCase()}`;
    $("#sumUpcoming").textContent = upcoming.length;
    $("#sumPast").textContent = past.length;
    $("#sumSpent").textContent = rub(past.reduce((sum, visit) => sum + (visit.price || 0), 0));

    const ordered = [...upcoming, ...past.reverse()];
    $("#visitsList").innerHTML = ordered.length
      ? ordered
          .map((visit, index) => {
            const date = visitTime(visit);
            const isPast = date < now;
            return `
            <li class="visit ${isPast ? "is-past" : ""}" style="animation-delay:${index * 50}ms">
              <div class="visit__date">
                <b>${date.getDate()}</b>
                <small>${date.toLocaleDateString("ru-RU", { month: "short" })}</small>
              </div>
              <div class="visit__info">
                <b>${visit.spec} · ${visit.time}</b>
                <span>${visit.doctor}</span>
              </div>
              <span class="visit__status">${isPast ? "Состоялся" : "Предстоит"}</span>
            </li>`;
          })
          .join("")
      : `<li class="visits__empty">Записей пока нет. <a href="#booking" data-close-link>Записаться к врачу →</a></li>`;

  }

  function prefillWizard() {
    const user = Auth.current();
    const form = $("#patientForm");
    if (!user) return;
    if (!form.elements.name.value) form.elements.name.value = user.name;
    if (!form.elements.phone.value && user.phone) form.elements.phone.value = user.phone;
    const medcard = Auth.getData("medcard", {});
    if (!form.elements.birth.value && medcard.birth) form.elements.birth.value = medcard.birth;
  }

  function seedDemoHistory() {
    if (Auth.getData("visits", []).length) return;
    const date = new Date();
    date.setDate(date.getDate() - 21);
    Auth.setData("visits", [
      { doctor: "Морозова Анна Сергеевна", spec: "Терапия", date: date.toISOString(), time: "10:30", price: 3400, at: Date.now() }
    ]);
    Auth.setData("medcard", { birth: "1990-04-12", allergy: "Не выявлено" });
  }

  function init() {
    Auth.init({
      namespace: "vitalis",
      demo: { name: "Соколова Мария Игоревна", email: "demo@vitalis.clinic", password: "Demo2026" }
    });

    $("#patientBtn").addEventListener("click", () => (Auth.isLoggedIn() ? openCabinet() : openAuth()));
    $$("[data-close-auth]").forEach((element) => element.addEventListener("click", () => closeLayer(authModal)));
    $$("[data-close-cabinet]").forEach((element) => element.addEventListener("click", () => closeLayer(cabinetModal)));

    $("#cabinetTabs").addEventListener("click", (event) => {
      const button = event.target.closest("[data-ctab]");
      if (button) selectTab(button.dataset.ctab);
    });

    $("#visitsList").addEventListener("click", (event) => {
      if (event.target.closest("[data-close-link]")) closeLayer(cabinetModal);
    });

    document.addEventListener("appointment:created", ({ detail }) => {
      if (Auth.isLoggedIn()) {
        Auth.pushData("visits", detail);
        notify("Приём добавлен в кабинет пациента");
      } else {
        notify("Войдите в кабинет, чтобы хранить историю приёмов");
      }
    });

    document.addEventListener("auth:success", ({ detail }) => {
      if (["login", "register", "demo"].includes(detail.type)) {
        if (detail.type === "demo") seedDemoHistory();
        closeLayer(authModal);
        const parts = detail.user.name.split(" ");
        notify(`Здравствуйте, ${parts.length === 3 ? parts[1] : parts[0]}!`);
        setTimeout(() => openCabinet(), 350);
      }
      if (detail.type === "profile") {
        Auth.setData("medcard", { birth: $("#birthInput").value, allergy: $("#allergyInput").value.trim() });
        prefillWizard();
      }
      if (detail.type === "logout") {
        closeLayer(cabinetModal);
        notify("Вы вышли из кабинета");
      }
    });

    document.addEventListener("auth:change", () => {
      renderCabinet();
      prefillWizard();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      closeLayer(authModal);
      closeLayer(cabinetModal);
    });

    prefillWizard();
  }

  return { init, openAuth, openCabinet };
})();

account.init();
