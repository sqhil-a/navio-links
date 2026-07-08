const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

const cursorGlow = document.querySelector(".cursor-glow");
const scrollProgress = document.querySelector(".scroll-progress");
const linksPanel = document.querySelector(".links-panel");

if (!prefersReducedMotion) {
  let glowX = window.innerWidth / 2;
  let glowY = window.innerHeight / 2;
  let currentGlowX = glowX;
  let currentGlowY = glowY;

  function animate() {
    currentGlowX += (glowX - currentGlowX) * 0.08;
    currentGlowY += (glowY - currentGlowY) * 0.08;

    if (cursorGlow) {
      cursorGlow.style.transform = `translate3d(${currentGlowX - 230}px, ${
        currentGlowY - 230
      }px, 0)`;
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener(
    "pointermove",
    (event) => {
      glowX = event.clientX;
      glowY = event.clientY;
    },
    { passive: true },
  );

  window.addEventListener(
    "pointerleave",
    () => {
      if (cursorGlow) cursorGlow.style.opacity = "0";
    },
    { passive: true },
  );

  window.addEventListener(
    "pointerenter",
    () => {
      if (cursorGlow) cursorGlow.style.opacity = "0.8";
    },
    { passive: true },
  );

  window.addEventListener(
    "scroll",
    () => {
      const scrollTop = window.scrollY;
      const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = pageHeight <= 0 ? 0 : scrollTop / pageHeight;

      if (scrollProgress) {
        scrollProgress.style.transform = `scaleX(${progress})`;
      }
    },
    { passive: true },
  );

  if (linksPanel) {
    linksPanel.addEventListener(
      "pointermove",
      (event) => {
        const rect = linksPanel.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;

        linksPanel.style.setProperty("--mx", `${x}%`);
        linksPanel.style.setProperty("--my", `${y}%`);
      },
      { passive: true },
    );
  }

  animate();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (!entry.isIntersecting) return;

        entry.target.style.transitionDelay = `${index * 70}ms`;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -70px 0px",
    },
  );

  document
    .querySelectorAll(
      ".orbital-card, .link-card, .hero-copy",
    )
    .forEach((el) => {
      el.classList.add("reveal");
      observer.observe(el);
    });
}