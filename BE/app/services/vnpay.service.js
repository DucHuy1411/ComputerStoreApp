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
   * Loại bỏ dấu tiếng Việt để tránh lỗi encoding với VNPay
   */
  removeVietnameseAccents(text) {
    if (!text) return text;
    
    // Thay thế các ký tự có dấu commonly used - đơn giản và hiệu quả
    // Sử dụng replace thay vì normalize có thể không được hỗ trợ
    return text
      .replace(/á|à|ạ|ả|ã|â|ấ|ầ|ậ|ẩ|ẫ|ă|ắ|ằ|ặ|ẳ|ẵ/g, 'a')
      .replace(/Á|À|Ạ|Ả|Ã|Â|Ấ|Ầ|Ậ|Ẩ|Ẫ|Ă|Ắ|Ằ|Ặ|Ẳ|Ẵ/g, 'A')
      .replace(/é|è|ẹ|ẻ|ẽ|ê|ế|ề|ệ|ể|ễ/g, 'e')
      .replace(/É|È|Ẹ|Ẻ|Ẽ|Ê|Ế|Ề|Ệ|Ể|Ễ/g, 'E')
      .replace(/ó|ò|ọ|ỏ|õ|ô|ố|ồ|ộ|ổ|ỗ|ơ|ớ|ờ|ợ|ở|ỡ/g, 'o')
      .replace(/Ó|Ò|Ọ|Ỏ|Õ|Ô|Ố|Ồ|Ộ|Ổ|Ỗ|Ơ|Ớ|Ờ|Ợ|Ở|Ỡ/g, 'O')
      .replace(/ú|ù|ụ|ủ|ũ|ưứ|ừ|ự|ử|ữ/g, 'u')
      .replace(/Ú|Ù|Ụ|Ủ|Ũ|Ư|Ứ|Ừ|Ự|Ử|Ữ/g, 'U')
      .replace(/í|ì|ị|ỉ|ĩ/g, 'i')
      .replace(/Í|Ì|Ị|Ỉ|Ĩ/g, 'I')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .replace(/ý|ỳ|ỵ|ỷ|ỹ/g, 'y')
      .replace(/Ý|Ỳ|Ỵ|Ỷ|Ỹ/g, 'Y');
  }

  /**
   * Tạo chữ ký HMAC SHA512 theo chuẩn VNPay
   * 
   * LƯU Ý QUAN TRỌNG: 
   * - Signature được tạo từ dữ liệu ĐÃ URL ENCODE (giống C#)
   * - Final URL cũng sử dụng dữ liệu đã encode
   * - Version 2.1.0: vnp_ExpireDate được include trong signature
   */
  createSignature(params, secretKey) {
    // 1. Lọc ra những tham số hợp lệ và không phải vnp_SecureHash, vnp_SecureHashType
    // LƯU Ý: Với version 2.1.0, vnp_ExpireDate ĐƯỢC include trong signature
    const filteredParams = {};
    Object.keys(params).forEach((key) => {
      if (
        key.startsWith('vnp_') &&
        params[key] !== undefined &&
        params[key] !== null &&
        params[key] !== '' &&
        key !== 'vnp_SecureHash' &&
        key !== 'vnp_SecureHashType'
        // KHÔNG loại bỏ vnp_ExpireDate với version 2.1.0
      ) {
        filteredParams[key] = String(params[key]);
      }
    });

    // 2. Sort theo tên key tăng dần
    const sortedKeys = Object.keys(filteredParams).sort();

    // 3. Join thành chuỗi "key=value" nối bằng '&' với URL ENCODE (giống C# Uri.EscapeDataString)
    // LƯU Ý: CÓ encode theo code mẫu chính thức của VNPay C#
    const dataToSign = sortedKeys
      .map((key) => `${key}=${encodeURIComponent(filteredParams[key])}`)
      .join('&');

    // Log chi tiết để debug
    console.log('\n[VNPay] ===== SIGNATURE DEBUG =====');
    console.log('[VNPay] Original params:', JSON.stringify(params, null, 2));
    console.log('[VNPay] Filtered params (vnp_ExpireDate included in signature):', JSON.stringify(filteredParams, null, 2));
    console.log('[VNPay] Sorted keys:', sortedKeys);
    console.log('[VNPay] Data to sign (ENCODED - like C#):', dataToSign);
    console.log('[VNPay] Data to sign length:', dataToSign.length);
    console.log('[VNPay] HashSecret:', secretKey);
    console.log('[VNPay] HashSecret length:', secretKey.length);

    // 4. Tạo HMAC SHA512 theo chuẩn VNPay
    const hmac = crypto.createHmac('sha512', secretKey);
    // Sử dụng Buffer theo code mẫu chính thức của VNPay
    hmac.update(Buffer.from(dataToSign, 'utf-8'));

    // 5. Lấy chữ ký hex
    const signature = hmac.digest('hex');

    console.log('[VNPay] Signature (hex):', signature);
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

    // Loại bỏ dấu tiếng Việt và ký tự đặc biệt (giống C#)
    const cleanOrderInfo = this.removeVietnameseAccents(
      (orderDescription || `Thanh toan don hang ${orderId}`)
        .replace(/ /g, '_')
        .replace(/-/g, '_')
        .replace(/,/g, '')
        .replace(/\./g, '')
        .replace(/:/g, '')
    ).substring(0, 255);

    const vnp_Params = {
      vnp_Version: vnpayConfig.version,
      vnp_Command: vnpayConfig.command,
      vnp_TmnCode: vnpayConfig.tmnCode,
      vnp_Amount: Math.round(amount * 100),
      vnp_CurrCode: vnpayConfig.currCode,
      vnp_TxnRef,
      vnp_OrderInfo: cleanOrderInfo,
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

    // Tạo chữ ký (với URL ENCODED data)
    const signature = this.createSignature(vnp_Params, vnpayConfig.hashSecret);
    vnp_Params.vnp_SecureHash = signature;

    const endpoint = vnpayConfig.endpoints.sandbox.create;

    // Sort lại để build URL
    const finalParams = this.sortObject(vnp_Params);
    
    // Build query string với URL encode (giống C# Uri.EscapeDataString)
    // KHÔNG encode chữ ký (giống C#)
    const queryStringWithoutHash = Object.keys(finalParams)
      .sort()
      .filter(key => key !== 'vnp_SecureHash')
      .map(key => `${key}=${encodeURIComponent(finalParams[key])}`)
      .join('&');
      
    const paymentUrl = `${endpoint}?${queryStringWithoutHash}&vnp_SecureHash=${finalParams.vnp_SecureHash}`;

    console.log('[VNPay] Final params (with signature):', JSON.stringify(finalParams, null, 2));
    console.log('[VNPay] Query string (without hash):', queryStringWithoutHash);
    console.log('[VNPay] Payment URL:', paymentUrl);
    
    // Additional validation
    console.log('[VNPay] Validation check:');
    console.log('- Amount:', finalParams.vnp_Amount, '(should be number * 100)');
    console.log('- OrderInfo length:', finalParams.vnp_OrderInfo?.length, '(max 255)');
    console.log('- TxnRef length:', finalParams.vnp_TxnRef?.length, '(max 50)');
    console.log('- CreateDate format:', finalParams.vnp_CreateDate, '(yyyymmddHHmmss)');
    console.log('- ExpireDate format:', finalParams.vnp_ExpireDate, '(yyyymmddHHmmss)');
    
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
