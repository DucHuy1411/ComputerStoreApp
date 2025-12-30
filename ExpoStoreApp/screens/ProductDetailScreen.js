import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  Text,
  View,
  Pressable,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { apiProductDetail, apiCartAdd } from "../services/endpoints";
import styles, { COLORS, LAYOUT } from "../styles/ProductDetailStyle";

const CART_KEY = "cart";
const VIEWED_KEY = "viewed_products";
const FAV_KEY = "favorite_products";
const FALLBACK_IMG = "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=1200&q=80";

const formatVnd = (n) => {
  const num = Number(n || 0);
  const s = Math.round(num).toString();
  return `${s.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}đ`;
};

const parseJsonArray = (v, fallback = []) => {
  if (Array.isArray(v)) return v;
  if (typeof v !== "string") return fallback;
  try {
    const parsed = JSON.parse(v);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const parseJsonAny = (v, fallback = null) => {
  if (v === null || v === undefined) return fallback;
  if (typeof v === "object") return v;
  if (typeof v !== "string") return fallback;
  try {
    return JSON.parse(v);
  } catch {
    return fallback;
  }
};

const normalizeProduct = (raw) => {
  const p = raw?.product ?? raw ?? {};
  const images = parseJsonArray(p.images, []);
  const specsRaw = parseJsonAny(p.specs, null);

  const safeImages = images.length > 0 ? images : [FALLBACK_IMG];

  const safeSpecs =
    Array.isArray(specsRaw) && specsRaw.some((x) => x && (x.k || x.v))
      ? specsRaw
          .filter((x) => x && (x.k || x.v))
          .map((x) => ({
            k: String(x.k ?? "").trim(),
            v: String(x.v ?? "").trim(),
            icon: x.icon || "information-circle-outline",
          }))
      : [];

  return {
    id: Number(p.id ?? 0),
    name: p.name ?? "",
    sku: p.sku ?? "",
    brand: p.brandName ?? p.brand ?? "",
    price: Number(p.price ?? 0),
    oldPrice: Number(p.oldPrice ?? 0),
    discountPct: Number(p.discountPct ?? 0),
    installmentMonthly: p.installmentMonthly === null || p.installmentMonthly === undefined ? null : Number(p.installmentMonthly),
    stock: Number(p.stock ?? 0),
    soldCount: p.soldCount === null || p.soldCount === undefined ? null : Number(p.soldCount),
    warrantyText: p.warrantyText ?? p.warranty ?? "",
    images: safeImages,
    specs: safeSpecs,
    raw: p,
  };
};

const safeParse = (s, fallback) => {
  try {
    const x = JSON.parse(s);
    return x ?? fallback;
  } catch {
    return fallback;
  }
};

const calcCartCountFromStorage = (cartObjOrArr) => {
  if (!cartObjOrArr) return 0;

  if (Array.isArray(cartObjOrArr)) {
    return cartObjOrArr.reduce((sum, it) => sum + (Number(it?.qty || 0) || 0), 0);
  }
  if (Array.isArray(cartObjOrArr.items)) {
    return cartObjOrArr.items.reduce((sum, it) => sum + (Number(it?.qty || 0) || 0), 0);
  }
  if (typeof cartObjOrArr === "object") {
    return Object.values(cartObjOrArr).reduce((sum, it) => sum + (Number(it?.qty || 0) || 0), 0);
  }
  return 0;
};

export default function ProductDetailScreen({ navigation, route }) {
  const routeProduct = route?.params?.product;

  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(() => normalizeProduct(routeProduct));
  const [qty, setQty] = useState(1);

  const [liked, setLiked] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const [imgIndex, setImgIndex] = useState(0);
  const imgRef = useRef(null);

  const imagesSafe = Array.isArray(product.images) ? product.images : [];
  const specsSafe = Array.isArray(product.specs) ? product.specs : [];

  const loadCartCount = useCallback(async () => {
    const raw = await AsyncStorage.getItem(CART_KEY);
    if (!raw) {
      setCartCount(0);
      return;
    }
    const parsed = safeParse(raw, null);
    setCartCount(calcCartCountFromStorage(parsed));
  }, []);

  const loadLikedState = useCallback(async (pid) => {
    const raw = await AsyncStorage.getItem(FAV_KEY);
    const arr = raw ? safeParse(raw, []) : [];
    const on = Array.isArray(arr) && arr.some((x) => String(x?.id) === String(pid));
    setLiked(!!on);
  }, []);

  const pushViewed = useCallback(async (p) => {
    if (!p?.id) return;

    const firstImg = Array.isArray(p.images) && p.images.length > 0 && p.images[0] ? p.images[0] : FALLBACK_IMG;

    const row = {
      id: p.id,
      name: p.name,
      price: p.price,
      image: firstImg,
      brand: p.brand,
      sku: p.sku,
      viewedAt: Date.now(),
    };

    const raw = await AsyncStorage.getItem(VIEWED_KEY);
    const arr = raw ? safeParse(raw, []) : [];
    const list = Array.isArray(arr) ? arr : [];

    const next = [row, ...list.filter((x) => String(x?.id) !== String(p.id))].slice(0, 50);
    await AsyncStorage.setItem(VIEWED_KEY, JSON.stringify(next));
  }, []);

  // NOTE: bạn đang có 2 useEffect load detail bị trùng. Giữ 1 cái thôi.
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const id = routeProduct?.id ?? route?.params?.id ?? null;
      if (!id) return;

      try {
        setLoading(true);

        const res = await apiProductDetail(id);
        const normalized = normalizeProduct(res?.product ?? res);

        if (!mounted) return;
        setProduct(normalized);

        await loadCartCount();
        await loadLikedState(normalized.id);
        await pushViewed(normalized);
      } catch (e) {
        if (mounted) {
          const fallback = normalizeProduct(routeProduct);
          setProduct(fallback);

          await loadCartCount();
          await loadLikedState(fallback.id);
          await pushViewed(fallback);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [routeProduct?.id, route?.params?.id, loadCartCount, loadLikedState, pushViewed]);

  useEffect(() => {
    loadCartCount();
  }, [loadCartCount]);

  const onImgScroll = (e) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / LAYOUT.IMG_W);
    setImgIndex(idx);
  };

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(product.stock || 99, q + 1));

  const addToCart = async () => {
    if (!product?.id) return;

    try {
      await apiCartAdd({ productId: product.id, qty });
      await loadCartCount();
      Alert.alert("Thành công", "Đã thêm vào giỏ hàng");
    } catch (e) {
      Alert.alert("Lỗi", e?.message || "Không thêm được vào giỏ hàng");
    }
  };

  const buyNow = () => {
    navigation.navigate("Checkout", { product, qty });
  };

  const toggleFavorite = async () => {
    if (!product?.id) return;

    const row = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: imagesSafe?.[0] || FALLBACK_IMG,
      brand: product.brand,
      sku: product.sku,
      addedAt: Date.now(),
    };

    try {
      const raw = await AsyncStorage.getItem(FAV_KEY);
      const arr = raw ? safeParse(raw, []) : [];
      const list = Array.isArray(arr) ? arr : [];

      const exists = list.some((x) => String(x?.id) === String(product.id));
      const next = exists ? list.filter((x) => String(x?.id) !== String(product.id)) : [row, ...list];

      await AsyncStorage.setItem(FAV_KEY, JSON.stringify(next));
      setLiked(!exists);
    } catch {
      // ignore
    }
  };

  const topInfoText = useMemo(() => {
    if (product.soldCount !== null && product.soldCount !== undefined) return `Đã bán: ${product.soldCount}`;
    if (product.warrantyText) return product.warrantyText;
    return "Hàng chính hãng";
  }, [product.soldCount, product.warrantyText]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable style={styles.headerIcon} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.TEXT} />
        </Pressable>

        <Text style={styles.headerTitle}>Chi tiết sản phẩm</Text>

        <View style={styles.headerRight}>
          <Pressable style={styles.headerIcon} onPress={() => navigation.navigate("Search")}>
            <Ionicons name="search-outline" size={22} color={COLORS.TEXT} />
          </Pressable>

          <Pressable style={styles.headerIcon} onPress={() => navigation.navigate("Cart")}>
            <Ionicons name="cart-outline" size={22} color={COLORS.TEXT} />
            {cartCount > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            ) : null}
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.imgWrap}>
          <ScrollView
            ref={imgRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onImgScroll}
            scrollEventThrottle={16}
          >
            {imagesSafe.map((u, i) => (
              <View key={String(i)} style={styles.imgPage}>
                <Image source={{ uri: u }} style={styles.img} />
              </View>
            ))}
          </ScrollView>

          <View style={styles.dots}>
            {imagesSafe.map((_, i) => (
              <View key={String(i)} style={[styles.dot, i === imgIndex && styles.dotActive]} />
            ))}
          </View>

          <View style={styles.fabCol}>
            <Pressable style={styles.fab}>
              <Ionicons name="share-social-outline" size={18} color={COLORS.TEXT} />
            </Pressable>
            <Pressable style={styles.fab} onPress={toggleFavorite}>
              <Ionicons name={liked ? "heart" : "heart-outline"} size={18} color={liked ? COLORS.RED : COLORS.TEXT} />
            </Pressable>
          </View>

          {loading ? (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator />
            </View>
          ) : null}
        </View>

        <Text style={styles.name}>{product.name}</Text>

        <View style={styles.infoRow}>
          <View style={styles.infoPill}>
            <Ionicons name="shield-checkmark-outline" size={16} color={COLORS.BLUE} />
            <Text style={styles.infoText}>{topInfoText}</Text>
          </View>

          {product.stock > 0 ? (
            <View style={[styles.infoPill, { borderColor: "#B9F0D3", backgroundColor: "#EAFBF3" }]}>
              <Ionicons name="cube-outline" size={16} color={COLORS.GREEN} />
              <Text style={[styles.infoText, { color: COLORS.GREEN }]}>Còn hàng</Text>
            </View>
          ) : (
            <View style={[styles.infoPill, { borderColor: "#FECACA", backgroundColor: "#FEE2E2" }]}>
              <Ionicons name="alert-circle-outline" size={16} color={COLORS.RED} />
              <Text style={[styles.infoText, { color: COLORS.RED }]}>Hết hàng</Text>
            </View>
          )}
        </View>

        <Text style={styles.meta}>
          SKU: {product.sku || "—"} · Thương hiệu: {product.brand || "—"}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.priceNow}>{formatVnd(product.price)}</Text>
          {product.oldPrice ? <Text style={styles.priceOld}>{formatVnd(product.oldPrice)}</Text> : null}
          {product.discountPct ? (
            <View style={styles.discountPill}>
              <Text style={styles.discountText}>-{product.discountPct}%</Text>
            </View>
          ) : null}
        </View>

        {product.installmentMonthly ? (
          <Pressable style={styles.installment}>
            <View style={styles.installLeft}>
              <View style={styles.greenPill}>
                <Text style={styles.greenPillText}>Trả góp 0%</Text>
              </View>
              <Text style={styles.installText}>
                Chỉ từ <Text style={styles.installMoney}>{formatVnd(product.installmentMonthly)}/tháng</Text>
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9AA0A6" />
          </Pressable>
        ) : null}

        {specsSafe.length > 0 ? (
          <View style={styles.specGrid}>
            {specsSafe.map((s, idx) => (
              <View key={String(s.k ?? idx)} style={styles.specCard}>
                <View style={styles.specIconBox}>
                  <Ionicons name={s.icon} size={18} color={COLORS.BLUE} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.specK}>{s.k}</Text>
                  <Text style={styles.specV} numberOfLines={1}>
                    {s.v}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : null}

        <View style={styles.qtyBlock}>
          <Text style={styles.qtyLabel}>Số lượng</Text>

          <View style={styles.qtyRow}>
            <View style={styles.stepper}>
              <Pressable style={styles.stepBtn} onPress={dec}>
                <Text style={styles.stepTxt}>−</Text>
              </Pressable>

              <View style={styles.stepMid}>
                <Text style={styles.qtyNum}>{qty}</Text>
              </View>

              <Pressable style={styles.stepBtn} onPress={inc}>
                <Text style={styles.stepTxt}>+</Text>
              </Pressable>
            </View>

            <Text style={styles.stock}>Còn {product.stock} sản phẩm</Text>
          </View>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <Pressable style={styles.addBtn} onPress={addToCart} disabled={product.stock <= 0}>
          <Ionicons name="cart-outline" size={18} color={COLORS.BLUE} />
          <Text style={styles.addText}>Thêm giỏ hàng</Text>
        </Pressable>

        <Pressable style={styles.buyBtn} onPress={buyNow} disabled={product.stock <= 0}>
          <Text style={styles.buyText}>Đặt mua</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
