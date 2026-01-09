import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Text, View, Pressable, ScrollView, Image, ActivityIndicator, Alert, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import { apiOrderDetail, apiCancelOrder } from "../services/endpoints";

import styles, { COLORS } from "../styles/OrderDetailStyle";

const STATUS_LABEL = {
  pending: "Chờ xác nhận",
  processing: "Đang xử lý",
  shipping: "Đang giao",
  done: "Đã giao",
  canceled: "Đã hủy",
};

const STATUS_UI = {
  pending: { bg: "#FFF3E6", text: "#F59E0B", icon: "time-outline" },
  processing: { bg: "#E9F7FF", text: "#0EA5E9", icon: "construct-outline" },
  shipping: { bg: "#EAF2FF", text: COLORS.BLUE, icon: "car-outline" },
  done: { bg: "#EAFBF3", text: COLORS.GREEN, icon: "checkmark-circle-outline" },
  canceled: { bg: "#FEE2E2", text: COLORS.RED, icon: "close-circle-outline" },
};

const formatVnd = (n) => {
  const s = Math.round(Number(n || 0)).toString();
  return `${s.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}đ`;
};

const pad2 = (n) => String(n).padStart(2, "0");

const parseSqlDate = (v) => {
  if (!v) return new Date(0);
  if (v instanceof Date) return v;
  const s = String(v).trim();
  const iso = s.includes("T") ? s : s.replace(" ", "T");
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? new Date(0) : d;
};

const formatDateVN = (v) => {
  const d = parseSqlDate(v);
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
};

const formatDateOnlyVN = (v) => {
  const d = parseSqlDate(v);
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
};

const pickImageFromProductImageUrl = (v) => {
  if (!v) return null;
  if (Array.isArray(v) && v.length) return v[0];

  const s = String(v).trim();
  if (!s) return null;

  if (s.startsWith("http://") || s.startsWith("https://")) return s;

  if (s.startsWith("[")) {
    try {
      const arr = JSON.parse(s);
      if (Array.isArray(arr) && arr.length && typeof arr[0] === "string") return arr[0];
    } catch {
      return null;
    }
  }

  return null;
};

const normalizeOrderDetail = (payload) => {
  const o = payload?.order || payload || {};
  const id = String(o.id ?? "");
  const code = o.code ? `#${o.code}` : id ? `#ORD-${id}` : "#ORD";

  const statusKey = String(o.status || "pending");
  const statusText = STATUS_LABEL[statusKey] || statusKey;
  const ui = STATUS_UI[statusKey] || { bg: COLORS.BORDER, text: COLORS.SUB, icon: "help-circle-outline" };

  const placedAt = o.placedAt || o.createdAt || null;

  const subtotal = Number(o.subtotal || 0);
  const shipping = Number(o.shippingFee || 0);
  const total = Number(o.total || 0);

  const items = (Array.isArray(o.items) ? o.items : []).map((it) => {
    const img = pickImageFromProductImageUrl(it.productImageUrl) || "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&q=80";

    const unitPrice = Number(it.unitPrice || 0);
    const qty = Number(it.qty || 1);
    const lineTotal = Number(it.lineTotal || unitPrice * qty);

    return {
      id: String(it.id),
      productId: String(it.productId),
      name: it.productName || "Sản phẩm",
      img,
      unitPrice,
      qty,
      lineTotal,
      raw: it,
    };
  });

  const history = Array.isArray(o.history) ? o.history : [];
  const timeline = history
    .slice()
    .sort((a, b) => parseSqlDate(a.happenedAt).getTime() - parseSqlDate(b.happenedAt).getTime())
    .map((h) => ({
      id: String(h.id),
      status: String(h.status || ""),
      title: h.title || STATUS_LABEL[h.status] || "Cập nhật",
      desc: h.description || "",
      time: h.happenedAt ? formatDateVN(h.happenedAt) : "Chưa cập nhật",
    }));

  const shipInfo = {
    name: o.shipName || "",
    phone: o.shipPhone || "",
    addr: o.shipAddressText || "",
    method: o.shippingMethod || "",
  };

  const paymentStatus = String(o.paymentStatus || "");
  const discountTotal = Number(o.discountTotal || 0);

  const eta = o.eta || o.estimatedDelivery || null;

  return {
    id,
    code,
    statusKey,
    statusText,
    ui,
    placedAt,
    eta: eta ? formatDateOnlyVN(eta) : "",
    shipInfo,
    items,
    money: { subtotal, shipping, discountTotal, total },
    paymentStatus,
    timeline,
    raw: o,
  };
};

