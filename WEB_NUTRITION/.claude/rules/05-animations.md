---
description: Scroll animations, easing tokens, Intersection Observer implementation. BẮT BUỘC cho mọi section.
globs: ["**/*.css", "**/*.js", "**/*.html"]
---

# Animations

## Easing tokens

```css
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
--duration-fast: 150ms;
--duration-base: 300ms;
--duration-slow: 600ms;
```

## QUY TẮC BẮT BUỘC: Mọi section PHẢI có scroll animation

Không có section nào được xuất hiện tĩnh khi scroll.

## CSS base cho data-animate

```css
[data-animate] {
  opacity: 0;
  transition-property: opacity, transform;
  transition-duration: var(--duration-slow);
  transition-timing-function: var(--ease-out-expo);
}
[data-animate="fade-up"] {
  transform: translateY(40px);
}
[data-animate="fade-in"] {
  transform: none;
}
[data-animate="slide-left"] {
  transform: translateX(-50px);
}
[data-animate="slide-right"] {
  transform: translateX(50px);
}
[data-animate="scale-in"] {
  transform: scale(0.92);
}

[data-animate].is-visible {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  [data-animate] {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

## Intersection Observer (js/animations.js)

```js
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add("is-visible"), delay);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
);

document
  .querySelectorAll("[data-animate]")
  .forEach((el) => observer.observe(el));
```

## Bảng phân công animation theo section

| Section      | Element             | Animation         | Delay         |
| ------------ | ------------------- | ----------------- | ------------- |
| Hero         | Section label       | `fade-up`         | 0ms           |
| Hero         | Headline (per line) | JS word-reveal    | +130ms/line   |
| Hero         | Subtext             | `fade-up`         | 350ms         |
| Hero         | Buttons             | `fade-up`         | 450ms         |
| Hero         | Illustration        | `fade-in`         | 200ms         |
| Stats bar    | Mỗi stat            | `fade-up`+countUp | stagger 80ms  |
| Features     | Section label       | `fade-up`         | 0ms           |
| Features     | Heading             | `fade-up`         | 100ms         |
| Features     | Text odd            | `slide-left`      | 0ms           |
| Features     | Text even           | `slide-right`     | 0ms           |
| Features     | Visual              | `fade-in`         | 150ms         |
| How it works | Mỗi step            | `fade-up`         | stagger 120ms |
| Diseases     | Mỗi card            | `scale-in`        | stagger 60ms  |
| Data preview | Container           | `fade-up`         | 0ms           |

## Hover effects

- Buttons: `translateY(-2px)` / 200ms
- Cards: `translateY(-4px)` / 300ms
- Nav: `backdrop-blur` khi `scrollY > 50`
- Chỉ `transform` và `opacity` — GPU-accelerated
