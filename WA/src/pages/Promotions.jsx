import { useEffect, useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import TabLayout from '../components/Layout/TabLayout';
import {
  apiGetAdminPromotions,
  apiGetAdminPromotion,
  apiCreateAdminPromotion,
  apiUpdateAdminPromotion,
  apiDeleteAdminPromotion,
  apiAddPromotionItem,
  apiRemovePromotionItem,
  apiGetProducts,
} from '../services/endpoints';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  TagIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ShoppingBagIcon,
  FireIcon,
} from '@heroicons/react/24/outline';

const initialPromotionState = {
  type: 'voucher',
  title: '',
  code: '',
  discountType: 'amount',
  discountValue: 0,
  minOrderAmount: 0,
  startsAt: '',
  endsAt: '',
  isActive: true,
  data: null,
};

export default function Promotions() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'voucher'; // 'voucher' or 'flash_sale'
  
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState(activeTab === 'flash_sale' ? 'flash_sale' : 'voucher');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isItemsModalOpen, setIsItemsModalOpen] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState(null);
  const [promotionToDelete, setPromotionToDelete] = useState(null);
  const [form, setForm] = useState(initialPromotionState);
  const [formErrors, setFormErrors] = useState({});
  const [promotionItems, setPromotionItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [newItem, setNewItem] = useState({ productId: '', discountPct: 0, stockLimit: '' });

  const loadPromotions = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        limit: 200,
        type: typeFilter !== 'all' ? typeFilter : undefined,
        isActive: statusFilter !== 'all' ? statusFilter : undefined,
        q: searchTerm || undefined,
      };
      const response = await apiGetAdminPromotions(params);
      setPromotions(response.promotions || []);
    } catch (error) {
      console.error('Error loading promotions:', error);
    } finally {
      setLoading(false);
    }
  }, [typeFilter, statusFilter, searchTerm]);

  // Update typeFilter when activeTab changes
  useEffect(() => {
    const newTypeFilter = activeTab === 'flash_sale' ? 'flash_sale' : 'voucher';
    setTypeFilter(newTypeFilter);
  }, [activeTab]);

  const handleTabChange = (tab) => {
    navigate(`/promotions?tab=${tab}`);
  };

  useEffect(() => {
    loadPromotions();
  }, [loadPromotions]);

  const loadProducts = async () => {
    try {
      const response = await apiGetProducts({ limit: 1000, status: 'active' });
      setProducts(response.products || []);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleSearch = () => {
    loadPromotions();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!form.title) errors.title = 'Tiêu đề là bắt buộc.';
    if (form.type === 'voucher') {
      if (!form.code) errors.code = 'Mã khuyến mãi là bắt buộc cho voucher.';
      if (!form.discountValue || Number(form.discountValue) <= 0) {
        errors.discountValue = 'Giá trị giảm giá phải lớn hơn 0.';
      }
    }
    if (form.startsAt && form.endsAt && new Date(form.startsAt) >= new Date(form.endsAt)) {
      errors.endsAt = 'Ngày kết thúc phải sau ngày bắt đầu.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSavePromotion = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        ...form,
        discountValue: form.discountValue ? Number(form.discountValue) : null,
        minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : null,
        startsAt: form.startsAt || null,
        endsAt: form.endsAt || null,
      };

      if (currentPromotion) {
        await apiUpdateAdminPromotion(currentPromotion.id, payload);
      } else {
        await apiCreateAdminPromotion(payload);
      }
      setIsModalOpen(false);
      setCurrentPromotion(null);
      setForm(initialPromotionState);
      setFormErrors({});
      loadPromotions();
    } catch (error) {
      console.error('Error saving promotion:', error);
      setFormErrors({ api: error.response?.data?.message || 'Lỗi khi lưu khuyến mãi.' });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (promotion) => {
    setCurrentPromotion(promotion);
    setForm({
      type: promotion.type,
      title: promotion.title || '',
      code: promotion.code || '',
      discountType: promotion.discountType || 'amount',
      discountValue: promotion.discountValue || 0,
      minOrderAmount: promotion.minOrderAmount || 0,
      startsAt: promotion.startsAt ? new Date(promotion.startsAt).toISOString().slice(0, 16) : '',
      endsAt: promotion.endsAt ? new Date(promotion.endsAt).toISOString().slice(0, 16) : '',
      isActive: promotion.isActive,
      data: promotion.data,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setCurrentPromotion(null);
    setForm({
      ...initialPromotionState,
      type: activeTab === 'flash_sale' ? 'flash_sale' : 'voucher',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleDeleteClick = (promotion) => {
    setPromotionToDelete(promotion);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!promotionToDelete) return;
    setLoading(true);
    try {
      await apiDeleteAdminPromotion(promotionToDelete.id);
      setIsDeleteModalOpen(false);
      setPromotionToDelete(null);
      loadPromotions();
    } catch (error) {
      console.error('Error deleting promotion:', error);
      alert(error.response?.data?.message || 'Lỗi khi xóa khuyến mãi.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (promotion) => {
    setLoading(true);
    try {
      await apiUpdateAdminPromotion(promotion.id, { isActive: !promotion.isActive });
      loadPromotions();
    } catch (error) {
      console.error('Error updating promotion status:', error);
      alert(error.response?.data?.message || 'Lỗi khi cập nhật trạng thái.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewItems = async (promotion) => {
    if (promotion.type !== 'flash_sale') return;
    try {
      const response = await apiGetAdminPromotion(promotion.id);
      setCurrentPromotion(response.promotion);
      setPromotionItems(response.promotion.items || []);
      await loadProducts();
      setIsItemsModalOpen(true);
    } catch (error) {
      console.error('Error loading promotion items:', error);
      alert('Không thể tải danh sách sản phẩm.');
    }
  };

  const handleAddItem = async () => {
    if (!newItem.productId || !newItem.discountPct) {
      alert('Vui lòng chọn sản phẩm và nhập phần trăm giảm giá.');
      return;
    }

    try {
      await apiAddPromotionItem(currentPromotion.id, {
        productId: newItem.productId,
        discountPct: Number(newItem.discountPct),
        stockLimit: newItem.stockLimit ? Number(newItem.stockLimit) : null,
      });
      const response = await apiGetAdminPromotion(currentPromotion.id);
      setPromotionItems(response.promotion.items || []);
      setNewItem({ productId: '', discountPct: 0, stockLimit: '' });
    } catch (error) {
      console.error('Error adding promotion item:', error);
      alert(error.response?.data?.message || 'Lỗi khi thêm sản phẩm.');
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi flash sale?')) {
      return;
    }

    try {
      await apiRemovePromotionItem(currentPromotion.id, itemId);
      const response = await apiGetAdminPromotion(currentPromotion.id);
      setPromotionItems(response.promotion.items || []);
    } catch (error) {
      console.error('Error removing promotion item:', error);
      alert(error.response?.data?.message || 'Lỗi khi xóa sản phẩm.');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeBadge = (type) => {
    return type === 'flash_sale'
      ? 'bg-orange-100 text-orange-800'
      : 'bg-blue-100 text-blue-800';
  };

  const getTypeLabel = (type) => {
    return type === 'flash_sale' ? 'Flash Sale' : 'Voucher';
  };

  const getStatusBadge = (isActive) => {
    return isActive
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-800';
  };

  const getDiscountText = (promotion) => {
    if (promotion.type === 'voucher') {
      if (promotion.discountType === 'amount') {
        return `Giảm ${formatPrice(promotion.discountValue)}`;
      } else {
        return `Giảm ${promotion.discountValue}%`;
      }
    }
    return 'Flash Sale';
  };

  const isExpired = (promotion) => {
    if (!promotion.endsAt) return false;
    return new Date(promotion.endsAt) < new Date();
  };

  const isUpcoming = (promotion) => {
    if (!promotion.startsAt) return false;
    return new Date(promotion.startsAt) > new Date();
  };

  return (
    <TabLayout>
      <div>
        {/* Sub Navigation */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 border-b border-gray-200">
            <button
              onClick={() => handleTabChange('voucher')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'voucher'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Voucher
            </button>
            <button
              onClick={() => handleTabChange('flash_sale')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'flash_sale'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Flash Sale
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {activeTab === 'flash_sale' ? 'Quản lý Flash Sale' : 'Quản lý Voucher'}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {activeTab === 'flash_sale'
                  ? 'Quản lý các chương trình flash sale và sản phẩm'
                  : 'Quản lý các mã giảm giá voucher'}
              </p>
            </div>
            {activeTab === 'flash_sale' && (
              <Link
                to="/promotion-items"
                className="btn-primary bg-orange-600 hover:bg-orange-700 flex items-center justify-center"
              >
                <FireIcon className="w-5 h-5 mr-2" />
                Quản lý Sản phẩm
              </Link>
            )}
            {activeTab === 'voucher' && (
              <button onClick={handleAddClick} className="btn-primary flex items-center justify-center">
                <PlusIcon className="w-5 h-5 mr-2" />
                Thêm Voucher
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm khuyến mãi..."
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
              <option value="true">Đang hoạt động</option>
              <option value="false">Đã tắt</option>
            </select>
            <div className="flex space-x-2">
              <button onClick={handleSearch} className="btn-secondary flex-1">
                Tìm kiếm
              </button>
              {activeTab === 'flash_sale' && (
                <button onClick={handleAddClick} className="btn-primary flex items-center justify-center">
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Thêm Flash Sale
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Promotions List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Đang tải...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.length > 0 ? (
              promotions.map((promotion) => (
                <div key={promotion.id} className="card hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 text-xs rounded-full font-semibold ${getTypeBadge(promotion.type)}`}>
                          {getTypeLabel(promotion.type)}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full font-semibold ${getStatusBadge(promotion.isActive)}`}>
                          {promotion.isActive ? 'Hoạt động' : 'Đã tắt'}
                        </span>
                        {isExpired(promotion) && (
                          <span className="px-2 py-1 text-xs rounded-full font-semibold bg-red-100 text-red-800">
                            Hết hạn
                          </span>
                        )}
                        {isUpcoming(promotion) && (
                          <span className="px-2 py-1 text-xs rounded-full font-semibold bg-yellow-100 text-yellow-800">
                            Sắp diễn ra
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{promotion.title}</h3>
                      {promotion.code && (
                        <p className="text-sm text-gray-600 mb-2">
                          <TagIcon className="w-4 h-4 inline mr-1" />
                          Mã: <span className="font-mono font-semibold">{promotion.code}</span>
                        </p>
                      )}
                      <p className="text-lg font-bold text-primary-600 mb-2">
                        {getDiscountText(promotion)}
                      </p>
                      {promotion.minOrderAmount > 0 && (
                        <p className="text-sm text-gray-600 mb-2">
                          Áp dụng cho đơn từ {formatPrice(promotion.minOrderAmount)}
                        </p>
                      )}
                      {promotion.type === 'flash_sale' && (
                        <p className="text-sm text-gray-600 mb-2">
                          <ShoppingBagIcon className="w-4 h-4 inline mr-1" />
                          {promotion.items?.length || 0} sản phẩm
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <ClockIcon className="w-4 h-4 mr-2" />
                      <div>
                        {promotion.startsAt && (
                          <p>Bắt đầu: {formatDate(promotion.startsAt)}</p>
                        )}
                        {promotion.endsAt && (
                          <p>Kết thúc: {formatDate(promotion.endsAt)}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      {promotion.type === 'flash_sale' && (
                        <button
                          onClick={() => handleViewItems(promotion)}
                          className="btn-secondary flex-1 text-sm"
                        >
                          Quản lý SP
                        </button>
                      )}
                      <button
                        onClick={() => handleEditClick(promotion)}
                        className="btn-secondary flex-1 text-sm"
                      >
                        <PencilIcon className="w-4 h-4 inline mr-1" />
                        Sửa
                      </button>
                      <button
                        onClick={() => handleToggleStatus(promotion)}
                        className={`flex-1 text-sm px-3 py-2 rounded-lg ${
                          promotion.isActive
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {promotion.isActive ? (
                          <>
                            <XCircleIcon className="w-4 h-4 inline mr-1" />
                            Tắt
                          </>
                        ) : (
                          <>
                            <CheckCircleIcon className="w-4 h-4 inline mr-1" />
                            Bật
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteClick(promotion)}
                        className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full card text-center py-12">
                <p className="text-gray-500">Không tìm thấy khuyến mãi nào.</p>
              </div>
            )}
          </div>
        )}

        {/* Add/Edit Promotion Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  {currentPromotion ? 'Sửa khuyến mãi' : 'Thêm khuyến mãi mới'}
                </h3>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setCurrentPromotion(null);
                    setForm(initialPromotionState);
                    setFormErrors({});
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSavePromotion(); }} className="space-y-4">
                {formErrors.api && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {formErrors.api}
                  </div>
                )}

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    Loại khuyến mãi <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={form.type}
                    onChange={handleInputChange}
                    className="input-field mt-1"
                    disabled={!!currentPromotion}
                  >
                    <option value="voucher">Voucher</option>
                    <option value="flash_sale">Flash Sale</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Tiêu đề <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleInputChange}
                    className="input-field mt-1"
                    placeholder="Ví dụ: Voucher Laptop, Flash Sale tháng 12"
                    required
                  />
                  {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
                </div>

                {form.type === 'voucher' && (
                  <>
                    <div>
                      <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                        Mã khuyến mãi <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="code"
                        name="code"
                        value={form.code}
                        onChange={handleInputChange}
                        className="input-field mt-1"
                        placeholder="TECH500"
                        required
                      />
                      {formErrors.code && <p className="text-red-500 text-xs mt-1">{formErrors.code}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="discountType" className="block text-sm font-medium text-gray-700">
                          Loại giảm giá
                        </label>
                        <select
                          id="discountType"
                          name="discountType"
                          value={form.discountType}
                          onChange={handleInputChange}
                          className="input-field mt-1"
                        >
                          <option value="amount">Giảm số tiền (VND)</option>
                          <option value="percent">Giảm phần trăm (%)</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700">
                          Giá trị giảm <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          id="discountValue"
                          name="discountValue"
                          value={form.discountValue}
                          onChange={handleInputChange}
                          className="input-field mt-1"
                          placeholder={form.discountType === 'amount' ? '500000' : '10'}
                          min="0"
                          step={form.discountType === 'amount' ? '1000' : '1'}
                          required
                        />
                        {formErrors.discountValue && <p className="text-red-500 text-xs mt-1">{formErrors.discountValue}</p>}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="minOrderAmount" className="block text-sm font-medium text-gray-700">
                        Đơn tối thiểu (VND)
                      </label>
                      <input
                        type="number"
                        id="minOrderAmount"
                        name="minOrderAmount"
                        value={form.minOrderAmount}
                        onChange={handleInputChange}
                        className="input-field mt-1"
                        placeholder="0"
                        min="0"
                        step="1000"
                      />
                    </div>
                  </>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startsAt" className="block text-sm font-medium text-gray-700">
                      Ngày bắt đầu
                    </label>
                    <input
                      type="datetime-local"
                      id="startsAt"
                      name="startsAt"
                      value={form.startsAt}
                      onChange={handleInputChange}
                      className="input-field mt-1"
                    />
                  </div>

                  <div>
                    <label htmlFor="endsAt" className="block text-sm font-medium text-gray-700">
                      Ngày kết thúc
                    </label>
                    <input
                      type="datetime-local"
                      id="endsAt"
                      name="endsAt"
                      value={form.endsAt}
                      onChange={handleInputChange}
                      className="input-field mt-1"
                    />
                    {formErrors.endsAt && <p className="text-red-500 text-xs mt-1">{formErrors.endsAt}</p>}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    checked={form.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    Kích hoạt khuyến mãi
                  </label>
                </div>

                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setCurrentPromotion(null);
                      setForm(initialPromotionState);
                      setFormErrors({});
                    }}
                    className="btn-secondary"
                  >
                    Hủy
                  </button>
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Đang lưu...' : currentPromotion ? 'Cập nhật' : 'Tạo mới'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Promotion Items Modal (Flash Sale) */}
        {isItemsModalOpen && currentPromotion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Quản lý sản phẩm Flash Sale: {currentPromotion.title}
                </h3>
                <button
                  onClick={() => {
                    setIsItemsModalOpen(false);
                    setCurrentPromotion(null);
                    setPromotionItems([]);
                    setNewItem({ productId: '', discountPct: 0, stockLimit: '' });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Add New Item */}
              <div className="card mb-6">
                <h4 className="font-semibold text-gray-900 mb-4">Thêm sản phẩm</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sản phẩm</label>
                    <select
                      value={newItem.productId}
                      onChange={(e) => setNewItem({ ...newItem, productId: e.target.value })}
                      className="input-field"
                    >
                      <option value="">Chọn sản phẩm</option>
                      {products
                        .filter((p) => !promotionItems.some((item) => item.productId === p.id))
                        .map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name} - {formatPrice(product.price)}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giảm giá (%)</label>
                    <input
                      type="number"
                      value={newItem.discountPct}
                      onChange={(e) => setNewItem({ ...newItem, discountPct: e.target.value })}
                      className="input-field"
                      placeholder="0"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giới hạn số lượng</label>
                    <input
                      type="number"
                      value={newItem.stockLimit}
                      onChange={(e) => setNewItem({ ...newItem, stockLimit: e.target.value })}
                      className="input-field"
                      placeholder="Không giới hạn"
                      min="0"
                    />
                  </div>
                </div>
                <button
                  onClick={handleAddItem}
                  className="btn-primary mt-4"
                >
                  <PlusIcon className="w-4 h-4 inline mr-2" />
                  Thêm sản phẩm
                </button>
              </div>

              {/* Items List */}
              <div className="card">
                <h4 className="font-semibold text-gray-900 mb-4">Danh sách sản phẩm ({promotionItems.length})</h4>
                {promotionItems.length > 0 ? (
                  <div className="space-y-3">
                    {promotionItems.map((item) => {
                      const product = item.product;
                      const images = product?.images ? JSON.parse(product.images) : [];
                      return (
                        <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                          {images.length > 0 && (
                            <img
                              src={images[0]}
                              alt={product?.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{product?.name || 'Unknown'}</p>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                              <span>Giảm: {item.discountPct}%</span>
                              {item.stockLimit && (
                                <span>Giới hạn: {item.stockLimit}</span>
                              )}
                              <span>Đã bán: {item.soldCount || 0}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Chưa có sản phẩm nào trong flash sale.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && promotionToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Xác nhận xóa khuyến mãi</h3>
              <p className="text-gray-700 mb-4">
                Bạn có chắc chắn muốn xóa khuyến mãi <strong>{promotionToDelete.title}</strong> (ID: {promotionToDelete.id})?
              </p>
              {promotionToDelete.type === 'flash_sale' && (
                <p className="text-sm text-gray-600 mb-4">
                  Tất cả sản phẩm trong flash sale này cũng sẽ bị xóa.
                </p>
              )}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setPromotionToDelete(null);
                  }}
                  className="btn-secondary"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="btn-primary bg-red-600 hover:bg-red-700"
                  disabled={loading}
                >
                  {loading ? 'Đang xóa...' : 'Xóa'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TabLayout>
  );
}
