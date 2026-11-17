const account = (() => {
  const profileModal = $("#profileModal");
  const renderDashboardBase = renderDashboard;

  function detectDevice() {
    const agent = navigator.userAgent;
    const browser = /Edg\//.test(agent) ? "Edge" : /Firefox\//.test(agent) ? "Firefox" : /Chrome\//.test(agent) ? "Chrome" : /Safari\//.test(agent) ? "Safari" : "Браузер";
    const system = /Windows/.test(agent) ? "Windows" : /Android/.test(agent) ? "Android" : /iPhone|iPad/.test(agent) ? "iOS" : /Mac/.test(agent) ? "macOS" : "Linux";
    return `${browser} · ${system}`;
  }

  function selectTab(name) {
    $$("#profileTabs button").forEach((button) => button.classList.toggle("is-active", button.dataset.ptab === name));
    $$("[data-ppanel]", profileModal).forEach((panel) => (panel.hidden = panel.dataset.ppanel !== name));
  }

  function openProfile() {
    selectTab("profile");
    closeSidebar();
    openModal(profileModal);
  }

  function loadWorkspace() {
    if (!Auth.isLoggedIn()) return;
    const saved = Auth.getData("workspace", null);
    state = saved?.tasks ? saved : createDefaultState();
    if (!saved) save();
    requestAnimationFrame(renderAll);
  }

  function init() {
    const openTaskModalBase = openTaskModal;
    openTaskModal = function (...args) {
      if (Auth.isLoggedIn()) openTaskModalBase(...args);
    };

    save = function () {
      if (Auth.isLoggedIn()) Auth.setData("workspace", state);
    };

    renderDashboard = function () {
      renderDashboardBase();
      const user = Auth.current();
      if (!user) return;
      const hour = new Date().getHours();
      const greeting = hour < 5 ? "Доброй ночи" : hour < 12 ? "Доброе утро" : hour < 18 ? "Добрый день" : "Добрый вечер";
      $("#greeting").textContent = `${greeting}, ${user.name.split(" ")[0]}`;
    };

    Auth.init({
      namespace: "flowdesk",
      demo: { name: "Алина Морозова", email: "demo@flowdesk.app", password: "Demo2026" }
    });

    $("#meBtn").addEventListener("click", openProfile);
    $$("[data-close-profile]").forEach((element) => element.addEventListener("click", closeModals));
    $("#sessionInfo").textContent = `Текущий сеанс: ${detectDevice()}`;

    $("#profileTabs").addEventListener("click", (event) => {
      const button = event.target.closest("[data-ptab]");
      if (button) selectTab(button.dataset.ptab);
    });

    document.addEventListener("auth:change", loadWorkspace);

    document.addEventListener("auth:success", ({ detail }) => {
      if (["login", "register", "demo"].includes(detail.type)) {
        showView("dashboard");
        toast(detail.type === "register" ? "Рабочее пространство создано" : `Добро пожаловать, ${detail.user.name.split(" ")[0]}`);
      }
      if (detail.type === "profile") renderAll();
      if (detail.type === "logout") {
        closeModals();
        palette.close();
      }
    });

    loadWorkspace();
  }

  return { init };
})();

account.init();
