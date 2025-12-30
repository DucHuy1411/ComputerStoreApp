import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  Pressable,
  ScrollView,
  FlatList,
  Image,
  Modal,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { apiProducts } from "../services/endpoints";

import styles, { COLORS } from "../styles/CategoryDetailStyle";

const formatVnd = (n) => {
  const s = Math.round(Number(n || 0)).toString();
  return `${s.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}đ`;
};

const parseJsonArray = (v, fallback = []) => {
  if (Array.isArray(v)) return v;
  if (typeof v !== "string") return fallback;
  try {
    const x = JSON.parse(v);
    return Array.isArray(x) ? x : fallback;
  } catch {
    return fallback;
  }
};

const parseJsonObject = (v, fallback = null) => {
  if (!v) return fallback;
  if (typeof v === "object") return v;
  if (typeof v !== "string") return fallback;
  try {
    return JSON.parse(v);
  } catch {
    return fallback;
  }
};

const pickFirstImage = (p) => {
  if (p.image) return p.image;
  if (p.thumbnail) return p.thumbnail;
  if (p.thumb) return p.thumb;

  const imgs = parseJsonArray(p.images, []);
  if (imgs.length > 0) return imgs[0];

  return "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80";
};

const normalizeProduct = (p) => {
  const tags = parseJsonArray(p.tags, []);
  const specsRaw = parseJsonObject(p.specs, null);

  let specs = [];
  if (Array.isArray(specsRaw)) {
    specs = specsRaw
      .map((x) => {
        if (typeof x === "string") return x;
        if (x?.k && x?.v) return `${x.k}: ${x.v}`;
        return null;
      })
      .filter(Boolean)
      .slice(0, 3);
  } else if (specsRaw && typeof specsRaw === "object") {
    specs = Object.entries(specsRaw)
      .slice(0, 3)
      .map(([k, v]) => `${k}: ${v}`);
  }

  return {
    id: String(p.id),
    name: p.name || "Sản phẩm",
    priceValue: Number(p.price || 0),
    priceText: formatVnd(p.price),
    rating: Math.round(Number(p.ratingAvg || 0)) || 0,
    ratingAvg: Number(p.ratingAvg || 0),
    reviews: Number(p.reviewsCount || 0),
    tags,
    specs,
    img: pickFirstImage(p),
    createdAt: p.createdAt,
    raw: p,
  };
};

