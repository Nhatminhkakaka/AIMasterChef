# 📖 Hướng Dẫn Chi Tiết Chức Năng "Đặc Sản Vùng Miền"

## 🎯 Tổng Quan

Chức năng "Khám Phá Đặc Sản Vùng Miền" được xây dựng với các component tái sử dụng, dữ liệu có cấu trúc, và hiệu ứng animation tinh tế.

---

## 📁 Cấu Trúc Dự Án

```
nextjs-dashboard/
├── app/
│   ├── specialty/
│   │   └── page.tsx                      # Trang chính
│   ├── components/
│   │   ├── RegionalMap.tsx               # Bản đồ SVG tương tác
│   │   ├── SpecialtyCard.tsx             # Card hiển thị chi tiết tỉnh
│   │   ├── SpecialtyExplorer.tsx         # Bộ tìm kiếm/filter
│   │   └── Sidebar.tsx                   # (Đã cập nhật)
│   └── lib/
│       └── provinces.ts                  # Dữ liệu 38 tỉnh + 2 quần đảo
└── SPECIALTY_FEATURE.md                  # Tài liệu tính năng
```

---

## 🔧 Component API

### 1. **RegionalMap**
Component bản đồ tương tác chính.

#### Props
```typescript
interface RegionalMapProps {} 
// Không có props (sử dụng state nội bộ)
```

#### State Internal
```typescript
hoveredProvince: Province | null      // Tỉnh đang hover
selectedProvince: Province | null     // Tỉnh được select
```

#### Events
```typescript
onMouseEnter(() => setHoveredProvince)  // Di chuột vào
onMouseLeave(() => setHoveredProvince)  // Ra khỏi
onClick(() => setSelectedProvince)      // Click chọn
```

#### Cách Sử Dụng
```tsx
import RegionalMap from '@/app/components/RegionalMap'

export default function App() {
  return <RegionalMap />
}
```

---

### 2. **SpecialtyCard**
Component hiển thị chi tiết tỉnh dưới dạng card.

#### Props
```typescript
interface SpecialtyCardProps {
  province: Province  // Dữ liệu tỉnh
}
```

#### Cách Sử Dụng
```tsx
import SpecialtyCard from '@/app/components/SpecialtyCard'
import { provinces } from '@/app/lib/provinces'

export default function Example() {
  const hanoi = provinces.find(p => p.id === 'ha-noi')
  
  return <SpecialtyCard province={hanoi!} />
}
```

---

### 3. **SpecialtyExplorer**
Bộ tìm kiếm & lọc tỉnh/đặc sản.

#### Props
```typescript
interface SpecialtyExplorerProps {
  onProvinceSelect?: (provinceId: string) => void  // Callback khi chọn
}
```

#### Features
- **Search**: Tìm theo tên tỉnh, viết tắt, tên đặc sản
- **Filter**: Lọc theo miền (Bắc, Trung, Nam, Hải Đảo)
- **Display**: Grid responsive, hiển thị số tỉnh tìm thấy

#### Cách Sử Dụng
```tsx
import SpecialtyExplorer from '@/app/components/SpecialtyExplorer'
import { useState } from 'react'

export default function Example() {
  const [selected, setSelected] = useState<string | null>(null)
  
  return (
    <SpecialtyExplorer 
      onProvinceSelect={(id) => {
        setSelected(id)
        // có thể truyền id này xuống bản đồ để zoom & hiển thị thông tin
        console.log(`Bạn chọn: ${id}`)
      }}
    />
  )
}
```

---

## 📊 Data Structure

### Province Interface
```typescript
interface Province {
  id: string                    // Định danh: "ha-noi", "da-nang", ...
  name: string                  // Tên đầy đủ: "Hà Nội"
  printName: string            // Tên in: "Thành phố Hà Nội"
  shortName: string            // Viết tắt: "HN"
  region: string               // "Miền Bắc" | "Miền Trung" | "Miền Nam" | "Hải Đảo"
  description: string          // Mô tả chi tiết about tỉnh
  specialties: Specialty[]     // Danh sách đặc sản
  svgPath: string             // Path vẽ SVG
  centerX: number             // Tọa độ X hiển thị text
  centerY: number             // Tọa độ Y hiển thị text
}

interface Specialty {
  name: string                // Tên đặc sản
  description: string         // Mô tả
  emoji?: string             // Icon emoji 🍲🥭🦀...
}
```

---

## 🎨 Styling & Theme

### Color Palette
```css
/* Bản đồ */
--color-normal: #4ecdc4      /* Xanh dương */
--color-hover: #ff6b6b       /* Đỏ */
--color-selected: #ffd93d    /* Vàng */
--color-sea: #80c0ff 50%     /* Gradient biển */

/* Backgrounds */
--bg-light: white            /* Light mode */
--bg-dark: #0f172a           /* Dark mode - neutral-950 */
--bg-component: #f3f4f6      /* Light component */
--bg-component-dark: #111827 /* Dark component - neutral-900 */
```

### Dark Mode
Tự động áp dụng theo `prefers-color-scheme`:
```tsx
<html suppressHydrationWarning>
  <body className="dark:bg-neutral-950 dark:text-white">
    ...
  </body>
</html>
```

---

## 🎬 Animations

### Framer Motion Usage
```tsx
import { motion, AnimatePresence } from 'framer-motion'

// Hover Scale
<motion.path
  whileHover={{ scale: 1.3 }}
/>

// Fade In/Out
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 20 }}
/>

// Stagger List
{items.map((item, idx) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: idx * 0.1 }}
  >
    {item}
  </motion.div>
))}
```

