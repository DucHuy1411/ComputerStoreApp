import { useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import TabLayout from '../components/Layout/TabLayout';
import {
  apiGetAdminCategories,
  apiCreateAdminCategory,
  apiUpdateAdminCategory,
  apiDeleteAdminCategory,
} from '../services/endpoints';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  FolderIcon,
  FolderOpenIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';

const initialCategoryState = {
  name: '',
  slug: '',
  icon: '',
  hint: '',
  parentId: '',
  sortOrder: 0,
  isActive: true,
};

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]); // For parent selection
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [form, setForm] = useState(initialCategoryState);
  const [formErrors, setFormErrors] = useState({});

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      // Always load as tree view
      const treeResponse = await apiGetAdminCategories({ tree: '1' });
      setCategories(treeResponse.categories || []);
      
      // Load flat list for parent selection
      const flatResponse = await apiGetAdminCategories({});
      setAllCategories(flatResponse.categories || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value),
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setForm((prev) => ({
      ...prev,
      name,
      slug: currentCategory ? prev.slug : generateSlug(name), // Only auto-generate slug for new categories
    }));
    if (formErrors.name) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.name;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!form.name || !form.name.trim()) errors.name = 'Tên danh mục là bắt buộc.';
    if (!form.slug || !form.slug.trim()) errors.slug = 'Slug là bắt buộc.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveCategory = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        icon: form.icon ? form.icon.trim() : null,
        hint: form.hint ? form.hint.trim() : null,
        parentId: form.parentId ? Number(form.parentId) : null,
        sortOrder: Number(form.sortOrder) || 0,
        isActive: form.isActive,
      };

      if (currentCategory) {
        await apiUpdateAdminCategory(currentCategory.id, payload);
      } else {
        await apiCreateAdminCategory(payload);
      }
      setIsModalOpen(false);
      setCurrentCategory(null);
      setForm(initialCategoryState);
      setFormErrors({});
      loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      setFormErrors({ api: error.response?.data?.message || 'Lỗi khi lưu danh mục.' });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (category) => {
    setCurrentCategory(category);
    setForm({
      name: category.name || '',
      slug: category.slug || '',
      icon: category.icon || '',
      hint: category.hint || '',
      parentId: category.parentId ? String(category.parentId) : '',
      sortOrder: category.sortOrder || 0,
      isActive: category.isActive !== undefined ? category.isActive : true,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setCurrentCategory(null);
    setForm(initialCategoryState);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    setLoading(true);
    try {
      const response = await apiDeleteAdminCategory(categoryToDelete.id);
      if (response.message) {
        alert(response.message);
      }
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
      loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert(error.response?.data?.message || 'Lỗi khi xóa danh mục.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (category) => {
    if (!window.confirm(`Bạn có chắc chắn muốn ${category.isActive ? 'ẩn' : 'hiện'} danh mục "${category.name}"?`)) {
      return;
    }

    setLoading(true);
    try {
      await apiUpdateAdminCategory(category.id, { isActive: !category.isActive });
      loadCategories();
    } catch (error) {
      console.error('Error updating category status:', error);
      alert(error.response?.data?.message || 'Lỗi khi cập nhật trạng thái.');
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter((cat) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    const matches = (cat.name || '').toLowerCase().includes(search) ||
      (cat.slug || '').toLowerCase().includes(search) ||
      (cat.hint || '').toLowerCase().includes(search);
    
    // Also check children
    if (cat.children && cat.children.length > 0) {
      return matches || cat.children.some((child) => 
        (child.name || '').toLowerCase().includes(search) ||
        (child.slug || '').toLowerCase().includes(search)
      );
    }
    return matches;
  });

  const renderCategoryTree = (cats, level = 0) => {
    return cats.map((category) => (
      <div key={category.id} className="mb-2">
        <div
          className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
            category.isActive
              ? 'bg-white border-gray-200 hover:border-gray-300'
              : 'bg-gray-50 border-gray-300 opacity-60'
          }`}
          style={{ marginLeft: `${level * 24}px` }}
        >
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {level > 0 && <div className="w-4 flex-shrink-0"></div>}
            {category.children && category.children.length > 0 ? (
              <FolderOpenIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
            ) : (
              <FolderIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                {category.icon && (
                  <span className="text-lg flex-shrink-0">{category.icon}</span>
                )}
                <p className="font-medium text-gray-900 truncate">{category.name}</p>
              </div>
              <p className="text-sm text-gray-500 truncate">/{category.slug}</p>
              {category.hint && (
                <p className="text-xs text-gray-400 mt-1 truncate">{category.hint}</p>
              )}
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
              <span className="text-xs text-gray-500 whitespace-nowrap">Thứ tự: {category.sortOrder}</span>
              <span
                className={`px-2 py-1 text-xs rounded-full font-semibold whitespace-nowrap ${
                  category.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {category.isActive ? 'Hoạt động' : 'Đã ẩn'}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
            <button
              onClick={() => handleEditClick(category)}
              className="text-primary-600 hover:text-primary-800 p-2 rounded-full hover:bg-gray-100"
              title="Sửa danh mục"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleToggleStatus(category)}
              className={`p-2 rounded-full hover:bg-gray-100 ${
                category.isActive
                  ? 'text-green-600 hover:text-green-800'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title={category.isActive ? 'Ẩn danh mục' : 'Hiện danh mục'}
            >
              {category.isActive ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => handleDeleteClick(category)}
              className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-gray-100"
              title="Xóa danh mục"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        {category.children && category.children.length > 0 && (
          <div className="mt-2">
            {renderCategoryTree(category.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  const getParentName = (parentId) => {
    if (!parentId) return null;
    const parent = allCategories.find((cat) => cat.id === parentId);
    return parent ? parent.name : null;
  };

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
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý Danh mục</h1>
              <p className="mt-1 text-sm text-gray-500">
                Quản lý danh mục sản phẩm và cấu trúc phân cấp
              </p>
            </div>
            <button onClick={handleAddClick} className="btn-primary flex items-center justify-center">
              <PlusIcon className="w-5 h-5 mr-2" />
              Thêm danh mục
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm danh mục..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <div className="text-sm text-gray-600 flex items-center">
              <span>Tổng: {categories.length} danh mục gốc</span>
            </div>
          </div>
        </div>

        {/* Categories Tree */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Đang tải...</p>
          </div>
        ) : (
          <div className="card">
            <div className="space-y-2">
              {filteredCategories.length > 0 ? (
                renderCategoryTree(filteredCategories)
              ) : (
                <div className="text-center py-12">
                  <FolderIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">Không tìm thấy danh mục nào.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add/Edit Category Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  {currentCategory ? 'Sửa danh mục' : 'Thêm danh mục mới'}
                </h3>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setCurrentCategory(null);
                    setForm(initialCategoryState);
                    setFormErrors({});
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSaveCategory(); }} className="space-y-4">
                {formErrors.api && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {formErrors.api}
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Tên danh mục <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleNameChange}
                    className="input-field mt-1"
                    placeholder="Ví dụ: Laptop"
                    required
                  />
                  {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                </div>

                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={form.slug}
                    onChange={handleInputChange}
                    className="input-field mt-1"
                    placeholder="laptop"
                    required
                  />
                  {formErrors.slug && <p className="text-red-500 text-xs mt-1">{formErrors.slug}</p>}
                  <p className="text-xs text-gray-500 mt-1">
                    Slug sẽ được tự động tạo từ tên danh mục (chỉ khi tạo mới)
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="icon" className="block text-sm font-medium text-gray-700">
                      Icon (tên icon)
                    </label>
                    <input
                      type="text"
                      id="icon"
                      name="icon"
                      value={form.icon}
                      onChange={handleInputChange}
                      className="input-field mt-1"
                      placeholder="laptop-outline"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Tên icon từ thư viện (ví dụ: laptop-outline)
                    </p>
                  </div>

                  <div>
                    <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700">
                      Thứ tự
                    </label>
                    <input
                      type="number"
                      id="sortOrder"
                      name="sortOrder"
                      value={form.sortOrder}
                      onChange={handleInputChange}
                      className="input-field mt-1"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="hint" className="block text-sm font-medium text-gray-700">
                    Gợi ý
                  </label>
                  <input
                    type="text"
                    id="hint"
                    name="hint"
                    value={form.hint}
                    onChange={handleInputChange}
                    className="input-field mt-1"
                    placeholder="Mô tả ngắn về danh mục"
                  />
                </div>

                <div>
                  <label htmlFor="parentId" className="block text-sm font-medium text-gray-700">
                    Danh mục cha
                  </label>
                  <select
                    id="parentId"
                    name="parentId"
                    value={form.parentId}
                    onChange={handleInputChange}
                    className="input-field mt-1"
                  >
                    <option value="">Không có (danh mục gốc)</option>
                    {allCategories
                      .filter((cat) => !currentCategory || cat.id !== currentCategory.id)
                      .map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name} {cat.parent ? `(${cat.parent.name})` : ''}
                        </option>
                      ))}
                  </select>
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
                    Kích hoạt danh mục
                  </label>
                </div>

                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setCurrentCategory(null);
                      setForm(initialCategoryState);
                      setFormErrors({});
                    }}
                    className="btn-secondary"
                  >
                    Hủy
                  </button>
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Đang lưu...' : currentCategory ? 'Cập nhật' : 'Tạo mới'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && categoryToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Xác nhận xóa danh mục</h3>
              <p className="text-gray-700 mb-4">
                Bạn có chắc chắn muốn xóa danh mục <strong>{categoryToDelete.name}</strong> (ID: {categoryToDelete.id})?
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Nếu danh mục này có danh mục con hoặc sản phẩm, nó sẽ được chuyển sang trạng thái "Đã ẩn" thay vì xóa vĩnh viễn.
              </p>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setCategoryToDelete(null);
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
