---
description: Cấu trúc và nội dung từng section của trang. Tham khảo khi build hoặc sửa sections.
globs: ["**/*.html"]
---

# Cấu trúc trang & Sections

## Nav

```
[ Logo NUTRITION·AI ]   [ Tính năng  Cách hoạt động  Bệnh lý  Kết quả ]   [ Đăng nhập ]  [ Bắt đầu → ]
```

- Sticky, `backdrop-blur` khi scroll
- Logo: wordmark chữ, không dùng icon
- Mobile: hamburger → full-screen overlay
- Active section: underline animation

## Hero

- Layout: full viewport, bất đối xứng — text trái (~42%), visual phải (~58%)
- Nền: `--color-cream`
- Illustration SVG hữu cơ (trái cây, rau củ, lá) — lớn, tràn ra ngoài blob
- Floating badges: calo hôm nay + độ chính xác AI
- Scroll hint ở bottom left

## Stats Bar

```
10.000+     98%      3×      15+
Người dùng  Chính xác  Nhanh hơn  Quy tắc dinh dưỡng
```

Nền `--color-forest`, text trắng/mint, countUp animation.

## Core Features (3 tính năng)

Layout alternating (text trái/phải xen kẽ):

1. **AI Lập Thực Đơn** — gợi ý thực đơn cá nhân hóa
2. **Hồ Sơ Sức Khỏe** — BMI/BMR/TDEE, theo dõi tiến độ
3. **Chatbot Dinh Dưỡng AI** — tư vấn theo context thực

Mỗi feature: số thứ tự editorial (01/02/03), SVG visual, tags bệnh lý.

## How It Works (4 bước)

```
① Hồ sơ → ② Mục tiêu → ③ AI tạo kế hoạch → ④ Theo dõi
```

Nền `--color-linen`, timeline ngang, stagger animation.

## Disease & Condition Support

Grid 7 bệnh lý: Tiểu đường Type 2, Tăng huyết áp, Tim mạch, Gout, Bệnh thận, Béo phì, Celiac.  
Cards hover: đổi sang nền `--color-forest`.

## Data Preview

3 cards dữ liệu thực:

- Biểu đồ giảm cân (8 tuần)
- Chat log demo
- Thực đơn mẫu một ngày

Dùng `--font-mono` cho số liệu.

## Footer

```
NUTRITION·AI     Dịch vụ     Công ty     Liên hệ
© 2024           ...         ...         hello@nutritionsystem.ai
```

Nền `--color-ink`.
