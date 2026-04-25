const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => {
          entry.target.classList.add("is-visible");
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: "0px 0px -60px 0px",
  },
);

export function initAnimations() {
  document
    .querySelectorAll("[data-animate]")
    .forEach((el) => observer.observe(el));
}

export function initCountUp() {
  const counters = document.querySelectorAll("[data-count]");
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.dataset.count);
          const suffix = el.dataset.suffix || "";
          const prefix = el.dataset.prefix || "";
          const duration = 1600;
          const start = performance.now();

          const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = target * eased;
            el.textContent =
              prefix +
              (Number.isInteger(target)
                ? Math.floor(current)
                : current.toFixed(1)) +
              suffix;
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          countObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 },
  );

  counters.forEach((el) => countObserver.observe(el));
}

export function initHeroWordReveal() {
  const hero = document.querySelector(".hero-headline");
  if (!hero) return;

  const lines = hero.querySelectorAll(".line");
  lines.forEach((line, i) => {
    line.style.opacity = "0";
    line.style.transform = "translateY(30px)";
    line.style.transition = `opacity 700ms cubic-bezier(0.16,1,0.3,1) ${100 + i * 130}ms, transform 700ms cubic-bezier(0.16,1,0.3,1) ${100 + i * 130}ms`;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        line.style.opacity = "1";
        line.style.transform = "none";
      });
    });
  });
}
