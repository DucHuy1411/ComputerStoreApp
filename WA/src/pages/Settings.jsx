import { useState } from 'react';
import TabLayout from '../components/Layout/TabLayout';
import {
  BuildingStorefrontIcon,
  Cog6ToothIcon,
  InformationCircleIcon,
  BellIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

export default function Settings() {
  const [settings, setSettings] = useState({
    storeName: 'TechStore',
    storePhone: '1900 1234',
    storeEmail: 'contact@techstore.com',
    storeAddress: '123 Đường ABC, Quận XYZ, TP.HCM',
    storeDescription: 'Cửa hàng điện tử và công nghệ hàng đầu',
    taxCode: '',
    businessLicense: '',
    facebook: '',
    zalo: '',
    tiktok: '',
    enableNotifications: true,
    enableEmailNotifications: true,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = () => {
    // TODO: Implement save to backend
    alert('Tính năng lưu cài đặt sẽ được triển khai sau.');
  };

  return (
    <TabLayout>
      <div>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Điều chỉnh Cửa hàng</h1>
          <p className="mt-1 text-sm text-gray-500">
            Cấu hình thông tin cửa hàng và các thiết lập hệ thống
          </p>
        </div>

        <div className="space-y-6">
          {/* Store Information */}
          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <BuildingStorefrontIcon className="w-6 h-6 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">Thông tin Cửa hàng</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên cửa hàng
                </label>
                <input
                  type="text"
                  name="storeName"
                  value={settings.storeName}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="storePhone"
                    value={settings.storePhone}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="storeEmail"
                    value={settings.storeEmail}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ
                </label>
                <textarea
                  name="storeAddress"
                  value={settings.storeAddress}
                  onChange={handleInputChange}
                  className="input-field"
                  rows="2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả cửa hàng
                </label>
                <textarea
                  name="storeDescription"
                  value={settings.storeDescription}
                  onChange={handleInputChange}
                  className="input-field"
                  rows="3"
                />
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <ShieldCheckIcon className="w-6 h-6 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">Thông tin Doanh nghiệp</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mã số thuế
                </label>
                <input
                  type="text"
                  name="taxCode"
                  value={settings.taxCode}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="0123456789"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giấy phép kinh doanh
                </label>
                <input
                  type="text"
                  name="businessLicense"
                  value={settings.businessLicense}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Số giấy phép"
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <InformationCircleIcon className="w-6 h-6 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">Mạng xã hội</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Facebook
                </label>
                <input
                  type="url"
                  name="facebook"
                  value={settings.facebook}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zalo
                </label>
                <input
                  type="text"
                  name="zalo"
                  value={settings.zalo}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Số điện thoại hoặc link Zalo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  TikTok
                </label>
                <input
                  type="url"
                  name="tiktok"
                  value={settings.tiktok}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="https://tiktok.com/@..."
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <BellIcon className="w-6 h-6 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">Thông báo</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Bật thông báo hệ thống</p>
                  <p className="text-xs text-gray-500">Nhận thông báo về đơn hàng, sản phẩm, v.v.</p>
                </div>
                <input
                  type="checkbox"
                  name="enableNotifications"
                  checked={settings.enableNotifications}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Bật thông báo email</p>
                  <p className="text-xs text-gray-500">Gửi email thông báo quan trọng</p>
                </div>
                <input
                  type="checkbox"
                  name="enableEmailNotifications"
                  checked={settings.enableEmailNotifications}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <Cog6ToothIcon className="w-6 h-6 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">Cài đặt Hệ thống</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Lưu ý:</strong> Các cài đặt hệ thống nâng cao sẽ được triển khai trong phiên bản tiếp theo.
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button onClick={handleSave} className="btn-primary">
              Lưu cài đặt
            </button>
          </div>
        </div>
      </div>
    </TabLayout>
  );
}



