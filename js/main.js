(function () {
  "use strict";

  const translations = window.LENDUP_TRANSLATIONS || {};
  const config = window.LENDUP_CONFIG || {};
  const supportedLanguages = ["es", "en"];
  let currentLanguage = "es";

  function getValue(path, language = currentLanguage) {
    return path.split(".").reduce((value, key) => value && value[key], translations[language]);
  }

  function setProductLinks() {
    document.querySelectorAll("[data-app-link]").forEach((link) => { link.href = config.APP_URL; });
    document.querySelectorAll("[data-login-link]").forEach((link) => { link.href = config.LOGIN_URL; });
    document.querySelectorAll("[data-register-link]").forEach((link) => { link.href = config.REGISTER_URL; });
  }

  function renderSteps() {
    ["borrower", "lender"].forEach((role) => {
      const panel = document.querySelector(`[data-panel="${role}"]`);
      if (!panel) return;
      const steps = getValue(`how.${role}Steps`) || [];
      panel.innerHTML = `<ol class="steps-list">${steps.map(([title, text]) => `
        <li class="step-card reveal is-visible">
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
        <h3>
          <button class="accordion-trigger" type="button" id="faq-trigger-${index}" aria-expanded="false" aria-controls="faq-panel-${index}">
            <span>${question}</span><i data-lucide="plus" aria-hidden="true"></i>
          </button>
        </h3>
        <div class="accordion-panel" id="faq-panel-${index}" role="region" aria-labelledby="faq-trigger-${index}" hidden>
          <p>${answer}</p>
        </div>
      </article>`).join("");

    accordion.querySelectorAll(".accordion-trigger").forEach((button) => {
      button.addEventListener("click", () => {
        const isOpen = button.getAttribute("aria-expanded") === "true";
        accordion.querySelectorAll(".accordion-trigger").forEach((item) => {
          item.setAttribute("aria-expanded", "false");
          document.getElementById(item.getAttribute("aria-controls")).hidden = true;
        });
        if (!isOpen) {
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
    grid.innerHTML = members.map((member) => {
      const displayName = currentLanguage === "en" && member.nameEn ? member.nameEn : member.name;
      return `
      <article class="team-member reveal is-visible">
        <div class="team-avatar">${member.image ? `<img src="${member.image}" alt="${displayName}" loading="lazy">` : `<span aria-hidden="true">${member.initials}</span>`}</div>
        <h4>${displayName}</h4>
        <p>${getValue("team.role")}</p>
      </article>`;
    }).join("");
  }

  function refreshIcons() {
    if (window.lucide) window.lucide.createIcons({ attrs: { "stroke-width": 1.8 } });
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
    document.querySelectorAll("[data-lang]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.lang === currentLanguage));
    });
    document.querySelectorAll("[data-legal-lang]").forEach((section) => {
      section.hidden = section.dataset.legalLang !== currentLanguage;
    });

    renderSteps();
    renderFaq();
    renderTeam();
    updateMenuLabel();
    refreshIcons();
  }

  function setupLanguageSwitchers() {
    document.querySelectorAll("[data-lang]").forEach((button) => {
      button.addEventListener("click", () => applyLanguage(button.dataset.lang));
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

  function setupMobileMenu() {
    const button = document.querySelector(".menu-toggle");
    const navigation = document.getElementById("primary-navigation");
    if (!button || !navigation) return;

    const setOpen = (open) => {
      button.setAttribute("aria-expanded", String(open));
      button.setAttribute("aria-label", getValue(open ? "nav.close" : "nav.open"));
      navigation.classList.toggle("open", open);
      document.body.classList.toggle("menu-open", open);
      button.innerHTML = `<span class="sr-only">${getValue(open ? "nav.close" : "nav.open")}</span><i data-lucide="${open ? "x" : "menu"}" aria-hidden="true"></i>`;
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
    window.addEventListener("resize", () => { if (window.innerWidth >= 1024) setOpen(false); });
  }

  function setupTabs() {
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
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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
    }, { threshold: 0.12 });
    items.forEach((item) => observer.observe(item));
  }

  function initialize() {
    setProductLinks();
    setupLanguageSwitchers();
    setupMobileMenu();
    setupTabs();
    setupHeader();
    setupSectionObserver();
    const savedLanguage = localStorage.getItem("lendup-language");
    applyLanguage(supportedLanguages.includes(savedLanguage) ? savedLanguage : "es");
    setupRevealObserver();
    const year = document.getElementById("current-year");
    if (year) year.textContent = new Date().getFullYear();
  }

  document.addEventListener("DOMContentLoaded", initialize);
})();
