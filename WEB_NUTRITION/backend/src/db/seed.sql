-- Seed data cho NutritionSystem
-- Chạy sau schema.sql: psql -U postgres -d nutrition_system -f src/db/seed.sql

-- Thực phẩm mẫu (kcal/100g)
INSERT INTO foods (name, name_en, calories, protein_g, carbs_g, fat_g, fiber_g, gi_index,
                   ok_diabetes, ok_hypertension, ok_gout, ok_kidney, ok_celiac)
VALUES
  ('Gạo trắng',        'White rice',       130, 2.7,  28.2, 0.3, 0.4,  72,  FALSE, TRUE,  TRUE,  FALSE, TRUE),
  ('Gạo lứt',          'Brown rice',       111, 2.6,  23.0, 0.9, 1.8,  55,  TRUE,  TRUE,  TRUE,  FALSE, TRUE),
  ('Ức gà luộc',       'Boiled chicken',   165, 31.0,  0.0, 3.6, 0.0,   0,  TRUE,  TRUE,  FALSE, TRUE,  TRUE),
  ('Cá hồi',           'Salmon',           208, 20.0,  0.0,13.0, 0.0,   0,  TRUE,  TRUE,  FALSE, TRUE,  TRUE),
  ('Đậu hũ',           'Tofu',              76,  8.0,  1.9, 4.8, 0.3,   0,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE),
  ('Rau muống luộc',   'Water spinach',     19,  2.6,  1.8, 0.2, 2.1,   0,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE),
  ('Bông cải xanh',    'Broccoli',          34,  2.8,  6.6, 0.4, 2.6,  10,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE),
  ('Khoai lang',       'Sweet potato',      86,  1.6, 20.1, 0.1, 3.0,  54,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE),
  ('Chuối',            'Banana',            89,  1.1, 22.8, 0.3, 2.6,  51,  FALSE, TRUE,  TRUE,  TRUE,  TRUE),
  ('Táo',              'Apple',             52,  0.3, 13.8, 0.2, 2.4,  36,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE),
  ('Trứng gà',         'Chicken egg',      155,  13.0, 1.1,11.0, 0.0,   0,  TRUE,  FALSE, FALSE, TRUE,  TRUE),
  ('Sữa chua không đường', 'Plain yogurt',  59,  10.0, 3.6, 0.4, 0.0,  35,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE),
  ('Yến mạch',         'Oatmeal',          389,  17.0,66.0, 7.0,10.0,  55,  TRUE,  TRUE,  TRUE,  FALSE, FALSE),
  ('Bánh mì nguyên cám', 'Whole wheat bread', 247, 13.0,41.0, 4.2, 7.0, 51, TRUE, TRUE,  TRUE,  FALSE, FALSE),
  ('Dầu ô liu',        'Olive oil',        884,   0.0,  0.0,100.0,0.0,  0,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE);

-- ============================================================
-- 100 thực phẩm Việt Nam bổ sung (2026-04-25)
-- Giá trị dinh dưỡng tính trên 100g
-- ============================================================

INSERT INTO foods (name, name_en, calories, protein_g, carbs_g, fat_g, fiber_g, gi_index,
                   ok_diabetes, ok_hypertension, ok_gout, ok_kidney, ok_celiac)
