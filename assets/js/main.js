/* =========================================================
   הגדרות העסק – עדכנו כאן את מספר הטלפון והוואטסאפ.
   כל הקישורים באתר (tel: ו-wa.me) מתעדכנים אוטומטית מכאן.
   ========================================================= */
const CONFIG = {
  // מספר בפורמט בינלאומי ללא + וללא אפס מוביל, לדוגמה: "972501234567"
  phoneIntl: "9725XXXXXXXX",
  // מספר לתצוגה באתר, לדוגמה: "050-123-4567"
  phoneDisplay: "05X-XXX-XXXX",
  // מספר הוואטסאפ (בדרך כלל זהה לטלפון)
  whatsappIntl: "9725XXXXXXXX",
};

(() => {
  "use strict";

  document.documentElement.classList.remove("no-js");

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const waLink = (text) =>
    `https://wa.me/${CONFIG.whatsappIntl}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

  /* ---------- Contact links ---------- */
  $$("[data-call]").forEach((a) => (a.href = `tel:+${CONFIG.phoneIntl}`));
  $$("[data-whatsapp]").forEach((a) => (a.href = waLink(a.dataset.waText)));
  $$("[data-phone-display]").forEach((el) => (el.textContent = CONFIG.phoneDisplay));

  /* ---------- Lead tracking hook (GA4 / GTM / Meta) ---------- */
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-track]");
    if (!el) return;
    const type = el.matches("[data-call]") ? "call" : el.matches("[data-whatsapp]") ? "whatsapp" : "other";
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "lead_click", lead_type: type, lead_location: el.dataset.track });
  });

  /* ---------- Year ---------- */
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- Remote image fallback ---------- */
  $$("img[data-fallback]").forEach((img) => {
    const fail = () => img.classList.add("img-failed");
    if (img.complete && img.naturalWidth === 0) fail();
    img.addEventListener("error", fail, { once: true });
  });

  /* ---------- Header + mobile CTA on scroll ---------- */
  const header = $(".site-header");
  const mobileCta = $(".mobile-cta");
  const hero = $(".hero");
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 20);
    mobileCta.classList.toggle("is-visible", y > hero.offsetHeight * 0.55);
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  const toggle = $(".nav-toggle");
  const nav = $("#nav");
  const setNav = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "סגירת תפריט" : "פתיחת תפריט");
    nav.classList.toggle("is-open", open);
  };
  toggle.addEventListener("click", () => setNav(toggle.getAttribute("aria-expanded") !== "true"));
  $$("a", nav).forEach((a) => a.addEventListener("click", () => setNav(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setNav(false));

  /* ---------- Active nav link ---------- */
  const navLinks = $$("a[href^='#']", nav);
  const sections = navLinks.map((a) => $(a.getAttribute("href"))).filter(Boolean);
  const navObs = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${en.target.id}`));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => navObs.observe(s));

  /* ---------- Reveal on scroll (with sibling stagger) ---------- */
  const reveals = $$(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-in"));
  } else {
    reveals.forEach((el) => {
      const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
      el.style.setProperty("--d", `${Math.min(siblings.indexOf(el), 6) * 0.08}s`);
    });
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-in"); obs.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach((el) => obs.observe(el));
  }

  if (reduceMotion || !finePointer) return; // pointer effects below are desktop-only

  /* ---------- 3D tilt ---------- */
  $$("[data-tilt]").forEach((el) => {
    const max = Number(el.dataset.tiltMax) || 8;
    let raf = 0;
    el.addEventListener("pointermove", (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        el.style.setProperty("--ry", `${(x - 0.5) * max * 2}deg`);
        el.style.setProperty("--rx", `${(0.5 - y) * max * 2}deg`);
        el.style.setProperty("--gx", `${x * 100}%`);
        el.style.setProperty("--gy", `${y * 100}%`);
      });
    });
    el.addEventListener("pointerleave", () => {
      cancelAnimationFrame(raf);
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    });
  });

  /* ---------- Magnetic buttons ---------- */
  $$(".magnetic").forEach((btn) => {
    btn.addEventListener("pointermove", (e) => {
      const r = btn.getBoundingClientRect();
      btn.style.setProperty("--bx", `${(e.clientX - r.left - r.width / 2) * 0.18}px`);
      btn.style.setProperty("--by", `${(e.clientY - r.top - r.height / 2) * 0.3}px`);
    });
    btn.addEventListener("pointerleave", () => {
      btn.style.setProperty("--bx", "0px");
      btn.style.setProperty("--by", "0px");
    });
  });

  /* ---------- Hero parallax ---------- */
  const media = $("[data-parallax]");
  hero.addEventListener("pointermove", (e) => {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    media.style.setProperty("--px", `${x * -18}px`);
    media.style.setProperty("--py", `${y * -12}px`);
  });
})();

/* ---------- Lead form → WhatsApp ---------- */
(() => {
  const form = document.getElementById("lead-form");
  if (!form) return;
  const err = form.querySelector(".form-error");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const phoneOk = /^[0-9\-+\s]{9,15}$/.test(phone);

    form.name.setAttribute("aria-invalid", String(!name));
    form.phone.setAttribute("aria-invalid", String(!phoneOk));
    if (!name || !phoneOk) {
      err.hidden = false;
      (!name ? form.name : form.phone).focus();
      return;
    }
    err.hidden = true;

    const lines = [
      "שלום, אשמח לקבל שירות חשמלאי.",
      `שם: ${name}`,
      `טלפון: ${phone}`,
      form.city.value.trim() && `יישוב: ${form.city.value.trim()}`,
      `שירות: ${form.service.value}`,
      form.message.value.trim() && `פרטים: ${form.message.value.trim()}`,
    ].filter(Boolean);

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "lead_form_submit", lead_type: "whatsapp_form", service: form.service.value });

    window.open(
      `https://wa.me/${CONFIG.whatsappIntl}?text=${encodeURIComponent(lines.join("\n"))}`,
      "_blank",
      "noopener"
    );
  });
})();
