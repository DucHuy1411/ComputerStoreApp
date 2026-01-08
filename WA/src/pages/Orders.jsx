import { useEffect, useState, useCallback } from 'react';
import TabLayout from '../components/Layout/TabLayout';
import {
  apiGetAdminOrders,
  apiGetAdminOrder,
  apiUpdateAdminOrderStatus,
  apiUpdateAdminPaymentStatus,
} from '../services/endpoints';
import {
  MagnifyingGlassIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  TruckIcon,
  ClockIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showPaymentStatusModal, setShowPaymentStatusModal] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({ status: '', description: '' });
  const [paymentStatusUpdate, setPaymentStatusUpdate] = useState({
    paymentStatus: '',
    paymentMethod: '',
    paymentTransactionId: '',
    description: '',
  });

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        limit: 100,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        paymentStatus: paymentStatusFilter !== 'all' ? paymentStatusFilter : undefined,
        q: searchTerm || undefined,
      };
      const response = await apiGetAdminOrders(params);
      setOrders(response.orders || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, paymentStatusFilter, searchTerm]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleSearch = () => {
    loadOrders();
  };

  const handleViewDetail = async (order) => {
    try {
      const response = await apiGetAdminOrder(order.id);
      setSelectedOrder(response.order);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error loading order detail:', error);
      alert('Không thể tải chi tiết đơn hàng');
    }
  };

  const handleOpenStatusModal = (order) => {
    setSelectedOrder(order);
    setStatusUpdate({ status: order.status, description: '' });
    setShowStatusModal(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !statusUpdate.status) return;

    try {
      await apiUpdateAdminOrderStatus(selectedOrder.id, {
        status: statusUpdate.status,
        description: statusUpdate.description,
      });
      setShowStatusModal(false);
      setSelectedOrder(null);
      setStatusUpdate({ status: '', description: '' });
      
      // Reload orders và refresh detail modal nếu đang mở
      await loadOrders();
      if (showDetailModal && selectedOrder) {
        const response = await apiGetAdminOrder(selectedOrder.id);
        setSelectedOrder(response.order);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const handleQuickStatusUpdate = async (order, newStatus) => {
    if (!window.confirm(`Bạn có chắc chắn muốn chuyển đơn hàng ${order.code} sang trạng thái "${getStatusLabel(newStatus)}"?`)) {
      return;
    }

    try {
      await apiUpdateAdminOrderStatus(order.id, {
        status: newStatus,
        description: `Chuyển trạng thái từ ${getStatusLabel(order.status)} sang ${getStatusLabel(newStatus)}`,
      });
      loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const handleOpenPaymentStatusModal = (order) => {
    setSelectedOrder(order);
    setPaymentStatusUpdate({
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod || '',
      paymentTransactionId: order.paymentTransactionId || '',
      description: '',
    });
    setShowPaymentStatusModal(true);
  };

  const handleUpdatePaymentStatus = async () => {
    if (!selectedOrder || !paymentStatusUpdate.paymentStatus) return;

    try {
      await apiUpdateAdminPaymentStatus(selectedOrder.id, {
        paymentStatus: paymentStatusUpdate.paymentStatus,
        paymentMethod: paymentStatusUpdate.paymentMethod || undefined,
        paymentTransactionId: paymentStatusUpdate.paymentTransactionId || undefined,
        description: paymentStatusUpdate.description,
      });
      setShowPaymentStatusModal(false);
      setSelectedOrder(null);
      setPaymentStatusUpdate({
        paymentStatus: '',
        paymentMethod: '',
        paymentTransactionId: '',
        description: '',
      });
      
      // Reload orders và refresh detail modal nếu đang mở
      await loadOrders();
      if (showDetailModal && selectedOrder) {
        const response = await apiGetAdminOrder(selectedOrder.id);
        setSelectedOrder(response.order);
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái thanh toán');
    }
  };

  const handleQuickPaymentStatusUpdate = async (order, newPaymentStatus) => {
    if (!window.confirm(`Bạn có chắc chắn muốn chuyển trạng thái thanh toán của đơn hàng ${order.code} sang "${getPaymentStatusLabel(newPaymentStatus)}"?`)) {
      return;
    }

    try {
      await apiUpdateAdminPaymentStatus(order.id, {
        paymentStatus: newPaymentStatus,
        description: `Chuyển trạng thái thanh toán từ ${getPaymentStatusLabel(order.paymentStatus)} sang ${getPaymentStatusLabel(newPaymentStatus)}`,
      });
      loadOrders();
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái thanh toán');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipping: 'bg-purple-100 text-purple-800',
      done: 'bg-green-100 text-green-800',
      canceled: 'bg-red-100 text-red-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Chờ xử lý',
      processing: 'Đang xử lý',
      shipping: 'Đang giao hàng',
      done: 'Hoàn thành',
      canceled: 'Đã hủy',
    };
    return labels[status] || status;
  };

  const getPaymentStatusBadge = (status) => {
    const badges = {
      unpaid: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusLabel = (status) => {
    const labels = {
      unpaid: 'Chưa thanh toán',
      paid: 'Đã thanh toán',
      failed: 'Thanh toán thất bại',
      refunded: 'Đã hoàn tiền',
    };
    return labels[status] || status;
  };

  const getPaymentMethodLabel = (method) => {
    const labels = {
      cod: 'Thanh toán khi nhận hàng',
      vnpay: 'VNPay',
      bank: 'Chuyển khoản',
      other: 'Khác',
    };
    return labels[method] || method || 'Chưa chọn';
  };

  const getNextStatusOptions = (currentStatus) => {
    const options = {
      pending: ['processing', 'canceled'],
      processing: ['shipping', 'canceled'],
      shipping: ['done', 'canceled'],
      done: [],
      canceled: [],
    };
    return options[currentStatus] || [];
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: ClockIcon,
      processing: CheckCircleIcon,
      shipping: TruckIcon,
      done: CheckCircleIcon,
      canceled: XCircleIcon,
    };
    return icons[status] || ClockIcon;
  };

  return (
    <TabLayout>
      <div>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Đơn hàng</h1>
          <p className="mt-1 text-sm text-gray-500">
            Xem và quản lý tất cả đơn hàng trong hệ thống
          </p>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm đơn hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="input-field pl-10"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="processing">Đang xử lý</option>
              <option value="shipping">Đang giao hàng</option>
              <option value="done">Hoàn thành</option>
              <option value="canceled">Đã hủy</option>
            </select>
            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">Tất cả thanh toán</option>
              <option value="unpaid">Chưa thanh toán</option>
              <option value="paid">Đã thanh toán</option>
              <option value="failed">Thanh toán thất bại</option>
              <option value="refunded">Đã hoàn tiền</option>
            </select>
            <button onClick={handleSearch} className="btn-primary">
              Tìm kiếm
            </button>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Đang tải...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-gray-500">Không có đơn hàng nào</p>
              </div>
            ) : (
              orders.map((order) => {
                const StatusIcon = getStatusIcon(order.status);
                const items = order.items || [];
                const totalItems = items.reduce((sum, item) => sum + (item.qty || 0), 0);

                return (
                  <div key={order.id} className="card hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* Order Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-bold text-gray-900">{order.code}</h3>
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(order.status)}`}>
                                {getStatusLabel(order.status)}
                              </span>
                              <span className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusBadge(order.paymentStatus)}`}>
                                {getPaymentStatusLabel(order.paymentStatus)}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>
                                <span className="font-medium">Khách hàng:</span> {order.shipName} • {order.shipPhone}
                              </p>
                              {order.user && (
                                <p>
                                  <span className="font-medium">Email:</span> {order.user.email || '-'}
                                </p>
                              )}
                              <p>
                                <span className="font-medium">Địa chỉ:</span> {order.shipAddressText}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Order Items Preview */}
                        {items.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-sm font-medium text-gray-700">
                                {totalItems} sản phẩm
                              </span>
                            </div>
                            <div className="flex space-x-2 overflow-x-auto pb-2">
                              {items.slice(0, 5).map((item, idx) => {
                                const images = item.productImageUrl
                                  ? (Array.isArray(item.productImageUrl)
                                      ? item.productImageUrl
                                      : JSON.parse(item.productImageUrl))
                                  : [];
                                return (
                                  <div key={idx} className="flex-shrink-0 flex items-center space-x-2 bg-gray-50 rounded-lg p-2">
                                    {images.length > 0 && (
                                      <img
                                        src={images[0]}
                                        alt={item.productName}
                                        className="w-12 h-12 object-cover rounded"
                                      />
                                    )}
                                    <div>
                                      <p className="text-xs font-medium text-gray-900 line-clamp-1">
                                        {item.productName}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        SL: {item.qty} × {formatPrice(item.unitPrice)}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                              {items.length > 5 && (
                                <div className="flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-lg w-16 h-16">
                                  <span className="text-xs font-medium text-gray-600">
                                    +{items.length - 5}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Order Summary */}
                        <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            <p>
                              <span className="font-medium">Ngày đặt:</span> {formatDate(order.placedAt)}
                            </p>
                            {order.paymentMethod && (
                              <p className="mt-1">
                                <span className="font-medium">Phương thức:</span> {getPaymentMethodLabel(order.paymentMethod)}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">
                              Tạm tính: {formatPrice(order.subtotal)}
                            </p>
                            {order.discountTotal > 0 && (
                              <p className="text-sm text-green-600">
                                Giảm: -{formatPrice(order.discountTotal)}
                              </p>
                            )}
                            {order.shippingFee > 0 && (
                              <p className="text-sm text-gray-600">
                                Phí ship: {formatPrice(order.shippingFee)}
                              </p>
                            )}
                            <p className="text-lg font-bold text-gray-900 mt-1">
                              Tổng: {formatPrice(order.total)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col space-y-2 md:ml-4">
                        <button
                          onClick={() => handleViewDetail(order)}
                          className="btn-secondary flex items-center justify-center"
                        >
                          <EyeIcon className="w-4 h-4 mr-2" />
                          Chi tiết
                        </button>
                        {order.status !== 'done' && order.status !== 'canceled' && (
                          <>
                            <button
                              onClick={() => handleOpenStatusModal(order)}
                              className="btn-primary flex items-center justify-center"
                            >
                              <StatusIcon className="w-4 h-4 mr-2" />
                              Cập nhật
                            </button>
                            {/* Quick Actions */}
                            <div className="flex flex-col space-y-1 pt-2 border-t border-gray-200">
                              <p className="text-xs text-gray-500 mb-1">Thao tác nhanh:</p>
                              {getNextStatusOptions(order.status).map((status) => {
                                const QuickIcon = getStatusIcon(status);
                                return (
                                  <button
                                    key={status}
                                    onClick={() => handleQuickStatusUpdate(order, status)}
                                    className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 flex items-center justify-center"
                                  >
                                    <QuickIcon className="w-3 h-3 mr-1" />
                                    {getStatusLabel(status)}
                                  </button>
                                );
                              })}
                              {order.status !== 'canceled' && (
                                <button
                                  onClick={() => handleQuickStatusUpdate(order, 'canceled')}
                                  className="text-xs px-2 py-1 bg-red-50 hover:bg-red-100 rounded text-red-700 flex items-center justify-center"
                                >
                                  <XCircleIcon className="w-3 h-3 mr-1" />
                                  Hủy đơn
                                </button>
                              )}
                            </div>
                          </>
                        )}
                        {/* Payment Status Quick Actions */}
                        <div className="flex flex-col space-y-1 pt-2 border-t border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Thanh toán:</p>
                          {order.paymentStatus !== 'paid' && (
                            <button
                              onClick={() => handleQuickPaymentStatusUpdate(order, 'paid')}
                              className="text-xs px-2 py-1 bg-green-50 hover:bg-green-100 rounded text-green-700 flex items-center justify-center"
                            >
                              <CheckCircleIcon className="w-3 h-3 mr-1" />
                              Đã thanh toán
                            </button>
                          )}
                          {order.paymentStatus !== 'unpaid' && order.paymentStatus !== 'refunded' && (
                            <button
                              onClick={() => handleQuickPaymentStatusUpdate(order, 'unpaid')}
                              className="text-xs px-2 py-1 bg-yellow-50 hover:bg-yellow-100 rounded text-yellow-700 flex items-center justify-center"
                            >
                              <ClockIcon className="w-3 h-3 mr-1" />
                              Chưa thanh toán
                            </button>
                          )}
                          {order.paymentStatus === 'paid' && (
                            <button
                              onClick={() => handleQuickPaymentStatusUpdate(order, 'refunded')}
                              className="text-xs px-2 py-1 bg-gray-50 hover:bg-gray-100 rounded text-gray-700 flex items-center justify-center"
                            >
                              <CurrencyDollarIcon className="w-3 h-3 mr-1" />
                              Hoàn tiền
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenPaymentStatusModal(order)}
                            className="text-xs px-2 py-1 bg-blue-50 hover:bg-blue-100 rounded text-blue-700 flex items-center justify-center"
                          >
                            <CreditCardIcon className="w-3 h-3 mr-1" />
                            Chi tiết
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Order Detail Modal */}
        {showDetailModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                  Chi tiết đơn hàng: {selectedOrder.code}
                </h2>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedOrder(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Order Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Trạng thái đơn hàng</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadge(selectedOrder.status)}`}>
                        {getStatusLabel(selectedOrder.status)}
                      </span>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getPaymentStatusBadge(selectedOrder.paymentStatus)}`}>
                        {getPaymentStatusLabel(selectedOrder.paymentStatus)}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {selectedOrder.status !== 'done' && selectedOrder.status !== 'canceled' && (
                      <button
                        onClick={() => {
                          setShowDetailModal(false);
                          handleOpenStatusModal(selectedOrder);
                        }}
                        className="btn-primary"
                      >
                        Cập nhật trạng thái
                      </button>
                    )}
                    {selectedOrder.paymentStatus !== 'refunded' && (
                      <button
                        onClick={() => {
                          setShowDetailModal(false);
                          handleOpenPaymentStatusModal(selectedOrder);
                        }}
                        className="btn-primary bg-green-600 hover:bg-green-700"
                      >
                        <CreditCardIcon className="w-4 h-4 inline mr-2" />
                        Cập nhật thanh toán
                      </button>
                    )}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="card">
                    <h3 className="font-semibold text-gray-900 mb-3">Thông tin khách hàng</h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-gray-600">Tên:</span>{' '}
                        <span className="font-medium">{selectedOrder.shipName}</span>
                      </p>
                      <p>
                        <span className="text-gray-600">SĐT:</span>{' '}
                        <span className="font-medium">{selectedOrder.shipPhone}</span>
                      </p>
                      {selectedOrder.user && (
                        <>
                          <p>
                            <span className="text-gray-600">Email:</span>{' '}
                            <span className="font-medium">{selectedOrder.user.email || '-'}</span>
                          </p>
                          <p>
                            <span className="text-gray-600">ID:</span>{' '}
                            <span className="font-medium">#{selectedOrder.user.id}</span>
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="font-semibold text-gray-900 mb-3">Địa chỉ giao hàng</h3>
                    <p className="text-sm text-gray-700">{selectedOrder.shipAddressText}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      Phương thức: {selectedOrder.shippingMethod === 'fast' ? 'Giao nhanh' : 'Giao tiêu chuẩn'}
                    </p>
                    {selectedOrder.shippingFee > 0 && (
                      <p className="text-sm text-gray-600">
                        Phí ship: {formatPrice(selectedOrder.shippingFee)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-4">Sản phẩm</h3>
                  <div className="space-y-3">
                    {(selectedOrder.items || []).map((item) => {
                      const images = item.productImageUrl
                        ? (Array.isArray(item.productImageUrl)
                            ? item.productImageUrl
                            : JSON.parse(item.productImageUrl))
                        : [];
                      return (
                        <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                          {images.length > 0 && (
                            <img
                              src={images[0]}
                              alt={item.productName}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.productName}</p>
                            <p className="text-sm text-gray-600">
                              Số lượng: {item.qty} × {formatPrice(item.unitPrice)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">
                              {formatPrice(item.lineTotal)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Payment Info */}
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-4">Thông tin thanh toán</h3>
                  <div className="space-y-2 text-sm">
                    {selectedOrder.paymentMethod && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phương thức:</span>
                        <span className="font-medium">{getPaymentMethodLabel(selectedOrder.paymentMethod)}</span>
                      </div>
                    )}
                    {selectedOrder.paymentTransactionId && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mã giao dịch:</span>
                        <span className="font-medium font-mono">{selectedOrder.paymentTransactionId}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-4">Tổng kết</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tạm tính:</span>
                      <span className="font-medium">{formatPrice(selectedOrder.subtotal)}</span>
                    </div>
                    {selectedOrder.discountTotal > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Giảm giá:</span>
                        <span className="font-medium text-green-600">
                          -{formatPrice(selectedOrder.discountTotal)}
                        </span>
                      </div>
                    )}
                    {selectedOrder.shippingFee > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Phí vận chuyển:</span>
                        <span className="font-medium">{formatPrice(selectedOrder.shippingFee)}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
                      <span className="font-semibold text-gray-900">Tổng cộng:</span>
                      <span className="text-xl font-bold text-primary-600">
                        {formatPrice(selectedOrder.total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status History */}
                {selectedOrder.history && selectedOrder.history.length > 0 && (
                  <div className="card">
                    <h3 className="font-semibold text-gray-900 mb-4">Lịch sử trạng thái</h3>
                    <div className="space-y-3">
                      {selectedOrder.history.map((history, idx) => {
                        const HistoryIcon = getStatusIcon(history.status);
                        const isLatest = idx === selectedOrder.history.length - 1;
                        return (
                          <div key={history.id} className="flex items-start space-x-3">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                              isLatest ? 'bg-primary-100' : 'bg-gray-100'
                            }`}>
                              <HistoryIcon className={`w-4 h-4 ${
                                isLatest ? 'text-primary-600' : 'text-gray-400'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{history.title}</p>
                              {history.description && (
                                <p className="text-sm text-gray-600">{history.description}</p>
                              )}
                              <p className="text-xs text-gray-500 mt-1">
                                {formatDate(history.happenedAt)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Update Status Modal */}
        {showStatusModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Cập nhật trạng thái đơn hàng</h3>
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setSelectedOrder(null);
                    setStatusUpdate({ status: '', description: '' });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {/* Order Info */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">Mã đơn hàng</p>
                  <p className="font-semibold text-gray-900">{selectedOrder.code}</p>
                </div>

                {/* Current Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái hiện tại
                  </label>
                  <div className={`px-4 py-3 rounded-lg flex items-center space-x-2 ${getStatusBadge(selectedOrder.status)}`}>
                    {(() => {
                      const CurrentIcon = getStatusIcon(selectedOrder.status);
                      return <CurrentIcon className="w-5 h-5" />;
                    })()}
                    <span className="font-medium">{getStatusLabel(selectedOrder.status)}</span>
                  </div>
                </div>

                {/* New Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chuyển sang trạng thái <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={statusUpdate.status}
                    onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Chọn trạng thái</option>
                    {getNextStatusOptions(selectedOrder.status).map((status) => (
                      <option key={status} value={status}>
                        {getStatusLabel(status)}
                      </option>
                    ))}
                    {selectedOrder.status !== 'canceled' && (
                      <option value="canceled">Đã hủy</option>
                    )}
                  </select>
                  {statusUpdate.status && statusUpdate.status !== selectedOrder.status && (
                    <div className={`mt-2 px-4 py-3 rounded-lg flex items-center space-x-2 ${getStatusBadge(statusUpdate.status)}`}>
                      {(() => {
                        const NewIcon = getStatusIcon(statusUpdate.status);
                        return <NewIcon className="w-5 h-5" />;
                      })()}
                      <span className="font-medium">{getStatusLabel(statusUpdate.status)}</span>
                    </div>
                  )}
                </div>

                {/* Quick Status Buttons */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hoặc chọn nhanh:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {getNextStatusOptions(selectedOrder.status).map((status) => {
                      const QuickIcon = getStatusIcon(status);
                      const isSelected = statusUpdate.status === status;
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setStatusUpdate({ ...statusUpdate, status })}
                          className={`px-3 py-2 rounded-lg border-2 flex items-center justify-center space-x-2 transition-colors ${
                            isSelected
                              ? `${getStatusBadge(status)} border-current`
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <QuickIcon className="w-4 h-4" />
                          <span className="text-sm font-medium">{getStatusLabel(status)}</span>
                        </button>
                      );
                    })}
                    {selectedOrder.status !== 'canceled' && (
                      <button
                        type="button"
                        onClick={() => setStatusUpdate({ ...statusUpdate, status: 'canceled' })}
                        className={`px-3 py-2 rounded-lg border-2 flex items-center justify-center space-x-2 transition-colors ${
                          statusUpdate.status === 'canceled'
                            ? 'bg-red-100 text-red-800 border-red-300'
                            : 'border-gray-200 hover:border-red-200 bg-white'
                        }`}
                      >
                        <XCircleIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">Hủy đơn</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú (tùy chọn)
                  </label>
                  <textarea
                    value={statusUpdate.description}
                    onChange={(e) => setStatusUpdate({ ...statusUpdate, description: e.target.value })}
                    className="input-field"
                    rows="3"
                    placeholder="Nhập ghi chú về việc thay đổi trạng thái..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Ghi chú này sẽ được lưu vào lịch sử trạng thái đơn hàng
                  </p>
                </div>

                {/* Warning for important status changes */}
                {statusUpdate.status === 'canceled' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-800">
                      ⚠️ Lưu ý: Hủy đơn hàng sẽ không thể hoàn tác. Vui lòng xác nhận lại.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setSelectedOrder(null);
                    setStatusUpdate({ status: '', description: '' });
                  }}
                  className="btn-secondary"
                >
                  Hủy
                </button>
                <button
                  onClick={handleUpdateStatus}
                  disabled={!statusUpdate.status || statusUpdate.status === selectedOrder.status}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Xác nhận cập nhật
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Update Payment Status Modal */}
        {showPaymentStatusModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Cập nhật trạng thái thanh toán</h3>
                <button
                  onClick={() => {
                    setShowPaymentStatusModal(false);
                    setSelectedOrder(null);
                    setPaymentStatusUpdate({
                      paymentStatus: '',
                      paymentMethod: '',
                      paymentTransactionId: '',
                      description: '',
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {/* Order Info */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">Mã đơn hàng</p>
                  <p className="font-semibold text-gray-900">{selectedOrder.code}</p>
                </div>

                {/* Current Payment Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái thanh toán hiện tại
                  </label>
                  <div className={`px-4 py-3 rounded-lg flex items-center space-x-2 ${getPaymentStatusBadge(selectedOrder.paymentStatus)}`}>
                    <CreditCardIcon className="w-5 h-5" />
                    <span className="font-medium">{getPaymentStatusLabel(selectedOrder.paymentStatus)}</span>
                  </div>
                </div>

                {/* New Payment Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chuyển sang trạng thái <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={paymentStatusUpdate.paymentStatus}
                    onChange={(e) => setPaymentStatusUpdate({ ...paymentStatusUpdate, paymentStatus: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Chọn trạng thái</option>
                    {selectedOrder.paymentStatus !== 'unpaid' && (
                      <option value="unpaid">Chưa thanh toán</option>
                    )}
                    {selectedOrder.paymentStatus !== 'paid' && (
                      <option value="paid">Đã thanh toán</option>
                    )}
                    {selectedOrder.paymentStatus !== 'failed' && (
                      <option value="failed">Thanh toán thất bại</option>
                    )}
                    {selectedOrder.paymentStatus === 'paid' && (
                      <option value="refunded">Đã hoàn tiền</option>
                    )}
                  </select>
                  {paymentStatusUpdate.paymentStatus && paymentStatusUpdate.paymentStatus !== selectedOrder.paymentStatus && (
                    <div className={`mt-2 px-4 py-3 rounded-lg flex items-center space-x-2 ${getPaymentStatusBadge(paymentStatusUpdate.paymentStatus)}`}>
                      <CreditCardIcon className="w-5 h-5" />
                      <span className="font-medium">{getPaymentStatusLabel(paymentStatusUpdate.paymentStatus)}</span>
                    </div>
                  )}
                </div>

                {/* Payment Method */}
                {paymentStatusUpdate.paymentStatus === 'paid' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phương thức thanh toán
                    </label>
                    <select
                      value={paymentStatusUpdate.paymentMethod}
                      onChange={(e) => setPaymentStatusUpdate({ ...paymentStatusUpdate, paymentMethod: e.target.value })}
                      className="input-field"
                    >
                      <option value="">Chọn phương thức</option>
                      <option value="cod">Thanh toán khi nhận hàng (COD)</option>
                      <option value="vnpay">VNPay</option>
                      <option value="bank">Chuyển khoản ngân hàng</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                )}

                {/* Transaction ID */}
                {(paymentStatusUpdate.paymentStatus === 'paid' || paymentStatusUpdate.paymentStatus === 'refunded') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mã giao dịch (tùy chọn)
                    </label>
                    <input
                      type="text"
                      value={paymentStatusUpdate.paymentTransactionId}
                      onChange={(e) => setPaymentStatusUpdate({ ...paymentStatusUpdate, paymentTransactionId: e.target.value })}
                      className="input-field"
                      placeholder="Nhập mã giao dịch nếu có"
                    />
                  </div>
                )}

                {/* Quick Payment Status Buttons */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hoặc chọn nhanh:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedOrder.paymentStatus !== 'unpaid' && (
                      <button
                        type="button"
                        onClick={() => setPaymentStatusUpdate({ ...paymentStatusUpdate, paymentStatus: 'unpaid' })}
                        className={`px-3 py-2 rounded-lg border-2 flex items-center justify-center space-x-2 transition-colors ${
                          paymentStatusUpdate.paymentStatus === 'unpaid'
                            ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                            : 'border-gray-200 hover:border-yellow-200 bg-white'
                        }`}
                      >
                        <ClockIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">Chưa thanh toán</span>
                      </button>
                    )}
                    {selectedOrder.paymentStatus !== 'paid' && (
                      <button
                        type="button"
                        onClick={() => setPaymentStatusUpdate({ ...paymentStatusUpdate, paymentStatus: 'paid' })}
                        className={`px-3 py-2 rounded-lg border-2 flex items-center justify-center space-x-2 transition-colors ${
                          paymentStatusUpdate.paymentStatus === 'paid'
                            ? 'bg-green-100 text-green-800 border-green-300'
                            : 'border-gray-200 hover:border-green-200 bg-white'
                        }`}
                      >
                        <CheckCircleIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">Đã thanh toán</span>
                      </button>
                    )}
                    {selectedOrder.paymentStatus !== 'failed' && (
                      <button
                        type="button"
                        onClick={() => setPaymentStatusUpdate({ ...paymentStatusUpdate, paymentStatus: 'failed' })}
                        className={`px-3 py-2 rounded-lg border-2 flex items-center justify-center space-x-2 transition-colors ${
                          paymentStatusUpdate.paymentStatus === 'failed'
                            ? 'bg-red-100 text-red-800 border-red-300'
                            : 'border-gray-200 hover:border-red-200 bg-white'
                        }`}
                      >
                        <XCircleIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">Thất bại</span>
                      </button>
                    )}
                    {selectedOrder.paymentStatus === 'paid' && (
                      <button
                        type="button"
                        onClick={() => setPaymentStatusUpdate({ ...paymentStatusUpdate, paymentStatus: 'refunded' })}
                        className={`px-3 py-2 rounded-lg border-2 flex items-center justify-center space-x-2 transition-colors ${
                          paymentStatusUpdate.paymentStatus === 'refunded'
                            ? 'bg-gray-100 text-gray-800 border-gray-300'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <CurrencyDollarIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">Hoàn tiền</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú (tùy chọn)
                  </label>
                  <textarea
                    value={paymentStatusUpdate.description}
                    onChange={(e) => setPaymentStatusUpdate({ ...paymentStatusUpdate, description: e.target.value })}
                    className="input-field"
                    rows="3"
                    placeholder="Nhập ghi chú về việc thay đổi trạng thái thanh toán..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Ghi chú này sẽ được lưu vào lịch sử trạng thái đơn hàng
                  </p>
                </div>

                {/* Warning for important status changes */}
                {paymentStatusUpdate.paymentStatus === 'refunded' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-800">
                      ⚠️ Lưu ý: Hoàn tiền sẽ không thể hoàn tác. Vui lòng xác nhận lại.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowPaymentStatusModal(false);
                    setSelectedOrder(null);
                    setPaymentStatusUpdate({
                      paymentStatus: '',
                      paymentMethod: '',
                      paymentTransactionId: '',
                      description: '',
                    });
                  }}
                  className="btn-secondary"
                >
                  Hủy
                </button>
                <button
                  onClick={handleUpdatePaymentStatus}
                  disabled={!paymentStatusUpdate.paymentStatus || paymentStatusUpdate.paymentStatus === selectedOrder.paymentStatus}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Xác nhận cập nhật
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TabLayout>
  );
}
