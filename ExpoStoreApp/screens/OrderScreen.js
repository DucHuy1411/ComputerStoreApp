import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Text,
  View,
  Pressable,
  ScrollView,
  Image,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
  FlatList, // ✅ add
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import { apiOrders, apiCancelOrder } from "../services/endpoints";
import styles, { COLORS } from "../styles/OrderStyle";

const { BG, TEXT, SUB, BLUE, BORDER, CARD, GREEN, RED } = COLORS;

const STATUS_LABEL = {
  pending: "Chờ xác nhận",
  processing: "Đang xử lý",
  shipping: "Đang giao",
  done: "Đã giao",
  canceled: "Đã hủy",
};

const STATUS_UI = {
  pending: { bg: "#FFF3E6", text: "#F59E0B" },
  processing: { bg: "#E9F7FF", text: "#0EA5E9" },
  shipping: { bg: "#EAFBF3", text: GREEN },
  done: { bg: "#EAFBF3", text: GREEN },
  canceled: { bg: "#FEE2E2", text: RED },
};

const pad2 = (n) => String(n).padStart(2, "0");

const parseSqlDate = (v) => {
  if (!v) return new Date(0);
  const s = String(v).trim();
  const iso = s.includes("T") ? s : s.replace(" ", "T");
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? new Date(0) : d;
};

const formatDateVN = (v) => {
  const d = parseSqlDate(v);
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()} ${pad2(d.getHours())}:${pad2(
    d.getMinutes()
  )}`;
};

const formatVnd = (n) => {
  const s = Math.round(Number(n || 0)).toString();
  return `${s.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}đ`;
};

const parseMoney = (v) => Number(String(v || "0").replace(/[^\d.]/g, "")) || 0;

const pickFirstImage = (productImageUrl) => {
  if (!productImageUrl) return null;

  if (Array.isArray(productImageUrl)) {
    const first = productImageUrl.find((x) => typeof x === "string" && x.startsWith("http"));
    return first || null;
  }

  const s = String(productImageUrl).trim();
  if (!s) return null;

  if (s.startsWith("http://") || s.startsWith("https://")) return s;

  if (s.startsWith("[")) {
    try {
      const arr = JSON.parse(s);
      if (Array.isArray(arr)) {
        const first = arr.find((x) => typeof x === "string" && x.startsWith("http"));
        return first || null;
      }
    } catch {
      return null;
    }
  }
  return null;
};

const FALLBACK_IMG = "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&q=80";

const normalizeOrderRow = (o) => {
  const statusKey = String(o.status || "pending");
  const ui = STATUS_UI[statusKey] || { bg: "#EEF2F8", text: "#6B7280" };

  const items = Array.isArray(o.items) ? o.items : [];
  const thumbs = items
    .map((it) => pickFirstImage(it.productImageUrl) || FALLBACK_IMG)
    .slice(0, 3);

  const itemsCount = items.reduce((s, it) => s + (Number(it.qty || 0) || 0), 0) || items.length;
  const productNames = items.map((it) => it.productName).filter(Boolean);

  return {
    id: String(o.id),
    code: `#${o.code || `ORD-${o.id}`}`,
    statusKey,
    status: STATUS_LABEL[statusKey] || statusKey,
    statusBg: ui.bg,
    statusText: ui.text,
    placedAt: o.placedAt || o.createdAt || null,
    dateText: o.placedAt ? formatDateVN(o.placedAt) : o.createdAt ? formatDateVN(o.createdAt) : "—",
    items: itemsCount,
    totalNumber: parseMoney(o.total),
    totalText: formatVnd(parseMoney(o.total)),
    thumbs,
    products: productNames,
    paymentStatus: String(o.paymentStatus || ""),
    raw: o,
  };
};

