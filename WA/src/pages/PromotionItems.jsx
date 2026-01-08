import { useEffect, useState, useCallback } from 'react';
import TabLayout from '../components/Layout/TabLayout';
import {
  apiGetAdminPromotionItems,
  apiUpdateAdminPromotionItem,
  apiDeleteAdminPromotionItem,
  apiGetAdminPromotions,
} from '../services/endpoints';
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  TagIcon,
  FireIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

export default function PromotionItems() {
  const [items, setItems] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [promotionFilter, setPromotionFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editForm, setEditForm] = useState({ discountPct: 0, stockLimit: '' });
  const [formErrors, setFormErrors] = useState({});

  const loadPromotionItems = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        limit: 500,
        promotionId: promotionFilter !== 'all' ? promotionFilter : undefined,
        sort: sortBy,
      };
      const response = await apiGetAdminPromotionItems(params);
      setItems(response.items || []);
    } catch (error) {
      console.error('Error loading promotion items:', error);
    } finally {
      setLoading(false);
    }
  }, [promotionFilter, sortBy]);

  const loadPromotions = async () => {
    try {
      const response = await apiGetAdminPromotions({ limit: 200 });
      setPromotions(response.promotions || []);
    } catch (error) {
      console.error('Error loading promotions:', error);
    }
  };

  useEffect(() => {
    loadPromotionItems();
    loadPromotions();
  }, [loadPromotionItems]);

  const handleSearch = () => {
    loadPromotionItems();
  };

  const handleEditClick = (item) => {
    setCurrentItem(item);
    setEditForm({
      discountPct: item.discountPct || 0,
      stockLimit: item.stockLimit || '',
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: name === 'discountPct' || name === 'stockLimit' ? (value === '' ? '' : Number(value)) : value,
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
    if (editForm.discountPct < 0 || editForm.discountPct > 100) {
      errors.discountPct = 'Phần trăm giảm giá phải từ 0 đến 100.';
    }
    if (editForm.stockLimit !== '' && editForm.stockLimit < 0) {
      errors.stockLimit = 'Giới hạn số lượng không thể âm.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveItem = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await apiUpdateAdminPromotionItem(currentItem.id, {
        discountPct: Number(editForm.discountPct),
        stockLimit: editForm.stockLimit === '' ? null : Number(editForm.stockLimit),
      });
      setIsEditModalOpen(false);
      setCurrentItem(null);
      setEditForm({ discountPct: 0, stockLimit: '' });
      setFormErrors({});
      loadPromotionItems();
    } catch (error) {
      console.error('Error saving promotion item:', error);
      setFormErrors({ api: error.response?.data?.message || 'Lỗi khi lưu sản phẩm khuyến mãi.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setLoading(true);
    try {
      await apiDeleteAdminPromotionItem(itemToDelete.id);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      loadPromotionItems();
    } catch (error) {
      console.error('Error deleting promotion item:', error);
      alert(error.response?.data?.message || 'Lỗi khi xóa sản phẩm khuyến mãi.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const calculateDiscountPrice = (originalPrice, discountPct) => {
    return originalPrice * (1 - discountPct / 100);
  };

  const filteredItems = items.filter((item) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      (item.product?.name || '').toLowerCase().includes(search) ||
      (item.promotion?.title || '').toLowerCase().includes(search) ||
      String(item.id).includes(search)
    );
  });

  const getStockStatus = (item) => {
    if (!item.stockLimit) return { label: 'Không giới hạn', color: 'text-gray-600' };
    const remaining = item.stockLimit - (item.soldCount || 0);
    if (remaining <= 0) return { label: 'Hết hàng', color: 'text-red-600' };
    if (remaining <= 5) return { label: `Còn ${remaining}`, color: 'text-orange-600' };
    return { label: `Còn ${remaining}`, color: 'text-green-600' };
  };

  return (
    <TabLayout>
      <div>
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FireIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý Sản phẩm Flash Sale</h1>
              <p className="mt-1 text-sm text-gray-500">
                Quản lý sản phẩm trong các chương trình flash sale
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm, khuyến mãi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="input-field pl-10"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <select
              value={promotionFilter}
              onChange={(e) => setPromotionFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">Tất cả khuyến mãi</option>
              {promotions
                .filter((p) => p.type === 'flash_sale')
                .map((promo) => (
                  <option key={promo.id} value={promo.id}>
                    {promo.title}
                  </option>
                ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="discountDesc">Giảm giá cao → thấp</option>
              <option value="discountAsc">Giảm giá thấp → cao</option>
              <option value="soldDesc">Bán chạy nhất</option>
            </select>
            <div className="text-sm text-gray-600 flex items-center">
              <span>Tổng: {filteredItems.length} sản phẩm</span>
            </div>
          </div>
        </div>

        {/* Promotion Items List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Đang tải...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const product = item.product;
                const promotion = item.promotion;
                const images = product?.images ? (Array.isArray(product.images) ? product.images : JSON.parse(product.images)) : [];
                const originalPrice = product?.price || 0;
                const discountPrice = calculateDiscountPrice(originalPrice, item.discountPct);
                const stockStatus = getStockStatus(item);
                const discountAmount = originalPrice - discountPrice;

                return (
                  <div
                    key={item.id}
                    className="card hover:shadow-lg transition-all duration-200 relative overflow-hidden"
                  >
                    {/* Promotion Badge */}
                    {promotion && (
                      <div className="absolute top-0 right-0 bg-orange-500 text-white px-3 py-1 text-xs font-semibold rounded-bl-lg">
                        {promotion.title}
                      </div>
                    )}

                    {/* Product Image */}
                    <div className="mb-4 -mx-6 -mt-6">
                      <img
                        src={images[0] || 'https://via.placeholder.com/300'}
                        alt={product?.name || 'Product'}
                        className="w-full h-48 object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="mb-4">
                      <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
                        {product?.name || 'Unknown Product'}
                      </h3>
                      
                      {/* Price Info */}
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Giá gốc:</span>
                          <span className="text-sm text-gray-400 line-through">
                            {formatPrice(originalPrice)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Giảm:</span>
                          <span className="text-lg font-bold text-red-600">
                            -{item.discountPct}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                          <span className="text-sm font-medium text-gray-900">Giá sau giảm:</span>
                          <span className="text-xl font-bold text-primary-600">
                            {formatPrice(discountPrice)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Tiết kiệm: {formatPrice(discountAmount)}
                        </div>
                      </div>

                      {/* Stock & Sales Info */}
                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Giới hạn</p>
                          <p className="text-sm font-medium text-gray-900">
                            {item.stockLimit ? item.stockLimit : '∞'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Đã bán</p>
                          <p className="text-sm font-medium text-gray-900">
                            {item.soldCount || 0}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-xs text-gray-500 mb-1">Tình trạng</p>
                          <p className={`text-sm font-semibold ${stockStatus.color}`}>
                            {stockStatus.label}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="text-primary-600 hover:text-primary-800 p-2 rounded-lg hover:bg-primary-50 transition-colors"
                        title="Sửa thông tin"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item)}
                        className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="Xóa khỏi flash sale"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full card text-center py-12">
                <FireIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">Không tìm thấy sản phẩm flash sale nào.</p>
              </div>
            )}
          </div>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && currentItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Sửa thông tin Flash Sale</h3>
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setCurrentItem(null);
                    setEditForm({ discountPct: 0, stockLimit: '' });
                    setFormErrors({});
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {currentItem.product && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">{currentItem.product.name}</p>
                  <p className="text-sm text-gray-600">
                    Giá gốc: {formatPrice(currentItem.product.price)}
                  </p>
                </div>
              )}

              <form onSubmit={(e) => { e.preventDefault(); handleSaveItem(); }} className="space-y-4">
                {formErrors.api && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {formErrors.api}
                  </div>
                )}

                <div>
                  <label htmlFor="discountPct" className="block text-sm font-medium text-gray-700">
                    Phần trăm giảm giá (%) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="discountPct"
                    name="discountPct"
                    value={editForm.discountPct}
                    onChange={handleInputChange}
                    className="input-field mt-1"
                    min="0"
                    max="100"
                    required
                  />
                  {formErrors.discountPct && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.discountPct}</p>
                  )}
                  {currentItem.product && editForm.discountPct > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Giá sau giảm: {formatPrice(calculateDiscountPrice(currentItem.product.price, editForm.discountPct))}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="stockLimit" className="block text-sm font-medium text-gray-700">
                    Giới hạn số lượng
                  </label>
                  <input
                    type="number"
                    id="stockLimit"
                    name="stockLimit"
                    value={editForm.stockLimit}
                    onChange={handleInputChange}
                    className="input-field mt-1"
                    min="0"
                    placeholder="Để trống nếu không giới hạn"
                  />
                  {formErrors.stockLimit && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.stockLimit}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Hiện tại đã bán: {currentItem.soldCount || 0}
                  </p>
                </div>

                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setCurrentItem(null);
                      setEditForm({ discountPct: 0, stockLimit: '' });
                      setFormErrors({});
                    }}
                    className="btn-secondary"
                  >
                    Hủy
                  </button>
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Đang lưu...' : 'Cập nhật'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && itemToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Xác nhận xóa</h3>
              <p className="text-gray-700 mb-4">
                Bạn có chắc chắn muốn xóa sản phẩm <strong>{itemToDelete.product?.name || 'Unknown'}</strong> khỏi flash sale?
              </p>
              {itemToDelete.promotion && (
                <p className="text-sm text-gray-600 mb-4">
                  Khuyến mãi: <strong>{itemToDelete.promotion.title}</strong>
                </p>
              )}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setItemToDelete(null);
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



