export function initNav() {
  const nav = document.querySelector(".nav");
  const hamburger = document.querySelector(".nav-hamburger");
  const overlay = document.querySelector(".nav-overlay");
  const overlayLinks = document.querySelectorAll(".nav-overlay .nav-link");

  // Sticky nav blur
  const handleScroll = () => {
    if (window.scrollY > 50) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  };
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // Mobile menu
  if (hamburger && overlay) {
    hamburger.addEventListener("click", () => {
      const isOpen = hamburger.classList.toggle("open");
      overlay.classList.toggle("open", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    overlayLinks.forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("open");
        overlay.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  // Active section highlight
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll('.nav-links .nav-link[href^="#"]');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${entry.target.id}`,
            );
          });
        }
      });
    },
    { threshold: 0.4 },
  );

  sections.forEach((s) => sectionObserver.observe(s));
}