### Filter Effects
```tsx
<defs>
  <filter id="glow">
    <feGaussianBlur stdDeviation="4" />
  </filter>
</defs>

<path filter="url(#glow)" />
```

---

## 🔍 Search & Filter Algorithm

### Search Logic
```typescript
const filteredProvinces = provinces.filter(province => {
  const matchSearch =
    province.name.toLowerCase().includes(term) ||
    province.shortName.toLowerCase().includes(term) ||
    province.specialties.some(s => 
      s.name.toLowerCase().includes(term)
    )
  
  return matchSearch && (region === null || province.region === region)
})
```

### Performance
- Uses `useMemo()` để tránh re-filter không cần thiết
- Complexity: O(n*m) với n=40 tỉnh, m=5 đặc sản (acceptable)

---

## 🚀 Advanced Usage

### Custom Province Addition
```typescript
// app/lib/provinces.ts

const newProvince: Province = {
  id: "dien-bien-phu",
  name: "Điện Biên Phủ",
  printName: "Quận Điện Biên Phủ",
  shortName: "DBP",
  region: "Miền Bắc",
  description: "Địa điểm lịch sử nổi tiếng...",
  specialties: [
    {
      name: "Cà phê đặc sản",
      description: "Cà phê từ vùng cao 1500m",
      emoji: "☕"
    }
  ],
  svgPath: "M 100 100 Q 120 90 140 100 Q 130 120 100 115 Z",
  centerX: 120,
  centerY: 107
}

export const provinces = [
  ...existingProvinces,
  newProvince
]
```

### Creating SVG Path
Dùng Inkscape, Adobe Illustrator, hoặc `path-to-SVG` tool:
```bash
# Ví dụ đơn giản (hình chữ nhật)
M 100 100 L 140 100 L 140 130 L 100 130 Z

# Bezier curve (chữ S)
M 100 100 Q 120 90 140 100 Q 130 120 100 115 Z
```

### Event Handling Extension
```tsx
// Trong RegionalMap.tsx

<motion.path
  onHoverStart={() => playSound('hover.mp3')}
  onHoverEnd={() => stopSound()}
  onTap={() => {
    setSelectedProvince(province)
    // Thêm tracking
    analytics.track('province_selected', { 
      province: province.id 
    })
  }}
/>
```

---

## 🐛 Common Issues & Solutions

### Issue: SVG Path không hiển thị
**Solution**: Kiểm tra:
```typescript
1. svgPath syntax đúng (M, L, Q, Z commands)
2. centerX, centerY nằm trong viewBox (0-800)
3. Bị overflow bị stroke nhìn không rõ
```

### Issue: Hover không responsive
**Solution**: Kiểm tra:
```tsx
1. onMouseEnter/Leave được gọi
2. State `hoveredProvince` được update
3. SVG element không bị pointer-events: none
```

### Issue: Card không cuộn
**Solution**: Thêm `overflow-y-auto`:
```tsx
<div className="flex-1 overflow-y-auto">
  <SpecialtyCard />
</div>
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile: < 640px */
- Bản đồ full width
- Panel info bên dưới
- Grid: 1 cột

/* Tablet: 640px - 1024px */
- Bản đồ 50% width
- Panel bên phải
- Grid: 2 cột

/* Desktop: > 1024px */
- Layout tối ưu
- Grid: 3 cột
- Sidebar mở full
```

---

## 🧪 Testing

### Unit Test Example
```typescript
// __tests__/provinces.test.ts
import { provinces } from '@/app/lib/provinces'

describe('Provinces Data', () => {
  test('Should have 40 provinces', () => {
    expect(provinces).toHaveLength(40)
  })
  
  test('Each province should have required fields', () => {
    provinces.forEach(p => {
      expect(p.id).toBeDefined()
      expect(p.name).toBeDefined()
      expect(p.specialties.length).toBeGreaterThan(0)
    })
  })
})
```

### E2E Test Example
```typescript
// __tests__/specialty.e2e.ts
describe('Specialty Page', () => {
  test('Should hover and display province info', () => {
    cy.visit('/specialty')
    cy.get('[data-province="ha-noi"]').trigger('mouseenter')
    cy.contains('Hà Nội').should('be.visible')
  })
})
```

---

## 🔐 Performance Tips

1. **Memoize Components**:
   ```tsx
   const SpecialtyCard = memo(({ province }) => ...)
   ```

2. **Lazy Load SVG**:
   ```tsx
   <Suspense fallback={<Loading />}>
     <RegionalMap />
   </Suspense>
   ```

3. **Optimize Animations**:
   ```tsx
   // Tránh animate expensive properties
   // ❌ whileHover={{ boxShadow: '...' }}
   // ✅ whileHover={{ scale: 1.05 }}
   ```

---

## 📚 Dependencies

```json
{
  "next": "^14.0",
  "react": "^18.0",
  "framer-motion": "^10.0",
  "tailwindcss": "^3.0",
  "typescript": "^5.0"
}
```

---

## 🎓 Learning Resources

- [SVG Path Tutorial](https://www.w3schools.com/graphics/svg_path.asp)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Next.js Docs](https://nextjs.org/docs)

---

## 📞 Support

Để lấy hỗ trợ hoặc báo cáo lỗi:
- Kiểm tra [SPECIALTY_FEATURE.md](./SPECIALTY_FEATURE.md)
- Xem console log (F12)
- Kiểm tra lỗi TypeScript: `npm run type-check`

---

**Made with ❤️ by kmd - 2026**
