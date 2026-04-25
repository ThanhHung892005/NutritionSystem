---
description: Spacing tokens, grid system và layout rules. Áp dụng cho mọi file CSS.
globs: ["**/*.css"]
---

# Spacing & Layout

## Spacing tokens

```css
--space-xs: 8px;
--space-sm: 16px;
--space-md: 32px;
--space-lg: 64px;
--space-xl: 128px;
--space-2xl: 200px;
```

Luôn dùng `--space-*` variables, không hardcode giá trị pixel cho spacing.

## Container

```css
--container-max: 1280px;
--container-pad: clamp(24px, 5vw, 80px);
```

## Border radius

```css
--radius-sm: 6px;
--radius-md: 16px;
--radius-lg: 32px;
--radius-pill: 999px;
```

## Grid

- Desktop: 12 cột, Tablet: 4 cột, Mobile: 1 cột
- Sections chính: full-width background, content trong `.container`
- Cards: `grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))`
- Cho phép elements "break out" khỏi container (như hero image)

## Layout principles

- Dùng **negative space nhiều** — "room to breathe" tạo cảm giác premium
- Bố cục **bất đối xứng** theo phong cách editorial
- Hero layout: text ~42%, visual ~58%
- Responsive breakpoints: 320px → 640px → 768px → 960px → 1440px
