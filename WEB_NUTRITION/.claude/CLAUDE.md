# CLAUDE.md — NutritionSystem

> Đọc trước khi viết bất kỳ dòng code nào.

---

## 1. Dự án

**NutritionSystem** — Web app AI dinh dưỡng, target audience Việt Nam.  
**Stack:** Vanilla HTML/CSS/JS (frontend, port 8099) · Express.js + PostgreSQL 17 (backend, port 3001)  
**Triết lý design:** "Organic Intelligence" — ấm áp tự nhiên + chính xác AI. Không gradient xanh/tím.

---

## 2. Design Tokens

### Màu sắc

```css
--color-forest: #1c3a2b; /* headlines, CTA bg, nav dark sections */
--color-sage: #4a7c59; /* accents, links, hover */
--color-mint: #a8c5a0; /* tags, highlights */
--color-cream: #f5f0e8; /* background chính */
--color-linen: #ede8dc; /* card backgrounds */
--color-sand: #c8b99a; /* borders, dividers */
--color-ink: #1a1a1a; /* body text */
--color-muted: #6b6560; /* subtext, captions */
--color-citrus: #d4813a; /* warnings, emphasis */
```

Quy tắc: tối đa 3 màu/section · không hardcode hex · không xanh dương/tím.

### Typography

```css
--font-display: "Playfair Display", Georgia, serif; /* headlines */
--font-body: "DM Sans", sans-serif; /* body ≥15px */
--font-mono: "DM Mono", monospace; /* data, numbers */

--text-hero: clamp(40px, 4.6vw, 68px); /* hero headline */
--text-h1: clamp(40px, 4vw, 56px);
--text-h2: clamp(28px, 3vw, 36px);
--text-body: 17px; /* line-height 1.7, max-width 65ch */
--text-sm: 13px;
```

Quy tắc: italic cho từ nhấn mạnh trong headline · font-weight ≤ 700.

### Spacing & Radius

```css
--space-xs: 8px;
--space-sm: 16px;
--space-md: 32px;
--space-lg: 64px;
--space-xl: 128px;
--space-2xl: 200px;
--radius-sm: 6px;
--radius-md: 16px;
--radius-lg: 32px;
--radius-pill: 999px;
--container-max: 1280px;
--container-pad: clamp(24px, 5vw, 80px);
```

---

## 3. Animation (BẮT BUỘC)

**Mọi section PHẢI có scroll animation** — không có element nào xuất hiện tĩnh.

```css
[data-animate] {
  opacity: 0;
  transition:
    opacity 600ms,
    transform 600ms cubic-bezier(0.16, 1, 0.3, 1);
}
[data-animate="fade-up"] {
  transform: translateY(40px);
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

Stagger: thêm `data-delay="100"` (ms) cho từng card trong group.  
Hover: buttons `translateY(-2px)` · cards `translateY(-4px)`.  
Screenshot sau mỗi thay đổi lớn:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --screenshot=screenshots/$(date +%Y%m%d_%H%M)_desktop.png \
  --window-size=1440,900 --virtual-time-budget=3000 "http://localhost:8099/"
```

---

## 4. Code Standards

- CSS classes: `kebab-case` · tokens: `--color-*`, `--space-*`, `--text-*`
- API prefix: `/api/v1/` · credentials trong `.env`, không commit
- Không React/Vue/jQuery · Vanilla JS ES6+
- Backend: Express module pattern `routes.js → controller.js → service.js`
- Auth: JWT lưu `localStorage` key `ns_token`, `requireAuth()` guard ở đầu mỗi app page

### Checklist trước commit

- [ ] Color/font/spacing dùng tokens, không hardcode
- [ ] `data-animate` trên mọi element cần animation
- [ ] `prefers-reduced-motion` cho CSS animations
- [ ] Hover state cho mọi interactive element
- [ ] Semantic HTML · contrast ≥ 4.5:1
- [ ] Không commit `.env`

