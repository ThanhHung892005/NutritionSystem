# CLAUDE.md — NutritionSystem

## Tổng quan

Web app AI dinh dưỡng cá nhân hóa cho người dùng Việt Nam. Backend Node.js/Express + PostgreSQL, frontend HTML/CSS/JS tĩnh, AI dùng Google Gemini.

---

## Cách chạy dự án

### Docker (khuyến nghị)

```bash
docker compose up -d        # Khởi động toàn bộ (db + backend + frontend)
docker compose down         # Dừng (giữ data)
docker compose down -v      # Dừng + xóa DB data
docker compose logs -f      # Xem logs realtime
```

### Local (không Docker)

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
npx serve frontend -l 8099

# Dừng
kill $(lsof -ti:3001) $(lsof -ti:8099)
```

### Ports

| Service  | URL                          | Ghi chú                                      |
| -------- | ---------------------------- | -------------------------------------------- |
| Frontend | http://localhost:8099        | nginx (Docker) hoặc npx serve (local)        |
| Backend  | http://localhost:3001/api/v1 | Express.js                                   |
| Database | localhost:**5433**           | Port 5433 vì 5432 bị PostgreSQL local chiếm |

> Nếu port 5432 trống, đổi `docker-compose.yml` về `"5432:5432"`.

---

## Các phase phát triển

### Phase 1 — Core (`schema.sql`)
Nền tảng hệ thống: xác thực, hồ sơ sức khỏe, thực phẩm, kế hoạch bữa ăn.

| Bảng              | Mô tả                                              |
| ----------------- | -------------------------------------------------- |
| `users`           | Tài khoản người dùng (email, password hash, tên)   |
| `health_profiles` | Hồ sơ sức khỏe: tuổi, giới, cân nặng, chiều cao, bệnh lý, BMI/BMR/TDEE |
| `weight_logs`     | Nhật ký cân nặng theo thời gian                    |
| `foods`           | Danh mục thực phẩm (tên, calo, macro)              |
| `meal_plans`      | Kế hoạch bữa ăn 7 ngày do AI tạo                  |

### Phase 2 — Meal Logging (`migration_phase2.sql`)
Ghi lại bữa ăn thực tế hàng ngày.

| Bảng        | Mô tả                                               |
| ----------- | --------------------------------------------------- |
| `meal_logs` | Nhật ký bữa ăn: food_id, khẩu phần, calo, meal_type (sáng/trưa/tối/phụ) |

### Phase 3 — Chatbot (`migration_chat_history.sql`)
Lưu lịch sử hội thoại AI.

| Bảng            | Mô tả                                           |
| --------------- | ----------------------------------------------- |
| `chat_messages` | Lịch sử chat: role (user/assistant), content, timestamp |

### Phase 4 — Foods Data (`migration_foods.sql`)
Seed 100 thực phẩm Việt Nam vào database. Idempotent (bỏ qua nếu đã tồn tại).

---

## Chức năng dự án

### 1. Xác thực (`/api/v1/auth`)
| Method | Endpoint    | Mô tả             |
| ------ | ----------- | ----------------- |
| POST   | `/register` | Đăng ký tài khoản |
| POST   | `/login`    | Đăng nhập, trả JWT |

### 2. Hồ sơ sức khỏe (`/api/v1/nutrition`)
| Method | Endpoint     | Mô tả                                           |
| ------ | ------------ | ----------------------------------------------- |
| GET    | `/`          | Lấy hồ sơ sức khỏe của user                    |
| POST   | `/`          | Tạo / cập nhật hồ sơ (tuổi, cân, chiều cao, bệnh lý...) |
| GET    | `/calculate` | Tính BMI, BMR, TDEE từ hồ sơ hiện tại          |

### 3. Theo dõi cân nặng (`/api/v1/weight`)
| Method | Endpoint | Mô tả                          |
| ------ | -------- | ------------------------------ |
| GET    | `/`      | Lịch sử cân nặng               |
| POST   | `/`      | Thêm bản ghi cân nặng mới      |
| DELETE | `/:id`   | Xoá bản ghi                    |

### 4. Thực phẩm (`/api/v1/foods`)
| Method | Endpoint | Mô tả                                     |
| ------ | -------- | ----------------------------------------- |
| GET    | `/`      | Danh sách thực phẩm (hỗ trợ tìm kiếm, phân trang) |

### 5. Kế hoạch bữa ăn AI (`/api/v1/meal-plans`)
| Method | Endpoint    | Mô tả                                          |
| ------ | ----------- | ---------------------------------------------- |
| GET    | `/`         | Lấy kế hoạch bữa ăn hiện tại                  |
| POST   | `/generate` | Gọi Gemini AI tạo thực đơn 7 ngày cá nhân hóa |

### 6. Nhật ký bữa ăn (`/api/v1/meal-logs`)
| Method | Endpoint | Mô tả                             |
| ------ | -------- | --------------------------------- |
| GET    | `/`      | Nhật ký bữa ăn (filter theo ngày) |
| POST   | `/`      | Ghi bữa ăn mới                    |
| DELETE | `/:id`   | Xoá bản ghi                       |

### 7. Chatbot dinh dưỡng AI (`/api/v1/chatbot`)
| Method | Endpoint   | Mô tả                                    |
| ------ | ---------- | ---------------------------------------- |
| POST   | `/`        | Gửi tin nhắn, nhận phản hồi từ Gemini AI |
| GET    | `/history` | Lấy lịch sử hội thoại                   |
| DELETE | `/history` | Xoá toàn bộ lịch sử chat                |

### 8. Báo cáo tuần (`/api/v1/reports`)
| Method | Endpoint  | Mô tả                                             |
| ------ | --------- | ------------------------------------------------- |
| GET    | `/weekly` | Tổng hợp calo, macro, tiến trình cân nặng 7 ngày |

---

## Cấu trúc

```
WEB_NUTRITION/
├── docker-compose.yml              # 3 services: db + backend + frontend
├── nginx.conf                      # nginx config: try_files hỗ trợ URL không có .html
├── .env                            # DB_PASSWORD cho docker-compose
├── backend/
│   ├── Dockerfile
│   ├── .env                        # Cấu hình DB, JWT, Gemini API key
│   └── src/
│       ├── app.js                  # Express entry point, port 3001
│       ├── db/
│       │   ├── schema.sql          # Phase 1: users, health_profiles, weight_logs, foods, meal_plans
│       │   ├── migration_phase2.sql    # Phase 2: meal_logs
│       │   ├── migration_chat_history.sql  # Phase 3: chat_messages
│       │   ├── migration_foods.sql     # Phase 4: 100 thực phẩm Việt Nam
│       │   └── seed.sql            # Dữ liệu mẫu users + health profiles
│       ├── middleware/             # JWT auth (requireAuth)
│       └── modules/
│           ├── auth/               # Đăng ký / đăng nhập
│           ├── nutrition/          # Hồ sơ sức khỏe, BMI/BMR/TDEE
│           ├── weight/             # Nhật ký cân nặng
│           ├── foods/              # Danh mục thực phẩm
│           ├── meal-plans/         # Tạo thực đơn AI 7 ngày
│           ├── meal-logs/          # Nhật ký bữa ăn hàng ngày
│           ├── chatbot/            # Chat dinh dưỡng AI (Gemini)
│           └── reports/            # Báo cáo tuần
└── frontend/
    ├── index.html                  # Landing page
    ├── auth.html                   # Đăng nhập / đăng ký
    ├── dashboard.html              # Tổng quan BMI/BMR/TDEE
    ├── profile.html                # Hồ sơ sức khỏe
    ├── tracker.html                # Theo dõi cân nặng
    ├── meal-log.html               # Nhật ký bữa ăn
    ├── meal-planner.html           # Lập thực đơn AI 7 ngày
    ├── chatbot.html                # Chatbot dinh dưỡng AI
    ├── weekly-report.html          # Báo cáo tuần
    ├── css/
    └── js/
        └── api.js                  # API_BASE = "http://localhost:3001/api/v1"
