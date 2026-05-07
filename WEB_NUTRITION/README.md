# NutritionSystem

Web app AI dinh dưỡng cá nhân hóa cho người dùng Việt Nam. Phân tích hồ sơ sức khỏe, lập thực đơn 7 ngày bằng AI, theo dõi cân nặng & calo hàng ngày.

## Yêu cầu

| Cách chạy                | Cần cài                                          |
| ------------------------ | ------------------------------------------------ |
| **Docker (khuyến nghị)** | Docker Desktop                                   |
| Thủ công                 | Node.js ≥ 18 · PostgreSQL 17 · `psql` trong PATH |

## Cài đặt — Docker (khuyến nghị)

```bash
# 1. Clone repo
git clone <repo-url>
cd WEB_NUTRITION

# 2. Tạo file .env từ template
cp backend/.env.example backend/.env
# Mở backend/.env, điền JWT_SECRET và GEMINI_API_KEY
# DB_PASSWORD mặc định là "postgres" — đổi nếu muốn

# 3. Khởi động toàn bộ hệ thống
docker compose up -d
```

Docker tự động:

- Tạo PostgreSQL 17 container
- Tạo database `nutrition_system`
- Chạy schema → migration → seed đúng thứ tự
- Khởi động backend Express (port 3001)

Backend sẵn sàng khi `docker compose logs backend` không còn báo lỗi kết nối DB.

```bash
# Serve frontend (port 8099)
npx serve frontend -l 8099
```

Mở trình duyệt tại `http://localhost:8099`

### Lệnh Docker hữu ích

```bash
docker compose up -d          # Khởi động
docker compose down           # Dừng (giữ data)
docker compose down -v        # Dừng + xóa toàn bộ data DB
docker compose logs -f        # Xem logs realtime
docker compose logs backend   # Logs backend only

# Reset database (chạy lại toàn bộ SQL từ đầu)
docker compose down -v && docker compose up -d
```

---

## Cài đặt — Thủ công (không dùng Docker)

```bash
# 1. Clone repo
git clone <repo-url>
cd WEB_NUTRITION

# 2. Cài dependencies backend
cd backend
npm install

# 3. Tạo file .env từ template
cp .env.example .env
# Mở .env và điền: DB_PASSWORD, JWT_SECRET, GEMINI_API_KEY

# 4. Khởi tạo database (cần PostgreSQL + psql trong PATH)
npm run db:setup
# Tương đương: tạo DB → schema → migrations → seed

# 5. Chạy backend (port 3001)
npm run dev
```

```bash
# Serve frontend (port 8099)
npx serve frontend -l 8099
```

### npm scripts database

| Script               | Tác dụng                                     |
| -------------------- | -------------------------------------------- |
| `npm run db:setup`   | Chạy toàn bộ: create + init + migrate + seed |
| `npm run db:create`  | Tạo database `nutrition_system`              |
| `npm run db:init`    | Chạy `schema.sql`                            |
| `npm run db:migrate` | Chạy 3 file migration theo thứ tự            |
| `npm run db:seed`    | Seed dữ liệu thực phẩm mẫu                   |

> Nếu PostgreSQL yêu cầu password: `PGPASSWORD=yourpass npm run db:setup`

---

## Biến môi trường (`backend/.env`)

| Biến             | Mô tả                 | Docker default          |
| ---------------- | --------------------- | ----------------------- |
| `PORT`           | Port backend          | `3001`                  |
| `DB_HOST`        | PostgreSQL host       | tự override → `db`      |
| `DB_PORT`        | PostgreSQL port       | `5432`                  |
| `DB_NAME`        | Tên database          | `nutrition_system`      |
| `DB_USER`        | PostgreSQL user       | `postgres`              |
| `DB_PASSWORD`    | PostgreSQL password   | `postgres`              |
| `JWT_SECRET`     | Secret key cho JWT    | **bắt buộc đổi**        |
| `JWT_EXPIRES_IN` | Thời hạn token        | `7d`                    |
| `FRONTEND_URL`   | URL frontend cho CORS | `http://localhost:8099` |
| `GEMINI_API_KEY` | Google Gemini API key | **bắt buộc điền**       |

> Khi dùng Docker: `DB_HOST` trong `.env` bị ghi đè tự động thành `db` (tên service). Không cần sửa tay.

---

## Cấu trúc dự án

```
WEB_NUTRITION/
├── docker-compose.yml          # Docker: db + backend
├── backend/
│   ├── Dockerfile
│   ├── src/
│   │   ├── app.js              # Express entry point
│   │   ├── db/                 # schema.sql, migrations, seed
│   │   ├── middleware/         # Auth JWT
│   │   └── modules/            # auth, nutrition, chatbot, meal-planner, reports
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── index.html              # Landing page
    ├── auth.html               # Đăng nhập / đăng ký
    ├── dashboard.html          # Tổng quan BMI/BMR/TDEE
    ├── profile.html            # Hồ sơ sức khỏe
    ├── tracker.html            # Theo dõi cân nặng
    ├── meal-log.html           # Nhật ký bữa ăn
    ├── meal-planner.html       # Lập thực đơn AI 7 ngày
    ├── chatbot.html            # Chatbot dinh dưỡng AI
    ├── weekly-report.html      # Báo cáo tuần
    ├── css/
    └── js/
```

## Tech stack

- **Frontend**: Vanilla HTML/CSS/JS (ES6+)
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL 17
- **AI**: Google Gemini 2.5 Flash Lite
- **Auth**: JWT (7 ngày)
- **Container**: Docker + Docker Compose
