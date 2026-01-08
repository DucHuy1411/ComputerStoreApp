import { useEffect, useState, useCallback } from 'react';
import TabLayout from '../components/Layout/TabLayout';
import {
  apiGetAdminUsers,
  apiCreateAdminUser,
  apiUpdateAdminUser,
  apiDeleteAdminUser,
  apiUpdateAdminUserRole,
  apiUpdateAdminUserStatus,
} from '../services/endpoints';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  LockClosedIcon,
  LockOpenIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

const initialUserState = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  role: 'customer',
  status: 'active',
};

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [form, setForm] = useState(initialUserState);
  const [formErrors, setFormErrors] = useState({});
  const [userToDelete, setUserToDelete] = useState(null);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        limit: 200,
        role: roleFilter !== 'all' ? roleFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        q: searchTerm || undefined,
      };
      const response = await apiGetAdminUsers(params);
      setUsers(response.users || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  }, [roleFilter, statusFilter, searchTerm]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSearch = () => {
    loadUsers();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field
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
    if (!form.phone) errors.phone = 'Số điện thoại là bắt buộc.';
    if (!currentUser && !form.password) errors.password = 'Mật khẩu là bắt buộc khi tạo mới.';
    if (form.password && form.password.length < 6) errors.password = 'Mật khẩu phải có ít nhất 6 ký tự.';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Email không hợp lệ.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveUser = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        fullName: form.fullName || undefined,
        email: form.email || undefined,
        phone: form.phone,
        role: form.role,
        status: form.status,
      };

      // Only include password if it's provided (for new users or when updating)
      if (form.password) {
        payload.password = form.password;
      }

      if (currentUser) {
        await apiUpdateAdminUser(currentUser.id, payload);
      } else {
        await apiCreateAdminUser(payload);
      }
      setIsModalOpen(false);
      setCurrentUser(null);
      setForm(initialUserState);
      setFormErrors({});
      loadUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      setFormErrors({ api: error.response?.data?.message || 'Lỗi khi lưu thông tin khách hàng.' });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setCurrentUser(user);
    setForm({
      fullName: user.fullName || '',
      email: user.email || '',
      phone: user.phone || '',
      password: '', // Don't pre-fill password
      role: user.role,
      status: user.status,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setCurrentUser(null);
    setForm(initialUserState);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    setLoading(true);
    try {
      await apiDeleteAdminUser(userToDelete.id);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(error.response?.data?.message || 'Lỗi khi xóa khách hàng.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRole = async (user) => {
    if (!window.confirm(`Bạn có chắc chắn muốn ${user.role === 'admin' ? 'bỏ quyền quản trị viên' : 'cấp quyền quản trị viên'} cho ${user.fullName || user.phone}?`)) {
      return;
    }

    setLoading(true);
    try {
      const newRole = user.role === 'admin' ? 'customer' : 'admin';
      await apiUpdateAdminUserRole(user.id, { role: newRole });
      loadUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      alert(error.response?.data?.message || 'Lỗi khi cập nhật quyền.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    let newStatus;
    if (user.status === 'active') {
      newStatus = 'blocked';
    } else if (user.status === 'blocked') {
      newStatus = 'active';
    } else {
      newStatus = 'active';
    }

    if (!window.confirm(`Bạn có chắc chắn muốn ${newStatus === 'blocked' ? 'khóa' : 'mở khóa'} tài khoản của ${user.fullName || user.phone}?`)) {
      return;
    }

    setLoading(true);
    try {
      await apiUpdateAdminUserStatus(user.id, { status: newStatus });
      loadUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      alert(error.response?.data?.message || 'Lỗi khi cập nhật trạng thái.');
    } finally {
      setLoading(false);
    }
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

  const getRoleBadge = (role) => {
    return role === 'admin'
      ? 'bg-purple-100 text-purple-800'
      : 'bg-gray-100 text-gray-800';
  };

  const getRoleLabel = (role) => {
    return role === 'admin' ? 'Quản trị viên' : 'Khách hàng';
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-yellow-100 text-yellow-800',
      blocked: 'bg-red-100 text-red-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      active: 'Hoạt động',
      inactive: 'Tạm khóa',
      blocked: 'Đã khóa',
    };
    return labels[status] || status;
  };

  return (
    <TabLayout>
      <div>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Khách hàng</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý thông tin khách hàng và quản trị viên
          </p>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm khách hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="input-field pl-10"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="customer">Khách hàng</option>
              <option value="admin">Quản trị viên</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Tạm khóa</option>
              <option value="blocked">Đã khóa</option>
            </select>
            <div className="flex space-x-2">
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

        {/* Users List */}
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
                  <th className="table-header">ID</th>
                  <th className="table-header">Thông tin</th>
                  <th className="table-header">Vai trò</th>
                  <th className="table-header">Trạng thái</th>
                  <th className="table-header">Ngày tạo</th>
                  <th className="table-header">Đăng nhập cuối</th>
                  <th className="table-header">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="table-cell font-medium">{user.id}</td>
                      <td className="table-cell">
                        <div className="flex items-center space-x-3">
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt={user.fullName || user.phone}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <UserCircleIcon className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{user.fullName || 'Chưa có tên'}</p>
                            <p className="text-sm text-gray-500">{user.phone}</p>
                            {user.email && (
                              <p className="text-xs text-gray-400">{user.email}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className={`px-2 py-1 text-xs rounded-full font-semibold ${getRoleBadge(user.role)}`}>
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className={`px-2 py-1 text-xs rounded-full font-semibold ${getStatusBadge(user.status)}`}>
                          {getStatusLabel(user.status)}
                        </span>
                      </td>
                      <td className="table-cell text-sm text-gray-600">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="table-cell text-sm text-gray-600">
                        {formatDate(user.lastLoginAt)}
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditClick(user)}
                            className="text-primary-600 hover:text-primary-800 p-1 rounded-full hover:bg-gray-100"
                            title="Sửa thông tin"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleToggleRole(user)}
                            className={`p-1 rounded-full hover:bg-gray-100 ${
                              user.role === 'admin'
                                ? 'text-purple-600 hover:text-purple-800'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                            title={user.role === 'admin' ? 'Bỏ quyền quản trị viên' : 'Cấp quyền quản trị viên'}
                          >
                            {user.role === 'admin' ? (
                              <ShieldCheckIcon className="w-5 h-5" />
                            ) : (
                              <ShieldExclamationIcon className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className={`p-1 rounded-full hover:bg-gray-100 ${
                              user.status === 'active'
                                ? 'text-green-600 hover:text-green-800'
                                : 'text-red-600 hover:text-red-800'
                            }`}
                            title={user.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                          >
                            {user.status === 'active' ? (
                              <LockClosedIcon className="w-5 h-5" />
                            ) : (
                              <LockOpenIcon className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user)}
                            className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-gray-100"
                            title="Xóa khách hàng"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="table-cell text-center text-gray-500 py-8">
                      Không tìm thấy khách hàng nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Add/Edit User Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  {currentUser ? 'Sửa thông tin khách hàng' : 'Thêm khách hàng mới'}
                </h3>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setCurrentUser(null);
                    setForm(initialUserState);
                    setFormErrors({});
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSaveUser(); }} className="space-y-4">
                {formErrors.api && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {formErrors.api}
                  </div>
                )}

                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleInputChange}
                    className="input-field mt-1"
                    placeholder="Nhập họ và tên"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleInputChange}
                    className="input-field mt-1"
                    placeholder="0912345678"
                    required
                  />
                  {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    className="input-field mt-1"
                    placeholder="email@example.com"
                  />
                  {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Mật khẩu {!currentUser && <span className="text-red-500">*</span>}
                    {currentUser && <span className="text-gray-500 text-xs">(Để trống nếu không đổi)</span>}
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={form.password}
                    onChange={handleInputChange}
                    className="input-field mt-1"
                    placeholder={currentUser ? "Nhập mật khẩu mới (nếu muốn đổi)" : "Tối thiểu 6 ký tự"}
                  />
                  {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                      Vai trò
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={form.role}
                      onChange={handleInputChange}
                      className="input-field mt-1"
                    >
                      <option value="customer">Khách hàng</option>
                      <option value="admin">Quản trị viên</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Trạng thái
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={form.status}
                      onChange={handleInputChange}
                      className="input-field mt-1"
                    >
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Tạm khóa</option>
                      <option value="blocked">Đã khóa</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setCurrentUser(null);
                      setForm(initialUserState);
                      setFormErrors({});
                    }}
                    className="btn-secondary"
                  >
                    Hủy
                  </button>
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Đang lưu...' : currentUser ? 'Cập nhật' : 'Tạo mới'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && userToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Xác nhận xóa khách hàng</h3>
              <p className="text-gray-700 mb-4">
                Bạn có chắc chắn muốn xóa khách hàng <strong>{userToDelete.fullName || userToDelete.phone}</strong> (ID: {userToDelete.id})?
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Nếu khách hàng này đã có đơn hàng, tài khoản sẽ được chuyển sang trạng thái "Đã khóa" thay vì xóa vĩnh viễn.
              </p>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setUserToDelete(null);
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
