const sequelize = require("../config/db.config");

const User = require("./users.model");
const Address = require("./addresses.model");
const Category = require("./categories.model");
const Product = require("./products.model");
const CartItem = require("./cart_items.model");
const Order = require("./orders.model");
const OrderItem = require("./order_items.model");
const OrderStatusHistory = require("./order_status_history.model");
const Promotion = require("./promotions.model");
const PromotionItem = require("./promotion_items.model");
const UserProductEvent = require("./user_product_events.model");
const Notification = require("./notifications.model");
const SearchTerm = require("./search_terms.model");

// ===== Associations =====
User.hasMany(Address, { foreignKey: "userId", as: "addresses" });
Address.belongsTo(User, { foreignKey: "userId", as: "user" });

Category.hasMany(Category, { foreignKey: "parentId", as: "children" });
Category.belongsTo(Category, { foreignKey: "parentId", as: "parent" });

Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });
Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

User.hasMany(CartItem, { foreignKey: "userId", as: "cartItems" });
CartItem.belongsTo(User, { foreignKey: "userId", as: "user" });
Product.hasMany(CartItem, { foreignKey: "productId", as: "cartRefs" });
CartItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

User.hasMany(Order, { foreignKey: "userId", as: "orders" });
Order.belongsTo(User, { foreignKey: "userId", as: "user" });
Address.hasMany(Order, { foreignKey: "addressId", as: "orders" });
Order.belongsTo(Address, { foreignKey: "addressId", as: "address" });

Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order" });
Product.hasMany(OrderItem, { foreignKey: "productId", as: "orderItems" });
OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

Order.hasMany(OrderStatusHistory, { foreignKey: "orderId", as: "history" });
OrderStatusHistory.belongsTo(Order, { foreignKey: "orderId", as: "order" });

Promotion.hasMany(PromotionItem, { foreignKey: "promotionId", as: "items" });
PromotionItem.belongsTo(Promotion, { foreignKey: "promotionId", as: "promotion" });
Product.hasMany(PromotionItem, { foreignKey: "productId", as: "promotionItems" });
PromotionItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

User.hasMany(UserProductEvent, { foreignKey: "userId", as: "productEvents" });
UserProductEvent.belongsTo(User, { foreignKey: "userId", as: "user" });
Product.hasMany(UserProductEvent, { foreignKey: "productId", as: "events" });
UserProductEvent.belongsTo(Product, { foreignKey: "productId", as: "product" });

User.hasMany(Notification, { foreignKey: "userId", as: "notifications" });
Notification.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(SearchTerm, { foreignKey: "userId", as: "searchTerms" });
SearchTerm.belongsTo(User, { foreignKey: "userId", as: "user" });

module.exports = {
  sequelize,
  User,
  Address,
  Category,
  Product,
  CartItem,
  Order,
  OrderItem,
  OrderStatusHistory,
  Promotion,
  PromotionItem,
  UserProductEvent,
  Notification,
  SearchTerm,
};
