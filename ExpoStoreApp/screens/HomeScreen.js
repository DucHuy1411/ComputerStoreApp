import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons, SimpleLineIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import {
  apiCategoriesTree,
  apiProducts,
  apiPromotionItems,
  apiCart,
} from "../services/endpoints";
import { fetchFlashSales } from "../services/flashSale.service";
import useNow from "../hooks/useNow";
import FlashSaleTicker from "../components/FlashSaleTicker";

import styles, { BANNER_W } from "../styles/HomeStyle";

const formatVnd = (n) => {
  const s = Math.round(Number(n || 0)).toString();
  return `${s.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}đ`;
};

const safeJsonParse = (s, fb) => {
  try {
    if (typeof s !== "string") return fb;
    return JSON.parse(s);
  } catch {
    return fb;
  }
};

const parseMs = (v) => {
  if (!v) return null;
  const ms = new Date(v).getTime();
  return Number.isNaN(ms) ? null : ms;
};

const normalizeImages = (p) => {
  const raw = p?.images ?? p?.image ?? p?.thumbnail ?? p?.thumb ?? p?.img;

  if (Array.isArray(raw)) return raw.filter(Boolean);

  if (typeof raw === "string") {
    const arr = safeJsonParse(raw, null);
    if (Array.isArray(arr)) return arr.filter(Boolean);
    if (raw.startsWith("http")) return [raw];
  }

  return [];
};

const pickFirstImage = (p) => {
  const imgs = normalizeImages(p);
  return (
    imgs[0] ||
    "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80"
  );
};

