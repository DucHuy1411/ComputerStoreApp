// screens/DealsScreen.js
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Text,
  View,
  Pressable,
  ScrollView,
  Image,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import styles, { COLORS } from "../styles/DealsStyle";
import { apiPromotions, apiPromotionItems } from "../services/endpoints";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80";

const safeJsonParse = (v, fb) => {
  if (v == null) return fb;
  if (typeof v === "object") return v ?? fb;
  if (typeof v !== "string") return fb;
  try {
    const x = JSON.parse(v);
    return x ?? fb;
  } catch {
    return fb;
  }
};

const parseImages = (raw) => {
  if (Array.isArray(raw) && raw.length) return raw.filter(Boolean);
  if (typeof raw === "string") {
    const s = raw.trim();
    if (!s) return [];
    if (s.startsWith("[") || s.startsWith("{")) {
      const x = safeJsonParse(s, null);
      if (Array.isArray(x)) return x.filter(Boolean);
    }
    if (s.startsWith("http://") || s.startsWith("https://")) return [s];
  }
  return [];
};

const pad2 = (n) => String(n).padStart(2, "0");

const parseDate = (v) => {
  if (!v) return null;
  if (v instanceof Date) return v;
  const s = String(v).trim();
  if (!s) return null;
  const iso = s.includes("T") ? s : s.replace(" ", "T");
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
};

const formatDateVN = (v) => {
  const d = parseDate(v);
  if (!d) return "";
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
};