VALUES
-- === TINH BỘT & NGŨ CỐC (10) ===
  ('Bún tươi',             'Rice vermicelli',           109,  2.5, 25.2,  0.2,  0.3,  65,  FALSE, TRUE,  TRUE,  TRUE,  TRUE),
  ('Bánh phở',             'Pho noodles',               108,  2.4, 24.8,  0.2,  0.2,  67,  FALSE, TRUE,  TRUE,  TRUE,  TRUE),
  ('Mì trứng khô',         'Dry egg noodles',           358, 13.0, 67.0,  4.5,  2.5,  55,  TRUE,  TRUE,  TRUE,  FALSE, FALSE),
  ('Bánh mì trắng',        'White bread',               265,  8.0, 50.0,  3.2,  2.0,  75,  FALSE, TRUE,  TRUE,  FALSE, FALSE),
  ('Khoai tây',            'Potato',                     77,  2.0, 17.0,  0.1,  2.2,  70,  FALSE, TRUE,  TRUE,  FALSE, TRUE),
  ('Ngô (bắp)',            'Corn',                       96,  3.4, 21.0,  1.5,  2.4,  52,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE),
  ('Sắn/Khoai mì',         'Cassava',                   160,  1.4, 38.1,  0.3,  1.8,  65,  FALSE, TRUE,  TRUE,  TRUE,  TRUE),
  ('Miến dong',            'Glass noodles',             351,  0.1, 86.1,  0.1,  0.5,  65,  FALSE, TRUE,  TRUE,  TRUE,  TRUE),
  ('Khoai môn',            'Taro',                      112,  1.5, 26.5,  0.2,  4.1,  55,  TRUE,  TRUE,  TRUE,  FALSE, TRUE),
  ('Bánh chưng',           'Sticky rice cake',          175,  5.8, 29.0,  4.2,  1.0,  65,  FALSE, TRUE,  TRUE,  FALSE, TRUE),

-- === THỊT & GIA CẦM (14) ===
  ('Thịt lợn nạc',         'Lean pork',                 143, 21.5,  0.0,  6.0,  0.0,   0,  TRUE,  TRUE,  FALSE, TRUE,  TRUE),
  ('Thịt bò',              'Beef',                      250, 26.0,  0.0, 15.0,  0.0,   0,  TRUE,  TRUE,  FALSE, TRUE,  TRUE),
  ('Sườn lợn',             'Pork ribs',                 278, 18.0,  0.0, 22.5,  0.0,   0,  TRUE,  TRUE,  FALSE, TRUE,  TRUE),
  ('Thịt gà đùi',          'Chicken thigh',             209, 18.0,  0.0, 15.0,  0.0,   0,  TRUE,  TRUE,  FALSE, TRUE,  TRUE),
  ('Thịt vịt',             'Duck meat',                 337, 19.0,  0.0, 28.0,  0.0,   0,  TRUE,  TRUE,  FALSE, TRUE,  TRUE),
  ('Thịt dê',              'Goat meat',                 143, 27.0,  0.0,  3.0,  0.0,   0,  TRUE,  TRUE,  FALSE, TRUE,  TRUE),
  ('Gan lợn',              'Pork liver',                134, 20.6,  3.8,  3.7,  0.0,   0,  TRUE,  FALSE, FALSE, FALSE, TRUE),
  ('Tim lợn',              'Pork heart',                119, 17.1,  1.3,  4.8,  0.0,   0,  TRUE,  TRUE,  FALSE, TRUE,  TRUE),
  ('Lòng lợn',             'Pork intestine',            166,  9.5,  1.0, 14.0,  0.0,   0,  TRUE,  FALSE, FALSE, TRUE,  TRUE),
  ('Xúc xích',             'Pork sausage',              301, 12.0,  3.5, 27.0,  0.0,   0,  TRUE,  FALSE, FALSE, TRUE,  TRUE),
  ('Thịt heo quay',        'Roast pork',                305, 20.0,  8.0, 22.0,  0.0,   0,  TRUE,  FALSE, FALSE, TRUE,  TRUE),
  ('Thịt bò khô',          'Dried beef jerky',          350, 55.0,  8.0, 11.0,  0.0,   0,  TRUE,  FALSE, FALSE, TRUE,  TRUE),
  ('Chả lụa',              'Vietnamese pork roll',      185, 15.5,  4.0, 12.0,  0.0,   0,  TRUE,  FALSE, FALSE, TRUE,  TRUE),
  ('Thịt gà xé',           'Shredded chicken',          170, 32.0,  0.0,  4.5,  0.0,   0,  TRUE,  TRUE,  FALSE, TRUE,  TRUE),

