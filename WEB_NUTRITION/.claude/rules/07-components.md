---
description: CSS patterns cho Button, Card, Tag, Section Label. Copy trực tiếp khi tạo component mới.
globs: ["**/*.css", "**/*.html"]
---

# Component Patterns

## Buttons

```css
/* Primary */
.btn-primary {
  background: var(--color-forest);
  color: var(--color-cream);
  padding: 14px 32px;
  border-radius: var(--radius-pill);
  font: 500 15px var(--font-body);
  letter-spacing: 0.3px;
  transition:
    transform 200ms var(--ease-out-expo),
    background 200ms ease;
}
.btn-primary:hover {
  transform: translateY(-2px);
  background: var(--color-sage);
}

/* Ghost */
.btn-ghost {
  border: 1.5px solid var(--color-forest);
  color: var(--color-forest);
  /* same padding/radius */
}

/* Arrow link */
.btn-arrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--color-forest);
  font-weight: 500;
  transition: gap 200ms var(--ease-out-expo);
}
.btn-arrow:hover {
  gap: 14px;
  color: var(--color-sage);
}
```

## Cards

```css
.card {
  background: var(--color-linen);
  border-radius: var(--radius-lg);
  padding: var(--space-md) var(--space-lg);
  border: 1px solid var(--color-sand);
  transition: transform 300ms var(--ease-out-expo);
}
.card:hover {
  transform: translateY(-4px);
}
```

Không dùng `box-shadow` nhiều layer — tạo cảm giác nặng nề.

## Tags / Badges

```css
.tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: var(--radius-pill);
  font: 500 11px var(--font-body);
  letter-spacing: 1.5px;
  text-transform: uppercase;
  background: var(--color-mint);
  color: var(--color-forest);
}
```

## Section Label (editorial)

```css
.section-label {
  font: 400 11px var(--font-mono);
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--color-muted);
  margin-bottom: var(--space-sm);
}
/* Ví dụ: ". 02 ."  hoặc  "— TÍNH NĂNG" */
```
