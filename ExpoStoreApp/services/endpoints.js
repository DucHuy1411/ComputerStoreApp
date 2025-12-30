import api from "./api";

// AUTH
export const apiRegister = (payload) => api.post("/auth/register", payload).then((r) => r.data);
export const apiLogin = (payload) => api.post("/auth/login", payload).then((r) => r.data);

// USER
export const apiMe = () => api.get("/users/me").then((r) => r.data);
export const apiUpdateMe = (payload) => api.put("/users/me", payload).then((r) => r.data);
export const apiMeStats = () => api.get("/users/me/stats").then((r) => r.data);

// CATEGORIES
export const apiCategoriesTree = () => api.get("/categories?tree=1").then((r) => r.data);

// PRODUCTS
export const apiProducts = (params) => api.get("/products", { params }).then((r) => r.data);
export const apiProductDetail = (id) => api.get(`/products/${id}`).then((r) => r.data);

// CART
export const apiCart = () => api.get("/cart").then((r) => r.data);
export const apiCartAdd = (payload) => api.post("/cart/items", payload).then((r) => r.data);
export const apiCartUpdate = (id, payload) => api.patch(`/cart/items/${id}`, payload).then((r) => r.data);
export const apiCartRemove = (id) => api.delete(`/cart/items/${id}`).then((r) => r.data);
export const apiCartClear = () => api.post("/cart/clear").then((r) => r.data);
export const apiCartToggleAll = (selected) => api.post("/cart/toggle-all", { selected }).then((r) => r.data);

// ORDERS
export const apiOrders = (params) => api.get("/orders", { params }).then((r) => r.data);
export const apiOrderDetail = (id) => api.get(`/orders/${id}`).then((r) => r.data);
export const apiCheckoutFromCart = (payload) => api.post("/orders/checkout-from-cart", payload).then((r) => r.data);
export const apiBuyNow = (payload) => api.post("/orders/buy-now", payload).then((r) => r.data);
export const apiCancelOrder = (id) => api.post(`/orders/${id}/cancel`).then((r) => r.data);

// ADDRESSES
export const apiAddresses = () => api.get("/addresses").then((r) => r.data);
export const apiAddressCreate = (payload) => api.post("/addresses", payload).then((r) => r.data);
export const apiAddressUpdate = (id, payload) => api.put(`/addresses/${id}`, payload).then((r) => r.data);
export const apiAddressDelete = (id) => api.delete(`/addresses/${id}`).then((r) => r.data);
export const apiAddressSetDefault = (id) => api.post(`/addresses/${id}/set-default`).then((r) => r.data);

// PROMOTIONS / DEALS
export const apiPromotions = (params) => api.get("/promotions", { params }).then((r) => r.data);
export const apiPromotionItems = (id) => api.get(`/promotions/${id}/items`).then((r) => r.data);

// SEARCH
export const apiTrends = () => api.get("/search/trends").then((r) => r.data);
export const apiRecentSearch = () => api.get("/search/recent").then((r) => r.data);
export const apiAddRecentSearch = (term) => api.post("/search/recent", { term }).then((r) => r.data);
export const apiClearRecentSearch = () => api.post("/search/recent/clear").then((r) => r.data);
export const apiRemoveRecentSearch = (id) => api.delete(`/search/recent/${id}`).then((r) => r.data);