---

## 5. Trạng thái dự án — 2026-04-24 (v3.0 — FEATURE COMPLETE)

### App Pages

| Trang                | Status | Notes                                             |
| -------------------- | ------ | ------------------------------------------------- |
| `auth.html`          | ✅     | JWT login/register                                |
| `dashboard.html`     | ✅     | BMI/BMR/TDEE + 4 action cards                     |
| `profile.html`       | ✅     | BMI bar + result panel                            |
| `tracker.html`       | ✅     | Weight chart min-max normalized                   |
| `meal-log.html`      | ✅     | DB food + custom food hybrid                      |
| `meal-planner.html`  | ✅     | AI 7-ngày + day navigator + history               |
| `chatbot.html`       | ✅     | Chat AI + Meal Review Panel + lịch sử chat lưu DB |
| `weekly-report.html` | ✅     | Báo cáo tuần: calo, macro, adherence, cân nặng    |

### Backend Modules

| Module                      | Status | Notes                                                                     |
| --------------------------- | ------ | ------------------------------------------------------------------------- |
| Auth                        | ✅     | bcrypt + JWT 7d                                                           |
| Health Profile + BMI engine | ✅     | Mifflin-St Jeor                                                           |
| Foods API                   | ✅     | ILIKE search + `ok_*` disease filter                                      |
| Weight Tracker              | ✅     | GET/POST/DELETE + ownership check                                         |
| Meal Logger                 | ✅     | ratio=amountG/100 auto-calc macros                                        |
| AI Meal Planner             | ✅     | Gemini `gemini-2.5-flash-lite`, JSON thuần, upsert theo ngày              |
| AI Chatbot                  | ✅     | Context-aware + Meal Review Panel + chat history DB (GET/DELETE /history) |
| Chat History                | ✅     | Bảng `chat_messages`, tự lưu sau mỗi exchange, khôi phục khi mở lại trang |
| Weekly Reports              | ✅     | `GET /api/v1/reports/weekly?weekStart=` — generate_series fill 7 ngày     |
| PostgreSQL                  | ✅     | 7 bảng, uuid PKs, trigger updated_at                                      |

### Bugs đã fix

- **Màn hình trắng** trên tracker/meal-log/meal-planner/chatbot: `animations.js` dùng ES module `export` gây SyntaxError khi load bằng `<script>` thường → tạo `app-animations.js` (IIFE, không export) riêng cho app pages
- **Error handler** `app.js`: đã fix dùng `err.status || 500` thay vì hardcode 500
- **AI provider**: đổi từ Anthropic sang Google Gemini; `gemini-2.0-flash` bị quota free tier = 0 → dùng `gemini-2.5-flash-lite`
- **404 chatbot endpoint**: server chạy từ trước khi chatbot module được tạo → restart là fix
- **Gemini 503**: `gemini-2.5-flash` quá tải → đổi sang `gemini-2.5-flash-lite` (cả chatbot lẫn meal planner)

### Tính năng hoàn thành — Session 2026-04-24 (Phase 3)

#### Nav Mobile — Hamburger Menu

- `dashboard.css`: styles cho `.dash-hamburger` (3 lines → ✕ animation) + `.dash-mobile-drawer` (slide-down)
- `api.js`: `initDashNav()` tự gọi qua `DOMContentLoaded` — auto-detect active link theo `pathname`, logout, close on outside click
- Tất cả 7 app pages: thêm `<button class="dash-hamburger">` + `<div class="dash-mobile-drawer">` ngay sau `</header>`
- Desktop (>640px): hamburger ẩn, nav links hiển thị bình thường
- Mobile (≤640px): nav links + user ẩn, hamburger hiện; click → drawer slide xuống

#### Weekly Report (`weekly-report.html`)

