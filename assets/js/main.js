/* ══════════════════════════════════════════════════════
   MAIN.JS — Portfolio Interactions & Effects
   ══════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
  initHamburger();
  initNavbarScroll();
  initTypingEffect();
  initCounterAnimation();
  initParticles();
  initHoneycombAnimation();
});

/* ── Hamburger Menu ── */
function initHamburger() {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.querySelector(".nav-links");
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("open");
  });

  // Close when clicking a link
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("open");
    });
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove("active");
      navLinks.classList.remove("open");
    }
  });
}

/* ── Navbar Scroll Effect ── */
function initNavbarScroll() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
}

/* ── Typing Effect ── */
function initTypingEffect() {
  const el = document.getElementById("typed-text");
  if (!el) return;

  const roles = [
    "Full-Stack Developer",
    "MERN Stack Specialist",
    "Problem Solver",
    "Clean Code Advocate",
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 80;
  const deleteSpeed = 40;
  const pauseTime = 1800;

  function type() {
    const current = roles[roleIndex];

    if (!isDeleting) {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(type, pauseTime);
        return;
      }
      setTimeout(type, typeSpeed);
    } else {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, deleteSpeed);
    }
  }

  setTimeout(type, 600);
}

/* ── Counter Animation ── */
function initCounterAnimation() {
  const counters = document.querySelectorAll(".stat-number[data-count]");
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => observer.observe(counter));

  function animateCounter(el) {
    const target = parseInt(el.getAttribute("data-count"), 10);
    const duration = 2000;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(eased * target);
      el.textContent = current + "+";

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }
}

/* ── Particle Canvas ── */
/* ── Particle Canvas ── */
function initParticles() {
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let particles = [];
  let mouse = { x: -1000, y: -1000 }; // Initialize off-screen
  let animFrameId;

  function resize() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }

  resize();
  window.addEventListener("resize", resize);

  // Track mouse
  window.addEventListener("mousemove", (e) => {
    // Need to account for canvas position if it's not full screen, 
    // but here it covers the hero section which is at the top.
    // However, if scrolled, clientY is relative to viewport, which matches fixed/absolute behavior usually.
    // But since canvas is absolute in relative hero, we might need offset.
    // Actually, hero is at top, so clientY + scrollY - offsetTop might be needed if it wasn't at 0,0.
    // For now simple clientX/Y roughly works for mouseover effects.
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  // Clear mouse on leave
  window.addEventListener("mouseleave", () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3.5 + 1.5;
      this.baseX = this.x; // Store original/target drift path? No, free float is fine.
      this.baseY = this.y;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Mouse Interaction - Attraction
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const limit = 200; // Interaction radius

      if (distance < limit) {
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const force = (limit - distance) / limit;
        const directionX = forceDirectionX * force * 0.6; // Strength
        const directionY = forceDirectionY * force * 0.6;

        this.x += directionX;
        this.y += directionY;
      }

      // Boundaries
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(37, 99, 235, ${this.opacity})`;
      ctx.fill();
    }
  }

  // Create particles
  const count = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 120);
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }

  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(37, 99, 235, ${0.15 * (1 - dist / 140)})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }

      // Connect to mouse
      const dx = particles[a].x - mouse.x;
      const dy = particles[a].y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 180) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(37, 99, 235, ${0.25 * (1 - dist / 180)})`; // Slightly stronger connection to mouse
        ctx.lineWidth = 0.8;
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    connectParticles();
    animFrameId = requestAnimationFrame(animate);
  }

  animate();
}

/* ── Form Submission ── */
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const submitBtn = this.querySelector("button[type='submit']");
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    setTimeout(() => {
      // Show success toast
      const toast = document.createElement("div");
      toast.textContent = "✓ Message sent! I'll get back to you soon.";
      toast.style.cssText = `
        position: fixed;
        top: 24px;
        right: 24px;
        background: linear-gradient(135deg, #2563eb, #6366f1);
        color: white;
        padding: 16px 28px;
        border-radius: 10px;
        font-family: 'Inter', sans-serif;
        font-weight: 600;
        font-size: 0.95rem;
        z-index: 2000;
        box-shadow: 0 8px 30px rgba(37,99,235,0.3);
        transform: translateX(120%);
        transition: transform 0.4s cubic-bezier(0.4,0,0.2,1);
      `;
      document.body.appendChild(toast);
      requestAnimationFrame(() => (toast.style.transform = "translateX(0)"));

      setTimeout(() => {
        toast.style.transform = "translateX(120%)";
        setTimeout(() => toast.remove(), 400);
      }, 3000);

      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      this.reset();
    }, 800);
  });
}

/* ── Honeycomb Cursor Animation ── */
function initHoneycombAnimation() {
  const canvas = document.getElementById("honeycomb-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let hexes = [];
  let mouse = { x: -1000, y: -1000 }; // Initialize off-screen
  let animFrameId;

  // Hexagon properties - flat-topped
  const hexSize = 30; // Radius
  const hexWidth = hexSize * 2;
  const hexHeight = Math.sqrt(3) * hexSize;
  const xOffset = hexWidth * 0.75;
  const yOffset = hexHeight;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createGrid();
  }

  window.addEventListener("resize", resize);

  // Track mouse position
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  class Hex {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.activeValue = 0; // 0 to 1 for glow intensity
    }

    draw() {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const x = this.x + hexSize * Math.cos(angle);
        const y = this.y + hexSize * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();

      // Base stroke (light gray)
      ctx.strokeStyle = "rgba(226, 232, 240, 0.4)"; // var(--card-border) with transparency
      ctx.lineWidth = 1;
      ctx.stroke();

      // Active glow stroke
      if (this.activeValue > 0.01) {
        ctx.strokeStyle = `rgba(37, 99, 235, ${this.activeValue})`; // var(--accent)
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = `rgba(99, 102, 241, ${this.activeValue * 0.15})`; // var(--indigo) fill
        ctx.fill();
      }
    }
  }

  function createGrid() {
    hexes = [];
    const cols = Math.ceil(canvas.width / xOffset) + 2;
    const rows = Math.ceil(canvas.height / yOffset) + 2;

    for (let r = -1; r < rows; r++) {
      for (let c = -1; c < cols; c++) {
        const x = c * xOffset;
        const y = r * hexHeight + (c % 2 === 0 ? 0 : hexHeight / 2);
        hexes.push(new Hex(x, y));
      }
    }
  }

  // Initial setup
  resize();

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw hexes
    hexes.forEach(hex => {
      // Calculate distance to mouse
      const dx = hex.x - mouse.x;
      const dy = hex.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Activation radius
      const radius = 250;
      let targetValue = 0;

      if (dist < radius) {
        // Calculate intensity based on distance (closer = brighter)
        targetValue = 1 - (dist / radius);
        // Make falloff sharper
        targetValue = Math.pow(targetValue, 2);
      }

      // Smooth transition
      hex.activeValue += (targetValue - hex.activeValue) * 0.1;

      hex.draw();
    });

    animFrameId = requestAnimationFrame(animate);
  }

  animate();
}
