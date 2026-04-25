---
description: Color tokens và quy tắc sử dụng màu. Áp dụng cho mọi file CSS/HTML.
globs: ["**/*.css", "**/*.html"]
---

# Color Palette

Luôn dùng CSS variables, không hardcode màu:

```css
:root {
  /* Primary */
  --color-forest: #1c3a2b; /* Xanh rừng đậm — headlines, CTA nền */
  --color-sage: #4a7c59; /* Xanh rêu — accents, links, icon */
  --color-mint: #a8c5a0; /* Xanh bạc hà nhạt — highlights, tags */

  /* Neutrals */
  --color-cream: #f5f0e8; /* Kem ấm — background chính */
  --color-linen: #ede8dc; /* Linen — card backgrounds */
  --color-sand: #c8b99a; /* Cát — borders, dividers */

  /* Ink */
  --color-ink: #1a1a1a; /* Gần đen — body text */
  --color-muted: #6b6560; /* Xám ấm — subtext, captions */

  /* Accent */
  --color-citrus: #d4813a; /* Cam đất — highlights nhấn mạnh */
  --color-blush: #e8c4a0; /* Hồng đào nhạt — decorative */
}
```

## Quy tắc bắt buộc

- Background mặc định: `--color-cream`
- Section tối (hero, CTA): `--color-forest` với text trắng/mint
- **KHÔNG dùng màu xanh dương hay tím** — tránh clichés AI/tech
- Giới hạn **3 màu** trên mỗi section
- Không có màu nào ngoài design system
