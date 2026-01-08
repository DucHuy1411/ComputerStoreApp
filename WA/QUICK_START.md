# 🚀 Hướng Dẫn Khởi Động Web Admin

## Bước 1: Đảm bảo Backend đang chạy

Web Admin cần Backend API chạy tại `http://localhost:3001`

```bash
cd ../BE
npm start
```

## Bước 2: Khởi động Web Admin

```bash
cd WA
npm run dev
```

Web Admin sẽ chạy tại: `http://localhost:5173`

## Bước 3: Đăng nhập

1. Mở trình duyệt tại `http://localhost:5173`
2. Bạn sẽ được chuyển đến trang Login
3. Đăng nhập với tài khoản admin:
   - Email/SĐT: (tài khoản admin trong database)
   - Password: (mật khẩu của tài khoản admin)

## 📋 Tính năng hiện có

- ✅ **Dashboard**: Thống kê tổng quan
- ✅ **Quản lý Sản phẩm**: Xem danh sách sản phẩm
- ✅ **Quản lý Đơn hàng**: Xem và quản lý đơn hàng
- ✅ **Quản lý Người dùng**: Xem danh sách người dùng
- ✅ **Quản lý Khuyến mãi**: (Đang phát triển)
- ✅ **Thống kê**: (Đang phát triển)

## 🔧 Cấu hình

File `.env` đã được tạo với cấu hình mặc định:
```
VITE_API_URL=http://localhost:3001
```

Nếu Backend chạy ở port khác, sửa file `.env` cho phù hợp.

## 🐛 Xử lý lỗi

### Lỗi kết nối API
- Kiểm tra Backend đang chạy: `curl http://localhost:3001`
- Kiểm tra CORS trong Backend
- Kiểm tra API URL trong `.env`

### Lỗi authentication
- Đảm bảo đã có tài khoản admin trong database
- Kiểm tra token được lưu trong localStorage
- Xóa localStorage và đăng nhập lại

## 📝 Lưu ý

- Web Admin sử dụng JWT authentication
- Token được lưu trong localStorage
- Tự động redirect về Login nếu token hết hạn hoặc không hợp lệ



