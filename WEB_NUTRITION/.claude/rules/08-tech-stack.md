---
description: Tech stack, cấu trúc thư mục và quy tắc backend. Tham khảo khi tạo file mới hoặc setup project.
---

# Tech Stack & Cấu trúc dự án

## Frontend

| Công nghệ         | Vai trò                                   |
| ----------------- | ----------------------------------------- |
| HTML5             | Cấu trúc semantic, accessibility          |
| CSS3              | Design tokens, styling, animations        |
| Vanilla JS (ES6+) | Intersection Observer, DOM, interactivity |

**Không dùng React/Vue** — website marketing ưu tiên tốc độ tải trang.  
JS libraries được phép: `gsap` (animation phức tạp), `lenis` (smooth scroll). Không dùng jQuery.

## Backend

| Công nghệ  | Vai trò                                        |
| ---------- | ---------------------------------------------- |
| Node.js    | Runtime server                                 |
| Express.js | REST API, routing, form submission             |
| NestJS     | Auth module, nutrition engine, chatbot service |
| PostgreSQL | Database chính                                 |

- Express cho: public API, webhook
- NestJS cho: auth, AI engine, chat service
- DB: connection pool (`pg` hoặc Drizzle ORM)
- API prefix: `/api/v1/`
- Credentials trong `.env`, không hardcode

## Cấu trúc thư mục

```
nutrition-system/
├── frontend/
│   ├── index.html
│   ├── css/
│   │   ├── tokens.css          ← CSS variables
│   │   ├── reset.css
│   │   ├── global.css
│   │   ├── components/         ← button.css, card.css, nav.css, tag.css
│   │   └── sections/           ← hero.css, features.css, ...
│   ├── js/
│   │   ├── main.js             ← Entry point
│   │   ├── animations.js       ← Intersection Observer
│   │   ├── nav.js              ← Sticky nav, mobile menu
│   │   └── utils.js
│   └── assets/
│       ├── illustrations/      ← SVG
│       └── images/             ← WebP optimized
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── modules/            ← NestJS modules
│   │   └── db/
│   └── .env.example
└── .claude/rules/              ← Rule files này
```