const formatMoneyShort = (discountType, discountValue) => {
  const val = Number(discountValue || 0);
  if (!val || !discountType) return "";
  if (discountType === "percent") return `${Math.round(val)}%`;
  // amount
  // hiển thị K/M/B thô
  const n = Math.round(val);
  if (n >= 1_000_000_000) return `${Math.round(n / 1_000_000_000)}B`;
  if (n >= 1_000_000) return `${Math.round(n / 1_000_000)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
};

const promoColorByIdx = (i) => {
  const palette = ["#0B63F6", "#7C3AED", "#0EA5E9", "#FF6A00", "#16A34A", "#EF4444"];
  return palette[i % palette.length];
};

const guessCategoryKey = (obj) => {
  const s = `${obj?.slug || ""} ${obj?.code || ""} ${obj?.name || ""} ${obj?.category || ""} ${obj?.categoryName || ""} ${obj?.categorySlug || ""}`.toLowerCase();
  if (s.includes("laptop")) return "laptop";
  if (s.includes("pc") || s.includes("desktop") || s.includes("linh kiện") || s.includes("component")) return "pc";
  if (s.includes("phụ kiện") || s.includes("accessory") || s.includes("chuột") || s.includes("bàn phím") || s.includes("tai nghe") || s.includes("headset") || s.includes("mouse") || s.includes("keyboard")) return "accessory";
  return "other";
};

const calcCountdown = (endsAt) => {
  const end = parseDate(endsAt);
  if (!end) return { ms: 0, text: "--:--:--" };
  const ms = Math.max(0, end.getTime() - Date.now());
  const totalSec = Math.floor(ms / 1000);
  const hh = Math.floor(totalSec / 3600);
  const mm = Math.floor((totalSec % 3600) / 60);
  const ss = totalSec % 60;
  return { ms, text: `${pad2(hh)}:${pad2(mm)}:${pad2(ss)}` };
};

export default function DealsScreen({ navigation }) {
  const [tab, setTab] = useState("voucher"); // voucher | flash | sale | installment
  const [notify, setNotify] = useState(true);

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all"); // all | laptop | pc | accessory | other
  const [minDiscount, setMinDiscount] = useState("all"); // all | 20 | 30 | 40

  const [loading, setLoading] = useState(true);
  const [vouchers, setVouchers] = useState([]); // normalized voucher promos
  const [flashPromo, setFlashPromo] = useState(null); // selected flash promo
  const [flashItems, setFlashItems] = useState([]); // normalized flash items

  const [heroTimer, setHeroTimer] = useState("--:--:--");
  const heroTickerRef = useRef(null);

  const stopTicker = useCallback(() => {
    if (heroTickerRef.current) clearInterval(heroTickerRef.current);
    heroTickerRef.current = null;
  }, []);

  const startTicker = useCallback(
    (endsAt) => {
      stopTicker();
      const first = calcCountdown(endsAt);
      setHeroTimer(first.text);
      heroTickerRef.current = setInterval(() => {
        const x = calcCountdown(endsAt);
        setHeroTimer(x.text);
        if (x.ms <= 0) stopTicker();
      }, 1000);
    },
    [stopTicker]
  );

  const loadAll = useCallback(async () => {
    try {
      setLoading(true);

      const promoRes = await apiPromotions(); // { promotions: [...] }
      const list = Array.isArray(promoRes?.promotions) ? promoRes.promotions : [];

      const voucherPromos = list.filter((p) => String(p?.type) === "voucher" && p?.isActive);
      const flashPromos = list.filter((p) => String(p?.type) === "flash_sale" && p?.isActive);

      const now = Date.now();
      const flashSorted = flashPromos
        .slice()
        .map((p) => ({
          ...p,
          _starts: parseDate(p.startsAt)?.getTime() ?? 0,
          _ends: parseDate(p.endsAt)?.getTime() ?? 0,
        }))
        .filter((p) => (p._starts ? p._starts <= now : true) && (p._ends ? p._ends > now : true))
        .sort((a, b) => (b._ends || 0) - (a._ends || 0)); // ưu tiên cái còn lâu hơn (đỡ hết hạn ngay)

      const activeFlash = flashSorted[0] || null;

      const normalizedVouchers = voucherPromos
        .slice()
        .sort((a, b) => (Number(b?.id || 0) || 0) - (Number(a?.id || 0) || 0))
        .map((p, idx) => {
          const data = safeJsonParse(p.data, {});
          const categoryKey = data?.categoryKey || data?.category || guessCategoryKey(p);
          const value = formatMoneyShort(p.discountType, p.discountValue);
          const minAmt = Number(p.minOrderAmount || 0);
          return {
            id: String(p.id),
            color: data?.color || promoColorByIdx(idx),
            title: data?.titlePrefix || "Giảm",
            value: value ? value : "—",
            code: p.code || "—",
            meta: minAmt > 0 ? `Đơn từ ${Math.round(minAmt).toLocaleString("vi-VN")}đ` : "Áp dụng mọi đơn",
            exp: p.endsAt ? `HSD: ${formatDateVN(p.endsAt)}` : "HSD: —",
            tag: data?.tag || (categoryKey === "laptop" ? "Laptop" : categoryKey === "pc" ? "PC" : categoryKey === "accessory" ? "Phụ kiện" : "Khác"),
            category: categoryKey || "other",
            raw: p,
          };
        });

      setVouchers(normalizedVouchers);

      if (!activeFlash) {
        setFlashPromo(null);
        setFlashItems([]);
        startTicker(null);
        return;
      }

      setFlashPromo(activeFlash);
      startTicker(activeFlash.endsAt);

      const itemsRes = await apiPromotionItems(activeFlash.id); // { promotion, items }
      const items = Array.isArray(itemsRes?.items) ? itemsRes.items : [];

      const normalizedFlash = items
        .slice()
        .map((it) => {
          const p = it?.product || {};
          const images = parseImages(p.images);
          const img = images[0] || FALLBACK_IMG;

          const discountPct = Number(it.discountPct || 0) || 0;
          const stockLimit = it.stockLimit == null ? null : Number(it.stockLimit);
          const soldCount = Number(it.soldCount || 0) || 0;

          const denom = stockLimit != null ? Math.max(0, stockLimit) : Math.max(0, Number(p.stock || 0) || 0);
          const leftN = denom > 0 ? Math.max(0, denom - soldCount) : 0;
          const soldPct = denom > 0 ? Math.min(1, Math.max(0, soldCount / denom)) : 0;

          const categoryKey =
            safeJsonParse(p.category, null)?.slug ||
            p.categorySlug ||
            p.categoryCode ||
            p.categoryName ||
            guessCategoryKey(p);

          return {
            id: String(it.id),
            productId: String(it.productId || p.id || ""),
            name: p.name || "Sản phẩm",
            discountPct,
            discount: discountPct > 0 ? `-${discountPct}%` : "-0%",
            leftN,
            left: denom > 0 ? `Chỉ còn ${leftN}` : "Số lượng có hạn",
            soldText: denom > 0 ? `Đã bán ${Math.round(soldPct * 100)}%` : `Đã bán ${soldCount}`,
            soldPct,
            img,
            category: String(categoryKey || "other").toLowerCase().includes("laptop")
              ? "laptop"
              : String(categoryKey || "").toLowerCase().includes("pc") || String(categoryKey || "").toLowerCase().includes("desktop")
              ? "pc"
              : String(categoryKey || "").toLowerCase().includes("accessory") || String(categoryKey || "").toLowerCase().includes("phụ kiện")
              ? "accessory"
              : "other",
            raw: it,
          };
        })
        .sort((a, b) => (Number(b.discountPct || 0) || 0) - (Number(a.discountPct || 0) || 0));

      setFlashItems(normalizedFlash);
    } catch (e) {
      setVouchers([]);
      setFlashPromo(null);
      setFlashItems([]);
      stopTicker();
      Alert.alert("Lỗi", e?.message || "Không tải được khuyến mãi");
    } finally {
      setLoading(false);
    }
  }, [startTicker, stopTicker]);

  useEffect(() => {
    loadAll();
    return () => stopTicker();
  }, [loadAll, stopTicker]);

  const filteredVouchers = useMemo(() => {
    let list = vouchers.slice();
    if (filterCategory !== "all") list = list.filter((v) => v.category === filterCategory);
    return list;
  }, [vouchers, filterCategory]);

  const filteredFlash = useMemo(() => {
    let list = flashItems.slice();
    if (filterCategory !== "all") list = list.filter((p) => p.category === filterCategory);

    if (minDiscount !== "all") {
      const min = Number(minDiscount);
      list = list.filter((p) => Number(p.discountPct || 0) >= min);
    }
    return list;
  }, [flashItems, filterCategory, minDiscount]);

  const activeFilterCount = (filterCategory !== "all" ? 1 : 0) + (minDiscount !== "all" ? 1 : 0);

  const TabBtn = ({ id, label }) => {
    const active = tab === id;
    return (
      <Pressable style={styles.tabBtn} onPress={() => setTab(id)}>
        <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
        <View style={[styles.tabLine, active && styles.tabLineActive]} />
      </Pressable>
    );
  };

  const VoucherCard = ({ item }) => (
    <View style={[styles.voucherCard, { backgroundColor: item.color }]}>
      <View style={styles.voucherTop}>
        <View>
          <Text style={styles.voucherTitle}>{item.title}</Text>
          <Text style={styles.voucherValue}>{item.value}</Text>
        </View>

        <View style={styles.voucherTag}>
          <Text style={styles.voucherTagText}>{item.tag}</Text>
        </View>
      </View>

      <View style={styles.voucherCodePill}>
        <Text style={styles.voucherCodeText}>{item.code}</Text>
      </View>

      <Text style={styles.voucherMeta}>{item.meta}</Text>

      <View style={styles.voucherBottom}>
        <Text style={styles.voucherExp}>{item.exp}</Text>

        <View style={styles.savedPill}>
          <Ionicons name="checkmark" size={14} color="#22C55E" />
          <Text style={styles.savedText}>Đang áp dụng</Text>
        </View>

        <Pressable
          style={styles.useNowBtn}
          onPress={() => {
            // chỉ điều hướng về màn checkout/cart tùy flow của mày
            navigation.navigate("Cart", { voucherCode: item.code });
          }}
        >
          <Text style={styles.useNowText}>Dùng ngay</Text>
        </Pressable>
      </View>

      <View style={styles.voucherDecorCircle} />
      <View style={styles.voucherDecorWave} />
    </View>
  );

  const FlashCard = ({ item }) => (
    <Pressable
      style={styles.flashCard}
      onPress={() => {
        const pid = Number(item.productId || item.id);
        navigation.navigate("ProductDetail", { id: pid, product: { id: pid } });
      }}
    >
      <View style={styles.flashImgWrap}>
        <Image source={{ uri: item.img }} style={styles.flashImg} />
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{item.discount}</Text>
        </View>
        <View style={styles.leftBadge}>
          <Text style={styles.leftText}>{item.left}</Text>
        </View>
      </View>

      <Text style={styles.flashName} numberOfLines={2}>
        {item.name}
      </Text>

      <Text style={styles.soldText}>{item.soldText}</Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${Math.round(item.soldPct * 100)}%` }]} />
      </View>
    </Pressable>
  );

  const Chip = ({ active, label, onPress }) => (
    <Pressable style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );

  const heroTitle = flashPromo?.title ? String(flashPromo.title).toUpperCase() : "FLASH SALE";

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable style={styles.headerIcon} onPress={() => navigation?.goBack?.()}>
            <Ionicons name="arrow-back" size={22} color={COLORS.TEXT} />
          </Pressable>

          <Text style={styles.headerTitle}>Khuyến mãi</Text>

          <Pressable style={styles.headerIcon} onPress={() => setFilterModalVisible(true)}>
            <Ionicons name="funnel-outline" size={22} color={COLORS.TEXT} />
            {activeFilterCount > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{activeFilterCount}</Text>
              </View>
            ) : null}
          </Pressable>
        </View>

        <View style={styles.hero}>
          <Ionicons name="time-outline" size={34} color={COLORS.WHITE} />
          <Text style={styles.heroTitle}>{heroTitle}</Text>

          <View style={styles.heroTimerRow}>
            <Text style={styles.heroTimerLabel}>Kết thúc sau</Text>
            <View style={styles.heroTimerPill}>
              <Text style={styles.heroTimerText}>{heroTimer}</Text>
            </View>
          </View>

          <Pressable style={styles.heroBtn} onPress={() => setTab("flash")}>
            <Text style={styles.heroBtnText}>Xem ngay</Text>
          </Pressable>
        </View>

        <View style={styles.notifyRow}>
          <View style={styles.notifyLeft}>
            <Ionicons name="notifications-outline" size={18} color={COLORS.TEXT} />
            <Text style={styles.notifyText}>Nhận thông báo về voucher mới nhé!</Text>
          </View>

          {/* giữ state notify để sau mày gắn Switch (nếu muốn) */}
          <View style={{ opacity: 0, width: 1, height: 1 }}>{notify ? <Text>1</Text> : <Text>0</Text>}</View>
        </View>

        <View style={styles.tabs}>
          <TabBtn id="voucher" label="Voucher" />
          <TabBtn id="flash" label="Flash Sale" />
          <TabBtn id="sale" label="Giảm giá" />
          <TabBtn id="installment" label="Trả góp 0%" />
        </View>

        {loading ? (
          <View style={{ paddingVertical: 18, alignItems: "center", gap: 10 }}>
            <ActivityIndicator />
            <Text style={{ color: COLORS.SUB, fontWeight: "800" }}>Đang tải...</Text>
          </View>
        ) : tab === "voucher" ? (
          <View style={{ marginTop: 10 }}>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Voucher</Text>
              <Pressable style={styles.seeAll} onPress={loadAll}>
                <Text style={styles.seeAllText}>Tải lại</Text>
                <Ionicons name="refresh" size={16} color={COLORS.BLUE} />
              </Pressable>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
              {filteredVouchers.length === 0 ? (
                <View style={{ width: 260, padding: 14, borderRadius: 16, borderWidth: 1, borderColor: "#EEF2F8", backgroundColor: "#fff" }}>
                  <Text style={{ fontWeight: "900", color: COLORS.TEXT }}>Không có voucher</Text>
                  <Text style={{ marginTop: 6, fontWeight: "700", color: "#9AA0A6" }}>Chưa có khuyến mãi dạng voucher</Text>
                </View>
              ) : (
                filteredVouchers.map((v) => <VoucherCard key={v.id} item={v} />)
              )}
            </ScrollView>

            <View style={styles.flashBar}>
              <MaterialCommunityIcons name="lightning-bolt" size={18} color={COLORS.RED} />
              <Text style={styles.flashBarText}>Kết thúc trong</Text>
              <Text style={styles.flashBarTimer}>{heroTimer}</Text>
            </View>

            <View style={styles.grid}>
              {filteredFlash.slice(0, 2).map((p) => (
                <FlashCard key={p.id} item={p} />
              ))}
            </View>
          </View>
        ) : tab === "flash" ? (
          <View style={{ marginTop: 10 }}>
            <View style={styles.flashBar}>
              <MaterialCommunityIcons name="lightning-bolt" size={18} color={COLORS.RED} />
              <Text style={styles.flashBarText}>Kết thúc trong</Text>
              <Text style={styles.flashBarTimer}>{heroTimer}</Text>
            </View>

            <View style={styles.grid}>
              {filteredFlash.length === 0 ? (
                <View style={{ padding: 14, borderRadius: 14, borderWidth: 1, borderColor: "#EEF2F8", backgroundColor: "#fff" }}>
                  <Text style={{ fontWeight: "900", color: COLORS.TEXT }}>Không có Flash Sale</Text>
                  <Text style={{ marginTop: 6, fontWeight: "700", color: "#9AA0A6" }}>
                    Chưa có promotion flash_sale đang hoạt động hoặc chưa gắn sản phẩm
                  </Text>
                </View>
              ) : (
                filteredFlash.map((p) => <FlashCard key={p.id} item={p} />)
              )}
            </View>
          </View>
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
              {tab === "sale" ? "Tab Giảm giá: dùng Flash Sale (lọc theo %)" : "Tab Trả góp 0%: chưa có API"}
            </Text>

            {tab === "sale" ? (
              <View style={[styles.grid, { marginTop: 12 }]}>
                {filteredFlash.map((p) => (
                  <FlashCard key={p.id} item={p} />
                ))}
              </View>
            ) : null}
          </View>
        )}

        <View style={{ height: 14 }} />
      </ScrollView>

      <Modal transparent visible={filterModalVisible} animationType="fade" onRequestClose={() => setFilterModalVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setFilterModalVisible(false)}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <View style={styles.modalHead}>
              <Text style={styles.modalTitle}>Bộ lọc</Text>
              <Pressable
                onPress={() => {
                  setFilterCategory("all");
                  setMinDiscount("all");
                }}
              >
                <Text style={styles.resetText}>Đặt lại</Text>
              </Pressable>
            </View>

            <Text style={styles.groupTitle}>Chuyên mục</Text>
            <View style={styles.chipRow}>
              <Chip active={filterCategory === "all"} label="Tất cả" onPress={() => setFilterCategory("all")} />
              <Chip active={filterCategory === "laptop"} label="Laptop" onPress={() => setFilterCategory("laptop")} />
              <Chip active={filterCategory === "pc"} label="PC" onPress={() => setFilterCategory("pc")} />
              <Chip active={filterCategory === "accessory"} label="Phụ kiện" onPress={() => setFilterCategory("accessory")} />
              <Chip active={filterCategory === "other"} label="Khác" onPress={() => setFilterCategory("other")} />
            </View>

            <Text style={[styles.groupTitle, { marginTop: 14 }]}>Giảm tối thiểu</Text>
            <View style={styles.chipRow}>
              <Chip active={minDiscount === "all"} label="Tất cả" onPress={() => setMinDiscount("all")} />
              <Chip active={minDiscount === "20"} label="≥ 20%" onPress={() => setMinDiscount("20")} />
              <Chip active={minDiscount === "30"} label="≥ 30%" onPress={() => setMinDiscount("30")} />
              <Chip active={minDiscount === "40"} label="≥ 40%" onPress={() => setMinDiscount("40")} />
            </View>

            <Pressable style={styles.applyBtn} onPress={() => setFilterModalVisible(false)}>
              <Text style={styles.applyText}>Áp dụng</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
