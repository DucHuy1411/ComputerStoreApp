const crypto = require('crypto');
const querystring = require('querystring');
const vnpayConfig = require('../config/vnpay.config');

class VnpayService {
  /**
   * Format ngày giờ theo chuẩn VNPAY (GMT+7)
   * yyyyMMddHHmmss
   */
  formatVnpDate(date) {
    const pad = (n) => n.toString().padStart(2, '0');

    return (
      date.getFullYear().toString() +
      pad(date.getMonth() + 1) +
      pad(date.getDate()) +
      pad(date.getHours()) +
      pad(date.getMinutes()) +
      pad(date.getSeconds())
    );
  }

  /**
   * Sort object theo alphabet (theo chuẩn VNPay)
   */
  sortObject(obj) {
    const sorted = {};
    Object.keys(obj)
      .sort()
      .forEach((key) => {
        sorted[key] = obj[key];
      });
    return sorted;
  }

  /**
   * Tạo chữ ký HMAC SHA512 theo chuẩn VNPay
   * 
   * LƯU Ý QUAN TRỌNG: 
   * - KHÔNG URL encode các giá trị khi tạo signature
   * - Chỉ encode khi tạo query string cuối cùng
   * - Với version 2.1.1, vnp_ExpireDate KHÔNG được include trong signature
   */
  createSignature(params, secretKey) {
    // 1. Lọc ra những tham số hợp lệ và không phải vnp_SecureHash, vnp_SecureHashType, vnp_ExpireDate
    // LƯU Ý: vnp_ExpireDate KHÔNG được include trong signature với version 2.1.1
    const filteredParams = {};
    Object.keys(params).forEach((key) => {
      if (
        key.startsWith('vnp_') &&
        params[key] !== undefined &&
        params[key] !== null &&
        params[key] !== '' &&
        key !== 'vnp_SecureHash' &&
        key !== 'vnp_SecureHashType' &&
        key !== 'vnp_ExpireDate' // Loại bỏ vnp_ExpireDate khỏi signature
      ) {
        filteredParams[key] = String(params[key]);
      }
    });

    // 2. Sort theo tên key tăng dần
    const sortedKeys = Object.keys(filteredParams).sort();

    // 3. Join thành chuỗi "key=value" nối bằng '&'
    // LƯU Ý: KHÔNG encode ở đây - chỉ nối key=value
    const dataToSign = sortedKeys
      .map((key) => `${key}=${filteredParams[key]}`)
      .join('&');

    // Log chi tiết để debug
    console.log('\n[VNPay] ===== SIGNATURE DEBUG =====');
    console.log('[VNPay] Original params:', JSON.stringify(params, null, 2));
    console.log('[VNPay] Filtered params (vnp_ExpireDate excluded from signature):', JSON.stringify(filteredParams, null, 2));
    console.log('[VNPay] Sorted keys:', sortedKeys);
    console.log('[VNPay] Data to sign (signData):', dataToSign);
    console.log('[VNPay] HashSecret:', secretKey);
    console.log('[VNPay] HashSecret length:', secretKey.length);

    // 4. Tạo HMAC SHA512
    const hmac = crypto.createHmac('sha512', secretKey);
    hmac.update(Buffer.from(dataToSign, 'utf-8'));

    // 5. Lấy chữ ký hex
    const signature = hmac.digest('hex');

    console.log('[VNPay] Signature (full):', signature);
    console.log('[VNPay] Signature length:', signature.length);
    console.log('[VNPay] ===== END SIGNATURE DEBUG =====\n');

    return signature;
  }