export default function HomeScreen({ navigation }) {
  const banners = useMemo(
    () => [
      { id: "b1", title: "Giảm 30%", sub: "Laptop Gaming Cao Cấp" },
      { id: "b2", title: "Giảm 20%", sub: "PC & Linh kiện" },
      { id: "b3", title: "Giảm 15%", sub: "Màn hình & Phụ kiện" },
    ],
    []
  );

  const [categories, setCategories] = useState([]);
  const [flashSale, setFlashSale] = useState([]);
  const [flashSales, setFlashSales] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const [bannerIndex, setBannerIndex] = useState(0);
  const bannerRef = useRef(null);
  const now = useNow();

  const activeFlashSales = useMemo(() => {
    const list = Array.isArray(flashSales) ? flashSales : [];
    return list.filter((e) => {
      const startMs = parseMs(e?.startAt);
      const endMs = parseMs(e?.endAt);
      if (startMs && now < startMs) return false;
      if (endMs && now >= endMs) return false;
      return true;
    });
  }, [flashSales, now]);

  const onBannerScroll = (e) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / BANNER_W);
    setBannerIndex(idx);
  };

  const mapProduct = (p, extra = {}) => {
    const price = Number(p?.price ?? p?.priceValue ?? 0);
    const oldPrice = Number(p?.oldPrice ?? p?.oldPriceValue ?? 0);

    const imgs = normalizeImages(p);
    const img = imgs[0] || pickFirstImage(p);

    const discountPct =
      Number(extra.discountPct ?? p.discountPct) ||
      (oldPrice > 0 ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0);

    return {
      id: p.id,
      name: p.name,

      img,
      images: imgs.length ? imgs : [img],

      priceValue: price,
      oldPriceValue: oldPrice,
      discountPct: discountPct || 0,

      installmentMonthly: Number(p.installmentMonthly ?? 0),
      brand: p.brandName ?? p.brand ?? "TechStore",
      sku: p.sku ?? "SKU001",
      stock: Number(p.stock ?? 99),


      price: formatVnd(price),
      oldPrice: oldPrice ? formatVnd(oldPrice) : "",
      discount: discountPct ? `-${discountPct}%` : "",
    };
  };

  const loadHome = async () => {
    try {
      // Categories
      const catRes = await apiCategoriesTree();
      const tree = catRes?.categories || [];

      const flat = tree.flatMap((parent) =>
        parent?.children?.length ? parent.children : [parent]
      );

      const iconMap = {
        laptop: "laptop-outline",
        pc: "desktop-outline",
        monitor: "tv-outline",
        keyboard: "keypad-outline",
        mouse: "mouse", // mouse-outline không tồn tại trong Ionicons
        audio: "headset-outline",
      };

      setCategories(
        flat
          .filter(Boolean)
          .slice(0, 12)
          .map((c, idx) => ({
            id: c.id,
            label: c.name,
            icon: c.icon || iconMap[c.code] || "pricetag-outline",
            active: idx === 0,
          }))
      );

      // Featured: 6, scroll ngang
      const featuredRes = await apiProducts({ sort: "popular", limit: 6 });
      setFeatured(
        (featuredRes?.products || []).map((p) =>
          mapProduct(p)
        )
      );

      // New: 6, scroll ngang
      const newRes = await apiProducts({ sort: "newest", limit: 15 });
      setNewProducts(
        (newRes?.products || []).map((p) => mapProduct(p))
      );

      // Flash sale events
      const events = await fetchFlashSales();
      setFlashSales(Array.isArray(events) ? events : []);

      const nowMs = Date.now();
      const activeEvents = Array.isArray(events)
        ? events.filter((e) => {
            const startMs = parseMs(e?.startAt);
            const endMs = parseMs(e?.endAt);
            if (startMs && nowMs < startMs) return false;
            if (endMs && nowMs >= endMs) return false;
            return true;
          })
        : [];

      if (activeEvents.length > 0) {
        const itemsGroups = await Promise.all(
          activeEvents.map(async (event) => {
            try {
              const itemsRes = await apiPromotionItems(event.id);
              return itemsRes?.items || [];
            } catch {
              return [];
            }
          })
        );

        const merged = itemsGroups.flat().map((it) => {
          const base = it.product || it;

          const mapped = mapProduct(base, {
            discountPct: it.discountPct ?? base.discountPct,
          });

          const promoPrice = Number(it.price ?? base.price ?? mapped.priceValue);
          const promoOldPrice = Number(it.oldPrice ?? base.oldPrice ?? mapped.oldPriceValue);
          const baseImgs = normalizeImages(base);
          const img = baseImgs[0] || mapped.img;

          const discountPct = Number(it.discountPct ?? mapped.discountPct) || 0;

          return {
            ...mapped,
            promoId: it.promotionId,
            img,
            images: baseImgs.length ? baseImgs : mapped.images,

            priceValue: promoPrice,
            oldPriceValue: promoOldPrice,

            price: formatVnd(promoPrice),
            oldPrice: promoOldPrice ? formatVnd(promoOldPrice) : "",
            discount: discountPct ? `-${discountPct}%` : "",
          };
        });

        setFlashSale(merged);
      } else {
        setFlashSale([]);
      }
    } catch (e) {
      Alert.alert("Lỗi", e?.message || "Không tải được Home");
    }
  };

  const loadCartCount = async () => {
    try {
      const res = await apiCart();
      const items = res?.items || [];
      const count = items.reduce((s, it) => s + (Number(it.qty) || 0), 0);
      setCartCount(count);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    loadHome();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadCartCount();
    }, [])
  );

  const openSearch = () => navigation.navigate("Search");
  const openCart = () => navigation.navigate("Cart");
  const openFlashSaleEvent = (event) => {
    if (!navigation?.navigate) return;
    const routes = navigation.getState?.().routeNames || [];
    if (routes.includes("FlashSale")) {
      navigation.navigate("FlashSale", { id: event?.id });
      return;
    }
    navigation.navigate("Deals", { flashSaleId: event?.id });
  };

  const openCategory = (c) => {
    navigation.navigate("Category", {
      screen: "CategoryDetail",
      params: { categoryId: c.id, title: c.label },
    });
  };

  const openProduct = (p) => {
    const imgs = p?.images?.length ? p.images : normalizeImages(p);
    const img0 = (imgs && imgs[0]) || p.img || pickFirstImage(p);

    navigation.navigate("ProductDetail", {
      product: {
        id: p.id,
        name: p.name,
        sku: p.sku ?? "SKU001",
        brand: p.brand ?? "TechStore",
        price: p.priceValue ?? 0,
        oldPrice: p.oldPriceValue ?? 0,
        discountPct: p.discountPct ?? 0,
        installmentMonthly: p.installmentMonthly ?? 0,
        stock: p.stock ?? 99,
        images: imgs?.length ? imgs : [img0],
        specs:
          p.specs?.length
            ? p.specs
            : [
              { k: "CPU", v: "Intel Core i7-1260P", icon: "hardware-chip-outline" },
              { k: "RAM", v: "16GB LPDDR5", icon: "albums-outline" },
              { k: "Storage", v: "512GB SSD NVMe", icon: "server-outline" },
              { k: "Display", v: '13.4" FHD+', icon: "desktop-outline" },
            ],
      },
    });
  };

  const PricePair = ({ p, styleWrap }) => (
    <View style={styleWrap}>
      {!!p.oldPrice && <Text style={styles.hOldPrice}>{p.oldPrice}</Text>}
      <Text style={styles.hPrice}>{p.price}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Search bar */}
        <View style={styles.searchRow}>
          <Pressable style={styles.searchBox} onPress={openSearch}>
            <Ionicons name="search-outline" size={18} color="#9AA0A6" />
            <TextInput
              placeholder="Tìm laptop, PC, phụ kiện..."
              placeholderTextColor="#9AA0A6"
              style={styles.searchInput}
              editable={false}
              pointerEvents="none"
            />
          </Pressable>

          <Pressable style={styles.cartBtn} onPress={openCart}>
            <Ionicons name="cart-outline" size={22} color="#333" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{String(cartCount || 0)}</Text>
            </View>
          </Pressable>
        </View>

        {/* Banner carousel */}
        <View style={{ marginTop: 14 }}>
          <ScrollView
            ref={bannerRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onBannerScroll}
            scrollEventThrottle={16}
          >
            {banners.map((b) => (
              <View key={b.id} style={styles.banner}>
                <Text style={styles.bannerTitle}>{b.title}</Text>
                <Text style={styles.bannerSub}>{b.sub}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.dots}>
            {banners.map((_, i) => (
              <View key={i} style={[styles.dot, i === bannerIndex && styles.dotActive]} />
            ))}
          </View>
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
          {categories.map((c) => {
            const active = !!c.active;
            return (
              <Pressable
                key={c.id}
                style={[styles.catPill, active && styles.catPillActive]}
                onPress={() => openCategory(c)}
              >
                <Ionicons name={c.icon} size={18} color={active ? "#fff" : "#111"} />
                <Text style={[styles.catText, active && styles.catTextActive]} numberOfLines={1}>
                  {c.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {!!activeFlashSales.length && (
          <>
            {/* Flash Sale */}
            <View style={styles.sectionHeader}>
              <View style={styles.sectionLeft}>
                <MaterialCommunityIcons name="lightning-bolt" size={18} color="#F5B400" />
                <Text style={styles.sectionTitle}>Flash Sale</Text>
              </View>

              <View style={styles.sectionRight}>
                {/* <Text style={styles.endsText}>Kết thúc trong</Text> */}
                <View style={[styles.timerPill, { overflow: "hidden", maxWidth: 250 }]}>
                  <FlashSaleTicker
                    flashSales={activeFlashSales}
                    nowMs={now}
                    onPressItem={openFlashSaleEvent}
                    textStyle={styles.timerText}
                  />
                </View>
              </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingRight: 6 }}>
              {flashSale.map((p) => (
                <Pressable key={`${p.promoId || "promo"}-${p.id}`} style={styles.flashCard} onPress={() => openProduct(p)}>
                  <View style={styles.flashImgWrap}>
                    <Image source={{ uri: p.img }} style={styles.flashImg} />
                    {!!p.discount && (
                      <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>{p.discount}</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.flashName} numberOfLines={2}>
                    {p.name}
                  </Text>

                  {!!p.oldPrice && <Text style={styles.oldPrice}>{p.oldPrice}</Text>}
                  <Text style={styles.newPrice}>{p.price}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </>
        )}

        {/* Featured (6, scroll ngang, bỏ sao, thay bằng old/new) */}
        <Text style={[styles.sectionTitleBig, { marginTop: 18 }]}>Sản Phẩm Nổi Bật</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
          {featured.slice(0, 6).map((p) => (
            <Pressable key={p.id} style={styles.hCard} onPress={() => openProduct(p)}>
              {!!p.badge && (
                <View style={styles.hBadgeGreen}>
                  <Text style={styles.hBadgeText}>{p.badge}</Text>
                </View>
              )}
              <Image source={{ uri: p.img }} style={styles.hImg} />
              <Text style={styles.hName} numberOfLines={2}>
                {p.name}
              </Text>
              {!!p.oldPrice && <Text style={styles.hOldPrice}>{p.oldPrice}</Text>}
              <Text style={styles.hPrice}>{p.price}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* New (6, scroll ngang, bỏ sao, thay bằng old/new) */}
        <Text style={[styles.sectionTitleBig, { marginTop: 18 }]}>Sản Phẩm Mới</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
          {newProducts.slice(0, 6).map((p) => (
            <Pressable key={p.id} style={styles.hCard} onPress={() => openProduct(p)}>
              {!!p.badge && (
                <View style={styles.hBadgeBlue}>
                  <Text style={styles.hBadgeText}>{p.badge}</Text>
                </View>
              )}
              <Image source={{ uri: p.img }} style={styles.hImg} />
              <Text style={styles.hName} numberOfLines={2}>
                {p.name}
              </Text>
              {!!p.oldPrice && <Text style={styles.hOldPrice}>{p.oldPrice}</Text>}
              <Text style={styles.hPrice}>{p.price}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={{ height: 14 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
