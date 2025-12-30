const express = require("express");
const cors = require("cors");

const route = require("./app/routes");
const { errorHandler } = require("./app/middlewares/error.middleware");
const { sequelize } = require("./app/models");

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));

route(app);

app.get("/", (req, res) => res.json({ ok: true, service: "techstore-api" }));

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("DB connected");

    // Nếu bạn đã tạo bảng bằng SQL thủ công thì KHÔNG sync để tránh lệch.
    // Nếu muốn Sequelize tự tạo bảng: bật force/alter tùy bạn.
    // await sequelize.sync({ alter: false });

    app.listen(PORT, () => console.log(`API running: http://127.0.0.1:${PORT}`));
  } catch (e) {
    console.error("Boot error:", e);
    process.exit(1);
  }
})();