export default function OrderScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [busyCancel, setBusyCancel] = useState({});
  const [ordersBase, setOrdersBase] = useState([]);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiOrders();
      const rows = Array.isArray(res?.orders) ? res.orders : Array.isArray(res) ? res : [];
      setOrdersBase(rows.map(normalizeOrderRow));
    } catch (e) {
      Alert.alert("Lỗi", e?.message || "Không tải được danh sách đơn hàng");
      setOrdersBase([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [loadOrders])
  );

  const tabCounts = useMemo(() => {
    const c = { all: 0, pending: 0, processing: 0, shipping: 0, done: 0, canceled: 0 };
    ordersBase.forEach((o) => {
      c.all += 1;
      if (c[o.statusKey] !== undefined) c[o.statusKey] += 1;
    });
    return c;
  }, [ordersBase]);

  const tabs = useMemo(
    () => [
      { id: "all", label: "Tất cả", count: tabCounts.all },
      { id: "pending", label: "Chờ xác nhận", count: tabCounts.pending },
      { id: "processing", label: "Đang xử lý", count: tabCounts.processing },
      { id: "shipping", label: "Đang giao", count: tabCounts.shipping },
      { id: "done", label: "Đã giao", count: tabCounts.done },
    ],
    [tabCounts]
  );

  const [active, setActive] = useState("all");
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const [fStatus, setFStatus] = useState({
    pending: true,
    processing: true,
    shipping: true,
    done: true,
    canceled: true,
  });

  const [minStr, setMinStr] = useState("");
  const [maxStr, setMaxStr] = useState("");
  const [range, setRange] = useState("all");
  const [sort, setSort] = useState("newest");

  const visibleOrders = useMemo(() => {
    const query = q.trim().toLowerCase();
    const minV = minStr.trim() ? Number(minStr.replace(/[^\d]/g, "")) : null;
    const maxV = maxStr.trim() ? Number(maxStr.replace(/[^\d]/g, "")) : null;

    const now = new Date();
    const from = (() => {
      if (range === "7d") return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      if (range === "30d") return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      if (range === "month") return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
      return null;
    })();

    let list = ordersBase.slice();

    if (active !== "all") list = list.filter((o) => o.statusKey === active);
    list = list.filter((o) => !!fStatus[o.statusKey]);

    list = list.filter((o) => {
      const v = Number(o.totalNumber || 0);
      if (minV !== null && v < minV) return false;
      if (maxV !== null && v > maxV) return false;
      return true;
    });

    if (from) list = list.filter((o) => parseSqlDate(o.raw?.placedAt || o.raw?.createdAt) >= from);

    if (query) {
      list = list.filter((o) => {
        const hay = [o.code, o.status, STATUS_LABEL[o.statusKey] || "", o.raw?.shipName || "", ...(o.products || [])]
          .join(" ")
          .toLowerCase();
        return hay.includes(query);
      });
    }

    list.sort((a, b) => {
      const da = parseSqlDate(a.raw?.placedAt || a.raw?.createdAt).getTime();
      const db = parseSqlDate(b.raw?.placedAt || b.raw?.createdAt).getTime();
      const pa = Number(a.totalNumber || 0);
      const pb = Number(b.totalNumber || 0);

      if (sort === "newest") return db - da;
      if (sort === "oldest") return da - db;
      if (sort === "priceDesc") return pb - pa;
      if (sort === "priceAsc") return pa - pb;
      return 0;
    });

    return list;
  }, [ordersBase, active, fStatus, minStr, maxStr, range, sort, q]);

  const TabItem = ({ t }) => {
    const isActive = active === t.id;
    return (
      <Pressable style={styles.tab} onPress={() => setActive(t.id)}>
        <View style={styles.tabRow}>
          <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{t.label}</Text>
          <View style={[styles.tabCount, isActive && styles.tabCountActive]}>
            <Text style={[styles.tabCountText, isActive && styles.tabCountTextActive]}>{t.count}</Text>
          </View>
        </View>
        {isActive && <View style={styles.tabUnderline} />}
      </Pressable>
    );
  };

  // ✅ separator thay cho "gap" + tránh layout weird
  const TabSep = () => <View style={{ width: 18 }} />;

  const canCancel = (o) => o.statusKey === "pending" || o.statusKey === "processing";

  const onCancel = (o) => {
    if (!canCancel(o)) return;

    Alert.alert("Hủy đơn", `Hủy đơn ${o.code}?`, [
      { text: "Không", style: "cancel" },
      {
        text: "Hủy",
        style: "destructive",
        onPress: async () => {
          try {
            setBusyCancel((m) => ({ ...m, [o.id]: true }));
            await apiCancelOrder(o.id);
            await loadOrders();
          } catch (e) {
            Alert.alert("Lỗi", e?.message || "Không hủy được đơn");
          } finally {
            setBusyCancel((m) => ({ ...m, [o.id]: false }));
          }
        },
      },
    ]);
  };

  const goDetail = (o) => navigation.navigate("OrderDetail", { orderId: o.id });

  const OrderCard = ({ o }) => (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View>
          <Text style={styles.code}>{o.code}</Text>

          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={14} color="#9AA0A6" />
            <Text style={styles.dateText}>Đặt ngày: {o.dateText}</Text>
          </View>

          {o.paymentStatus ? (
            <View style={styles.payRowMini}>
              <Ionicons name="card-outline" size={14} color="#9AA0A6" />
              <Text style={styles.payTextMini}>{o.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}</Text>
            </View>
          ) : null}
        </View>

        <View style={[styles.statusPill, { backgroundColor: o.statusBg }]}>
          <Text style={[styles.statusText, { color: o.statusText }]}>{o.status}</Text>
        </View>
      </View>

      <View style={styles.thumbRow}>
        {o.thumbs.map((u, i) => (
          <View key={i} style={styles.thumbBox}>
            <Image source={{ uri: u }} style={styles.thumbImg} />
          </View>
        ))}
      </View>

      <View style={styles.midRow}>
        <Text style={styles.itemsText}>{o.items} sản phẩm</Text>
        <Text style={styles.total}>{o.totalText}</Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={[styles.btn, styles.btnOutline, !canCancel(o) && { opacity: 0.5 }]}
          onPress={() => onCancel(o)}
          disabled={!canCancel(o) || !!busyCancel[o.id]}
        >
          <Ionicons name="close-outline" size={16} color={BLUE} />
          <Text style={[styles.btnText, { color: BLUE }]}>{busyCancel[o.id] ? "Đang hủy..." : "Hủy đơn"}</Text>
        </Pressable>

        <Pressable style={[styles.btn, styles.btnOutlineBlue]} onPress={() => goDetail(o)}>
          <Ionicons name="eye-outline" size={16} color={BLUE} />
          <Text style={[styles.btnText, { color: BLUE }]}>Chi tiết</Text>
        </Pressable>
      </View>
    </View>
  );

  const Toggle = ({ id, label }) => {
    const on = !!fStatus[id];
    return (
      <Pressable style={[styles.fChip, on && styles.fChipOn]} onPress={() => setFStatus((s) => ({ ...s, [id]: !s[id] }))}>
        <Text style={[styles.fChipText, on && styles.fChipTextOn]}>{label}</Text>
      </Pressable>
    );
  };

  const Quick = ({ id, label }) => {
    const on = range === id;
    return (
      <Pressable style={[styles.fChip, on && styles.fChipOn]} onPress={() => setRange(id)}>
        <Text style={[styles.fChipText, on && styles.fChipTextOn]}>{label}</Text>
      </Pressable>
    );
  };

  const Sort = ({ id, label }) => {
    const on = sort === id;
    return (
      <Pressable style={[styles.fRowBtn, on && styles.fRowBtnOn]} onPress={() => setSort(id)}>
        <Text style={[styles.fRowBtnText, on && styles.fRowBtnTextOn]}>{label}</Text>
        {on && <Ionicons name="checkmark" size={18} color={BLUE} />}
      </Pressable>
    );
  };

  const resetFilters = () => {
    setFStatus({ pending: true, processing: true, shipping: true, done: true, canceled: true });
    setMinStr("");
    setMaxStr("");
    setRange("all");
    setSort("newest");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={TEXT} />
        </Pressable>

        {!searchOpen ? (
          <Text style={styles.headerTitle}>Đơn hàng của tôi</Text>
        ) : (
          <View style={styles.searchWrap}>
            <Ionicons name="search-outline" size={18} color="#9AA0A6" />
            <TextInput
              value={q}
              onChangeText={setQ}
              placeholder="Tìm mã đơn / sản phẩm / trạng thái"
              placeholderTextColor="#9AA0A6"
              style={styles.searchInput}
              autoCapitalize="none"
              returnKeyType="search"
            />
            <Pressable onPress={() => setQ("")} hitSlop={10}>
              <Ionicons name="close-circle" size={18} color="#9AA0A6" />
            </Pressable>
          </View>
        )}

        <Pressable
          style={styles.headerBtn}
          onPress={() => {
            setSearchOpen((v) => !v);
            if (searchOpen) setQ("");
          }}
        >
          <Ionicons name={searchOpen ? "close-outline" : "search-outline"} size={22} color={TEXT} />
        </Pressable>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={tabs}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => <TabItem t={item} />}
        contentContainerStyle={styles.tabs}
        ItemSeparatorComponent={TabSep}
        style={styles.tabsList}
      />

      <View style={styles.summaryRow}>
        <Text style={styles.summaryText}>
          {visibleOrders.length} đơn{q.trim() ? ` • “${q.trim()}”` : ""}
        </Text>

        <Pressable style={styles.smallFilterBtn} onPress={() => setFilterOpen(true)}>
          <Ionicons name="funnel-outline" size={16} color={BLUE} />
          <Text style={styles.smallFilterText}>Lọc</Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {visibleOrders.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="receipt-outline" size={42} color="#9AA0A6" />
              <Text style={styles.emptyTitle}>Không có đơn hàng</Text>
              <Text style={styles.emptySub}>Đổi bộ lọc hoặc từ khóa</Text>
            </View>
          ) : (
            visibleOrders.map((o) => <OrderCard key={o.id} o={o} />)
          )}
          <View style={{ height: 90 }} />
        </ScrollView>
      )}

      <Pressable style={styles.fab} onPress={() => setFilterOpen(true)}>
        <Ionicons name="funnel-outline" size={22} color="#fff" />
      </Pressable>

      <Modal visible={filterOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Bộ lọc</Text>
              <Pressable style={styles.sheetClose} onPress={() => setFilterOpen(false)}>
                <Ionicons name="close" size={22} color={TEXT} />
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.sheetBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.fTitle}>Trạng thái</Text>
              <View style={styles.fChipRow}>
                <Toggle id="pending" label="Chờ xác nhận" />
                <Toggle id="processing" label="Đang xử lý" />
                <Toggle id="shipping" label="Đang giao" />
                <Toggle id="done" label="Đã giao" />
                <Toggle id="canceled" label="Đã hủy" />
              </View>

              <Text style={[styles.fTitle, { marginTop: 14 }]}>Khoảng tiền (VND)</Text>
              <View style={styles.amountRow}>
                <View style={styles.amountBox}>
                  <Text style={styles.amountLabel}>Từ</Text>
                  <TextInput
                    value={minStr}
                    onChangeText={setMinStr}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#9AA0A6"
                    style={styles.amountInput}
                  />
                </View>
                <View style={styles.amountBox}>
                  <Text style={styles.amountLabel}>Đến</Text>
                  <TextInput
                    value={maxStr}
                    onChangeText={setMaxStr}
                    keyboardType="numeric"
                    placeholder="99999999"
                    placeholderTextColor="#9AA0A6"
                    style={styles.amountInput}
                  />
                </View>
              </View>

              <Text style={[styles.fTitle, { marginTop: 14 }]}>Thời gian</Text>
              <View style={styles.fChipRow}>
                <Quick id="all" label="Tất cả" />
                <Quick id="7d" label="7 ngày" />
                <Quick id="30d" label="30 ngày" />
                <Quick id="month" label="Tháng này" />
              </View>

              <Text style={[styles.fTitle, { marginTop: 14 }]}>Sắp xếp</Text>
              <View style={styles.fSortBox}>
                <Sort id="newest" label="Mới nhất" />
                <Sort id="oldest" label="Cũ nhất" />
                <Sort id="priceDesc" label="Giá cao → thấp" />
                <Sort id="priceAsc" label="Giá thấp → cao" />
              </View>
            </ScrollView>

            <View style={styles.sheetFooter}>
              <Pressable style={[styles.footerBtn, styles.footerGhost]} onPress={resetFilters}>
                <Text style={[styles.footerBtnText, { color: BLUE }]}>Đặt lại</Text>
              </Pressable>
              <Pressable style={[styles.footerBtn, styles.footerPrimary]} onPress={() => setFilterOpen(false)}>
                <Text style={[styles.footerBtnText, { color: "#fff" }]}>Áp dụng</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
