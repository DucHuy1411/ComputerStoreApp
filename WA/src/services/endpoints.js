import api from './api';

// Auth
export const apiLogin = (payload) => api.post('/auth/login', payload).then((r) => r.data);
export const apiRegister = (payload) => api.post('/auth/register', payload).then((r) => r.data);

// Users
export const apiGetUsers = (params) => api.get('/users', { params }).then((r) => r.data);
export const apiGetUser = (id) => api.get(`/users/${id}`).then((r) => r.data);
export const apiUpdateUser = (id, payload) => api.put(`/users/${id}`, payload).then((r) => r.data);
export const apiDeleteUser = (id) => api.delete(`/users/${id}`).then((r) => r.data);

// Products
export const apiGetProducts = (params) => api.get('/products', { params }).then((r) => r.data);
export const apiGetProduct = (id) => api.get(`/products/${id}`).then((r) => r.data);
export const apiCreateProduct = (payload) => api.post('/products', payload).then((r) => r.data);
export const apiUpdateProduct = (id, payload) => api.put(`/products/${id}`, payload).then((r) => r.data);
export const apiDeleteProduct = (id) => api.delete(`/products/${id}`).then((r) => r.data);
export const apiToggleProductStatus = (id, status) => api.patch(`/products/${id}/status`, { status }).then((r) => r.data);

// Categories
export const apiGetCategories = (params) => api.get('/categories', { params }).then((r) => r.data);
export const apiGetCategory = (id) => api.get(`/categories/${id}`).then((r) => r.data);
export const apiCreateCategory = (payload) => api.post('/categories', payload).then((r) => r.data);
export const apiUpdateCategory = (id, payload) => api.put(`/categories/${id}`, payload).then((r) => r.data);
export const apiDeleteCategory = (id) => api.delete(`/categories/${id}`).then((r) => r.data);

// Orders
export const apiGetOrders = (params) => api.get('/orders', { params }).then((r) => r.data);
export const apiGetOrder = (id) => api.get(`/orders/${id}`).then((r) => r.data);
export const apiUpdateOrderStatus = (id, payload) => api.put(`/orders/${id}/status`, payload).then((r) => r.data);

// Admin Orders
export const apiGetAdminOrders = (params) => api.get('/admin/orders', { params }).then((r) => r.data);
export const apiGetAdminOrder = (id) => api.get(`/admin/orders/${id}`).then((r) => r.data);
export const apiUpdateAdminOrderStatus = (id, payload) => api.put(`/admin/orders/${id}/status`, payload).then((r) => r.data);
export const apiUpdateAdminPaymentStatus = (id, payload) => api.put(`/admin/orders/${id}/payment-status`, payload).then((r) => r.data);

// Admin Users
export const apiGetAdminUsers = (params) => api.get('/admin/users', { params }).then((r) => r.data);
export const apiCreateAdminUser = (payload) => api.post('/admin/users', payload).then((r) => r.data);
export const apiUpdateAdminUser = (id, payload) => api.put(`/admin/users/${id}`, payload).then((r) => r.data);
export const apiDeleteAdminUser = (id) => api.delete(`/admin/users/${id}`).then((r) => r.data);
export const apiUpdateAdminUserRole = (id, payload) => api.patch(`/admin/users/${id}/role`, payload).then((r) => r.data);
export const apiUpdateAdminUserStatus = (id, payload) => api.patch(`/admin/users/${id}/status`, payload).then((r) => r.data);

// Admin Promotions
export const apiGetAdminPromotions = (params) => api.get('/admin/promotions', { params }).then((r) => r.data);
export const apiGetAdminPromotion = (id) => api.get(`/admin/promotions/${id}`).then((r) => r.data);
export const apiCreateAdminPromotion = (payload) => api.post('/admin/promotions', payload).then((r) => r.data);
export const apiUpdateAdminPromotion = (id, payload) => api.put(`/admin/promotions/${id}`, payload).then((r) => r.data);
export const apiDeleteAdminPromotion = (id) => api.delete(`/admin/promotions/${id}`).then((r) => r.data);
export const apiAddPromotionItem = (id, payload) => api.post(`/admin/promotions/${id}/items`, payload).then((r) => r.data);
export const apiRemovePromotionItem = (id, itemId) => api.delete(`/admin/promotions/${id}/items/${itemId}`).then((r) => r.data);

// Admin Promotion Items
export const apiGetAdminPromotionItems = (params) => api.get('/admin/promotion-items', { params }).then((r) => r.data);
export const apiUpdateAdminPromotionItem = (id, payload) => api.put(`/admin/promotion-items/${id}`, payload).then((r) => r.data);
export const apiDeleteAdminPromotionItem = (id) => api.delete(`/admin/promotion-items/${id}`).then((r) => r.data);

// Admin Categories
export const apiGetAdminCategories = (params) => api.get('/admin/categories', { params }).then((r) => r.data);
export const apiCreateAdminCategory = (payload) => api.post('/admin/categories', payload).then((r) => r.data);
export const apiUpdateAdminCategory = (id, payload) => api.put(`/admin/categories/${id}`, payload).then((r) => r.data);
export const apiDeleteAdminCategory = (id) => api.delete(`/admin/categories/${id}`).then((r) => r.data);

// Promotions
export const apiGetPromotions = (params) => api.get('/promotions', { params }).then((r) => r.data);
export const apiGetPromotion = (id) => api.get(`/promotions/${id}`).then((r) => r.data);
export const apiCreatePromotion = (payload) => api.post('/promotions', payload).then((r) => r.data);
export const apiUpdatePromotion = (id, payload) => api.put(`/promotions/${id}`, payload).then((r) => r.data);
export const apiDeletePromotion = (id) => api.delete(`/promotions/${id}`).then((r) => r.data);

// Dashboard Stats
export const apiGetDashboardStats = () => api.get('/admin/dashboard/stats').then((r) => r.data);

