const authRoute = require("./auth.routes");
const userRoute = require("./users.routes");
const addressRoute = require("./addresses.routes");
const categoryRoute = require("./categories.routes");
const productRoute = require("./products.routes");
const cartRoute = require("./cart.routes");
const orderRoute = require("./orders.routes");
const promoRoute = require("./promotions.routes");
const flashSaleRoute = require("./flashsales.routes");
const shippingRoute = require("./shipping.routes");
const eventsRoute = require("./events.routes");
const notifRoute = require("./notifications.routes");
const searchRoute = require("./search.routes");
const paymentRoute = require("./payments.routes");
const adminRoute = require("./admin.routes");

function route(app) {
  app.use("/auth", authRoute);
  app.use("/users", userRoute);
  app.use("/addresses", addressRoute);
  app.use("/categories", categoryRoute);
  app.use("/products", productRoute);
  app.use("/cart", cartRoute);
  app.use("/orders", orderRoute);
  app.use("/promotions", promoRoute);
  app.use("/api/flash-sales", flashSaleRoute);
  app.use("/shipping", shippingRoute);
  app.use("/events", eventsRoute);
  app.use("/notifications", notifRoute);
  app.use("/search", searchRoute);
  app.use("/api/payments", paymentRoute);
  app.use("/admin", adminRoute);
}

module.exports = route;
