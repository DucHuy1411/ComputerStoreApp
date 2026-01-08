/**
 * Cấu hình VNPay Payment Gateway
 *
 * Để lấy thông tin này:
 * 1. Đăng ký tại https://sandbox.vnpayment.vn/
 * 2. Tạo merchant và lấy TmnCode, HashSecret
 * 3. Cấu hình Return URL và IPN URL
 *
 * Khuyến nghị: Sử dụng environment variables để bảo mật
 * Tạo file .env trong thư mục BE/ với các biến:
 * VNPAY_ENV, VNPAY_TMN_CODE, VNPAY_HASH_SECRET, VNPAY_RETURN_URL, VNPAY_IPN_URL
 */

module.exports = {
  // Môi trường: 'sandbox' hoặc 'production'
  environment: 'sandbox',

  // Thông tin từ VNPay Merchant Portal
  // LƯU Ý: Thay thế các giá trị này bằng thông tin thật từ VNPay Merchant Portal
  tmnCode: 'ZJ61TPT8',
  hashSecret: '30V3L1CO410URBEG570H6V3P59DFG2WB',

  // URLs
  endpoints: {
    sandbox: {
      // https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
      create: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
      query: 'https://sandbox.vnpayment.vn/merchant_webapi/merchant.html',
    },
    production: {
      create: 'https://vnpayment.vn/paymentv2/vpcpay.html',
      query: 'https://vnpayment.vn/merchant_webapi/merchant.html',
    },
  },

  // Return URL - Sau khi thanh toán xong, VNPay redirect về đây
  // Format: https://{domain}/ReturnUrl (không có query params)
  // VNPay sẽ tự động append query params khi redirect:
  //   ?vnp_Amount=1000000&vnp_BankCode=NCB&vnp_BankTranNo=...&vnp_ResponseCode=00&vnp_TxnRef=...&vnp_SecureHash=...
  // LƯU Ý: 
  // - VNPay sandbox có thể không chấp nhận localhost, cần dùng ngrok hoặc domain thật
  // - URL phải là HTTPS trong production
  // - Không có trailing slash và không có query params
  returnUrl:
    process.env.VNPAY_RETURN_URL ||
    'http://abaha.vn/api/payments/vnpay/return',

  // IPN (Instant Payment Notification) URL - Backend sẽ nhận callback từ VNPay
  // LƯU Ý: Phải là HTTPS và accessible từ internet (không thể dùng localhost)
  // Để test local, sử dụng ngrok: ngrok http 3001
  // Ví dụ: https://abc123.ngrok.io/api/payments/vnpay/ipn
  ipnUrl:
    process.env.VNPAY_IPN_URL || 'http://abaha.vn/api/payments/vnpay/ipn',

  // Version - VNPay yêu cầu 2.1.1
  version: '2.1.1',

  // Command
  command: 'pay',

  // Order Type
  orderType: 'other',

  // Locale
  locale: 'vn',

  // Currency
  currCode: 'VND',
};
