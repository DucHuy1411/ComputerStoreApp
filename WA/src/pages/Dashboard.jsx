import { useEffect, useState } from 'react';
import TabLayout from '../components/Layout/TabLayout';
import {
  ShoppingBagIcon,
  CubeIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { apiGetDashboardStats } from '../services/endpoints';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await apiGetDashboardStats();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
        setError(err.response?.data?.message || 'Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
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

  const getStatusBadgeColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipping: 'bg-purple-100 text-purple-800',
      done: 'bg-green-100 text-green-800',
      canceled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusBadgeColor = (status) => {
    const colors = {
      unpaid: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <TabLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Đang tải dữ liệu...</p>
          </div>
        </div>
      </TabLayout>
    );
  }

  if (error) {
    return (
      <TabLayout>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </TabLayout>
    );
  }

  if (!stats) {
    return null;
  }

  const overviewCards = [
    {
      name: 'Tổng đơn hàng',
      value: stats.overview.totalOrders,
      icon: ShoppingBagIcon,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgGradient: 'from-blue-500 to-blue-600',
    },
    {
      name: 'Sản phẩm',
      value: stats.overview.totalProducts,
      icon: CubeIcon,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgGradient: 'from-green-500 to-green-600',
    },
    {
      name: 'Khách hàng',
      value: stats.overview.totalCustomers,
      icon: UsersIcon,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgGradient: 'from-yellow-500 to-yellow-600',
    },
    {
      name: 'Tổng doanh thu',
      value: formatCurrency(stats.revenue.total),
      icon: CurrencyDollarIcon,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgGradient: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <TabLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Tổng quan hệ thống và thống kê kinh doanh
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {overviewCards.map((card) => (
            <div
              key={card.name}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{card.name}</p>
                  <p className={`text-2xl font-bold ${card.textColor}`}>
                    {typeof card.value === 'number' ? card.value.toLocaleString('vi-VN') : card.value}
                  </p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Stats */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Doanh thu hôm nay</h3>
              <CurrencyDollarIcon className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.revenue.today)}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {stats.orders.today} đơn hàng
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Doanh thu tháng này</h3>
              <ChartBarIcon className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(stats.revenue.thisMonth)}
            </p>
            <div className="flex items-center mt-2">
              {stats.revenue.growth >= 0 ? (
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${stats.revenue.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(stats.revenue.growth)}% so với tháng trước
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Đơn hàng tháng này</h3>
              <ShoppingBagIcon className="h-5 w-5 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-purple-600">
              {stats.orders.thisMonth.toLocaleString('vi-VN')}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {stats.orders.today} đơn hôm nay
            </p>
          </div>
        </div>

        {/* Orders Status & Product Alerts */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Orders by Status */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Đơn hàng theo trạng thái</h3>
            <div className="space-y-3">
              {Object.entries(stats.orders.byStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {status === 'pending' ? 'Chờ xử lý' :
                     status === 'processing' ? 'Đang xử lý' :
                     status === 'shipping' ? 'Đang giao' :
                     status === 'done' ? 'Hoàn thành' :
                     status === 'canceled' ? 'Đã hủy' : status}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-900">{count}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(status)}`}>
                      {status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Alerts */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cảnh báo sản phẩm</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-sm font-medium text-gray-900">Hết hàng</span>
                </div>
                <span className="text-lg font-bold text-red-600">
                  {stats.products.outOfStock}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="text-sm font-medium text-gray-900">Sắp hết hàng</span>
                </div>
                <span className="text-lg font-bold text-yellow-600">
                  {stats.products.lowStock}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Products & Recent Orders */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 5 sản phẩm bán chạy</h3>
            <div className="space-y-3">
              {stats.topProducts && stats.topProducts.length > 0 ? (
                stats.topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-600">#{index + 1}</span>
                    </div>
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">{formatCurrency(product.price)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{product.totalSold}</p>
                      <p className="text-xs text-gray-500">đã bán</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">Chưa có dữ liệu</p>
              )}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Đơn hàng gần đây</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {stats.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <div key={order.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-900">{order.code}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    {order.customer && (
                      <p className="text-xs text-gray-600 mb-1">
                        {order.customer.name} • {order.customer.phone}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold text-gray-900">
                        {formatCurrency(order.total)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadgeColor(order.paymentStatus)}`}>
                        {order.paymentStatus === 'paid' ? 'Đã thanh toán' :
                         order.paymentStatus === 'unpaid' ? 'Chưa thanh toán' :
                         order.paymentStatus === 'failed' ? 'Thất bại' :
                         order.paymentStatus === 'refunded' ? 'Đã hoàn tiền' : order.paymentStatus}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(order.placedAt)}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">Chưa có đơn hàng</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </TabLayout>
  );
}
