import api from "./api";

export const fetchFlashSales = async () =>
  api.get("/api/flash-sales").then((r) => r.data);
