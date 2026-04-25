---
description: Typography tokens, font stack và quy tắc chữ. Áp dụng cho mọi file CSS/HTML.
globs: ["**/*.css", "**/*.html"]
---

# Typography

## Font stack

```css
--font-display: "Playfair Display", Georgia, serif; /* Headlines */
--font-body: "DM Sans", system-ui, sans-serif; /* Body copy */
--font-mono: "DM Mono", "Courier New", monospace; /* Data, labels */
```

Google Fonts import (dùng `preconnect` + `font-display: swap`):

- Playfair Display: ital,wght@0,400;0,700;1,400;1,700
- DM Sans: wght@300;400;500
- DM Mono: wght@400;500

## Type scale

| Token         | Size                   | Dùng cho                         |
| ------------- | ---------------------- | -------------------------------- |
| `--text-hero` | clamp(40px,4.6vw,68px) | Hero headline                    |
| `--text-h1`   | clamp(40px,4vw,56px)   | Section titles                   |
| `--text-h2`   | clamp(28px,3vw,36px)   | Sub-sections                     |
| `--text-h3`   | 24px                   | Card titles                      |
| `--text-body` | 17px                   | Body copy (line-height 1.7)      |
| `--text-sm`   | 13px                   | Captions, labels, meta           |
| `--text-tag`  | 11px                   | Tags, badges (letter-spacing +2) |

## Quy tắc bắt buộc

- Headlines dùng `font-style: italic` cho từ nhấn mạnh
- Không dùng `font-weight > 700` ngoài hero
- Body text: `line-height: 1.7`, `max-width: 65ch`
- Body text **không nhỏ hơn 15px**
- Không animation khi hover trên text thuần — chỉ buttons/cards
