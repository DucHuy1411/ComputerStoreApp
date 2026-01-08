# Hướng dẫn tích hợp VNPay

## 1. Đăng ký tài khoản VNPay

1. Truy cập https://sandbox.vnpayment.vn/ để đăng ký tài khoản sandbox
2. Hoặc https://www.vnpayment.vn/ để đăng ký tài khoản production
3. Tạo merchant và lấy thông tin:
   - **TmnCode**: Mã merchant
   - **HashSecret**: Secret key để tạo chữ ký

## 2. Cấu hình

### Cấu hình trong file `.env` (khuyến nghị):

```env
VNPAY_ENV=sandbox
VNPAY_TMN_CODE=YOUR_TMN_CODE
VNPAY_HASH_SECRET=YOUR_HASH_SECRET
VNPAY_RETURN_URL=http://localhost:3001/api/payments/vnpay/return
VNPAY_IPN_URL=http://localhost:3001/api/payments/vnpay/ipn
```

### Hoặc cấu hình trực tiếp trong `vnpay.config.js`:

Mở file `BE/app/config/vnpay.config.js` và thay thế các giá trị:
- `tmnCode`: Mã merchant từ VNPay
- `hashSecret`: Secret key từ VNPay

## 3. Cấu hình URLs

### Return URL
- URL này sẽ được VNPay redirect về sau khi người dùng thanh toán xong
- Format: `http://your-domain/api/payments/vnpay/return`
- Để test local, có thể dùng ngrok: `ngrok http 3001`

### IPN URL (Instant Payment Notification)
- URL này sẽ nhận webhook từ VNPay khi có giao dịch
- Format: `http://your-domain/api/payments/vnpay/ipn`
- **Lưu ý**: Phải là HTTPS và accessible từ internet (không thể dùng localhost)
- Để test local, sử dụng ngrok: `ngrok http 3001`

## 4. Cấu hình Deep Link cho Mobile App

Trong file `vnpay.config.js`, cấu hình `returnUrl` để redirect về app:

```javascript
returnUrl: 'expostoreapp://payment/vnpay'
```

## 5. Test thanh toán

1. Khởi động backend server: `cd BE && npm start`
2. Tạo đơn hàng từ mobile app
3. Chọn phương thức thanh toán VNPay
4. Hoàn tất thanh toán trên trang VNPay
5. Kiểm tra kết quả trong database và app

## 6. Chuyển sang Production

1. Đăng ký tài khoản production tại https://www.vnpayment.vn/
2. Cập nhật `.env`:
   ```env
   VNPAY_ENV=production
   VNPAY_TMN_CODE=X0RPM1LN
   VNPAY_HASH_SECRET=NTYG8F0K48EPZ1U42XLZ6F4VJFB9C65
   ```
3. Cập nhật URLs trong VNPay Merchant Portal:
   - Return URL: `http://localhost:3001/api/payments/vnpay/return`
   - IPN URL: `http://localhost:3001/api/payments/vnpay/ipn`

## 7. Troubleshooting

### Lỗi "Invalid signature"
- Kiểm tra lại `hashSecret` trong config
- Đảm bảo chữ ký được tạo đúng theo format của VNPay

### Lỗi "Order not found"
- Kiểm tra `vnp_TxnRef` có đúng format không (orderCode_timestamp)
- Kiểm tra order code trong database

### IPN không nhận được callback
- Đảm bảo IPN URL là HTTPS và accessible từ internet
- Kiểm tra firewall và network settings
- Sử dụng ngrok để test local

## 8. API Endpoints

- `POST /api/payments/vnpay/initiate` - Tạo payment URL
- `GET /api/payments/vnpay/return` - Return URL từ VNPay
- `POST /api/payments/vnpay/ipn` - IPN webhook từ VNPay
- `GET /api/payments/vnpay/status/:orderId` - Kiểm tra trạng thái thanh toán

## 9. Database Migration

Chạy migration để cập nhật database:

```bash
cd BE
mysql -u root -p techstore < migrations/remove_momo_add_vnpay.sql
```

Hoặc sử dụng script Node.js:

```bash
node run_migration_node.js migrations/remove_momo_add_vnpay.sql
```