export default function CategoryDetailScreen({ navigation, route }) {
  const title = route?.params?.title || "Danh mục";
  const categoryId = route?.params?.categoryId;

  const priceFilters = useMemo(
    () => [
      { id: "all", label: "Tất cả" },
      { id: "lt15", label: "Dưới 15 triệu" },
      { id: "15-25", label: "15-25 triệu" },
      { id: "gt25", label: "Trên 25 triệu" },
    ],
    []
  );

  const sortOptions = useMemo(
    () => [
      { id: "popular", label: "Phổ biến" },
      { id: "newest", label: "Mới nhất" },
      { id: "price_asc", label: "Giá tăng dần" },
      { id: "price_desc", label: "Giá giảm dần" },
      { id: "rating", label: "Đánh giá cao" },
    ],
    []
  );

  const [activePriceFilter, setActivePriceFilter] = useState("all");
  const [onlyFreeship, setOnlyFreeship] = useState(false);
  const [onlyInstallment, setOnlyInstallment] = useState(false);
  const [sortKey, setSortKey] = useState("popular");

  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState([]);

  const badgeCount = (onlyFreeship ? 1 : 0) + (onlyInstallment ? 1 : 0) + (activePriceFilter !== "all" ? 1 : 0);

  const sortLabel = useMemo(() => sortOptions.find((o) => o.id === sortKey)?.label || "Phổ biến", [sortKey, sortOptions]);

  const buildPriceParams = () => {
    if (activePriceFilter === "lt15") return { maxPrice: 14999999 };
    if (activePriceFilter === "15-25") return { minPrice: 15000000, maxPrice: 25000000 };
    if (activePriceFilter === "gt25") return { minPrice: 25000001 };
    return {};
  };

  const loadProducts = useCallback(
    async (opts = { silent: false }) => {
      const silent = !!opts?.silent;

      try {
        if (!silent) setLoading(true);

        const priceParams = buildPriceParams();
        const params = {
          ...(categoryId ? { categoryId } : {}),
          ...priceParams,
          freeship: onlyFreeship ? "1" : undefined,
          installment0: onlyInstallment ? "1" : undefined,
          sort: sortKey,
          limit: 50,
          offset: 0,
        };

        Object.keys(params).forEach((k) => params[k] === undefined && delete params[k]);

        const res = await apiProducts(params);
        const rows = (res?.products || []).map(normalizeProduct);

        setProducts(rows);
      } catch (e) {
        setProducts([]);
        Alert.alert("Lỗi", e?.message || "Không tải được sản phẩm");
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [categoryId, activePriceFilter, onlyFreeship, onlyInstallment, sortKey]
  );

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadProducts({ silent: true });
    setRefreshing(false);
  }, [loadProducts]);

  const renderStars = (n) => (
    <View style={styles.starsRow}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Ionicons key={i} name={i < n ? "star" : "star-outline"} size={14} color={COLORS.STAR} />
      ))}
    </View>
  );

  const ProductCard = ({ item }) => (
    <Pressable style={styles.card} onPress={() => navigation.navigate("ProductDetail", { productId: item.id, product: item.raw })}>
      <View style={styles.cardInner}>
        <View style={styles.imgBox}>
          <Image source={{ uri: item.img }} style={styles.img} />
        </View>

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>
            {item.name}
          </Text>

          {item.specs?.length ? (
            <View style={styles.specRow}>
              {item.specs.map((s) => (
                <View key={s} style={styles.specPill}>
                  <Text style={styles.specText} numberOfLines={1}>
                    {s}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}

          <View style={styles.rateRow}>
            {renderStars(item.rating || 0)}
            <Text style={styles.review}>({item.reviews || 0})</Text>
          </View>

          <Text style={styles.price}>{formatVnd(item.priceValue)}</Text>

          {item.tags?.length ? (
            <View style={styles.tagRow}>
              {item.tags.map((t) => (
                <View key={t} style={styles.tagPill}>
                  <Text style={styles.tagText}>{t}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  );

  const ToggleRow = ({ label, value, onPress }) => (
    <Pressable style={styles.toggleRow} onPress={onPress}>
      <View style={styles.toggleLeft}>
        <View style={[styles.checkBox, value && styles.checkBoxOn]}>
          {value ? <Ionicons name="checkmark" size={14} color={COLORS.WHITE} /> : null}
        </View>
        <Text style={styles.toggleLabel}>{label}</Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable style={styles.headerIcon} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.TEXT} />
        </Pressable>

        <Text style={styles.headerTitle}>{title}</Text>

        <View style={styles.headerRight}>
          <Pressable style={styles.headerIcon} onPress={() => setFilterModalVisible(true)}>
            <Ionicons name="funnel-outline" size={22} color={COLORS.TEXT} />
            {badgeCount > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{badgeCount}</Text>
              </View>
            ) : null}
          </Pressable>

          <Pressable style={styles.headerIcon} onPress={() => setSortModalVisible(true)}>
            <Ionicons name="swap-vertical-outline" size={22} color={COLORS.TEXT} />
          </Pressable>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips} style={{ flexGrow: 0 }}>
        {priceFilters.map((f) => {
          const active = activePriceFilter === f.id;
          return (
            <Pressable key={f.id} style={[styles.chip, active && styles.chipActive]} onPress={() => setActivePriceFilter(f.id)}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{f.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Sắp xếp theo</Text>
        <Pressable style={styles.sortBtn} onPress={() => setSortModalVisible(true)}>
          <Text style={styles.sortBtnText}>{sortLabel}</Text>
          <Ionicons name="chevron-down" size={18} color={COLORS.TEXT} />
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator />
          <Text style={styles.loadingText}>Đang tải sản phẩm...</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(i) => i.id}
          renderItem={ProductCard}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="cube-outline" size={42} color={COLORS.MUTED} />
              <Text style={styles.emptyTitle}>Không có sản phẩm</Text>
              <Text style={styles.emptySub}>Thử đổi bộ lọc</Text>
            </View>
          }
        />
      )}

      <Modal transparent visible={sortModalVisible} animationType="fade" onRequestClose={() => setSortModalVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setSortModalVisible(false)}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <Text style={styles.modalTitle}>Sắp xếp</Text>

            {sortOptions.map((o) => {
              const active = sortKey === o.id;
              return (
                <Pressable
                  key={o.id}
                  style={[styles.modalRow, active && styles.modalRowActive]}
                  onPress={() => {
                    setSortKey(o.id);
                    setSortModalVisible(false);
                  }}
                >
                  <Text style={[styles.modalRowText, active && styles.modalRowTextActive]}>{o.label}</Text>
                  {active ? <Ionicons name="checkmark" size={18} color={COLORS.BLUE} /> : null}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>

      <Modal transparent visible={filterModalVisible} animationType="fade" onRequestClose={() => setFilterModalVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setFilterModalVisible(false)}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <View style={styles.modalHead}>
              <Text style={styles.modalTitle}>Bộ lọc</Text>
              <Pressable
                onPress={() => {
                  setActivePriceFilter("all");
                  setOnlyFreeship(false);
                  setOnlyInstallment(false);
                }}
              >
                <Text style={styles.resetText}>Đặt lại</Text>
              </Pressable>
            </View>

            <Text style={styles.groupTitle}>Khoảng giá</Text>
            <View style={styles.groupWrap}>
              {priceFilters.map((f) => {
                const active = activePriceFilter === f.id;
                return (
                  <Pressable key={f.id} style={[styles.pill, active && styles.pillActive]} onPress={() => setActivePriceFilter(f.id)}>
                    <Text style={[styles.pillText, active && styles.pillTextActive]}>{f.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={[styles.groupTitle, { marginTop: 14 }]}>Tuỳ chọn</Text>
            <View style={styles.box}>
              <ToggleRow label="Chỉ Freeship" value={onlyFreeship} onPress={() => setOnlyFreeship((v) => !v)} />
              <View style={styles.sep} />
              <ToggleRow label="Chỉ Trả góp 0%" value={onlyInstallment} onPress={() => setOnlyInstallment((v) => !v)} />
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