```

---

## Tech stack

- **Frontend**: Vanilla HTML/CSS/JS — không có build step, sửa và reload trực tiếp
- **Backend**: Node.js 18 + Express.js, `nodemon` tự reload khi sửa file
- **Database**: PostgreSQL 17
- **AI**: Google Gemini 2.5 Flash Lite (`GEMINI_API_KEY` trong `.env`)
- **Auth**: JWT, expire 7 ngày
- **Container**: Docker + Docker Compose (3 services: db, backend, frontend)

---

## Biến môi trường (`backend/.env`)

| Biến             | Giá trị             | Ghi chú               |
| ---------------- | ------------------- | --------------------- |
| `PORT`           | `3001`              |                       |
| `DB_HOST`        | `db` (auto Docker)  | Docker ghi đè tự động |
| `DB_PASSWORD`    | `892005`            |                       |
| `JWT_SECRET`     | *(đã set)*          | Đổi trước khi deploy  |
| `GEMINI_API_KEY` | *(đã set)*          |                       |
| `FRONTEND_URL`   | `http://localhost:8099` | Dùng cho CORS     |

> Root `.env` (cạnh `docker-compose.yml`) chứa `DB_PASSWORD=892005` để Docker Compose truyền đúng password vào PostgreSQL container.

---

## Lưu ý phát triển

- Frontend gọi API qua `http://localhost:3001` hardcode trong `frontend/js/api.js` — đổi port backend thì cập nhật file này.
- `nginx.conf` dùng `try_files $uri $uri.html` — URL `/dashboard` tự resolve thành `dashboard.html`.
- Reset hoàn toàn DB: `docker compose down -v && docker compose up -d`
- Thứ tự SQL init: `01_schema` → `02_migration_phase2` → `03_migration_chat_history` → `04_seed` → `05_migration_foods`
