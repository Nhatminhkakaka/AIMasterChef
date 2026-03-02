# 🗺️ Chức Năng Khám Phá Đặc Sản Vùng Miền

## Giới Thiệu
Chức năng "Khám Phá Đặc Sản Vùng Miền" là một tính năng tương tác và hấp dẫn giúp người dùng:
- 🗺️ Xem bản đồ Việt Nam tương tác với tất cả 64 tỉnh/thành phố, Hoàng Sa và Trường Sa
- 🍽️ Khám phá các đặc sản nổi tiếng của mỗi vùng
- 📍 Tìm hiểu thông tin chi tiết về mỗi tỉnh: mô tả, vị trí, các món ăn đặc sác
- ✨ Trải nghiệm hiệu ứng động mượt mà, phóng to/thu nhỏ khi di chuột

---

## 📁 Cấu Trúc File

```
app/
├── specialty/
│   └── page.tsx                 # Trang chính "Đặc sản vùng miền"
├── components/
│   └── RegionalMap.tsx          # Component bản đồ tương tác
├── lib/
│   └── provinces.ts             # Dữ liệu 64 tỉnh + đặc sản
└── components/
    └── Sidebar.tsx              # (Đã cập nhật) Thêm link "Đặc sản"
```

---

## ✨ Các Tính Năng

