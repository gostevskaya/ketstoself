
document.addEventListener("DOMContentLoaded", () => {
  const cfg = window.SITE_CONFIG || {};
  document.querySelectorAll("[data-phone]").forEach(el => el.textContent = cfg.phoneDisplay || "");
  document.querySelectorAll("[data-phone-link]").forEach(el => el.href = "tel:" + (cfg.phoneLink || ""));
  document.querySelectorAll("[data-telegram]").forEach(el => el.href = cfg.telegram || "#");
  document.querySelectorAll("[data-viber]").forEach(el => el.href = cfg.viber || "#");

  const toggle = document.querySelector(".mobile-toggle");
  const nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
  }

  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a").forEach(a => {
    const href = a.getAttribute("href");
    if (href === path || (path.startsWith("article-") && href === "blog.html")) {
      a.classList.add("active");
    }
  });

  const cards = [...document.querySelectorAll(".blog-card")];
  const filterButtons = document.querySelectorAll(".filter-btn");
  const sortSelect = document.querySelector("#sortArticles");
  const grid = document.querySelector(".blog-grid");
  let activeCategory = "all";

  function renderBlog() {
    if (!grid || !cards.length) return;
    const sorted = [...cards].sort((a,b) => {
      const da = new Date(a.dataset.date);
      const db = new Date(b.dataset.date);
      return sortSelect && sortSelect.value === "oldest" ? da-db : db-da;
    });
    sorted.forEach(card => {
      const show = activeCategory === "all" || card.dataset.category === activeCategory;
      card.classList.toggle("hidden", !show);
      grid.appendChild(card);
    });
  }

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeCategory = btn.dataset.filter;
      renderBlog();
    });
  });

  if (sortSelect) sortSelect.addEventListener("change", renderBlog);
  renderBlog();
});
