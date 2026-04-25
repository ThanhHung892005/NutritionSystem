---
description: Tổng quan dự án NutritionSystem — mục tiêu, đối tượng, triết lý thiết kế. Đọc trước khi làm bất kỳ task nào.
---

# NutritionSystem — Tổng quan dự án

**Tên sản phẩm**: NutritionSystem  
**Loại**: Marketing / Landing website (giới thiệu dịch vụ AI dinh dưỡng)  
**Mục tiêu**: Truyền đạt sự tin tưởng, khoa học, và cảm giác cá nhân hóa của hệ thống AI gợi ý thực đơn  
**Đối tượng**: Người dùng cuối quan tâm sức khỏe, các tổ chức y tế, chuyên gia dinh dưỡng

## Triết lý thiết kế: "Organic Intelligence"

Kết hợp sự ấm áp hữu cơ của thực phẩm tự nhiên với độ chính xác lạnh lùng của AI. Tối giản nhưng không vô hồn. Khoa học nhưng không xa cách.

Lấy cảm hứng từ phong cách editorial của các website food/lifestyle cao cấp:

- Typography lớn, táo bạo — chiếm không gian mạnh mẽ
- Bố cục bất đối xứng, negative space rộng
- Kết hợp illustration hữu cơ với data visualization sạch
- Màu sắc lấy từ thiên nhiên: lá cây, đất, kem, xanh rêu
  **Nên làm:**

Chạy /init trước – bất cứ khi nào làm việc với folder mới

Dùng bullet points và headings ngắn – viết theo kiểu mật độ thông tin cao

Đặt những guardrail quan trọng nhất lên ĐẦU file

Commit CLAUDE.md gốc vào git – đây là file cấu hình quan trọng, cần version control như code thực sự

Định kỳ review và tỉa bớt – CLAUDE.md là tài liệu sống, không phải viết một lần rồi quên

**Không nên làm:**

Dump nguyên style guide hay API docs vào – quá dài, Claude đọc không hiệu quả

Dùng @-include file lớn trừ khi thực sự cần thiết – mỗi lần include là tốn thêm token

Viết rule mơ hồ kiểu 'hãy viết code tốt' – rule phải cụ thể, đo lường được

Để file dài hơn 500 dòng mà không tách ra – lúc đó dùng /rules folder
