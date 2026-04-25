# NutritionSystem

Web app AI dinh dưỡng cá nhân hóa cho người dùng Việt Nam. Phân tích hồ sơ sức khỏe, lập thực đơn 7 ngày bằng AI, theo dõi cân nặng & calo hàng ngày.

## Yêu cầu

- Node.js ≥ 18
- PostgreSQL 17
- Google Gemini API key (free tier)

## Cài đặt

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

# 4. Khởi tạo database
npm run db:init
npm run db:seed   # (tùy chọn) seed dữ liệu mẫu

# 5. Chạy backend (port 3001)
npm run dev
```

Mở `frontend/index.html` hoặc serve thư mục `frontend/` qua bất kỳ static server nào (port 8099):

```bash
# Ví dụ dùng npx serve
npx serve frontend -l 8099
```

## Biến môi trường (`backend/.env`)

| Biến             | Mô tả                                                   |
| ---------------- | ------------------------------------------------------- |
| `PORT`           | Port backend (mặc định: 3001)                           |
| `DB_HOST`        | PostgreSQL host                                         |
| `DB_PORT`        | PostgreSQL port (mặc định: 5432)                        |
| `DB_NAME`        | Tên database                                            |
| `DB_USER`        | PostgreSQL user                                         |
| `DB_PASSWORD`    | PostgreSQL password                                     |
| `JWT_SECRET`     | Secret key cho JWT (dùng chuỗi ngẫu nhiên dài)          |
| `JWT_EXPIRES_IN` | Thời hạn token (mặc định: 7d)                           |
| `FRONTEND_URL`   | URL frontend cho CORS (mặc định: http://localhost:8099) |
| `GEMINI_API_KEY` | Google Gemini API key                                   |

## Cấu trúc dự án

```
WEB_NUTRITION/
├── backend/
│   ├── src/
│   │   ├── app.js              # Express entry point
│   │   ├── db/                 # Schema SQL, migrations
│   │   ├── middleware/         # Auth JWT
│   │   ├── modules/            # auth, nutrition, chatbot, meal-planner, reports...
│   │   └── routes/
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
