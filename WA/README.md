# Web Admin - Computer Store

Web Admin Panel cho hệ thống Computer Store, được xây dựng với React.js và Tailwind CSS.

## 🚀 Tính năng

- ✅ Dashboard với thống kê tổng quan
- ✅ Quản lý sản phẩm (CRUD)
- ✅ Quản lý đơn hàng
- ✅ Quản lý người dùng
- ✅ Quản lý khuyến mãi
- ✅ Thống kê và báo cáo
- ✅ Authentication với JWT
- ✅ Responsive design với Tailwind CSS

## 📋 Yêu cầu

- Node.js 16+ 
- npm hoặc yarn
- Backend API đang chạy tại `http://localhost:3001`

## 🛠️ Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

3. Cập nhật API URL trong `.env` nếu cần:
```env
VITE_API_URL=http://localhost:3001
```

4. Khởi động development server:
```bash
npm run dev
```

5. Mở trình duyệt tại: `http://localhost:5173`

## 📁 Cấu trúc Project

```
WA/
├── src/
│   ├── components/       # React components
│   │   └── Layout/      # Layout components (Sidebar, MainLayout)
│   ├── context/         # React Context (AuthContext)
│   ├── pages/          # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Products.jsx
│   │   ├── Orders.jsx
│   │   ├── Users.jsx
│   │   ├── Promotions.jsx
│   │   ├── Stats.jsx
│   │   └── Login.jsx
│   ├── services/       # API services
│   │   ├── api.js      # Axios instance
│   │   └── endpoints.js # API endpoints
│   ├── App.jsx         # Main App component
│   └── main.jsx        # Entry point
├── public/             # Static files
├── tailwind.config.js  # Tailwind configuration
├── vite.config.js      # Vite configuration
└── package.json
```

## 🔐 Authentication

Admin panel sử dụng JWT authentication. Đăng nhập với tài khoản admin để truy cập các tính năng quản lý.

## 🎨 UI Components

Sử dụng Tailwind CSS với các utility classes và custom components:
- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.card` - Card container
- `.input-field` - Input field
- `.table-header` - Table header
- `.table-cell` - Table cell

## 📝 Scripts

- `npm run dev` - Khởi động development server
- `npm run build` - Build production
- `npm run preview` - Preview production build
- `npm run lint` - Chạy ESLint

## 🔗 Kết nối với Backend

Web Admin kết nối với Backend API tại `BE/` thông qua các endpoints:
- `/auth/login` - Đăng nhập
- `/products` - Quản lý sản phẩm
- `/orders` - Quản lý đơn hàng
- `/users` - Quản lý người dùng
- `/promotions` - Quản lý khuyến mãi

## 🐛 Troubleshooting

### Lỗi kết nối API
- Kiểm tra Backend API đang chạy tại port 3001
- Kiểm tra CORS settings trong Backend
- Kiểm tra API URL trong file `.env`

### Lỗi authentication
- Kiểm tra token được lưu trong localStorage
- Đảm bảo Backend trả về token hợp lệ
- Kiểm tra JWT secret trong Backend

## 📚 Tài liệu tham khảo

- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
- [Axios](https://axios-http.com/)
- [Heroicons](https://heroicons.com/)