-- === HẢI SẢN (14) ===
  ('Cá tra',               'Pangasius',                 102, 16.0,  0.0,  4.0,  0.0,   0,  TRUE,  TRUE,  FALSE, TRUE,  TRUE),
  ('Cá thu',               'Mackerel',                  205, 19.0,  0.0, 13.5,  0.0,   0,  TRUE,  TRUE,  FALSE, TRUE,  TRUE),
  ('Cá ngừ',               'Tuna',                      144, 23.0,  0.0,  5.0,  0.0,   0,  TRUE,  TRUE,  FALSE, TRUE,  TRUE),
  ('Cá rô phi',            'Tilapia',                    96, 20.0,  0.0,  1.7,  0.0,   0,  TRUE,  TRUE,  FALSE, TRUE,  TRUE),
  ('Cá chép',              'Carp',                      127, 17.8,  0.0,  5.6,  0.0,   0,  TRUE,  TRUE,  FALSE, TRUE,  TRUE),
  ('Tôm sú',               'Black tiger shrimp',         99, 18.1,  1.0,  2.2,  0.0,   0,  TRUE,  TRUE,  FALSE, TRUE,  TRUE),
  ('Tôm thẻ',              'White shrimp',               85, 18.0,  0.0,  1.0,  0.0,   0,  TRUE,  TRUE,  FALSE, TRUE,  TRUE),
  ('Mực ống',              'Squid',                      92, 15.6,  3.1,  1.4,  0.0,   0,  TRUE,  TRUE,  FALSE, TRUE,  TRUE),
  ('Cua biển',             'Sea crab',                   87, 18.1,  0.0,  1.1,  0.0,   0,  TRUE,  TRUE,  FALSE, TRUE,  TRUE),
  ('Sò huyết',             'Blood cockle',               74, 11.6,  4.7,  0.9,  0.0,   0,  TRUE,  TRUE,  FALSE, TRUE,  TRUE),
  ('Hàu',                  'Oyster',                     68,  7.1,  4.3,  2.5,  0.0,   0,  TRUE,  TRUE,  FALSE, TRUE,  TRUE),
  ('Cá cơm khô',           'Dried anchovy',             295, 59.0,  0.0,  5.5,  0.0,   0,  TRUE,  FALSE, FALSE, FALSE, TRUE),
  ('Cá mòi hộp',           'Canned sardine',            208, 24.6,  0.0, 11.5,  0.0,   0,  TRUE,  FALSE, FALSE, TRUE,  TRUE),
  ('Tôm khô',              'Dried shrimp',              298, 62.0,  0.0,  2.9,  0.0,   0,  TRUE,  FALSE, FALSE, FALSE, TRUE),

-- === RAU CỦ (18) ===
  ('Cải thảo',             'Napa cabbage',               16,  1.2,  3.2,  0.2,  1.2,  10,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE),
  ('Cải xanh',             'Mustard greens',             27,  2.7,  4.3,  0.4,  2.0,  10,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE),
  ('Rau cải ngọt',         'Bok choy',                   13,  1.5,  2.2,  0.2,  1.0,  10,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE),
  ('Mướp đắng',            'Bitter melon',               17,  1.0,  3.7,  0.2,  2.8,  15,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE),
  ('Bầu',                  'Bottle gourd',               14,  0.6,  3.4,  0.0,  0.5,  15,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE),
  ('Bí đỏ',                'Pumpkin',                    26,  1.0,  6.5,  0.1,  0.5,  65,  FALSE, TRUE,  TRUE,  TRUE,  TRUE),
  ('Cà chua',              'Tomato',                     18,  0.9,  3.9,  0.2,  1.2,  15,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE),
  ('Cà rốt',               'Carrot',                     41,  0.9,  9.6,  0.2,  2.8,  47,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE),
  ('Đậu cô ve',            'Green beans',                31,  1.8,  7.1,  0.1,  2.7,  30,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE),
  ('Đậu Hà Lan',           'Green peas',                 81,  5.4, 14.5,  0.4,  5.7,  51,  TRUE,  TRUE,  TRUE,  FALSE, TRUE),
  ('Giá đỗ',               'Bean sprouts',               30,  3.0,  5.9,  0.2,  1.8,  25,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE),
  ('Hành tây',             'Onion',                      40,  1.1,  9.3,  0.1,  1.7,  10,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE),
  ('Tỏi',                  'Garlic',                    149,  6.4, 33.1,  0.5,  2.1,  30,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE),
  ('Gừng',                 'Ginger',                     80,  1.8, 17.8,  0.8,  2.0,  25,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE),
  ('Rau húng quế',         'Thai basil',                 23,  3.2,  2.7,  0.6,  1.6,   0,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE),
  ('Rau ngò rí',           'Cilantro',                   23,  2.1,  3.7,  0.5,  2.8,   0,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE),
  ('Nấm rơm',              'Straw mushroom',             22,  2.1,  3.5,  0.3,  1.2,  15,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE),
  ('Nấm hương',            'Shiitake mushroom',          34,  2.2,  6.8,  0.5,  2.5,  15,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE),

