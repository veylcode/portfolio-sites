const account = (() => {
  const authModal = $("#authModal");
  const profileModal = $("#profileModal");

  const translitMap = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i", й: "y", к: "k", л: "l", м: "m",
    н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch",
    ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya"
  };

  const translit = (text) =>
    [...text.toLowerCase()].map((char) => translitMap[char] ?? char).join("").toUpperCase();

  function detectDevice() {
    const agent = navigator.userAgent;
    const browser = /Edg\//.test(agent) ? "Edge" : /Firefox\//.test(agent) ? "Firefox" : /Chrome\//.test(agent) ? "Chrome" : /Safari\//.test(agent) ? "Safari" : "Браузер";
    const system = /Windows/.test(agent) ? "Windows" : /Android/.test(agent) ? "Android" : /iPhone|iPad/.test(agent) ? "iOS" : /Mac/.test(agent) ? "macOS" : /Linux/.test(agent) ? "Linux" : "";
    return [browser, system].filter(Boolean).join(" · ");
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

  function openProfile() {
    $("#profileBalance").textContent = money(state.balance);
    $("#profileTx").textContent = state.transactions.length;
    selectProfileTab("profile");
    openLayer(profileModal);
  }

  function selectProfileTab(name) {
    $$("#profileTabs button").forEach((button) => button.classList.toggle("is-active", button.dataset.ptab === name));
    $$("[data-ppanel]", profileModal).forEach((panel) => (panel.hidden = panel.dataset.ppanel !== name));
  }

  function loadUserBank() {
    state = (Auth.isLoggedIn() && Auth.getData("bank")) || defaultState();
    displayedBalance = 0;
    renderBalance();
    renderTransactions();
    renderGoals();
  }

  function wrapSave() {
    saveState = function () {
      if (Auth.isLoggedIn()) Auth.setData("bank", state);
    };
  }

  function applyCardHolder(name) {
    const input = $("#holderInput");
    input.value = translit(name).slice(0, 22);
    input.dispatchEvent(new Event("input"));
  }

  function init() {
    wrapSave();

    Auth.init({
      namespace: "nova",
      demo: { name: "Алекс Новак", email: "demo@nova.bank", password: "Demo2026" }
    });

    $$("[data-open-auth]").forEach((button) => button.addEventListener("click", () => openAuth(button.dataset.openAuth)));
    $("#userPill").addEventListener("click", openProfile);
    $$("[data-close-auth]").forEach((element) => element.addEventListener("click", () => closeLayer(authModal)));
    $$("[data-close-profile]").forEach((element) => element.addEventListener("click", () => closeLayer(profileModal)));
    $("#sessionDevice").textContent = detectDevice();

    $("#profileTabs").addEventListener("click", (event) => {
      const button = event.target.closest("[data-ptab]");
      if (button) selectProfileTab(button.dataset.ptab);
    });

    document.addEventListener("auth:change", loadUserBank);

    document.addEventListener("auth:success", ({ detail }) => {
      if (["login", "register", "demo"].includes(detail.type)) {
        closeLayer(authModal);
        applyCardHolder(detail.user.name);
        showToast(detail.type === "register" ? `Счёт открыт. Добро пожаловать, ${detail.user.name.split(" ")[0]}!` : `С возвращением, ${detail.user.name.split(" ")[0]}`);
        setTimeout(() => $("#demo").scrollIntoView({ behavior: "smooth" }), 300);
      }
      if (detail.type === "logout") {
        closeLayer(profileModal);
        showToast("Вы вышли из аккаунта");
      }
      if (detail.type === "profile") applyCardHolder(Auth.current().name);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      closeLayer(authModal);
      closeLayer(profileModal);
    });

    loadUserBank();
  }

  return { init, openAuth };
})();

account.init();