### 1️⃣ Bản Đồ Tương Tác (SVG)
- **Vẽ bằng SVG**: Hỗ trợ mọi độ phân giải màn hình, responsive 100%
- **Di Chuột (Hover)**: 
  - Tỉnh phóng to ~130% (scale: 1.3)
  - Màu thay đổi thành đỏ (#ff6b6b)
  - Hiển thị tên tỉnh (viết tắt)
  - Glow effect để tạo hiệu ứng tinh tế
  
- **Click (Select)**:
  - Tỉnh được chọn có màu vàng (#ffd93d)
  - Dữ liệu trong panel bên phải được cập nhật ngay lập tức

### 2️⃣ Panel Thông Tin Động
- **Hiển thị tên tỉnh**: Tên chính + tên in + vùng
- **Giới thiệu**: Mô tả ngắn gọn về tỉnh/thành
- **Đặc sản**: Danh sách các món ăn đặc sản với:
  - Tên món ăn
  - Mô tả chi tiết
  - Emoji đại diện (🍲, 🥭, 🦀, v.v...)
  - Hiệu ứng fade-in lần lượt
  
### 3️⃣ Dữ Liệu Chi Tiết
Mỗi tỉnh bao gồm:
```typescript
{
  id: string                  // Định danh duy nhất
  name: string               // Tên tỉnh
  printName: string          // Tên in chính thức
  shortName: string          // Viết tắt (2-3 ký tự)
  region: string             // Miền Bắc / Miền Trung / Miền Nam
  description: string        // Mô tả về tỉnh
  specialties: Specialty[]   // Danh sách đặc sản
  svgPath: string           // Đường vẽ SVG
  centerX: number           // Tọa độ X tâm
  centerY: number           // Tọa độ Y tâm
}
```

### 4️⃣ Thiết Kế Giao Diện
- **Gradient Colors**: Từ xanh dương → cam → đỏ
- **Dark Mode**: Hỗ trợ hoàn toàn với dark theme
- **Animations**:
  - Framer Motion cho smooth transitions
  - AnimatePresence cho mount/unmount effects
  - Stagger animations cho list items
  
- **Responsive Layout**:
  - Mobile: Bản đồ + panel xếp chồng
  - Tablet: Bản đồ nhỏ hơn, panel bên phải
  - Desktop: Layout tối ưu với 2 cột

### 5️⃣ Legend & Stats
- Hiển thị thống kê: 64 tỉnh, 100+ đặc sản, 3 miền, 2 quần đảo
- Logo màu sắc giải thích: Bình thường (xanh), Di chuột (đỏ), Đã chọn (vàng)

---

## 🚀 Cách Sử Dụng

### Cho Người Dùng
1. Click vào menu Sidebar → Chọn "🗺️ Đặc sản"
2. **Khám phá bản đồ**:
   - Di chuột qua các tỉnh để xem tên + thông tin
   - Click vào tỉnh yêu thích để xem chi tiết đặc sản
3. **Xem thông tin**:
   - Panel bên phải hiển thị: tên, mô tả, giới thiệu, danh sách đặc sản
   - Scroll để xem thêm nếu cần

### Cho Nhà Phát Triển
#### Import Component
```tsx
import RegionalMap from "app/components/RegionalMap"
import { provinces, Province } from "app/lib/provinces"

// Sử dụng
<RegionalMap />
```

#### Thêm Tỉnh Mới
1. Mở `app/lib/provinces.ts`
2. Thêm object tỉnh mới vào mảng `provinces`:
```typescript
{
  id: "ten-tinh", 
  name: "Tên Tỉnh",
  printName: "Tỉnh Tên Tinh",
  shortName: "TT",
  region: "Miền Bắc",
  description: "Mô tả...",
  specialties: [
    { name: "Tên đặc sản", description: "Mô tả", emoji: "🍽️" }
  ],
  svgPath: "M 100 100 Q 120 90 140 100 Q 130 120 100 115 Z",
  centerX: 120,
  centerY: 107,
}
```

#### Chỉnh Sửa Bản Đồ SVG
- Mỗi tỉnh là một `<path>` element trong SVG
- Thay đổi `svgPath` để vẽ lại hình dạng
- Điều chỉnh `centerX`, `centerY` để căn chỉnh text

#### Thêm Hiệu Ứng Mới
1. Sửa trong `RegionalMap.tsx`:
```tsx
<motion.path
  whileHover={{ scale: 1.3 }}  // Thay đổi scale
  whileTap={{ scale: 1.5 }}    // Thêm hiệu ứng click
  // ...
/>
```

---

## 🎨 Màu Sắc & Hiệu Ứng

### Màu Sắc Chính
- **Bình thường**: #4ecdc4 (Xanh dương)
- **Di chuột**: #ff6b6b (Đỏ)
- **Đã chọn**: #ffd93d (Vàng)
- **Biển**: Gradient xanh nhạt

### Hiệu Ứng
- **Zoom on Hover**: Scale 1.3
- **Glow**: Filter blur radius 4px
- **Fade-in**: Duration 0.2-0.3s
- **Stagger**: Delay 0.1s giữa các item

### Dark Mode
- Background: neutral-900/800
- Text: white/gray-300
- Border: neutral-800
- Tự động theo system preference

---

## 📊 Dữ Liệu Tỉnh/Thành

### Miền Bắc (13 tỉnh)
- Hà Nội, Hà Giang, Cao Bằng, Bắc Kạn, Lạng Sơn, Tuyên Quang, Thái Nguyên, Bắc Giang, Bắc Ninh, Phú Thọ, Quảng Ninh, Vĩnh Phúc, Yên Bái, Sơn La, Điện Biên, Lai Châu

### Miền Trung (17 tỉnh)
- Hòa Bình, Thanh Hóa, Nghệ An, Hà Tĩnh, Quảng Bình, Quảng Trị, Thừa Thiên-Huế, Đà Nẵng, Quảng Nam, Quảng Ngãi, Bình Định, Phú Yên, Khánh Hòa, Ninh Thuận, Bình Thuận

### Miền Nam (8 tỉnh)
- Đồng Nai, Bà Rịa-Vũng Tàu, Hồ Chí Minh, Tây Ninh, Long An, Tiền Giang, Bến Tre, Trà Vinh, Vĩnh Long, Cần Thơ, Đồng Tháp, An Giang, Kiên Giang, Cà Mau

### Quần Đảo (2)
- Hoàng Sa (Paracel Islands)
- Trường Sa (Spratly Islands)

---

## 🔧 Công Nghệ Sử Dụng

- **Next.js 13+**: Framework React hiện đại
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling responsive
- **Framer Motion**: Animations mượt mà
- **SVG**: Bản đồ vector scalable
- **Supabase**: Authentication (check user login)

---

## 🐛 Troubleshooting

### Bản đồ không hiển thị
- Kiểm tra `provinces.ts` có dữ liệu không
- Verify `svgPath` có giá trị

### Hover không hoạt động
- Kiểm tra `onMouseEnter` / `onMouseLeave` events
- Verify component mounted (useEffect)

### Panel biến mất
- Kiểm tra `AnimatePresence` wrapper
- Verify state `hoveredProvince` được cập nhật

### Dark mode không áp dụng
- Kiểm tra class `dark` có được set
- Verify Tailwind config có `darkMode: 'class'`

---

## 📈 Cải Tiến Trong Tương Lai

- 🔍 Thêm tính năng search/filter tỉnh
- 📸 Thêm ảnh chụp đặc sản từng tỉnh
- 🎥 Video giới thiệu cách nấu các đặc sản
- 🌐 Thêm webhook để cập nhật dữ liệu từ API
- 📍 Google Map integration hiển thị vị trí các nhà hàng đặc sán
- ⭐ Cho phép user rating/review đặc sản
- 📥 Export dữ liệu tỉnh thành PDF, Excel

---

## 👨‍💻 Author
Tạo bởi: **kmd - 2026**

Designed with ❤️ for Vietnamese food lovers!
