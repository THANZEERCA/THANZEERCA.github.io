/* ══════════════════════════════════════════════════════
   ANIMATIONS.JS — GSAP Scroll & Reveal Animations
   ══════════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

/* ── Hero Entrance Timeline ── */
if (document.querySelector(".hero-greeting")) {
  const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

  heroTl
    .fromTo(".profile-photo", { scale: 0.5, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.8 })
    .fromTo(".hero-greeting", { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6 }, "-=0.3")
    .fromTo(".hero-title", { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8 }, "-=0.3")
    .fromTo(".hero-typing-line", { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6 }, "-=0.4")
    .fromTo(".hero-sub", { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6 }, "-=0.3")
    .fromTo(".hero-buttons", { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6 }, "-=0.3")
    .fromTo(".stats-strip", { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8 }, "-=0.2");
}

/* ── Scroll Reveal — Cards, Sections, Containers ── */
const revealElements = gsap.utils.toArray(
  ".card, .icon-card, .project-card, .resume-section, .tech-pills-section, .cta-section, .contact-form, .education-item, .experience-item"
);

revealElements.forEach((el) => {
  gsap.fromTo(el,
    { y: 40, autoAlpha: 0 },
    {
      y: 0,
      autoAlpha: 1,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        toggleActions: "play none none none",
      },
    }
  );
});

/* ── Section Headers ── */
gsap.utils.toArray(".section-header").forEach((header) => {
  const children = header.children;
  gsap.fromTo(children,
    { y: 30, autoAlpha: 0 },
    {
      y: 0,
      autoAlpha: 1,
      duration: 0.6,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: {
        trigger: header,
        start: "top 85%",
      },
    }
  );
});

/* ── Section Titles (standalone) ── */
gsap.utils.toArray(".section-title").forEach((title) => {
  if (title.closest(".section-header")) return; // already animated above
  gsap.fromTo(title,
    { x: -30, autoAlpha: 0 },
    {
      x: 0,
      autoAlpha: 1,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: {
        trigger: title,
        start: "top 85%",
      },
    }
  );
});

/* ── Nav Links Stagger ── */
gsap.fromTo(".nav-links a",
  { y: -10, autoAlpha: 0 },
  {
    y: 0,
    autoAlpha: 1,
    duration: 0.5,
    stagger: 0.1,
    ease: "power3.out",
    delay: 0.2,
  }
);

/* ── Tech Pills Stagger ── */
gsap.utils.toArray(".pills-wrap").forEach((wrap) => {
  gsap.fromTo(wrap.children,
    { y: 15, autoAlpha: 0 },
    {
      y: 0,
      autoAlpha: 1,
      duration: 0.4,
      stagger: 0.05,
      ease: "power3.out",
      scrollTrigger: {
        trigger: wrap,
        start: "top 90%",
      },
    }
  );
});

/* ── Skill Groups ── */
gsap.utils.toArray(".skill-group").forEach((group, i) => {
  // Use scrollTrigger for each group
  gsap.fromTo(group,
    { y: 20, autoAlpha: 0 },
    {
      y: 0,
      autoAlpha: 1,
      duration: 0.5,
      delay: i * 0.08, // Stagger delay based on index if multiple triggered same time? 
      // Actually if they are grid items, index works best if they are all selected at once.
      // But here we iterate. Let's just use simple fromTo.
      ease: "power3.out",
      scrollTrigger: {
        trigger: group,
        start: "top 88%",
      },
    }
  );
});

/* ── Detail Items (Contact) ── */
gsap.utils.toArray(".detail-item").forEach((item, i) => {
  gsap.fromTo(item,
    { x: -20, autoAlpha: 0 },
    {
      x: 0,
      autoAlpha: 1,
      duration: 0.5,
      delay: i * 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: item,
        start: "top 90%",
      },
    }
  );
});

/* ── Form Inputs ── */
gsap.utils.toArray(".form-group").forEach((group, i) => {
  gsap.fromTo(group,
    { y: 20, autoAlpha: 0 },
    {
      y: 0,
      autoAlpha: 1,
      duration: 0.5,
      delay: i * 0.08,
      ease: "power3.out",
      scrollTrigger: {
        trigger: group,
        start: "top 92%",
      },
    }
  );
});

/* ── Smooth Scroll Anchor Links ── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href !== "#" && document.querySelector(href)) {
      e.preventDefault();
      gsap.to(window, {
        duration: 0.8,
        scrollTo: { y: href, offsetY: 80 },
        ease: "power3.inOut",
      });
    }
  });
});