  /**
   * Tạo URL thanh toán VNPay
   */
  createPaymentUrl(params) {
    const {
      orderId,
      amount,
      orderDescription,
      orderType = vnpayConfig.orderType,
      locale = vnpayConfig.locale,
      clientIp = '127.0.0.1',
    } = params;

    const vnp_TxnRef = `${orderId}_${Date.now()}`.substring(0, 50);

    const now = new Date();
    const createDate = this.formatVnpDate(now);

    const expireDate = this.formatVnpDate(
      new Date(now.getTime() + 15 * 60 * 1000),
    );

    const vnp_Params = {
      vnp_Version: vnpayConfig.version,
      vnp_Command: vnpayConfig.command,
      vnp_TmnCode: vnpayConfig.tmnCode,
      vnp_Amount: Math.round(amount * 100),
      vnp_CurrCode: vnpayConfig.currCode,
      vnp_TxnRef,
      vnp_OrderInfo: (
        orderDescription || `Thanh toan don hang ${orderId}`
      ).substring(0, 255),
      vnp_OrderType: orderType,
      vnp_Locale: locale,
      vnp_ReturnUrl: vnpayConfig.returnUrl,
      vnp_IpAddr: clientIp,
      vnp_CreateDate: createDate,
      vnp_ExpireDate: expireDate,
    };

    // if (vnpayConfig.ipnUrl) {
    //   vnp_Params.vnp_IpNUrl = vnpayConfig.ipnUrl;
    // }

    console.log('\n[VNPay] ===== CREATE PAYMENT URL =====');
    console.log('[VNPay] Order ID:', orderId);
    console.log('[VNPay] Amount:', amount, 'VND');
    console.log('[VNPay] Client IP:', clientIp);
    console.log('[VNPay] All params before signature:', JSON.stringify(vnp_Params, null, 2));

    // Tạo chữ ký (KHÔNG encode trong signature)
    const signature = this.createSignature(vnp_Params, vnpayConfig.hashSecret);
    vnp_Params.vnp_SecureHash = signature;

    const endpoint = vnpayConfig.endpoints.sandbox.create;

    // Sort lại để build URL đẹp
    const finalParams = this.sortObject(vnp_Params);
    const queryString = querystring.stringify(finalParams);
    const paymentUrl = `${endpoint}?${queryString}`;

    console.log('[VNPay] Final params (with signature):', JSON.stringify(finalParams, null, 2));
    console.log('[VNPay] Query string:', queryString);
    console.log('[VNPay] Payment URL:', paymentUrl);
    console.log('[VNPay] ===== END CREATE PAYMENT URL =====\n');

    return paymentUrl;
  }

  /**
   * Verify chữ ký từ Return / IPN
   */
  verifySignature(params) {
    const secureHash = params.vnp_SecureHash;

    const calculatedHash = this.createSignature(params, vnpayConfig.hashSecret);

    return calculatedHash === secureHash;
  }

  /**
   * Query trạng thái giao dịch
   */
  async queryPaymentStatus(orderId, transDate) {
    const now = new Date();

    const vnp_Params = {
      vnp_Version: vnpayConfig.version,
      vnp_Command: 'querydr',
      vnp_TmnCode: vnpayConfig.tmnCode,
      vnp_TxnRef: orderId,
      vnp_TransactionDate: transDate,
      vnp_CreateDate: this.formatVnpDate(now),
    };

    vnp_Params.vnp_SecureHash = this.createSignature(vnp_Params, vnpayConfig.hashSecret);

    const endpoint = vnpayConfig.endpoints.sandbox.query;
    const queryString = querystring.stringify(vnp_Params);
    const url = `${endpoint}?${queryString}`;

    const https = require('https');
    const http = require('http');
    const urlModule = require('url');

    const parsedUrl = urlModule.parse(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;

    return new Promise((resolve, reject) => {
      const req = client.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          const result = querystring.parse(data);
          resolve({
            success: result.vnp_ResponseCode === '00',
            responseCode: result.vnp_ResponseCode,
            message: result.vnp_Message,
            transactionNo: result.vnp_TransactionNo,
            amount: result.vnp_Amount
              ? parseInt(result.vnp_Amount) / 100
              : null,
            orderId: result.vnp_TxnRef,
          });
        });
      });

      req.on('error', reject);
      req.setTimeout(30000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
    });
  }
}

module.exports = new VnpayService();
