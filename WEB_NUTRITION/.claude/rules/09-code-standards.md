---
description: Naming conventions, performance, accessibility standards. Áp dụng cho mọi file code.
globs: ["**/*.html", "**/*.css", "**/*.js"]
---

# Code Standards

## Naming conventions

- CSS classes: `kebab-case` (`.hero-section__title`)
- Design tokens: `--color-*`, `--text-*`, `--space-*`
- HTML: semantic tags — `<section>`, `<article>`, `<nav>`, `<main>`
- JS files: `camelCase` cho functions và variables

## Performance

- Images: WebP + `loading="lazy"` + `srcset`
- Fonts: `font-display: swap`, `preconnect` Google Fonts
- Animations: chỉ `transform` và `opacity` (GPU-accelerated)
- Lighthouse target: **Performance ≥ 90**, **Accessibility ≥ 95**

## Accessibility

- Contrast ratio **≥ 4.5:1** cho body text
- Focus states rõ ràng (`outline` với `--color-sage`)
- `aria-label` cho icons, buttons không có text
- `prefers-reduced-motion` media query cho **mọi** animation
- `alt` text cho mọi `<img>`, `aria-hidden="true"` cho decorative SVG

## Quick checklist trước khi commit

- [ ] Đúng color tokens, không hardcode màu
- [ ] Đúng font tokens (display/body/mono)
- [ ] Spacing dùng `--space-*` variables
- [ ] Hover state cho mọi interactive element
- [ ] `data-animate` attribute trên mọi element cần scroll animation
- [ ] `prefers-reduced-motion` cho animations
- [ ] Semantic HTML đúng cấu trúc
- [ ] Responsive từ 320px → 1440px+
- [ ] Text contrast ≥ 4.5:1
- [ ] Không `.env` trong commit
- [ ] Backend API endpoint đúng prefix `/api/v1/`
