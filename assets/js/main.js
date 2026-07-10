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


  const certificateButtons = [...document.querySelectorAll("[data-certificate]")];
  if (certificateButtons.length) {
    const lightbox = document.createElement("div");
    lightbox.className = "certificate-lightbox";
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.innerHTML = `
      <div class="certificate-lightbox-dialog" role="dialog" aria-modal="true" aria-label="Перегляд сертифіката">
        <button class="certificate-lightbox-close" type="button" aria-label="Закрити перегляд">×</button>
        <button class="certificate-lightbox-nav certificate-lightbox-prev" type="button" aria-label="Попередній сертифікат">‹</button>
        <div class="certificate-lightbox-image-wrap">
          <img class="certificate-lightbox-image" alt=""/>
        </div>
        <p class="certificate-lightbox-caption" aria-live="polite"></p>
        <button class="certificate-lightbox-nav certificate-lightbox-next" type="button" aria-label="Наступний сертифікат">›</button>
      </div>`;
    document.body.appendChild(lightbox);

    const dialog = lightbox.querySelector(".certificate-lightbox-dialog");
    const image = lightbox.querySelector(".certificate-lightbox-image");
    const caption = lightbox.querySelector(".certificate-lightbox-caption");
    const closeButton = lightbox.querySelector(".certificate-lightbox-close");
    const prevButton = lightbox.querySelector(".certificate-lightbox-prev");
    const nextButton = lightbox.querySelector(".certificate-lightbox-next");
    let currentIndex = 0;
    let returnFocus = null;

    const renderCertificate = (index) => {
      currentIndex = (index + certificateButtons.length) % certificateButtons.length;
      const button = certificateButtons[currentIndex];
      const thumb = button.querySelector("img");
      image.src = button.dataset.full || thumb?.currentSrc || thumb?.src || "";
      image.alt = thumb?.alt || "Сертифікат";
      caption.textContent = `${image.alt} — ${currentIndex + 1} з ${certificateButtons.length}`;
      const hasSeveral = certificateButtons.length > 1;
      prevButton.hidden = !hasSeveral;
      nextButton.hidden = !hasSeveral;
    };

    const openLightbox = (index, trigger) => {
      returnFocus = trigger;
      renderCertificate(index);
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("certificate-lightbox-open");
      closeButton.focus();
    };

    const closeLightbox = () => {
      if (!lightbox.classList.contains("is-open")) return;
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("certificate-lightbox-open");
      image.removeAttribute("src");
      returnFocus?.focus();
    };

    certificateButtons.forEach((button, index) => button.addEventListener("click", () => openLightbox(index, button)));
    closeButton.addEventListener("click", closeLightbox);
    prevButton.addEventListener("click", () => renderCertificate(currentIndex - 1));
    nextButton.addEventListener("click", () => renderCertificate(currentIndex + 1));
    lightbox.addEventListener("click", (event) => { if (event.target === lightbox) closeLightbox(); });
    dialog.addEventListener("click", (event) => event.stopPropagation());
    document.addEventListener("keydown", (event) => {
      if (!lightbox.classList.contains("is-open")) return;
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") renderCertificate(currentIndex - 1);
      if (event.key === "ArrowRight") renderCertificate(currentIndex + 1);
    });
  }

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
