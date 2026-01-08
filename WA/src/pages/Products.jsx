import { useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import TabLayout from '../components/Layout/TabLayout';
import {
  apiGetProducts,
  apiCreateProduct,
  apiUpdateProduct,
  apiDeleteProduct,
  apiToggleProductStatus,
  apiGetCategories,
} from '../services/endpoints';
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  EyeIcon,
  EyeSlashIcon,
  MagnifyingGlassIcon,
  CubeIcon,
} from '@heroicons/react/24/outline';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    categoryId: '',
    name: '',
    slug: '',
    sku: '',
    brandName: '',
    price: '',
    oldPrice: '',
    stock: '',
    isFreeship: false,
    isInstallment0: false,
    description: '',
    status: 'active',
    images: [],
    specs: [],
    tags: [],
  });
  const [formErrors, setFormErrors] = useState({});

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        apiGetProducts({ limit: 100, status: statusFilter === 'all' ? undefined : statusFilter }),
        apiGetCategories(),
      ]);
      setProducts(productsRes.products || []);
      setCategories(categoriesRes.categories || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const params = { limit: 100 };
      if (searchTerm) params.q = searchTerm;
      if (statusFilter !== 'all') params.status = statusFilter;
      const response = await apiGetProducts(params);
      setProducts(response.products || []);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        categoryId: product.categoryId || '',
        name: product.name || '',
        slug: product.slug || '',
        sku: product.sku || '',
        brandName: product.brandName || '',
        price: product.price || '',
        oldPrice: product.oldPrice || '',
        stock: product.stock || '',
        isFreeship: product.isFreeship || false,
        isInstallment0: product.isInstallment0 || false,
        description: product.description || '',
        status: product.status || 'active',
        images: product.images ? (Array.isArray(product.images) ? product.images : JSON.parse(product.images)) : [],
        specs: product.specs ? (Array.isArray(product.specs) ? product.specs : JSON.parse(product.specs)) : [],
        tags: product.tags ? (Array.isArray(product.tags) ? product.tags : JSON.parse(product.tags)) : [],
      });
    } else {
      setEditingProduct(null);
      setFormData({
        categoryId: '',
        name: '',
        slug: '',
        sku: '',
        brandName: '',
        price: '',
        oldPrice: '',
        stock: '',
        isFreeship: false,
        isInstallment0: false,
        description: '',
        status: 'active',
        images: [],
        specs: [],
        tags: [],
      });
    }
    setFormErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormErrors({});
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name) => {
    setFormData({ ...formData, name, slug: generateSlug(name) });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.categoryId) errors.categoryId = 'Danh mục là bắt buộc';
    if (!formData.name) errors.name = 'Tên sản phẩm là bắt buộc';
    if (!formData.slug) errors.slug = 'Slug là bắt buộc';
    if (!formData.sku) errors.sku = 'SKU là bắt buộc';
    if (!formData.price || formData.price <= 0) errors.price = 'Giá phải lớn hơn 0';
    if (formData.stock === '' || formData.stock < 0) errors.stock = 'Tồn kho phải >= 0';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = {
        ...formData,
        categoryId: Number(formData.categoryId),
        price: Number(formData.price),
        oldPrice: formData.oldPrice ? Number(formData.oldPrice) : null,
        stock: Number(formData.stock) || 0,
        images: formData.images.length > 0 ? formData.images : null,
        specs: formData.specs.length > 0 ? formData.specs : null,
        tags: formData.tags.length > 0 ? formData.tags : null,
      };

      if (editingProduct) {
        await apiUpdateProduct(editingProduct.id, payload);
      } else {
        await apiCreateProduct(payload);
      }

      handleCloseModal();
      loadData();
    } catch (error) {
      console.error('Error saving product:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi lưu sản phẩm');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;

    try {
      await apiDeleteProduct(deleteConfirm.id);
      setDeleteConfirm(null);
      loadData();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi xóa sản phẩm');
    }
  };

  const handleToggleStatus = async (product) => {
    try {
      const newStatus = product.status === 'active' ? 'inactive' : 'active';
      await apiToggleProductStatus(product.id, newStatus);
      loadData();
    } catch (error) {
      console.error('Error toggling status:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      out_of_stock: 'bg-red-100 text-red-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      active: 'Hoạt động',
      inactive: 'Ẩn',
      out_of_stock: 'Hết hàng',
    };
    return labels[status] || status;
  };

  const filteredProducts = products.filter((product) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(search) ||
      product.sku.toLowerCase().includes(search) ||
      product.slug.toLowerCase().includes(search)
    );
  });

  const location = useLocation();

  return (
    <TabLayout>
      <div>
        {/* Sub Navigation */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 border-b border-gray-200">
            <Link
              to="/products"
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                location.pathname === '/products'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Sản phẩm
            </Link>
            <Link
              to="/categories"
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                location.pathname === '/categories'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Danh mục
            </Link>
          </div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Sản phẩm</h1>
          <button
            onClick={() => handleOpenModal()}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Thêm sản phẩm
          </button>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
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
              <option value="active">Hoạt động</option>
              <option value="inactive">Ẩn</option>
              <option value="out_of_stock">Hết hàng</option>
            </select>
            <button onClick={handleSearch} className="btn-primary">
              Tìm kiếm
            </button>
          </div>
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Đang tải...</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="table-header">ID</th>
                    <th className="table-header">Hình ảnh</th>
                    <th className="table-header">Tên sản phẩm</th>
                    <th className="table-header">SKU</th>
                    <th className="table-header">Danh mục</th>
                    <th className="table-header">Giá</th>
                    <th className="table-header">Tồn kho</th>
                    <th className="table-header">Trạng thái</th>
                    <th className="table-header">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="table-cell text-center py-8 text-gray-500">
                        Không có sản phẩm nào
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="table-cell">{product.id}</td>
                        <td className="table-cell">
                          {product.images && Array.isArray(product.images) && product.images.length > 0 ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                              <CubeIcon className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </td>
                        <td className="table-cell font-medium">{product.name}</td>
                        <td className="table-cell">{product.sku}</td>
                        <td className="table-cell">{product.category?.name || '-'}</td>
                        <td className="table-cell">{formatPrice(product.price)}</td>
                        <td className="table-cell">{product.stock}</td>
                        <td className="table-cell">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(product.status)}`}>
                            {getStatusLabel(product.status)}
                          </span>
                        </td>
                        <td className="table-cell">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleToggleStatus(product)}
                              className="text-primary-600 hover:text-primary-800"
                              title={product.status === 'active' ? 'Ẩn sản phẩm' : 'Hiện sản phẩm'}
                            >
                              {product.status === 'active' ? (
                                <EyeSlashIcon className="w-5 h-5" />
                              ) : (
                                <EyeIcon className="w-5 h-5" />
                              )}
                            </button>
                            <button
                              onClick={() => handleOpenModal(product)}
                              className="text-primary-600 hover:text-primary-800"
                              title="Sửa"
                            >
                              <PencilIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(product)}
                              className="text-red-600 hover:text-red-800"
                              title="Xóa"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Danh mục <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className={`input-field ${formErrors.categoryId ? 'border-red-500' : ''}`}
                      required
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.categoryId && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.categoryId}</p>
                    )}
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên sản phẩm <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className={`input-field ${formErrors.name ? 'border-red-500' : ''}`}
                      required
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                    )}
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className={`input-field ${formErrors.slug ? 'border-red-500' : ''}`}
                      required
                    />
                    {formErrors.slug && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.slug}</p>
                    )}
                  </div>

                  {/* SKU */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SKU <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                      className={`input-field ${formErrors.sku ? 'border-red-500' : ''}`}
                      required
                    />
                    {formErrors.sku && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.sku}</p>
                    )}
                  </div>

                  {/* Brand */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thương hiệu</label>
                    <input
                      type="text"
                      value={formData.brandName}
                      onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giá <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className={`input-field ${formErrors.price ? 'border-red-500' : ''}`}
                      min="0"
                      step="1000"
                      required
                    />
                    {formErrors.price && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.price}</p>
                    )}
                  </div>

                  {/* Old Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giá cũ</label>
                    <input
                      type="number"
                      value={formData.oldPrice}
                      onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                      className="input-field"
                      min="0"
                      step="1000"
                    />
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tồn kho <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className={`input-field ${formErrors.stock ? 'border-red-500' : ''}`}
                      min="0"
                      required
                    />
                    {formErrors.stock && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.stock}</p>
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="input-field"
                    >
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Ẩn</option>
                      <option value="out_of_stock">Hết hàng</option>
                    </select>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isFreeship}
                      onChange={(e) => setFormData({ ...formData, isFreeship: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Miễn phí vận chuyển</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isInstallment0}
                      onChange={(e) => setFormData({ ...formData, isInstallment0: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Trả góp 0%</span>
                  </label>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field"
                    rows="4"
                  />
                </div>

                {/* Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh (URLs, mỗi URL một dòng)</label>
                  <textarea
                    value={formData.images.join('\n')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        images: e.target.value.split('\n').filter((url) => url.trim()),
                      })
                    }
                    className="input-field"
                    rows="3"
                    placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags (mỗi tag một dòng)</label>
                  <textarea
                    value={formData.tags.join('\n')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tags: e.target.value.split('\n').filter((tag) => tag.trim()),
                      })
                    }
                    className="input-field"
                    rows="2"
                    placeholder="Trả góp 0%&#10;Freeship&#10;Gaming"
                  />
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button type="button" onClick={handleCloseModal} className="btn-secondary">
                    Hủy
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingProduct ? 'Cập nhật' : 'Tạo mới'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Xác nhận xóa</h3>
              <p className="text-gray-600 mb-4">
                Bạn có chắc chắn muốn xóa sản phẩm <strong>{deleteConfirm.name}</strong>?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="btn-secondary"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TabLayout>
  );
}
