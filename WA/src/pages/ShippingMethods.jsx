import { useEffect, useState, useCallback } from 'react';
import TabLayout from '../components/Layout/TabLayout';
import {
  apiGetAdminShippingMethods,
  apiCreateAdminShippingMethod,
  apiUpdateAdminShippingMethod,
  apiToggleAdminShippingMethod,
  apiDeleteAdminShippingMethod,
} from '../services/endpoints';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';

const initialFormState = {
  name: '',
  code: '',
  type: 'DELIVERY',
  base_fee: 0,
  eta_text: '',
  sort_order: 0,
  is_active: true,
};

const normalizeCodeInput = (value) => {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const formatVnd = (value) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
    Number(value || 0),
  );

export default function ShippingMethods() {
  const [shippingMethods, setShippingMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentMethod, setCurrentMethod] = useState(null);
  const [methodToDelete, setMethodToDelete] = useState(null);
  const [form, setForm] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});

  const loadShippingMethods = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        limit: 200,
        q: searchTerm || undefined,
        type: typeFilter !== 'all' ? typeFilter : undefined,
        is_active:
          statusFilter === 'active'
            ? 'true'
            : statusFilter === 'inactive'
            ? 'false'
            : undefined,
      };
      const response = await apiGetAdminShippingMethods(params);
      setShippingMethods(response.shippingMethods || []);
    } catch (error) {
      console.error('Error loading shipping methods:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, typeFilter]);

  useEffect(() => {
    loadShippingMethods();
  }, [loadShippingMethods]);

  const handleSearch = () => {
    loadShippingMethods();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : type === 'number'
          ? Number(value)
          : value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setForm((prev) => ({
      ...prev,
      name,
      code: currentMethod ? prev.code : normalizeCodeInput(name),
    }));
    if (formErrors.name || formErrors.code) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next.name;
        delete next.code;
        return next;
      });
    }
  };

  const handleCodeChange = (e) => {
    const code = normalizeCodeInput(e.target.value);
    setForm((prev) => ({ ...prev, code }));
    if (formErrors.code) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next.code;
        return next;
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!form.name || !form.name.trim()) errors.name = 'Tên là bắt buộc.';
    if (!form.code || !form.code.trim()) errors.code = 'Mã là bắt buộc.';
    if (!form.type) errors.type = 'Loại là bắt buộc.';
    if (form.base_fee === '' || Number(form.base_fee) < 0) {
      errors.base_fee = 'Phí phải >= 0.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        code: form.code.trim(),
        type: form.type,
        base_fee: Number(form.base_fee) || 0,
        eta_text: form.eta_text ? form.eta_text.trim() : null,
        sort_order: Number(form.sort_order) || 0,
        is_active: !!form.is_active,
      };

      if (currentMethod) {
        await apiUpdateAdminShippingMethod(currentMethod.id, payload);
      } else {
        await apiCreateAdminShippingMethod(payload);
      }
      setIsModalOpen(false);
      setCurrentMethod(null);
      setForm(initialFormState);
      setFormErrors({});
      loadShippingMethods();
    } catch (error) {
      console.error('Error saving shipping method:', error);
      setFormErrors({
        api: error.response?.data?.message || 'Lỗi khi lưu phương thức vận chuyển.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (method) => {
    setCurrentMethod(method);
    setForm({
      name: method.name || '',
      code: method.code || '',
      type: method.type || 'DELIVERY',
      base_fee: Number(method.base_fee || 0),
      eta_text: method.eta_text || '',
      sort_order: Number(method.sort_order || 0),
      is_active: !!method.is_active,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setCurrentMethod(null);
    setForm(initialFormState);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (method) => {
    const nextLabel = method.is_active ? 'tắt' : 'bật';
    if (!window.confirm(`Bạn có chắc chắn muốn ${nextLabel} "${method.name}"?`)) {
      return;
    }
    setLoading(true);
    try {
      await apiToggleAdminShippingMethod(method.id);
      loadShippingMethods();
    } catch (error) {
      console.error('Error toggling shipping method:', error);
      alert(error.response?.data?.message || 'Lỗi khi cập nhật trạng thái.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (method) => {
    setMethodToDelete(method);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!methodToDelete) return;
    setLoading(true);
    try {
      await apiDeleteAdminShippingMethod(methodToDelete.id);
      setIsDeleteModalOpen(false);
      setMethodToDelete(null);
      loadShippingMethods();
    } catch (error) {
      console.error('Error deleting shipping method:', error);
      alert(error.response?.data?.message || 'Lỗi khi xóa phương thức vận chuyển.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (active) =>
    active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';

  const getStatusLabel = (active) => (active ? 'Đang bật' : 'Đã tắt');

  const getTypeLabel = (type) =>
    type === 'PICKUP' ? 'Nhận tại cửa hàng' : 'Giao hàng';

  return (
    <TabLayout>
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Phương thức vận chuyển</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản trị danh sách phương thức vận chuyển theo cấu hình hệ thống
          </p>
        </div>

        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tìm kiếm
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm theo tên hoặc mã..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">Tất cả</option>
                <option value="active">Đang bật</option>
                <option value="inactive">Đã tắt</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">Tất cả</option>
                <option value="DELIVERY">Giao hàng</option>
                <option value="PICKUP">Nhận tại cửa hàng</option>
              </select>
            </div>
            <div className="flex items-end space-x-2">
              <button onClick={handleSearch} className="btn-secondary flex-1">
                Tìm kiếm
              </button>
              <button onClick={handleAddClick} className="btn-primary flex items-center justify-center">
                <PlusIcon className="w-5 h-5 mr-2" />
                Thêm mới
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Đang tải...</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header">Tên</th>
                  <th className="table-header">Mã</th>
                  <th className="table-header">Loại</th>
                  <th className="table-header">Phí</th>
                  <th className="table-header">ETA</th>
                  <th className="table-header">Trạng thái</th>
                  <th className="table-header">Sort</th>
                  <th className="table-header">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {shippingMethods.length > 0 ? (
                  shippingMethods.map((method) => (
                    <tr key={method.id} className="hover:bg-gray-50">
                      <td className="table-cell font-medium">
                        <div className="flex items-center space-x-2">
                          <TruckIcon className="w-4 h-4 text-gray-400" />
                          <span>{method.name || '-'}</span>
                        </div>
                      </td>
                      <td className="table-cell text-sm text-gray-600">{method.code}</td>
                      <td className="table-cell">
                        <span className="px-2 py-1 text-xs rounded-full font-semibold bg-blue-100 text-blue-800">
                          {getTypeLabel(method.type)}
                        </span>
                      </td>
                      <td className="table-cell text-sm text-gray-600">
                        {Number(method.base_fee || 0) === 0 ? 'Miễn phí' : formatVnd(method.base_fee)}
                      </td>
                      <td className="table-cell text-sm text-gray-600">{method.eta_text || '-'}</td>
                      <td className="table-cell">
                        <span className={`px-2 py-1 text-xs rounded-full font-semibold ${getStatusBadge(!!method.is_active)}`}>
                          {getStatusLabel(!!method.is_active)}
                        </span>
                      </td>
                      <td className="table-cell text-sm text-gray-600">{method.sort_order ?? 0}</td>
                      <td className="table-cell">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditClick(method)}
                            className="text-primary-600 hover:text-primary-800 p-1 rounded-full hover:bg-gray-100"
                            title="Chỉnh sửa"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(method)}
                            className={`p-1 rounded-full hover:bg-gray-100 ${
                              method.is_active ? 'text-green-600 hover:text-green-800' : 'text-gray-500 hover:text-gray-700'
                            }`}
                            title={method.is_active ? 'Tắt' : 'Bật'}
                          >
                            {method.is_active ? (
                              <CheckCircleIcon className="w-5 h-5" />
                            ) : (
                              <XCircleIcon className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteClick(method)}
                            className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-gray-100"
                            title="Xóa"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="table-cell text-center text-gray-500 py-8">
                      Không có phương thức vận chuyển nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  {currentMethod ? 'Chỉnh sửa' : 'Thêm mới'} phương thức vận chuyển
                </h3>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setCurrentMethod(null);
                    setForm(initialFormState);
                    setFormErrors({});
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {formErrors.api && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                  {formErrors.api}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleNameChange}
                    className="input-field"
                    placeholder="Giao hàng tiêu chuẩn"
                  />
                  {formErrors.name && (
                    <p className="text-sm text-red-600 mt-1">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={form.code}
                    onChange={handleCodeChange}
                    className="input-field"
                    placeholder="standard"
                  />
                  {formErrors.code && (
                    <p className="text-sm text-red-600 mt-1">{formErrors.code}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại
                  </label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="DELIVERY">Giao hàng</option>
                    <option value="PICKUP">Nhận tại cửa hàng</option>
                  </select>
                  {formErrors.type && (
                    <p className="text-sm text-red-600 mt-1">{formErrors.type}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phí vận chuyển
                    </label>
                    <input
                      type="number"
                      name="base_fee"
                      value={form.base_fee}
                      onChange={handleInputChange}
                      className="input-field"
                      min="0"
                    />
                    {formErrors.base_fee && (
                      <p className="text-sm text-red-600 mt-1">{formErrors.base_fee}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sort order
                    </label>
                    <input
                      type="number"
                      name="sort_order"
                      value={form.sort_order}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ETA
                  </label>
                  <input
                    type="text"
                    name="eta_text"
                    value={form.eta_text}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Dự kiến giao: 2-3 ngày"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Kích hoạt</p>
                    <p className="text-xs text-gray-500">Bật/tắt phương thức vận chuyển</p>
                  </div>
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={!!form.is_active}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setCurrentMethod(null);
                    setForm(initialFormState);
                    setFormErrors({});
                  }}
                  className="btn-secondary flex-1"
                  disabled={loading}
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  className="btn-primary flex-1"
                  disabled={loading}
                >
                  {loading ? 'Đang lưu...' : 'Lưu'}
                </button>
              </div>
            </div>
          </div>
        )}

        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Xác nhận xóa</h3>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn tắt phương thức "{methodToDelete?.name}"?
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setMethodToDelete(null);
                  }}
                  className="btn-secondary flex-1"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDelete}
                  className="btn-primary flex-1 bg-red-600 hover:bg-red-700"
                  disabled={loading}
                >
                  {loading ? 'Đang xử lý...' : 'Xác nhận'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TabLayout>
  );
}
