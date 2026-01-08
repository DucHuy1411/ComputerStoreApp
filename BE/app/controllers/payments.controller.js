const { Order } = require('../models');
const vnpayService = require('../services/vnpay.service');

class PaymentsController {
  /**
   * POST /api/payments/vnpay/initiate
   * Tạo payment URL với VNPay
   * Body: { orderId }
   */
  async initiateVnpayPayment(req, res) {
    const userId = req.user.id;
    const { orderId, clientIp: clientIpFromBody } = req.body || {};

    if (!orderId) {
      return res.status(400).json({ message: 'orderId is required' });
    }

    try {
      // Tìm order và kiểm tra quyền
      const order = await Order.findOne({
        where: { id: orderId, userId },
      });

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      if (order.paymentStatus === 'paid') {
        return res.status(400).json({ message: 'Order already paid' });
      }

      // Ưu tiên lấy IP từ request body (từ client app)
      // Nếu không có thì lấy từ headers (fallback)
      const clientIp =
        clientIpFromBody ||
        req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        req.headers['x-real-ip'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
        '127.0.0.1';

      console.log(
        '[VNPay] Using client IP:',
        clientIp,
        clientIpFromBody ? '(from client)' : '(from server headers)',
      );

      // Tạo payment URL với VNPay
      const paymentUrl = vnpayService.createPaymentUrl({
        orderId: order.code, // Dùng order code làm orderId cho VNPay
        amount: Number(order.total),
        orderDescription: `Thanh toan don hang ${order.code}`, // Không dùng dấu tiếng Việt để tránh encoding issues
        clientIp: clientIp,
      });

      // Lưu payment method vào order
      order.paymentMethod = 'vnpay';
      await order.save();

      return res.json({
        success: true,
        payUrl: paymentUrl,
        orderId: order.id,
        orderCode: order.code,
      });
    } catch (error) {
      console.error('Initiate VNPay payment error:', error);
      return res.status(500).json({
        message: error.message || 'Internal server error',
      });
    }
  }

  /**
   * GET /api/payments/vnpay/return
   * Return URL từ VNPay sau khi thanh toán
   *
   * VNPay sẽ redirect về URL này với các query params:
   * ?vnp_Amount=1000000&vnp_BankCode=NCB&vnp_BankTranNo=VNP14226112&vnp_CardType=ATM
   * &vnp_OrderInfo=...&vnp_PayDate=20231207170112&vnp_ResponseCode=00&vnp_TmnCode=...
   * &vnp_TransactionNo=14226112&vnp_TransactionStatus=00&vnp_TxnRef=166117&vnp_SecureHash=...
   */
  async vnpayReturn(req, res) {
    try {
      const vnp_Params = req.query;

      console.log('[VNPay Return] Received params:', {
        vnp_TxnRef: vnp_Params.vnp_TxnRef,
        vnp_ResponseCode: vnp_Params.vnp_ResponseCode,
        vnp_TransactionStatus: vnp_Params.vnp_TransactionStatus,
        vnp_TransactionNo: vnp_Params.vnp_TransactionNo,
        vnp_Amount: vnp_Params.vnp_Amount,
        vnp_BankCode: vnp_Params.vnp_BankCode,
        vnp_PayDate: vnp_Params.vnp_PayDate,
      });

      // Xác thực chữ ký
      const isValid = vnpayService.verifySignature(vnp_Params);
      if (!isValid) {
        console.error('[VNPay Return] Invalid signature');
        return res.status(400).send('Invalid signature');
      }

      const {
        vnp_TxnRef,
        vnp_ResponseCode,
        vnp_TransactionStatus,
        vnp_TransactionNo,
        vnp_Amount,
        vnp_BankCode,
        vnp_BankTranNo,
        vnp_CardType,
        vnp_PayDate,
      } = vnp_Params;

      // Tìm order bằng code (lấy phần đầu của vnp_TxnRef trước dấu _)
      const orderCode = vnp_TxnRef.split('_')[0];
      const order = await Order.findOne({
        where: { code: orderCode },
      });

      if (!order) {
        console.error(`[VNPay Return] Order not found: ${orderCode}`);
        return res.status(404).send('Order not found');
      }

      // Xử lý kết quả thanh toán
      // vnp_ResponseCode = '00' và vnp_TransactionStatus = '00' => Thanh toán thành công
      if (vnp_ResponseCode === '00' && vnp_TransactionStatus === '00') {
        // Thanh toán thành công
        order.paymentStatus = 'paid';
        order.paymentTransactionId = vnp_TransactionNo;
        order.paymentMethod = 'vnpay';
        await order.save();

        console.log(
          `[VNPay Return] Payment successful for order ${order.code}`,
          {
            TransactionNo: vnp_TransactionNo,
            BankCode: vnp_BankCode,
            BankTranNo: vnp_BankTranNo,
            CardType: vnp_CardType,
            PayDate: vnp_PayDate,
          },
        );
      } else {
        // Thanh toán thất bại hoặc bị hủy
        order.paymentStatus = 'failed';
        await order.save();

        console.log(`[VNPay Return] Payment failed for order ${order.code}`, {
          ResponseCode: vnp_ResponseCode,
          TransactionStatus: vnp_TransactionStatus,
        });
      }

      // Redirect về app với kết quả
      const redirectUrl = `expostoreapp://payment/vnpay?orderId=${
        order.id
      }&status=${
        vnp_ResponseCode === '00' && vnp_TransactionStatus === '00'
          ? 'success'
          : 'failed'
      }`;
      return res.redirect(redirectUrl);
    } catch (error) {
      console.error('[VNPay Return] Error:', error);
      return res.status(500).send('Internal server error');
    }
  }

  /**
   * POST /api/payments/vnpay/ipn
   * IPN (Instant Payment Notification) từ VNPay
   */
  async vnpayIpn(req, res) {
    try {
      const vnp_Params = req.body;

      // Xác thực chữ ký
      const isValid = vnpayService.verifySignature(vnp_Params);
      if (!isValid) {
        console.error('Invalid VNPay IPN signature');
        return res
          .status(400)
          .json({ RspCode: '97', Message: 'Invalid signature' });
      }

      const { vnp_TxnRef, vnp_ResponseCode, vnp_TransactionNo, vnp_Amount } =
        vnp_Params;

      // Tìm order bằng code
      const order = await Order.findOne({
        where: { code: vnp_TxnRef.split('_')[0] },
      });

      if (!order) {
        console.error(`Order not found: ${vnp_TxnRef}`);
        return res
          .status(404)
          .json({ RspCode: '01', Message: 'Order not found' });
      }

      // Kiểm tra số tiền
      const amount = parseInt(vnp_Amount) / 100;
      if (Math.abs(amount - Number(order.total)) > 0.01) {
        console.error(`Amount mismatch: order=${order.total}, vnpay=${amount}`);
        return res.json({ RspCode: '04', Message: 'Amount mismatch' });
      }

      // Xử lý kết quả thanh toán
      if (vnp_ResponseCode === '00' && order.paymentStatus !== 'paid') {
        // Thanh toán thành công
        order.paymentStatus = 'paid';
        order.paymentTransactionId = vnp_TransactionNo;
        order.paymentMethod = 'vnpay';
        await order.save();

        console.log(
          `IPN: Payment successful for order ${order.code}, TransactionNo: ${vnp_TransactionNo}`,
        );
      }

      // Trả về response cho VNPay
      return res.json({ RspCode: '00', Message: 'Success' });
    } catch (error) {
      console.error('VNPay IPN error:', error);
      return res
        .status(500)
        .json({ RspCode: '99', Message: 'Internal server error' });
    }
  }

  /**
   * GET /api/payments/vnpay/status/:orderId
   * Kiểm tra trạng thái thanh toán
   */
  async checkPaymentStatus(req, res) {
    const userId = req.user.id;
    const { orderId } = req.params;

    try {
      const order = await Order.findOne({
        where: { id: orderId, userId },
      });

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      if (order.paymentMethod !== 'vnpay') {
        return res.json({
          paymentStatus: order.paymentStatus,
          paymentMethod: order.paymentMethod,
          message: 'No VNPay payment found',
        });
      }

      // Query status từ VNPay nếu có transaction date
      // Note: VNPay query cần transaction date, nên chỉ query khi có thông tin đầy đủ
      // Hoặc có thể skip query và chỉ trả về status hiện tại

      return res.json({
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        paymentTransactionId: order.paymentTransactionId,
      });
    } catch (error) {
      console.error('Check payment status error:', error);
      return res.status(500).json({
        message: error.message || 'Internal server error',
      });
    }
  }
}

module.exports = new PaymentsController();
