document.addEventListener("DOMContentLoaded", () => {
  const cfg = window.SITE_CONFIG || {};

  document.querySelectorAll("[data-phone]").forEach((el) => { el.textContent = cfg.phoneDisplay || "+38 075 45 075 90"; });
  document.querySelectorAll("[data-phone-link]").forEach((el) => { el.href = `tel:${cfg.phoneLink || "+380754507590"}`; });
  document.querySelectorAll("[data-telegram]").forEach((el) => { el.href = cfg.telegram || "https://t.me/olena_keystoself"; });
  document.querySelectorAll("[data-telegram-channel]").forEach((el) => { el.href = cfg.telegramChannel || "https://t.me/keystoself_channel"; });
  document.querySelectorAll("[data-viber]").forEach((el) => { el.href = cfg.viber || "viber://chat?number=%2B380754507590"; });

  const toggle = document.querySelector(".mobile-toggle");
  const nav = document.querySelector(".main-nav");
  const closeMenu = () => {
    if (!toggle || !nav) return;
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  };
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = !nav.classList.contains("open");
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });
    document.addEventListener("click", (event) => {
      if (!nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });
  }

  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a").forEach((link) => {
    const href = link.getAttribute("href") || "";
    if (href.startsWith("#")) return;
    const target = href.split("#")[0];
    const isArticle = current.startsWith("article-") && target === "blog.html";
    if (target === current || isArticle) link.classList.add("active");
  });

  const cards = [...document.querySelectorAll(".blog-card")];
  const buttons = [...document.querySelectorAll(".filter-btn")];
  const sortSelect = document.getElementById("sortArticles");
  const grid = document.querySelector(".blog-grid");
  let filter = "all";

  const renderBlog = () => {
    if (!grid || !cards.length) return;
    const sorted = [...cards].sort((a, b) => {
      const aDate = new Date(a.dataset.date || 0);
      const bDate = new Date(b.dataset.date || 0);
      return sortSelect?.value === "oldest" ? aDate - bDate : bDate - aDate;
    });
    sorted.forEach((card) => {
      const visible = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hidden", !visible);
      grid.appendChild(card);
    });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      filter = button.dataset.filter || "all";
      renderBlog();
    });
  });
  sortSelect?.addEventListener("change", renderBlog);
  renderBlog();

  const gaId = String(cfg.gaMeasurementId || "").trim();
  if (/^G-[A-Z0-9]+$/i.test(gaId)) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(){ window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", gaId);
  }
});
