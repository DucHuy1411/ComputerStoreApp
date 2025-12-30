const { Notification } = require("../models");

class NotificationsController {
  // GET /notifications
  async index(req, res) {
    const userId = req.user.id;
    const list = await Notification.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
      limit: 200,
    });
    return res.json({ notifications: list });
  }

  // GET /notifications/unread-count
  async unreadCount(req, res) {
    const userId = req.user.id;
    const n = await Notification.count({ where: { userId, isRead: false } });
    return res.json({ unread: n });
  }

  // PATCH /notifications/:id/read
  async read(req, res) {
    const userId = req.user.id;
    const id = req.params.id;

    const noti = await Notification.findOne({ where: { id, userId } });
    if (!noti) return res.status(404).json({ message: "Notification not found" });

    noti.isRead = true;
    noti.readAt = new Date();
    await noti.save();

    return res.json({ message: "OK" });
  }
}

module.exports = new NotificationsController();
