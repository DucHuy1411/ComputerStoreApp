const { sequelize, Order, Product, User, OrderItem, Promotion, PromotionItem, Category } = require("../models");
const { Op, fn, col, literal } = require("sequelize");
const bcrypt = require("bcryptjs");

class AdminController {
  /**
   * GET /admin/dashboard/stats
   * Lấy thống kê tổng quan cho dashboard admin
   */
  async dashboardStats(req, res) {
    try {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

      // Tổng số lượng
      const [
        totalOrders,
        totalProducts,
        totalCustomers,
        totalCategories,
        totalPromotions,
      ] = await Promise.all([
        Order.count(),
        Product.count(),
        User.count({ where: { role: "customer" } }),
        Category.count(),
        Promotion.count(),
      ]);

      // Đơn hàng theo trạng thái
      const ordersByStatus = await Order.findAll({
        attributes: [
          "status",
          [fn("COUNT", col("id")), "count"],
        ],
        group: ["status"],
        raw: true,
      });

      const statusCounts = {
        pending: 0,
        processing: 0,
        shipping: 0,
        done: 0,
        canceled: 0,
      };

      ordersByStatus.forEach((item) => {
        statusCounts[item.status] = parseInt(item.count) || 0;
      });

      // Đơn hàng theo payment status
      const ordersByPaymentStatus = await Order.findAll({
        attributes: [
          "paymentStatus",
          [fn("COUNT", col("id")), "count"],
        ],
        group: ["paymentStatus"],
        raw: true,
      });

      const paymentStatusCounts = {
        unpaid: 0,
        paid: 0,
        failed: 0,
        refunded: 0,
      };

      ordersByPaymentStatus.forEach((item) => {
        paymentStatusCounts[item.paymentStatus] = parseInt(item.count) || 0;
      });

      // Doanh thu
      const revenueStats = await Order.findAll({
        attributes: [
          [fn("SUM", col("total")), "totalRevenue"],
          [fn("COUNT", col("id")), "totalCount"],
        ],
        where: {
          paymentStatus: "paid",
        },
        raw: true,
      });

      const totalRevenue = parseFloat(revenueStats[0]?.totalRevenue || 0);

      // Doanh thu hôm nay
      const todayRevenue = await Order.sum("total", {
        where: {
          paymentStatus: "paid",
          placedAt: {
            [Op.gte]: todayStart,
          },
        },
      }) || 0;

      // Doanh thu tháng này
      const thisMonthRevenue = await Order.sum("total", {
        where: {
          paymentStatus: "paid",
          placedAt: {
            [Op.gte]: thisMonthStart,
          },
        },
      }) || 0;

      // Doanh thu tháng trước
      const lastMonthRevenue = await Order.sum("total", {
        where: {
          paymentStatus: "paid",
          placedAt: {
            [Op.gte]: lastMonthStart,
            [Op.lte]: lastMonthEnd,
          },
        },
      }) || 0;

      // Đơn hàng hôm nay
      const todayOrders = await Order.count({
        where: {
          placedAt: {
            [Op.gte]: todayStart,
          },
        },
      });

      // Đơn hàng tháng này
      const thisMonthOrders = await Order.count({
        where: {
          placedAt: {
            [Op.gte]: thisMonthStart,
          },
        },
      });

      // Sản phẩm hết hàng
      const outOfStockProducts = await Product.count({
        where: {
          stock: 0,
          status: "active",
        },
      });

      // Sản phẩm sắp hết hàng (stock < 10)
      const lowStockProducts = await Product.count({
        where: {
          stock: {
            [Op.gt]: 0,
            [Op.lt]: 10,
          },
          status: "active",
        },
      });

      // Top 5 sản phẩm bán chạy
      const topProducts = await OrderItem.findAll({
        attributes: [
          "productId",
          [fn("SUM", col("qty")), "totalSold"],
        ],
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["id", "name", "price", "images"],
            required: false,
          },
        ],
        group: ["productId"],
        order: [[literal("totalSold"), "DESC"]],
        limit: 5,
        raw: false,
      });