- **Backend**: `modules/reports/` — service dùng `generate_series` SQL fill đủ 7 ngày kể cả ngày không log; tính avg calo, macro, adherence%, weight change trong tuần; fallback target = 2000 kcal nếu chưa có profile
- **Frontend**: week navigator ← → (nút → disabled khi ở tuần hiện tại); 7-bar chart (màu: xanh rừng ≥80% · xanh rêu 50–80% · cam <50% · xám = chưa log); adherence fill bar animate 800ms; weight section ẩn nếu không có log cân trong tuần
- Link "Báo cáo tuần" đã thêm vào desktop nav + mobile drawer của tất cả 7 app pages

### Bước tiếp theo — Phase 4 (tùy chọn)

> Tất cả tính năng Phase 1–3 đã hoàn thành. Các cải tiến có thể làm thêm:

1. **PWA / Offline** — service worker, manifest, install prompt
2. **Push notifications** — nhắc log bữa ăn hàng ngày
3. **Export PDF** — xuất báo cáo tuần/tháng ra file
4. **Landing page** — hoàn thiện `index.html` (hiện chỉ là marketing page tĩnh)

---

## 6. Quyết định quan trọng

| Quyết định                                                | Lý do                                                                                                                  |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `--text-hero: clamp(40px,4.6vw,68px)`                     | Tiếng Việt có dấu, headline 3 dòng wrap xấu ở font lớn                                                                 |
| Hero grid `42fr 58fr`                                     | Illustration cần nhiều không gian hơn text                                                                             |
| Express thay vì NestJS                                    | MVP không cần TypeScript/DI; module pattern đủ                                                                         |
| `pg` pool thay vì ORM                                     | Raw SQL dễ debug hơn cho MVP                                                                                           |
| JWT trong localStorage                                    | Frontend static, không có server set httpOnly cookie                                                                   |
| Hybrid Meal Logger                                        | User cần log DB foods (auto-macro) và món tự nhập                                                                      |
| `ON CONFLICT` upsert meal_plans                           | Generate lại cùng ngày → update, không duplicate                                                                       |
| Prompt yêu cầu JSON thuần                                 | Gemini đôi khi wrap JSON trong markdown fence                                                                          |
| `gemini-2.5-flash-lite` thay vì `2.5-flash`               | `2.5-flash` thường xuyên 503 (quá tải); `2.0-flash` quota = 0; `2.5-flash-lite` ổn định trên project này               |
| `app-animations.js` tách khỏi `animations.js`             | `animations.js` dùng ES `export` → SyntaxError trên regular script; `index.html` dùng `type="module"` nên giữ nguyên   |
| Chat history lưu DB, bỏ sessionStorage                    | sessionStorage mất khi đóng tab; DB cho phép khôi phục lịch sử xuyên session                                           |
| `saveMessages` fire-and-forget (không await)              | Không block response AI trả về; lỗi ghi DB chỉ log console, không ảnh hưởng UX                                         |
| Meal Review Panel format thành plain text message         | Tái dùng `handleSend()` có sẵn; không cần endpoint mới; AI nhận context bữa ăn qua system prompt như bình thường       |
| System prompt inject profile + meal plan + meal log       | AI biết context thực tế → review thực đơn chính xác theo bệnh lý                                                       |
| `initDashNav()` đặt trong `api.js`, không tạo file riêng  | `api.js` đã được load ở mọi app page → không cần thêm `<script>` tag vào 7 file HTML; auto-call qua `DOMContentLoaded` |
| Drawer top tính bằng `nav.getBoundingClientRect().height` | Tránh hardcode 49px; đúng với mọi viewport/font-size                                                                   |
| `generate_series` SQL trong reports thay vì fill JS       | DB tự fill 7 ngày kể cả ngày không có meal_log → không cần xử lý gap phía JS; kết quả luôn đủ 7 phần tử                |
| Weekly report fallback `targetCalories = 2000`            | User chưa nhập health profile vẫn xem được báo cáo; không throw 404 ra UI                                              |

---

_Last updated: v3.0 — 2026-04-24 (Feature Complete)_
