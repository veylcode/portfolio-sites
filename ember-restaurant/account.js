const account = (() => {
  const modal = $("#guestModal");
  const WELCOME_POINTS = 300;
  const POINTS_PER_VISIT = 150;
  const levels = [
    { name: "Искра", from: 0 },
    { name: "Пламя", from: 800 },
    { name: "Жар", from: 1500 },
    { name: "Костёр шефа", from: 2500 }
  ];

  function open() {
    renderRoom();
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function close() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function selectTab(name) {
    $$("#guestTabs button").forEach((button) => button.classList.toggle("is-active", button.dataset.gtab === name));
    $$("[data-gpanel]", modal).forEach((panel) => (panel.hidden = panel.dataset.gpanel !== name));
  }

  function renderLoyalty(bookings) {
    const points = WELCOME_POINTS + bookings.length * POINTS_PER_VISIT;
    const currentIndex = levels.findLastIndex((level) => points >= level.from);
    const current = levels[currentIndex];
    const next = levels[currentIndex + 1];

    $("#emberPoints").textContent = points.toLocaleString("ru-RU");
    $("#emberLevel").textContent = current.name;
    $("#emberBar").style.width = next ? `${((points - current.from) / (next.from - current.from)) * 100}%` : "100%";
    $("#emberNext").textContent = next ? `До уровня «${next.name}» — ${next.from - points} угольков` : "Максимальный уровень";
  }

  function renderBookings(bookings) {
    const now = Date.now();
    const sorted = [...bookings].sort((a, b) => new Date(b.date) - new Date(a.date));

    $("#bookingsList").innerHTML = sorted.length
      ? sorted
          .map((booking, index) => {
            const date = new Date(booking.date);
            const [hours, minutes] = booking.time.split(":").map(Number);
            date.setHours(hours, minutes);
            const isPast = date.getTime() < now;
            return `
            <li class="booking-card ${isPast ? "is-past" : ""}" style="animation-delay:${index * 60}ms">
              <div class="booking-card__date">
                <b>${date.getDate()}</b>
                <small>${date.toLocaleDateString("ru-RU", { month: "short" })}</small>
              </div>
              <div class="booking-card__info">
                <b>${booking.time} · ${booking.guests} ${booking.guests === 1 ? "гость" : booking.guests < 5 ? "гостя" : "гостей"}</b>
                <span>${booking.occasion}${isPast ? " · визит состоялся" : " · ждём вас"}</span>
              </div>
              <span class="booking-card__code">${booking.code}</span>
            </li>`;
          })
          .join("")
      : `<li class="bookings__empty">Броней пока нет. <a href="#reserve" data-close-link>Забронировать стол →</a></li>`;
  }

  function renderRoom() {
    if (!Auth.isLoggedIn()) return;
    const bookings = Auth.getData("bookings", []);
    renderLoyalty(bookings);
    renderBookings(bookings);
  }

  function prefillBooking() {
    const user = Auth.current();
    const form = $("#bookingForm");
    if (!user) return;
    if (!form.elements.name.value) form.elements.name.value = user.name;
    if (!form.elements.phone.value && user.phone) form.elements.phone.value = user.phone;
  }

  function init() {
    Auth.init({
      namespace: "ember",
      demo: { name: "Мария Огнева", email: "demo@ember.rest", password: "Demo2026" }
    });

    $("#guestBtn").addEventListener("click", open);
    $$("[data-close-guest]").forEach((element) => element.addEventListener("click", close));

    $("#guestTabs").addEventListener("click", (event) => {
      const button = event.target.closest("[data-gtab]");
      if (button) selectTab(button.dataset.gtab);
    });

    $("#bookingsList").addEventListener("click", (event) => {
      if (event.target.closest("[data-close-link]")) close();
    });

    document.addEventListener("booking:created", ({ detail }) => {
      if (!Auth.isLoggedIn()) return;
      Auth.pushData("bookings", detail);
      renderRoom();
    });

    document.addEventListener("auth:success", ({ detail }) => {
      if (["login", "register", "demo"].includes(detail.type)) {
        selectTab("bookings");
        renderRoom();
      }
    });

    document.addEventListener("auth:change", () => {
      renderRoom();
      prefillBooking();
    });

    document.addEventListener("keydown", (event) => event.key === "Escape" && close());

    selectTab("bookings");
    renderRoom();
    prefillBooking();
  }

  return { init, open };
})();

account.init();