export default function OrderDetailScreen({ navigation, route }) {
  const orderId = route?.params?.orderId ?? route?.params?.id ?? route?.params?.order?.id ?? null;

  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);

  const load = useCallback(async () => {
    if (!orderId) {
      setLoading(false);
      setDetail(null);
      return;
    }
    try {
      setLoading(true);
      const res = await apiOrderDetail(orderId);
      setDetail(normalizeOrderDetail(res));
    } catch (e) {
      Alert.alert("Lỗi", e?.message || "Không tải được chi tiết đơn hàng");
      setDetail(null);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const canCancel = detail?.statusKey === "pending" || detail?.statusKey === "processing";

  const onCancel = useCallback(() => {
    if (!detail?.id) return;
    if (!canCancel) {
      Alert.alert("Không thể hủy", "Đơn này không ở trạng thái cho phép hủy");
      return;
    }
    Alert.alert("Hủy đơn", "Hủy đơn này?", [
      { text: "Không", style: "cancel" },
      {
        text: "Hủy",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            await apiCancelOrder(detail.id);
            await load();
          } catch (e) {
            setLoading(false);
            Alert.alert("Lỗi", e?.message || "Không hủy được đơn");
          }
        },
      },
    ]);
  }, [detail, canCancel, load]);

  const onCall = useCallback(async () => {
    const phone = detail?.shipInfo?.phone || "";
    const digits = phone.replace(/[^\d+]/g, "");
    if (!digits) return;
    try {
      await Linking.openURL(`tel:${digits}`);
    } catch {}
  }, [detail]);

  const Dot = ({ kind, isLast }) => {
    const isDone = kind === "done";
    const isActive = kind === "active";
    const bg = isDone ? COLORS.GREEN : isActive ? COLORS.BLUE : COLORS.LINE;
    const border = isDone || isActive ? bg : COLORS.GREY;

    return (
      <View style={styles.dotCol}>
        <View style={[styles.dot, { backgroundColor: bg, borderColor: border }]}>
          {isDone ? (
            <Ionicons name="checkmark" size={16} color={COLORS.WHITE} />
          ) : isActive ? (
            <Ionicons name="time-outline" size={16} color={COLORS.WHITE} />
          ) : (
            <Ionicons name="ellipse-outline" size={14} color={COLORS.MUTED} />
          )}
        </View>
        {!isLast && <View style={styles.vLine} />}
      </View>
    );
  };

  const timelineWithState = useMemo(() => {
    const t = detail?.timeline || [];
    if (t.length === 0) return [];
    return t.map((x, idx) => {
      const last = idx === t.length - 1;
      return { ...x, kind: last ? "active" : "done" };
    });
  }, [detail]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.TEXT} />
        </Pressable>

        <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>

        <Pressable style={styles.headerBtn} onPress={onCall}>
          <Ionicons name="call-outline" size={22} color={COLORS.TEXT} />
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : !detail ? (
        <View style={styles.empty}>
          <Ionicons name="receipt-outline" size={42} color={COLORS.MUTED} />
          <Text style={styles.emptyTitle}>Không có dữ liệu</Text>
          <Text style={styles.emptySub}>Thiếu orderId hoặc API lỗi</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.topCard}>
            <View style={[styles.bigIconWrap, { backgroundColor: detail.ui.text }]}>
              <Ionicons name={detail.ui.icon} size={34} color={COLORS.WHITE} />
            </View>

            <Text style={styles.orderCode}>
              Mã đơn hàng: <Text style={styles.orderCodeBlue}>{detail.code}</Text>
            </Text>

            <View style={[styles.statusPill, { backgroundColor: detail.ui.bg }]}>
              <Text style={[styles.statusPillText, { color: detail.ui.text }]}>{detail.statusText}</Text>
            </View>

            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={16} color={COLORS.BLUE} />
              <Text style={styles.metaText}>Đặt ngày: {detail.placedAt ? formatDateVN(detail.placedAt) : "—"}</Text>
            </View>

            <View style={styles.topActions}>
              <Pressable
                style={[styles.topBtn, styles.topBtnOutline, !canCancel && { opacity: 0.5 }]}
                onPress={onCancel}
                disabled={!canCancel}
              >
                <Ionicons name="close-outline" size={16} color={COLORS.BLUE} />
                <Text style={[styles.topBtnText, { color: COLORS.BLUE }]}>Hủy đơn</Text>
              </Pressable>

              <Pressable
                style={[styles.topBtn, styles.topBtnOutline]}
                onPress={() => navigation.navigate("AppTabs", { screen: "Home" })}
              >
                <Ionicons name="bag-handle-outline" size={16} color={COLORS.BLUE} />
                <Text style={[styles.topBtnText, { color: COLORS.BLUE }]}>Mua tiếp</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Lịch sử trạng thái</Text>

            {timelineWithState.length === 0 ? (
              <Text style={styles.muted}>Chưa có lịch sử</Text>
            ) : (
              <View style={styles.timeline}>
                {timelineWithState.map((t, idx) => {
                  const isLast = idx === timelineWithState.length - 1;
                  const titleColor = t.kind === "todo" ? COLORS.MUTED : COLORS.TEXT;

                  return (
                    <View key={t.id} style={styles.tRow}>
                      <Dot kind={t.kind} isLast={isLast} />

                      <View style={styles.tContent}>
                        <Text style={[styles.tTitle, { color: titleColor }]}>{t.title}</Text>
                        <Text style={styles.tTime}>{t.time}</Text>
                        <Text style={styles.tDesc}>{t.desc || "—"}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sản phẩm</Text>

            <View style={{ gap: 12 }}>
              {detail.items.map((it) => (
                <View key={it.id} style={styles.itemRow}>
                  <View style={styles.itemImgBox}>
                    <Image source={{ uri: it.img }} style={styles.itemImg} />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemName} numberOfLines={2}>
                      {it.name}
                    </Text>
                    <Text style={styles.itemSub}>
                      {formatVnd(it.unitPrice)} · SL: {it.qty}
                    </Text>
                  </View>

                  <Text style={styles.itemTotal}>{formatVnd(it.lineTotal)}</Text>
                </View>
              ))}
            </View>

            <View style={styles.moneyBox}>
              <View style={styles.moneyRow}>
                <Text style={styles.moneyLabel}>Tạm tính</Text>
                <Text style={styles.moneyValue}>{formatVnd(detail.money.subtotal)}</Text>
              </View>

              <View style={styles.moneyRow}>
                <Text style={styles.moneyLabel}>Giảm giá</Text>
                <Text style={styles.moneyValue}>{detail.money.discountTotal > 0 ? `-${formatVnd(detail.money.discountTotal)}` : "0đ"}</Text>
              </View>

              <View style={styles.moneyRow}>
                <Text style={styles.moneyLabel}>Vận chuyển</Text>
                <Text style={[styles.moneyValue, { color: COLORS.GREEN }]}>{Number(detail.money.shipping) === 0 ? "Miễn phí" : formatVnd(detail.money.shipping)}</Text>
              </View>

              <View style={styles.moneyDivider} />

              <View style={styles.moneyRow}>
                <Text style={styles.moneyTotalLabel}>Tổng cộng</Text>
                <Text style={styles.moneyTotalValue}>{formatVnd(detail.money.total)}</Text>
              </View>

              <View style={styles.payRow}>
                <Text style={styles.payLabel}>Thanh toán</Text>
                <Text style={[styles.payValue, detail.paymentStatus === "paid" ? { color: COLORS.GREEN } : { color: COLORS.RED }]}>
                  {detail.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.shipHeader}>
              <Text style={styles.cardTitle}>Thông tin giao hàng</Text>
            </View>

            <View style={styles.shipRow}>
              <View style={styles.shipAvatar}>
                <Text style={styles.shipAvatarText}>{(detail.shipInfo.name || "?").trim().slice(0, 1).toUpperCase()}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.shipName}>{detail.shipInfo.name || "—"}</Text>
                <Text style={styles.shipSub}>Phương thức: {detail.shipInfo.method || "—"}</Text>
                <Text style={styles.shipPhone}>{detail.shipInfo.phone || "—"}</Text>
                <Text style={styles.shipAddr} numberOfLines={3}>
                  {detail.shipInfo.addr || "—"}
                </Text>
              </View>
            </View>
          </View>

          <View style={{ height: 14 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
