(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = typeof window.gsap !== "undefined";
  const hasST = hasGsap && typeof window.ScrollTrigger !== "undefined";
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  /* ---------- Mobile nav (fullscreen drawer) ---------- */
  const hamburger = document.getElementById("hamburger");
  const gnav = document.getElementById("gnav");

  const setNav = (open) => {
    gnav.classList.toggle("is-open", open);
    hamburger.classList.toggle("is-open", open);
    hamburger.setAttribute("aria-expanded", String(open));
    hamburger.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
    document.body.style.overflow = open ? "hidden" : "";
  };

  if (hamburger && gnav) {
    hamburger.addEventListener("click", () => setNav(!gnav.classList.contains("is-open")));
    gnav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setNav(false)));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && gnav.classList.contains("is-open")) setNav(false);
    });
  }

  /* ---------- Header shrink / background on scroll ---------- */
  const header = document.getElementById("header");
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Reveal: all content visible when reduced motion ---------- */
  const reveals = Array.from(document.querySelectorAll(".reveal"));
  const showAll = () => reveals.forEach((el) => el.classList.add("is-visible"));

  if (reduceMotion) {
    showAll();
    document.querySelectorAll(".hero-stats .num[data-count]").forEach((el) => {
      el.textContent = el.dataset.count;
    });
    return initFormAndMarquee();
  }

  /* ---------- Scroll reveal (GSAP ScrollTrigger, IO fallback) ---------- */
  if (hasST) {
    reveals.forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: () => el.classList.add("is-visible"),
      });
    });
  } else if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach((el) => io.observe(el));
  } else {
    showAll();
  }

  /* ---------- Hero entrance: character stagger + collage ---------- */
  const splitChars = (el) => {
    const text = el.textContent;
    el.textContent = "";
    el.setAttribute("aria-label", text);
    Array.from(text).forEach((ch) => {
      const s = document.createElement("span");
      s.className = "ch";
      s.textContent = ch;
      s.setAttribute("aria-hidden", "true");
      el.appendChild(s);
    });
  };

  if (hasGsap) {
    document.querySelectorAll(".hero-title .line").forEach(splitChars);
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".hero-eyebrow", { y: 18, opacity: 0, duration: 0.8 }, 0.1)
      .from(".hero-title .ch", { y: 26, opacity: 0, duration: 0.7, stagger: 0.035 }, 0.3)
      .from(".hero-lead", { y: 18, opacity: 0, duration: 0.8 }, "-=0.4")
      .from(".hero-actions .btn", { y: 16, opacity: 0, duration: 0.7, stagger: 0.1 }, "-=0.5")
      .from(".hero-stats li", { y: 14, opacity: 0, duration: 0.6, stagger: 0.1 }, "-=0.4")
      .from(".hero-note", { opacity: 0, duration: 0.6 }, "-=0.3")
      .from(".collage-item", { scale: 0.7, opacity: 0, duration: 1.3, ease: "elastic.out(1, 0.6)", stagger: 0.18 }, 0.4)
      .from(".collage-deco", { scale: 0, opacity: 0, duration: 1, ease: "back.out(2)" }, "-=0.9")
      .from(".scroll-cue", { opacity: 0, duration: 0.8 }, "-=0.4");
  }

  /* ---------- Counters ---------- */
  const counters = document.querySelectorAll(".hero-stats .num[data-count]");
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    if (hasGsap) {
      const obj = { v: 0 };
      gsap.to(obj, { v: target, duration: 1.6, ease: "power2.out", onUpdate: () => { el.textContent = Math.round(obj.v); } });
      return;
    }
    const duration = 1200;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3))).toString();
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (counters.length) {
    if (hasST) {
      ScrollTrigger.create({ trigger: ".hero-stats", start: "top 95%", once: true, onEnter: () => counters.forEach(animateCount) });
    } else if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { animateCount(entry.target); io.unobserve(entry.target); }
        });
      }, { threshold: 0.5 });
      counters.forEach((el) => io.observe(el));
    } else {
      counters.forEach(animateCount);
    }
  }

  /* ---------- Parallax (subtle, ±40px max) ---------- */
  if (hasST) {
    document.querySelectorAll("[data-parallax]").forEach((el) => {
      const amt = Math.max(-40, Math.min(40, parseFloat(el.dataset.parallax) || 0));
      gsap.fromTo(el, { y: -amt }, {
        y: amt,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
      });
    });
  }

  /* ---------- Signature: service cards spring-expand on hover / tap ---------- */
  const serviceCards = document.querySelectorAll(".service-card");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  serviceCards.forEach((card) => {
    const grow = () => hasGsap && gsap.to(card, { scale: 1.04, y: -8, duration: 1.1, ease: "elastic.out(1, 0.55)", overwrite: "auto" });
    const shrink = () => hasGsap && gsap.to(card, { scale: 1, y: 0, duration: 0.7, ease: "power3.out", overwrite: "auto" });
    if (finePointer) {
      card.addEventListener("pointerenter", grow);
      card.addEventListener("pointerleave", shrink);
    }
    card.addEventListener("focus", grow);
    card.addEventListener("blur", shrink);
    card.addEventListener("click", () => {
      const active = card.classList.toggle("is-active");
      serviceCards.forEach((c) => { if (c !== card) { c.classList.remove("is-active"); if (hasGsap) gsap.to(c, { scale: 1, y: 0, duration: 0.5, ease: "power3.out", overwrite: "auto" }); } });
      active ? grow() : shrink();
    });
  });

  /* ---------- Signature: timeline dotted path drawn on scroll ---------- */
  const timeline = document.getElementById("timeline");
  if (timeline) {
    const path = timeline.querySelector(".tl-path");
    if (hasST) {
      ScrollTrigger.create({
        trigger: timeline,
        start: "top 70%",
        end: "bottom 60%",
        scrub: 0.8,
        onUpdate: (self) => path.style.setProperty("--p", self.progress.toFixed(4)),
      });
    } else {
      path.style.setProperty("--p", "1");
    }
  }

  /* ---------- Magnetic buttons (fine pointer only) ---------- */
  if (hasGsap && finePointer) {
    document.querySelectorAll("[data-magnet]").forEach((btn) => {
      const strength = 0.28;
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * strength;
        const y = (e.clientY - (r.top + r.height / 2)) * strength;
        gsap.to(btn, { x, y, duration: 0.5, ease: "power3.out" });
      });
      btn.addEventListener("pointerleave", () => gsap.to(btn, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" }));
    });
  }

  initFormAndMarquee();

  /* ---------- Shared: marquee pause + contact form (demo, no real submit) ---------- */
  function initFormAndMarquee() {
    const marquee = document.getElementById("voiceMarquee");
    if (marquee) {
      // Tap toggles pause on touch devices (hover handles pointer devices via CSS).
      marquee.addEventListener("touchstart", () => marquee.classList.toggle("is-paused"), { passive: true });
    }

    const form = document.getElementById("contactForm");
    const successMsg = document.getElementById("formSuccess");

    const validators = {
      name: (v) => v.trim().length > 0,
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      message: (v) => v.trim().length > 0,
    };
    const errorMessages = {
      name: "お名前を入力してください。",
      email: "正しいメールアドレスを入力してください。",
      message: "お問い合わせ内容を入力してください。",
    };

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        let valid = true;

        Object.keys(validators).forEach((field) => {
          const input = form.elements[field];
          const row = input.closest(".form-row");
          const errorEl = form.querySelector(`.form-error[data-for="${field}"]`);
          const ok = validators[field](input.value);

          if (!ok) {
            valid = false;
            row.classList.add("has-error");
            if (errorEl) errorEl.textContent = errorMessages[field];
          } else {
            row.classList.remove("has-error");
            if (errorEl) errorEl.textContent = "";
          }
        });

        if (valid && successMsg) {
          successMsg.hidden = false;
          form.reset();
          successMsg.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
        } else if (successMsg) {
          successMsg.hidden = true;
        }
      });
    }
  }
})();