-- === TRÁI CÂY (12) ===
  ('Xoài',                 'Mango',                      65,  0.5, 17.0,  0.3,  1.8,  56,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE),
  ('Ổi',                   'Guava',                      68,  2.6, 14.3,  1.0,  5.4,  12,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE),
  ('Đu đủ',                'Papaya',                     43,  0.5, 11.0,  0.3,  1.7,  59,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE),
  ('Dưa hấu',              'Watermelon',                 30,  0.6,  7.6,  0.2,  0.4,  72,  FALSE, TRUE,  TRUE,  TRUE,  TRUE),
  ('Dứa',                  'Pineapple',                  50,  0.5, 13.1,  0.1,  1.4,  66,  FALSE, TRUE,  TRUE,  TRUE,  TRUE),
  ('Cam',                  'Orange',                     47,  0.9, 11.8,  0.1,  2.4,  40,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE),
  ('Bưởi',                 'Pomelo',                     38,  0.8,  9.6,  0.1,  1.0,  25,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE),
  ('Thanh long',           'Dragon fruit',               60,  1.2, 13.2,  0.4,  3.0,  50,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE),
  ('Nhãn',                 'Longan',                     60,  1.3, 15.1,  0.1,  1.1,  52,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE),
  ('Vải',                  'Lychee',                     66,  0.8, 16.5,  0.4,  1.3,  57,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE),
  ('Sầu riêng',            'Durian',                    147,  1.5, 27.1,  5.3,  3.8,  49,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE),
  ('Bơ (quả)',             'Avocado',                   160,  2.0,  8.5, 14.7,  6.7,  15,  TRUE,  TRUE,  TRUE,  FALSE, TRUE),

-- === LEGUMES & ĐẬU (6) ===
  ('Đậu đen',              'Black bean',                341, 21.6, 62.4,  1.4, 15.5,  35,  TRUE,  TRUE,  TRUE,  FALSE, TRUE),
  ('Đậu xanh',             'Mung bean',                 347, 23.9, 62.6,  1.2, 16.3,  25,  TRUE,  TRUE,  TRUE,  FALSE, TRUE),
  ('Đậu đỏ',               'Red kidney bean',           333, 22.5, 60.0,  0.8, 15.2,  29,  TRUE,  TRUE,  TRUE,  FALSE, TRUE),
  ('Đậu phộng',            'Peanut',                    567, 25.8, 16.1, 49.2,  8.5,  14,  TRUE,  TRUE,  FALSE, FALSE, TRUE),
  ('Sữa đậu nành',         'Soy milk',                   54,  3.3,  6.3,  1.8,  0.0,  30,  TRUE,  TRUE,  TRUE,  FALSE, TRUE),
  ('Tương đậu nành',       'Soy sauce',                  60, 10.5,  5.6,  0.1,  0.8,   0,  TRUE,  FALSE, TRUE,  TRUE,  TRUE),

-- === SỮA & TRỨNG (5) ===
  ('Sữa tươi nguyên kem',  'Whole milk',                 61,  3.2,  4.8,  3.3,  0.0,  27,  TRUE,  TRUE,  TRUE,  FALSE, TRUE),
  ('Sữa đặc có đường',     'Sweetened condensed milk',  321,  8.1, 54.4,  8.7,  0.0,  61,  FALSE, TRUE,  TRUE,  FALSE, TRUE),
  ('Phô mai',              'Processed cheese',           371, 22.0,  2.6, 30.0,  0.0,   0,  TRUE,  FALSE, FALSE, FALSE, TRUE),
  ('Bơ động vật',          'Butter',                    717,  0.9,  0.1, 81.1,  0.0,   0,  TRUE,  FALSE, TRUE,  TRUE,  TRUE),
  ('Trứng vịt',            'Duck egg',                  185, 13.0,  1.5, 14.0,  0.0,   0,  TRUE,  FALSE, FALSE, TRUE,  TRUE),