      // Đơn hàng gần đây (7 ngày)
      const recentOrders = await Order.findAll({
        attributes: ["id", "code", "total", "status", "paymentStatus", "placedAt"],
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "fullName", "phone"],
            required: false,
          },
        ],
        order: [["placedAt", "DESC"]],
        limit: 10,
      });

      // Tăng trưởng doanh thu (%)
      const revenueGrowth = lastMonthRevenue > 0
        ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
        : 0;

      return res.json({
        overview: {
          totalOrders,
          totalProducts,
          totalCustomers,
          totalCategories,
          totalPromotions,
        },
        orders: {
          byStatus: statusCounts,
          byPaymentStatus: paymentStatusCounts,
          today: todayOrders,
          thisMonth: thisMonthOrders,
        },
        revenue: {
          total: totalRevenue,
          today: todayRevenue,
          thisMonth: thisMonthRevenue,
          lastMonth: lastMonthRevenue,
          growth: parseFloat(revenueGrowth),
        },
        products: {
          outOfStock: outOfStockProducts,
          lowStock: lowStockProducts,
        },
        topProducts: topProducts.map((item) => ({
          id: item.productId,
          name: item.product?.name || "Unknown",
          price: item.product?.price || 0,
          image: item.product?.images ? JSON.parse(item.product.images)[0] : null,
          totalSold: parseInt(item.dataValues.totalSold) || 0,
        })),
        recentOrders: recentOrders.map((order) => ({
          id: order.id,
          code: order.code,
          total: parseFloat(order.total),
          status: order.status,
          paymentStatus: order.paymentStatus,
          placedAt: order.placedAt,
          customer: order.user ? {
            id: order.user.id,
            name: order.user.fullName,
            phone: order.user.phone,
          } : null,
        })),
      });
    } catch (error) {
      console.error("Dashboard stats error:", error);
      return res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  }

  /**
   * GET /admin/orders
   * Lấy danh sách đơn hàng cho admin (không filter theo userId)
   */
  async getOrders(req, res) {
    try {
      const {
        status,
        paymentStatus,
        q,
        fromDate,
        toDate,
        sort = "newest",
        limit = 50,
        offset = 0,
      } = req.query;

      const where = {};
      if (status && status !== "all") where.status = status;
      if (paymentStatus && paymentStatus !== "all") where.paymentStatus = paymentStatus;
      if (fromDate) where.placedAt = { ...(where.placedAt || {}), [Op.gte]: new Date(fromDate) };
      if (toDate) where.placedAt = { ...(where.placedAt || {}), [Op.lte]: new Date(toDate) };

      const order = (() => {
        if (sort === "oldest") return [["placedAt", "ASC"]];
        if (sort === "totalAsc") return [["total", "ASC"]];
        if (sort === "totalDesc") return [["total", "DESC"]];
        return [["placedAt", "DESC"]];
      })();

      const orders = await Order.findAll({
        where,
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "fullName", "phone", "email"],
            required: false,
          },
          {
            model: OrderItem,
            as: "items",
            attributes: ["id", "productName", "productImageUrl", "qty", "unitPrice", "lineTotal"],
            required: false,
          },
        ],
        order,
        limit: Math.min(Number(limit), 100),
        offset: Number(offset),
      });

      // Search filter
      let filtered = orders;
      if (q) {
        const query = String(q).trim().toLowerCase();
        filtered = orders.filter((o) => {
          const hay = [
            o.code,
            o.shipName,
            o.shipPhone,
            o.status,
            o.paymentStatus,
            o.user?.fullName || "",
            o.user?.phone || "",
            ...(o.items || []).map((it) => it.productName),
          ].join(" ").toLowerCase();
          return hay.includes(query);
        });
      }

      return res.json({ orders: filtered });
    } catch (error) {
      console.error("Admin get orders error:", error);
      return res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  }

  /**
   * GET /admin/orders/:id
   * Lấy chi tiết đơn hàng cho admin
   */
  async getOrderDetail(req, res) {
    try {
      const { id } = req.params;

      const order = await Order.findByPk(id, {
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "fullName", "phone", "email"],
            required: false,
          },
          {
            model: OrderItem,
            as: "items",
            required: false,
          },
          {
            model: require("../models").OrderStatusHistory,
            as: "history",
            order: [["happenedAt", "ASC"]],
            required: false,
          },
        ],
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      return res.json({ order });
    } catch (error) {
      console.error("Admin get order detail error:", error);
      return res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  }

  /**
   * PUT /admin/orders/:id/status
   * Cập nhật trạng thái đơn hàng
   */
  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, description } = req.body;

      if (!status || !["pending", "processing", "shipping", "done", "canceled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Validate status transition
      if (order.status === "done" && status !== "done") {
        return res.status(400).json({ message: "Cannot change status of completed order" });
      }
      if (order.status === "canceled" && status !== "canceled") {
        return res.status(400).json({ message: "Cannot change status of canceled order" });
      }

      const oldStatus = order.status;
      order.status = status;
      await order.save();

      // Create status history
      const { OrderStatusHistory } = require("../models");
      const statusLabels = {
        pending: "Chờ xử lý",
        processing: "Đang xử lý",
        shipping: "Đang giao hàng",
        done: "Hoàn thành",
        canceled: "Đã hủy",
      };

      await OrderStatusHistory.create({
        orderId: order.id,
        status,
        title: statusLabels[status] || status,
        description: description || `Đơn hàng chuyển từ ${statusLabels[oldStatus] || oldStatus} sang ${statusLabels[status] || status}`,
        happenedAt: new Date(),
      });

      const updated = await Order.findByPk(order.id, {
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "fullName", "phone", "email"],
            required: false,
          },
          {
            model: OrderItem,
            as: "items",
            required: false,
          },
          {
            model: OrderStatusHistory,
            as: "history",
            order: [["happenedAt", "ASC"]],
            required: false,
          },
        ],
      });

      return res.json({ order: updated });
    } catch (error) {
      console.error("Admin update order status error:", error);
      return res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  }

  /**
   * PUT /admin/orders/:id/payment-status
   * Cập nhật trạng thái thanh toán của đơn hàng
   */
  async updatePaymentStatus(req, res) {
    try {
      const { id } = req.params;
      const { paymentStatus, paymentMethod, paymentTransactionId, description } = req.body;

      if (!paymentStatus || !["unpaid", "paid", "failed", "refunded"].includes(paymentStatus)) {
        return res.status(400).json({ message: "Invalid payment status" });
      }

      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Validate payment status transition
      if (order.paymentStatus === "refunded" && paymentStatus !== "refunded") {
        return res.status(400).json({ message: "Cannot change payment status of refunded order" });
      }

      const oldPaymentStatus = order.paymentStatus;
      order.paymentStatus = paymentStatus;
      
      // Update payment method if provided
      if (paymentMethod) {
        if (!["cod", "vnpay", "bank", "other"].includes(paymentMethod)) {
          return res.status(400).json({ message: "Invalid payment method" });
        }
        order.paymentMethod = paymentMethod;
      }

      // Update transaction ID if provided
      if (paymentTransactionId !== undefined) {
        order.paymentTransactionId = paymentTransactionId;
      }

      await order.save();

      // Create status history for payment status change
      const { OrderStatusHistory } = require("../models");
      const paymentStatusLabels = {
        unpaid: "Chưa thanh toán",
        paid: "Đã thanh toán",
        failed: "Thanh toán thất bại",
        refunded: "Đã hoàn tiền",
      };

      await OrderStatusHistory.create({
        orderId: order.id,
        status: order.status, // Keep order status, but note payment change in description
        title: `Cập nhật thanh toán: ${paymentStatusLabels[paymentStatus]}`,
        description: description || `Trạng thái thanh toán đã thay đổi từ ${paymentStatusLabels[oldPaymentStatus] || oldPaymentStatus} sang ${paymentStatusLabels[paymentStatus] || paymentStatus}`,
        happenedAt: new Date(),
      });

      const updated = await Order.findByPk(order.id, {
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "fullName", "phone", "email"],
            required: false,
          },
          {
            model: OrderItem,
            as: "items",
            required: false,
          },
          {
            model: OrderStatusHistory,
            as: "history",
            order: [["happenedAt", "ASC"]],
            required: false,
          },
        ],
      });

      return res.json({ order: updated });
    } catch (error) {
      console.error("Admin update payment status error:", error);
      return res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  }

  /**
   * GET /admin/users
   * Lấy danh sách users cho admin
   */
  async getUsers(req, res) {
    try {
      const {
        role,
        status,
        q,
        sort = "newest",
        limit = 100,
        offset = 0,
      } = req.query;

      const where = {};
      if (role && role !== "all") where.role = role;
      if (status && status !== "all") where.status = status;

      const order = (() => {
        if (sort === "oldest") return [["createdAt", "ASC"]];
        if (sort === "nameAsc") return [["fullName", "ASC"]];
        if (sort === "nameDesc") return [["fullName", "DESC"]];
        return [["createdAt", "DESC"]];
      })();

      const users = await User.findAll({
        where,
        attributes: ["id", "fullName", "email", "phone", "status", "role", "avatarUrl", "createdAt", "lastLoginAt"],
        order,
        limit: Math.min(Number(limit), 200),
        offset: Number(offset),
      });

      // Search filter
      let filtered = users;
      if (q) {
        const query = String(q).trim().toLowerCase();
        filtered = users.filter((u) => {
          const hay = [
            u.fullName || "",
            u.email || "",
            u.phone || "",
            u.id.toString(),
          ].join(" ").toLowerCase();
          return hay.includes(query);
        });
      }

      return res.json({ users: filtered });
    } catch (error) {
      console.error("Admin get users error:", error);
      return res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  }

  /**
   * POST /admin/users
   * Tạo user mới
   */
  async createUser(req, res) {
    try {
      const { fullName, email, phone, password, role = "customer", status = "active" } = req.body;

      // Validation
      if (!phone) {
        return res.status(400).json({ message: "Phone is required" });
      }
      if (!password || password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
      if (role && !["customer", "admin"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
      if (status && !["active", "inactive", "blocked"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      // Check unique phone
      const existingPhone = await User.findOne({ where: { phone } });
      if (existingPhone) {
        return res.status(409).json({ message: "Phone number already exists" });
      }

      // Check unique email if provided
      if (email) {
        const existingEmail = await User.findOne({ where: { email: email.toLowerCase().trim() } });
        if (existingEmail) {
          return res.status(409).json({ message: "Email already exists" });
        }
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        fullName: fullName ? String(fullName).trim() : null,
        email: email ? String(email).trim().toLowerCase() : null,
        phone: String(phone).trim(),
        passwordHash,
        role,
        status,
      });

      const safeUser = newUser.toJSON();
      delete safeUser.passwordHash;

      return res.status(201).json({ user: safeUser });
    } catch (error) {
      console.error("Admin create user error:", error);
      return res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  }

  /**
   * PUT /admin/users/:id
   * Cập nhật thông tin user
   */
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { fullName, email, phone, password, role, status } = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update fullName
      if (fullName !== undefined) {
        user.fullName = fullName ? String(fullName).trim() : null;
      }

      // Update email
      if (email !== undefined) {
        const nextEmail = String(email).trim().toLowerCase();
        if (nextEmail && nextEmail !== String(user.email || "").toLowerCase()) {
          const exists = await User.findOne({ where: { email: nextEmail, id: { [Op.ne]: id } } });
          if (exists) {
            return res.status(409).json({ message: "Email already in use" });
          }
          user.email = nextEmail;
        } else if (!nextEmail) {
          user.email = null;
        }
      }

      // Update phone
      if (phone !== undefined) {
        const nextPhone = String(phone).trim();
        if (nextPhone !== user.phone) {
          const exists = await User.findOne({ where: { phone: nextPhone, id: { [Op.ne]: id } } });
          if (exists) {
            return res.status(409).json({ message: "Phone number already in use" });
          }
          user.phone = nextPhone;
        }
      }

      // Update password
      if (password !== undefined) {
        if (password.length < 6) {
          return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        user.passwordHash = await bcrypt.hash(password, 10);
      }

      // Update role
      if (role !== undefined) {
        if (!["customer", "admin"].includes(role)) {
          return res.status(400).json({ message: "Invalid role" });
        }
        user.role = role;
      }

      // Update status
      if (status !== undefined) {
        if (!["active", "inactive", "blocked"].includes(status)) {
          return res.status(400).json({ message: "Invalid status" });
        }
        user.status = status;
      }

      await user.save();

      const safeUser = user.toJSON();
      delete safeUser.passwordHash;

      return res.json({ user: safeUser });
    } catch (error) {
      console.error("Admin update user error:", error);
      return res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  }

  /**
   * DELETE /admin/users/:id
   * Xóa user
   */
  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if user has orders
      const orderCount = await Order.count({ where: { userId: id } });
      if (orderCount > 0) {
        // If user has orders, set status to blocked instead of deleting
        user.status = "blocked";
        await user.save();
        return res.json({
          message: "User cannot be deleted as they have orders. Status set to blocked.",
          user: user.toJSON(),
        });
      }

      // Delete user if no orders
      await user.destroy();

      return res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Admin delete user error:", error);
      return res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  }

  /**
   * PATCH /admin/users/:id/role
   * Cập nhật role của user
   */
  async updateUserRole(req, res) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!role || !["customer", "admin"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.role = role;
      await user.save();

      const safeUser = user.toJSON();
      delete safeUser.passwordHash;

      return res.json({ user: safeUser });
    } catch (error) {
      console.error("Admin update user role error:", error);
      return res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  }

  /**
   * PATCH /admin/users/:id/status
   * Cập nhật status của user (khóa/mở khóa tài khoản)
   */
  async updateUserStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status || !["active", "inactive", "blocked"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.status = status;
      await user.save();

      const safeUser = user.toJSON();
      delete safeUser.passwordHash;

      return res.json({ user: safeUser });
    } catch (error) {
      console.error("Admin update user status error:", error);
      return res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  }

  /**
   * GET /admin/promotions
   * Lấy danh sách promotions cho admin
   */
  async getPromotions(req, res) {
    try {
      const {
        type,
        isActive,
        q,
        sort = "newest",
        limit = 100,
        offset = 0,
      } = req.query;

      const where = {};
      if (type && type !== "all") where.type = type;
      if (isActive !== undefined && isActive !== "all") {
        where.isActive = isActive === "true" || isActive === true;
      }

      const order = (() => {
        if (sort === "oldest") return [["createdAt", "ASC"]];
        if (sort === "titleAsc") return [["title", "ASC"]];
        if (sort === "titleDesc") return [["title", "DESC"]];
        return [["createdAt", "DESC"]];
      })();

      const promotions = await Promotion.findAll({
        where,
        order,
        limit: Math.min(Number(limit), 200),
        offset: Number(offset),
      });

      // Search filter
      let filtered = promotions;
      if (q) {
        const query = String(q).trim().toLowerCase();
        filtered = promotions.filter((p) => {
          const hay = [
            p.title || "",
            p.code || "",
            p.type || "",
          ].join(" ").toLowerCase();
          return hay.includes(query);
        });
      }

      return res.json({ promotions: filtered });
    } catch (error) {
      console.error("Admin get promotions error:", error);
      return res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  }

  /**
   * GET /admin/promotions/:id
   * Lấy chi tiết promotion
   */
  async getPromotionDetail(req, res) {
    try {
      const { id } = req.params;

      const promotion = await Promotion.findByPk(id, {
        include: [
          {
            model: PromotionItem,
            as: "items",
            include: [
              {
                model: Product,
                as: "product",
                attributes: ["id", "name", "price", "images"],
                required: false,
              },
            ],
            required: false,
          },
        ],
      });

      if (!promotion) {
        return res.status(404).json({ message: "Promotion not found" });
      }

      return res.json({ promotion });
    } catch (error) {
      console.error("Admin get promotion detail error:", error);
      return res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  }

  /**
   * POST /admin/promotions
   * Tạo promotion mới
   */
  async createPromotion(req, res) {
    try {
      const {
        type,
        title,
        code,
        discountType,
        discountValue,
        minOrderAmount,
        startsAt,
        endsAt,
        isActive = true,
        data,
      } = req.body;

      // Validation
      if (!type || !["voucher", "flash_sale"].includes(type)) {
        return res.status(400).json({ message: "Invalid type. Must be 'voucher' or 'flash_sale'" });
      }
      if (!title) {
        return res.status(400).json({ message: "Title is required" });
      }

      // Voucher requires code, discountType, discountValue
      if (type === "voucher") {
        if (!code) {
          return res.status(400).json({ message: "Code is required for voucher" });
        }
        if (!discountType || !["amount", "percent"].includes(discountType)) {
          return res.status(400).json({ message: "Invalid discountType" });
        }
        if (!discountValue || Number(discountValue) <= 0) {
          return res.status(400).json({ message: "discountValue must be greater than 0" });
        }
      }

      // Check unique code for voucher
      if (type === "voucher" && code) {
        const existing = await Promotion.findOne({ where: { code } });
        if (existing) {
          return res.status(409).json({ message: "Promotion code already exists" });
        }
      }

      const newPromotion = await Promotion.create({
        type,
        title: String(title).trim(),
        code: code ? String(code).trim() : null,
        discountType: discountType || null,
        discountValue: discountValue ? Number(discountValue) : null,
        minOrderAmount: minOrderAmount ? Number(minOrderAmount) : null,
        startsAt: startsAt ? new Date(startsAt) : null,
        endsAt: endsAt ? new Date(endsAt) : null,
        isActive: Boolean(isActive),
        data: data ? (typeof data === "string" ? JSON.parse(data) : data) : null,
      });

      return res.status(201).json({ promotion: newPromotion });
    } catch (error) {
      console.error("Admin create promotion error:", error);
      return res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  }

  /**
   * PUT /admin/promotions/:id
   * Cập nhật promotion
   */
  async updatePromotion(req, res) {
    try {
      const { id } = req.params;
      const {
        title,
        code,
        discountType,
        discountValue,
        minOrderAmount,
        startsAt,
        endsAt,
        isActive,
        data,
      } = req.body;

      const promotion = await Promotion.findByPk(id);
      if (!promotion) {
        return res.status(404).json({ message: "Promotion not found" });
      }

      // Update fields
      if (title !== undefined) promotion.title = String(title).trim();
      if (code !== undefined) {
        const nextCode = code ? String(code).trim() : null;
        if (promotion.type === "voucher" && !nextCode) {
          return res.status(400).json({ message: "Code is required for voucher" });
        }
        if (nextCode && nextCode !== promotion.code) {
          const exists = await Promotion.findOne({ where: { code: nextCode, id: { [Op.ne]: id } } });
          if (exists) {
            return res.status(409).json({ message: "Promotion code already exists" });
          }
        }
        promotion.code = nextCode;
      }
      if (discountType !== undefined) {
        if (promotion.type === "voucher" && !["amount", "percent"].includes(discountType)) {
          return res.status(400).json({ message: "Invalid discountType" });
        }
        promotion.discountType = discountType || null;
      }
      if (discountValue !== undefined) {
        if (promotion.type === "voucher" && (!discountValue || Number(discountValue) <= 0)) {
          return res.status(400).json({ message: "discountValue must be greater than 0" });
        }
        promotion.discountValue = discountValue ? Number(discountValue) : null;
      }
      if (minOrderAmount !== undefined) promotion.minOrderAmount = minOrderAmount ? Number(minOrderAmount) : null;
      if (startsAt !== undefined) promotion.startsAt = startsAt ? new Date(startsAt) : null;
      if (endsAt !== undefined) promotion.endsAt = endsAt ? new Date(endsAt) : null;
      if (isActive !== undefined) promotion.isActive = Boolean(isActive);
      if (data !== undefined) promotion.data = data ? (typeof data === "string" ? JSON.parse(data) : data) : null;

      await promotion.save();

      return res.json({ promotion });
    } catch (error) {
      console.error("Admin update promotion error:", error);
      return res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  }

  /**
   * DELETE /admin/promotions/:id
   * Xóa promotion
   */
  async deletePromotion(req, res) {
    try {
      const { id } = req.params;

      const promotion = await Promotion.findByPk(id);
      if (!promotion) {
        return res.status(404).json({ message: "Promotion not found" });
      }

      // Delete promotion items first
      await PromotionItem.destroy({ where: { promotionId: id } });

      // Delete promotion
      await promotion.destroy();

      return res.json({ message: "Promotion deleted successfully" });
    } catch (error) {
      console.error("Admin delete promotion error:", error);
      return res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  }

  /**
   * POST /admin/promotions/:id/items
   * Thêm sản phẩm vào flash sale
   */
  async addPromotionItem(req, res) {
    try {
      const { id } = req.params;
      const { productId, discountPct, stockLimit } = req.body;

      const promotion = await Promotion.findByPk(id);
      if (!promotion) {
        return res.status(404).json({ message: "Promotion not found" });
      }

      if (promotion.type !== "flash_sale") {
        return res.status(400).json({ message: "Only flash_sale promotions can have items" });
      }

      if (!productId || !discountPct) {
        return res.status(400).json({ message: "productId and discountPct are required" });
      }

      const [item, created] = await PromotionItem.findOrCreate({
        where: { promotionId: id, productId },
        defaults: {
          promotionId: id,
          productId,
          discountPct: Number(discountPct),
          stockLimit: stockLimit ? Number(stockLimit) : null,
          soldCount: 0,
        },
      });

      if (!created) {
        // Update existing item
        item.discountPct = Number(discountPct);
        if (stockLimit !== undefined) item.stockLimit = stockLimit ? Number(stockLimit) : null;
        await item.save();
      }

      const updated = await PromotionItem.findByPk(item.id, {
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["id", "name", "price", "images"],
          },
        ],
      });

      return res.json({ item: updated });
    } catch (error) {
      console.error("Admin add promotion item error:", error);
      return res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  }

  /**
   * DELETE /admin/promotions/:id/items/:itemId
   * Xóa sản phẩm khỏi flash sale
   */
  async removePromotionItem(req, res) {
    try {
      const { id, itemId } = req.params;

      const item = await PromotionItem.findOne({
        where: { id: itemId, promotionId: id },
      });

      if (!item) {
        return res.status(404).json({ message: "Promotion item not found" });
      }

      await item.destroy();

      return res.json({ message: "Promotion item removed successfully" });
    } catch (error) {
      console.error("Admin remove promotion item error:", error);
      return res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  }

  /**
   * GET /admin/categories
   * Lấy danh sách categories cho admin
   */
  async getCategories(req, res) {
    try {
      const { tree, isActive } = req.query;

      if (tree === "1") {
        const parents = await Category.findAll({
          where: { parentId: null, ...(isActive !== undefined ? { isActive: isActive === "true" } : {}) },
          order: [["sortOrder", "ASC"], ["id", "ASC"]],
          include: [
            {
              model: Category,
              as: "children",
              where: isActive !== undefined ? { isActive: isActive === "true" } : {},
              required: false,
              order: [["sortOrder", "ASC"]],
            },
          ],
        });
        return res.json({ categories: parents });
      }

      const categories = await Category.findAll({
        where: isActive !== undefined ? { isActive: isActive === "true" } : {},
        order: [["sortOrder", "ASC"], ["id", "ASC"]],
        include: [
          {
            model: Category,
            as: "parent",
            attributes: ["id", "name", "slug"],
            required: false,
          },
        ],
      });

      return res.json({ categories });
    } catch (error) {
      console.error("Admin get categories error:", error);
      return res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  }

  /**
   * POST /admin/categories
   * Tạo category mới
   */
  async createCategory(req, res) {
    try {
      const { name, slug, icon, hint, parentId, sortOrder, isActive = true } = req.body;

      if (!name || !slug) {
        return res.status(400).json({ message: "Name and slug are required" });
      }

      // Check unique slug
      const existing = await Category.findOne({ where: { slug } });
      if (existing) {
        return res.status(409).json({ message: "Category slug already exists" });
      }

      // Validate parentId if provided
      if (parentId) {
        const parent = await Category.findByPk(parentId);
        if (!parent) {
          return res.status(404).json({ message: "Parent category not found" });
        }
      }

      const newCategory = await Category.create({
        name: String(name).trim(),
        slug: String(slug).trim(),
        icon: icon ? String(icon).trim() : null,
        hint: hint ? String(hint).trim() : null,
        parentId: parentId ? Number(parentId) : null,
        sortOrder: sortOrder ? Number(sortOrder) : 0,
        isActive: Boolean(isActive),
      });

      return res.status(201).json({ category: newCategory });
    } catch (error) {
      console.error("Admin create category error:", error);
      return res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  }

  /**
   * PUT /admin/categories/:id
   * Cập nhật category
   */
  async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const { name, slug, icon, hint, parentId, sortOrder, isActive } = req.body;

      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      // Update fields
      if (name !== undefined) category.name = String(name).trim();
      if (slug !== undefined) {
        const nextSlug = String(slug).trim();
        if (nextSlug !== category.slug) {
          const exists = await Category.findOne({ where: { slug: nextSlug, id: { [Op.ne]: id } } });
          if (exists) {
            return res.status(409).json({ message: "Category slug already exists" });
          }
        }
        category.slug = nextSlug;
      }
      if (icon !== undefined) category.icon = icon ? String(icon).trim() : null;
      if (hint !== undefined) category.hint = hint ? String(hint).trim() : null;
      if (parentId !== undefined) {
        if (parentId && Number(parentId) === id) {
          return res.status(400).json({ message: "Category cannot be its own parent" });
        }
        if (parentId) {
          const parent = await Category.findByPk(parentId);
          if (!parent) {
            return res.status(404).json({ message: "Parent category not found" });
          }
        }
        category.parentId = parentId ? Number(parentId) : null;
      }
      if (sortOrder !== undefined) category.sortOrder = Number(sortOrder);
      if (isActive !== undefined) category.isActive = Boolean(isActive);

      await category.save();

      return res.json({ category });
    } catch (error) {
      console.error("Admin update category error:", error);
      return res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  }

  /**
   * DELETE /admin/categories/:id
   * Xóa category
   */
  async deleteCategory(req, res) {
    try {
      const { id } = req.params;

      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      // Check if category has children
      const childrenCount = await Category.count({ where: { parentId: id } });
      if (childrenCount > 0) {
        return res.status(400).json({ message: "Cannot delete category with children. Please delete or move children first." });
      }

      // Check if category has products
      const { Product } = require("../models");
      const productsCount = await Product.count({ where: { categoryId: id } });
      if (productsCount > 0) {
        // Set inactive instead of deleting
        category.isActive = false;
        await category.save();
        return res.json({
          message: "Category cannot be deleted as it has products. Status set to inactive.",
          category,
        });
      }

      await category.destroy();

      return res.json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("Admin delete category error:", error);
      return res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  }

  /**
   * GET /admin/promotion-items
   * Lấy danh sách tất cả promotion items cho admin
   */
  async getPromotionItems(req, res) {
    try {
      const {
        promotionId,
        productId,
        sort = "newest",
        limit = 200,
        offset = 0,
      } = req.query;

      const where = {};
      if (promotionId) where.promotionId = Number(promotionId);
      if (productId) where.productId = Number(productId);

      const order = (() => {
        if (sort === "oldest") return [["createdAt", "ASC"]];
        if (sort === "discountDesc") return [["discountPct", "DESC"]];
        if (sort === "discountAsc") return [["discountPct", "ASC"]];
        if (sort === "soldDesc") return [["soldCount", "DESC"]];
        return [["createdAt", "DESC"]];
      })();

      const items = await PromotionItem.findAll({
        where,
        include: [
          {
            model: Promotion,
            as: "promotion",
            attributes: ["id", "title", "type", "isActive"],
            required: false,
          },
          {
            model: Product,
            as: "product",
            attributes: ["id", "name", "price", "images", "stock", "status"],
            required: false,
          },
        ],
        order,
        limit: Math.min(Number(limit), 500),
        offset: Number(offset),
      });

      return res.json({ items });
    } catch (error) {
      console.error("Admin get promotion items error:", error);
      return res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  }

  /**
   * PUT /admin/promotion-items/:id
   * Cập nhật promotion item
   */
  async updatePromotionItem(req, res) {
    try {
      const { id } = req.params;
      const { discountPct, stockLimit } = req.body;

      const item = await PromotionItem.findByPk(id);
      if (!item) {
        return res.status(404).json({ message: "Promotion item not found" });
      }

      if (discountPct !== undefined) {
        if (Number(discountPct) < 0 || Number(discountPct) > 100) {
          return res.status(400).json({ message: "discountPct must be between 0 and 100" });
        }
        item.discountPct = Number(discountPct);
      }

      if (stockLimit !== undefined) {
        item.stockLimit = stockLimit ? Number(stockLimit) : null;
      }

      await item.save();

      const updated = await PromotionItem.findByPk(item.id, {
        include: [
          {
            model: Promotion,
            as: "promotion",
            attributes: ["id", "title", "type", "isActive"],
            required: false,
          },
          {
            model: Product,
            as: "product",
            attributes: ["id", "name", "price", "images", "stock", "status"],
            required: false,
          },
        ],
      });

      return res.json({ item: updated });
    } catch (error) {
      console.error("Admin update promotion item error:", error);
      return res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  }

  /**
   * DELETE /admin/promotion-items/:id
   * Xóa promotion item
   */
  async deletePromotionItem(req, res) {
    try {
      const { id } = req.params;

      const item = await PromotionItem.findByPk(id);
      if (!item) {
        return res.status(404).json({ message: "Promotion item not found" });
      }

      await item.destroy();

      return res.json({ message: "Promotion item deleted successfully" });
    } catch (error) {
      console.error("Admin delete promotion item error:", error);
      return res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  }
}

module.exports = new AdminController();
