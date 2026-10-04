(function () {
  "use strict";

  const translations = window.LENDUP_TRANSLATIONS || {};
  const config = window.LENDUP_CONFIG || {};
  const supportedLanguages = ["es", "en"];
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let currentLanguage = "es";

  function getValue(path, language = currentLanguage) {
    return path.split(".").reduce((value, key) => value && value[key], translations[language]);
  }

  function refreshIcons() {
    if (window.lucide) window.lucide.createIcons({ attrs: { "stroke-width": 1.8 } });
  }

  function setProductLinks() {
    document.querySelectorAll("[data-app-link]").forEach((link) => { link.href = config.APP_URL; });
    document.querySelectorAll("[data-explore-link]").forEach((link) => { link.href = config.EXPLORE_URL; });
    document.querySelectorAll("[data-publish-link]").forEach((link) => { link.href = config.PUBLISH_URL; });
  }

  function renderSteps() {
    ["borrower", "lender"].forEach((role) => {
      const panel = document.querySelector(`[data-panel="${role}"]`);
      if (!panel) return;
      const steps = getValue(`how.${role}Steps`) || [];
      panel.innerHTML = `<ol class="steps-list">${steps.map(([title, text]) => `
        <li class="step-card">
          <div><h3>${title}</h3><p>${text}</p></div>
        </li>`).join("")}</ol>`;
    });
  }

  function renderFaq() {
    const accordion = document.getElementById("faq-accordion");
    if (!accordion) return;
    const items = getValue("faq.items") || [];
    accordion.innerHTML = items.map(([question, answer], index) => `
      <article class="accordion-item reveal is-visible">
        <h3><button class="accordion-trigger" type="button" id="faq-trigger-${index}" aria-expanded="false" aria-controls="faq-panel-${index}">
          <span>${question}</span><i data-lucide="plus" aria-hidden="true"></i>
        </button></h3>
        <div class="accordion-panel" id="faq-panel-${index}" role="region" aria-labelledby="faq-trigger-${index}" hidden><p>${answer}</p></div>
      </article>`).join("");

    accordion.querySelectorAll(".accordion-trigger").forEach((button) => {
      button.addEventListener("click", () => {
        const shouldOpen = button.getAttribute("aria-expanded") !== "true";
        accordion.querySelectorAll(".accordion-trigger").forEach((item) => {
          item.setAttribute("aria-expanded", "false");
          document.getElementById(item.getAttribute("aria-controls")).hidden = true;
        });
        if (shouldOpen) {
          button.setAttribute("aria-expanded", "true");
          document.getElementById(button.getAttribute("aria-controls")).hidden = false;
        }
      });
    });
  }

  function renderTeam() {
    const grid = document.getElementById("team-grid");
    if (!grid) return;
    const members = window.LENDUP_TEAM || [];
    grid.innerHTML = members.map((member) => `
      <article class="team-member reveal is-visible">
        <div class="team-avatar">${member.image ? `<img src="${member.image}" alt="${member.name}" loading="lazy">` : `<span aria-hidden="true">${member.initials}</span>`}</div>
        <h4>${member.name}</h4><p>${getValue("team.role")}</p>
      </article>`).join("");
  }

  function renderAboutProductVideo() {
    const container = document.getElementById("about-product-video");
    if (!container) return;
    const videoId = String(config.ABOUT_PRODUCT_YOUTUBE_ID || "").trim();
    if (/^[A-Za-z0-9_-]{6,}$/.test(videoId)) {
      container.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?rel=0&controls=1" title="${getValue("video.iframeTitle")}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
      return;
    }
    container.innerHTML = `<div class="video-placeholder"><span class="video-play"><i data-lucide="play" aria-hidden="true"></i></span><strong>${getValue("video.title")}</strong><span>${getValue("video.comingSoon")}</span></div>`;
  }

  function renderSocialLinks() {
    const container = document.getElementById("social-links");
    if (!container) return;
    const socialLinks = config.SOCIAL_LINKS || {};
    const iconNames = { github: "github", youtube: "youtube", instagram: "instagram", linkedin: "linkedin" };
    container.replaceChildren();
    Object.entries(iconNames).forEach(([network, icon]) => {
      const url = socialLinks[network];
      if (!url) return;
      const link = document.createElement("a");
      link.className = "social-link";
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.setAttribute("aria-label", getValue(`social.${network}`));
      link.innerHTML = `<i data-lucide="${icon}" aria-hidden="true"></i>`;
      container.appendChild(link);
    });
  }

  function updateMenuLabel() {
    const menuButton = document.querySelector(".menu-toggle");
    if (!menuButton) return;
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    const label = getValue(isOpen ? "nav.close" : "nav.open");
    menuButton.setAttribute("aria-label", label);
    const text = menuButton.querySelector(".sr-only");
    if (text) text.textContent = label;
  }

  function updateLanguageToggles() {
    const nextLabel = getValue(currentLanguage === "es" ? "lang.switchToEnglish" : "lang.switchToSpanish");
    document.querySelectorAll("[data-language-toggle]").forEach((button) => {
      button.setAttribute("aria-label", nextLabel);
      const code = button.querySelector("[data-language-code]");
      if (code) code.textContent = currentLanguage.toUpperCase();
    });
  }

  function applyLanguage(language) {
    currentLanguage = supportedLanguages.includes(language) ? language : "es";
    document.documentElement.lang = currentLanguage;
    localStorage.setItem("lendup-language", currentLanguage);

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const value = getValue(element.dataset.i18n);
      if (typeof value === "string") element.textContent = value;
    });
    document.querySelectorAll("[data-i18n-html]").forEach((element) => {
      const value = getValue(element.dataset.i18nHtml);
      if (typeof value === "string") element.innerHTML = value;
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
      const value = getValue(element.dataset.i18nAria);
      if (typeof value === "string") element.setAttribute("aria-label", value);
    });
    document.querySelectorAll("[data-legal-lang]").forEach((section) => {
      section.hidden = section.dataset.legalLang !== currentLanguage;
    });

    renderSteps();
    renderFaq();
    renderTeam();
    renderAboutProductVideo();
    renderSocialLinks();
    updateLanguageToggles();
    updateMenuLabel();
    refreshIcons();
  }

  function setupLanguageToggle() {
    document.querySelectorAll("[data-language-toggle]").forEach((button) => {
      button.addEventListener("click", () => applyLanguage(currentLanguage === "es" ? "en" : "es"));
    });
  }

  function setupMobileMenu() {
    const button = document.querySelector(".menu-toggle");
    const navigation = document.getElementById("primary-navigation");
    if (!button || !navigation) return;

    const setOpen = (open) => {
      button.setAttribute("aria-expanded", String(open));
      navigation.classList.toggle("open", open);
      document.body.classList.toggle("menu-open", open);
      button.innerHTML = `<span class="sr-only">${getValue(open ? "nav.close" : "nav.open")}</span><i data-lucide="${open ? "x" : "menu"}" aria-hidden="true"></i>`;
      updateMenuLabel();
      refreshIcons();
    };

    button.addEventListener("click", () => setOpen(button.getAttribute("aria-expanded") !== "true"));
    navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && button.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        button.focus();
      }
    });
    window.addEventListener("resize", () => { if (window.innerWidth > 992) setOpen(false); });
  }

  function setupHeroCarousel() {
    const carousel = document.querySelector(".hero-carousel");
    const track = document.querySelector("[data-hero-track]");
    const slides = [...document.querySelectorAll("[data-hero-slide]")];
    const dots = [...document.querySelectorAll("[data-hero-dot]")];
    if (!carousel || !track || !slides.length) return;

    let currentIndex = 0;
    let autoplayTimer = null;
    let touchStartX = null;
    let pausedByHover = false;
    let pausedByFocus = false;

    const update = () => {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      slides.forEach((slide, index) => {
        const active = index === currentIndex;
        slide.setAttribute("aria-hidden", String(!active));
        slide.inert = !active;
      });
      dots.forEach((dot, index) => dot.setAttribute("aria-current", String(index === currentIndex)));
    };
    const stopAutoplay = () => {
      if (autoplayTimer) window.clearInterval(autoplayTimer);
      autoplayTimer = null;
    };
    const startAutoplay = () => {
      stopAutoplay();
      if (reducedMotionQuery.matches || pausedByHover || pausedByFocus) return;
      autoplayTimer = window.setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        update();
      }, 8000);
    };
    const goTo = (index, reset = true) => {
      currentIndex = (index + slides.length) % slides.length;
      update();
      if (reset) startAutoplay();
    };

    document.querySelector("[data-hero-prev]")?.addEventListener("click", () => goTo(currentIndex - 1));
    document.querySelector("[data-hero-next]")?.addEventListener("click", () => goTo(currentIndex + 1));
    dots.forEach((dot) => dot.addEventListener("click", () => goTo(Number(dot.dataset.heroDot))));
    carousel.addEventListener("pointerenter", () => { pausedByHover = true; stopAutoplay(); });
    carousel.addEventListener("pointerleave", () => { pausedByHover = false; startAutoplay(); });
    carousel.addEventListener("focusin", () => { pausedByFocus = true; stopAutoplay(); });
    carousel.addEventListener("focusout", () => {
      window.setTimeout(() => {
        pausedByFocus = carousel.contains(document.activeElement);
        if (!pausedByFocus) startAutoplay();
      }, 0);
    });
    carousel.addEventListener("touchstart", (event) => { touchStartX = event.changedTouches[0]?.clientX ?? null; }, { passive: true });
    carousel.addEventListener("touchend", (event) => {
      if (touchStartX === null) return;
      const delta = (event.changedTouches[0]?.clientX ?? touchStartX) - touchStartX;
      if (Math.abs(delta) > 48) goTo(currentIndex + (delta < 0 ? 1 : -1));
      touchStartX = null;
    }, { passive: true });
    reducedMotionQuery.addEventListener?.("change", startAutoplay);
    update();
    startAutoplay();
  }

  function setupBenefitSlider() {
    const slider = document.querySelector("[data-benefit-slider]");
    const cards = [...document.querySelectorAll("[data-benefit-card]")];
    const dots = [...document.querySelectorAll("[data-benefit-dot]")];
    if (!slider || !cards.length) return;

    let activeIndex = 0;
    let autoplayTimer = null;
    let paused = false;

    const update = () => {
      const mobile = window.innerWidth <= 992;
      cards.forEach((card, index) => {
        const previous = (activeIndex - 1 + cards.length) % cards.length;
        const next = (activeIndex + 1) % cards.length;
        card.classList.toggle("active", index === activeIndex);
        card.classList.toggle("left", index === previous);
        card.classList.toggle("right", index === next);
        card.setAttribute("aria-current", String(index === activeIndex));
        card.tabIndex = mobile || [activeIndex, previous, next].includes(index) ? 0 : -1;
      });
      dots.forEach((dot, index) => dot.setAttribute("aria-current", String(index === activeIndex)));
    };
    const stopAutoplay = () => {
      if (autoplayTimer) window.clearInterval(autoplayTimer);
      autoplayTimer = null;
    };
    const startAutoplay = () => {
      stopAutoplay();
      if (reducedMotionQuery.matches || paused || window.innerWidth <= 992) return;
      autoplayTimer = window.setInterval(() => {
        activeIndex = (activeIndex + 1) % cards.length;
        update();
      }, 6000);
    };
    const activate = (index) => {
      activeIndex = index;
      update();
      startAutoplay();
    };

    cards.forEach((card, index) => {
      card.addEventListener("click", () => activate(index));
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          activate(index);
        }
      });
    });
    dots.forEach((dot) => dot.addEventListener("click", () => activate(Number(dot.dataset.benefitDot))));
    slider.addEventListener("pointerenter", () => { paused = true; stopAutoplay(); });
    slider.addEventListener("pointerleave", () => { paused = false; startAutoplay(); });
    slider.addEventListener("focusin", () => { paused = true; stopAutoplay(); });
    slider.addEventListener("focusout", () => {
      window.setTimeout(() => {
        paused = slider.contains(document.activeElement);
        if (!paused) startAutoplay();
      }, 0);
    });
    window.addEventListener("resize", () => { update(); startAutoplay(); });
    reducedMotionQuery.addEventListener?.("change", startAutoplay);
    update();
    startAutoplay();
  }

  function setupHowRoleSelector() {
    const tabs = [...document.querySelectorAll("[role='tab'][data-tab]")];
    if (!tabs.length) return;
    const activate = (tab, focus = false) => {
      tabs.forEach((item) => {
        const active = item === tab;
        item.setAttribute("aria-selected", String(active));
        item.tabIndex = active ? 0 : -1;
        const panel = document.querySelector(`[data-panel="${item.dataset.tab}"]`);
        if (panel) panel.hidden = !active;
      });
      if (focus) tab.focus();
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activate(tab));
      tab.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        let nextIndex = index;
        if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
        if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = tabs.length - 1;
        activate(tabs[nextIndex], true);
      });
    });
  }

  function setupHeader() {
    const header = document.getElementById("site-header");
    if (!header) return;
    const update = () => header.classList.toggle("scrolled", window.scrollY > 16 || document.body.classList.contains("legal-page"));
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  function setupSectionObserver() {
    const sections = [...document.querySelectorAll("[data-section]")];
    const links = [...document.querySelectorAll("[data-nav-link]")];
    if (!sections.length || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      links.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`));
    }, { rootMargin: "-28% 0px -58%", threshold: [0.05, 0.25, 0.55] });
    sections.forEach((section) => observer.observe(section));
  }

  function setupRevealObserver() {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || reducedMotionQuery.matches) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });
    items.forEach((item) => observer.observe(item));
  }

  function initialize() {
    setProductLinks();
    setupLanguageToggle();
    setupMobileMenu();
    setupHowRoleSelector();
    setupHeader();
    setupSectionObserver();
    const savedLanguage = localStorage.getItem("lendup-language");
    applyLanguage(supportedLanguages.includes(savedLanguage) ? savedLanguage : "es");
    setupHeroCarousel();
    setupBenefitSlider();
    setupRevealObserver();
    const year = document.getElementById("current-year");
    if (year) year.textContent = new Date().getFullYear();
  }

  document.addEventListener("DOMContentLoaded", initialize);
})();