-- === HẠT & DẦU (6) ===
  ('Hạt điều',             'Cashew nut',                553, 18.2, 30.2, 43.8,  3.3,  25,  TRUE,  TRUE,  FALSE, FALSE, TRUE),
  ('Hạt mè',               'Sesame seed',               573, 17.7, 23.5, 49.7, 11.8,  35,  TRUE,  TRUE,  TRUE,  FALSE, TRUE),
  ('Hạt bí',               'Pumpkin seed',              559, 30.2, 10.7, 49.1,  6.0,  25,  TRUE,  TRUE,  FALSE, FALSE, TRUE),
  ('Hạt dưa',              'Watermelon seed',           600, 28.3, 15.3, 47.4,  0.0,   0,  TRUE,  TRUE,  FALSE, FALSE, TRUE),
  ('Cùi dừa',              'Coconut meat',              354,  3.3, 15.2, 33.5,  9.0,  45,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE),
  ('Nước dừa',             'Coconut water',              19,  0.7,  3.7,  0.2,  1.1,  45,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE),

-- === GIA VỊ & DẦU ĂN (7) ===
  ('Nước mắm',             'Fish sauce',                 35,  5.5,  3.5,  0.0,  0.0,   0,  TRUE,  FALSE, TRUE,  TRUE,  TRUE),
  ('Dầu hào',              'Oyster sauce',               51,  0.9, 10.7,  0.5,  0.4,   0,  TRUE,  FALSE, TRUE,  TRUE,  TRUE),
  ('Tương ớt',             'Chili sauce',                44,  0.8,  9.4,  0.3,  0.6,   0,  TRUE,  FALSE, TRUE,  TRUE,  TRUE),
  ('Dầu mè',               'Sesame oil',                884,  0.0,  0.0,100.0,  0.0,   0,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE),
  ('Dầu dừa',              'Coconut oil',               862,  0.0,  0.0,100.0,  0.0,   0,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE),
  ('Đường mía',            'Cane sugar',                387,  0.0,100.0,  0.0,  0.0,  70,  FALSE, TRUE,  TRUE,  TRUE,  TRUE),
  ('Mật ong',              'Honey',                     304,  0.3, 82.4,  0.0,  0.2,  55,  FALSE, TRUE,  TRUE,  TRUE,  TRUE),

-- === MÓN ĂN VIỆT NAM (8) ===
  ('Phở bò',               'Beef pho',                   75,  5.5,  9.8,  1.5,  0.4,  45,  TRUE,  FALSE, FALSE, TRUE,  TRUE),
  ('Bún bò Huế',           'Hue beef noodle soup',       90,  5.8, 11.5,  2.3,  0.5,  45,  TRUE,  FALSE, FALSE, TRUE,  TRUE),
  ('Cơm tấm',              'Broken rice with pork',     175,  8.5, 26.5,  4.5,  0.8,  60,  FALSE, FALSE, FALSE, TRUE,  TRUE),
  ('Bánh xèo',             'Vietnamese sizzling crepe', 185,  5.2, 21.0,  9.5,  1.0,  55,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE),
  ('Gỏi cuốn',             'Fresh spring roll',         120,  6.5, 16.0,  3.0,  1.5,  45,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE),
  ('Chả giò',              'Fried spring roll',         248,  7.5, 23.0, 14.0,  1.5,  55,  TRUE,  TRUE,  TRUE,  TRUE,  TRUE),
  ('Canh chua cá',         'Vietnamese sour fish soup',  55,  5.0,  5.5,  1.5,  0.8,  20,  TRUE,  FALSE, FALSE, TRUE,  TRUE),
  ('Cháo trắng',           'Plain rice congee',          48,  1.2, 10.5,  0.1,  0.3,  68,  FALSE, TRUE,  TRUE,  TRUE,  TRUE);
