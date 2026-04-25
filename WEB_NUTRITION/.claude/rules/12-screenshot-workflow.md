---
description: Quy trình bắt buộc chụp screenshot và so sánh design sau mỗi thay đổi lớn.
---

# Screenshot & Design Comparison Workflow

## Khi nào BẮT BUỘC chụp screenshot

- Hoàn thành build 1 section mới
- Thay đổi layout/spacing đáng kể
- Cập nhật color scheme hoặc typography
- Thêm/sửa animation lớn
- Responsive breakpoint adjustment

## Quy trình

```
1. CODE thay đổi
        ↓
2. CHỤP screenshot (command bên dưới)
        ↓
3. SO SÁNH với design reference (inspiration_sm.png)
        ↓
4. CHECKLIST: Vi phạm design rules không?
        ↓
5. FIX nếu có vấn đề → lặp lại từ bước 2
        ↓
6. COMMIT nếu đạt
```

## Lệnh chụp screenshot (server đang chạy ở port 8099)

```bash
# Desktop 1440px
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new \
  --screenshot=screenshots/$(date +%Y%m%d_%H%M)_desktop.png \
  --window-size=1440,900 \
  --hide-scrollbars \
  --virtual-time-budget=3000 \
  "http://localhost:8099/"

# Mobile 390px
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new \
  --screenshot=screenshots/$(date +%Y%m%d_%H%M)_mobile.png \
  --window-size=390,844 \
  --hide-scrollbars \
  --virtual-time-budget=3000 \
  "http://localhost:8099/"
```

## Checklist so sánh

**Layout & Spacing:**

- [ ] Negative space đủ rộng? (không "chật")
- [ ] Typography đủ lớn, táo bạo ở hero/headers?
- [ ] Bố cục bất đối xứng đúng style?

**Màu sắc:**

- [ ] Nền đúng `--color-cream` hay `--color-forest` theo section?
- [ ] Không có xanh dương/tím lọt vào?

**Typography:**

- [ ] Đúng font Playfair Display / DM Sans?
- [ ] Hero headline đủ lớn?
- [ ] Có italic cho từ nhấn mạnh?

**Animation:**

- [ ] Tất cả sections animate khi scroll?
- [ ] Stagger delay hoạt động đúng?

**Responsive:**

- [ ] Desktop 1440px ✓
- [ ] Tablet 768px ✓
- [ ] Mobile 390px ✓

## Lưu trữ

```
screenshots/
├── reference/
│   └── inspiration_sm.png   ← Ảnh gốc Koox để so sánh
└── YYYYMMDD_HHMM_desktop.png
```
