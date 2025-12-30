// src/screens/CartScreen.js
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Text, View, Pressable, ScrollView, Image, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import { apiCart, apiCartUpdate, apiCartRemove, apiCartClear, apiCartToggleAll } from "../services/endpoints";

import styles, { COLORS } from "../styles/CartStyle";

const formatVnd = (n) => {
  const s = Math.round(Number(n || 0)).toString();
  const withDots = s.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${withDots}đ`;
};

const CheckBox = ({ checked, onPress }) => (
  <Pressable onPress={onPress} style={[styles.cb, checked && styles.cbOn]}>
    {checked ? <Ionicons name="checkmark" size={16} color={COLORS.WHITE} /> : null}
  </Pressable>
);

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

const pickFirstImage = (p) => {
  if (p.image) return p.image;
  if (p.thumbnail) return p.thumbnail;
  if (p.thumb) return p.thumb;

  const imgs = parseJsonArray(p.images, []);
  if (imgs.length > 0) return imgs[0];

  return "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80";
};

const normalizeCart = (res) => {
  const list = res?.items || [];
  const items = list.map((it) => {
    const p = it.product || {};
    const img = pickFirstImage(p);

    return {
      id: String(it.id),
      productId: String(it.productId || p.id || ""),
      name: p.name || "Sản phẩm",
      sub: p.shortDesc || p.subTitle || "",
      price: Number(p.price || 0),
      qty: Number(it.qty || 1),
      selected: !!it.selected,
      img,
      productRaw: p,
      itemRaw: it,
    };
  });

  return {
    items,
    subtotal: Number(res?.subtotal ?? 0),
    shipping: Number(res?.shipping ?? 0),
    total: Number(res?.total ?? Number(res?.subtotal ?? 0) + Number(res?.shipping ?? 0)),
  };
};

export default function CartScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [busyMap, setBusyMap] = useState({});
  const [items, setItems] = useState([]);
  const [serverTotals, setServerTotals] = useState({ subtotal: 0, shipping: 0, total: 0 });

  const setItemBusy = (id, v) => setBusyMap((m) => ({ ...m, [id]: v }));

  const loadCart = async () => {
    try {
      setLoading(true);
      const res = await apiCart();
      const n = normalizeCart(res);
      setItems(n.items);
      setServerTotals({ subtotal: n.subtotal, shipping: n.shipping, total: n.total });
    } catch (e) {
      Alert.alert("Lỗi", e?.message || "Không tải được giỏ hàng");
      setItems([]);
      setServerTotals({ subtotal: 0, shipping: 0, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [])
  );

  const selectedAll = useMemo(() => items.length > 0 && items.every((i) => !!i.selected), [items]);

  const subtotalLocal = useMemo(() => items.reduce((sum, i) => sum + (i.selected ? i.price * i.qty : 0), 0), [items]);

  const subtotal = serverTotals.subtotal ?? subtotalLocal;
  const shipping = serverTotals.shipping ?? 0;
  const total = serverTotals.total ?? subtotalLocal;

  const setQty = async (id, next) => {
    const n = Math.max(1, Number(next || 1));
    const prev = items;

    setItems((cur) => cur.map((i) => (i.id === id ? { ...i, qty: n } : i)));

    try {
      setItemBusy(id, true);
      await apiCartUpdate(id, { qty: n });
      await loadCart();
    } catch (e) {
      setItems(prev);
      Alert.alert("Lỗi", e?.message || "Không cập nhật số lượng");
    } finally {
      setItemBusy(id, false);
    }
  };

  const toggleItem = async (id) => {
    const curr = items.find((x) => x.id === id);
    if (!curr) return;

    const nextSelected = !curr.selected;
    const prev = items;

    setItems((cur) => cur.map((i) => (i.id === id ? { ...i, selected: nextSelected } : i)));

    try {
      setItemBusy(id, true);
      await apiCartUpdate(id, { selected: nextSelected });
      await loadCart();
    } catch (e) {
      setItems(prev);
      Alert.alert("Lỗi", e?.message || "Không cập nhật chọn sản phẩm");
    } finally {
      setItemBusy(id, false);
    }
  };

  const toggleAll = async () => {
    const next = !selectedAll;
    const prev = items;

    setItems((cur) => cur.map((i) => ({ ...i, selected: next })));

    try {
      setLoading(true);
      await apiCartToggleAll(next);
      await loadCart();
    } catch (e) {
      setItems(prev);
      Alert.alert("Lỗi", e?.message || "Không cập nhật chọn tất cả");
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id) => {
    Alert.alert("Xóa sản phẩm", "Xóa sản phẩm này khỏi giỏ hàng?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          const prev = items;
          setItems((cur) => cur.filter((i) => i.id !== id));

          try {
            await apiCartRemove(id);
            await loadCart();
          } catch (e) {
            setItems(prev);
            Alert.alert("Lỗi", e?.message || "Không xóa được sản phẩm");
          }
        },
      },
    ]);
  };

  const clearAll = async () => {
    if (items.length === 0) return;

    Alert.alert("Xóa tất cả", "Xóa toàn bộ sản phẩm trong giỏ hàng?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          const prev = items;
          setItems([]);

          try {
            setLoading(true);
            await apiCartClear();
            await loadCart();
          } catch (e) {
            setItems(prev);
            Alert.alert("Lỗi", e?.message || "Không xóa được giỏ hàng");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const checkout = () => {
    const selectedItems = items.filter((i) => i.selected);
    if (selectedItems.length === 0) {
      Alert.alert("Thông báo", "Chưa chọn sản phẩm nào để đặt hàng");
      return;
    }

    const products = selectedItems.map((i) => ({
      cartItemId: i.id,
      productId: i.productId,
      name: i.name,
      qty: i.qty,
      priceNumber: i.price,
      priceText: formatVnd(i.price),
      sub: i.sub,
      img: i.img,
      lineTotal: i.price * i.qty,
    }));

    const subtotalNumber = products.reduce((s, p) => s + p.lineTotal, 0);
    const shippingNumber = 0;
    const totalNumber = subtotalNumber + shippingNumber;

    navigation.navigate("Checkout", {
      from: "cart",
      order: {
        products,
        subtotal: formatVnd(subtotalNumber),
        shipping: shippingNumber === 0 ? "Miễn phí" : formatVnd(shippingNumber),
        total: formatVnd(totalNumber),
        subtotalNumber,
        shippingNumber,
        totalNumber,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable style={styles.headerIcon} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.TEXT} />
        </Pressable>

        <Text style={styles.headerTitle}>Giỏ hàng ({items.length})</Text>

        <Pressable onPress={clearAll}>
          <Text style={styles.clearText}>Xóa tất cả</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator />
            <Text style={styles.loadingText}>Đang tải giỏ hàng...</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
            <View style={styles.selectAll}>
              <View style={styles.selectLeft}>
                <CheckBox checked={selectedAll} onPress={toggleAll} />
                <Text style={styles.selectText}>Chọn tất cả</Text>
              </View>
              <Text style={styles.selectRight}>{items.length} sản phẩm</Text>
            </View>

            {items.length === 0 ? (
              <View style={styles.empty}>
                <Ionicons name="cart-outline" size={42} color={COLORS.MUTED} />
                <Text style={styles.emptyTitle}>Giỏ hàng trống</Text>
                <Text style={styles.emptySub}>Thêm sản phẩm để tiếp tục</Text>
              </View>
            ) : (
              items.map((it) => (
                <View key={it.id} style={styles.itemCard}>
                  <View style={styles.itemRow}>
                    <CheckBox checked={it.selected} onPress={() => toggleItem(it.id)} />

                    <View style={styles.itemImgBox}>
                      <Image source={{ uri: it.img }} style={styles.itemImg} />
                    </View>

                    <View style={{ flex: 1 }}>
                      <View style={styles.itemTopRow}>
                        <Text style={styles.itemName} numberOfLines={2}>
                          {it.name}
                        </Text>

                        <Pressable onPress={() => removeItem(it.id)} hitSlop={10} style={styles.trashBtn}>
                          <Ionicons name="trash-outline" size={18} color={COLORS.RED} />
                        </Pressable>
                      </View>

                      {!!it.sub && (
                        <Text style={styles.itemSub} numberOfLines={1}>
                          {it.sub}
                        </Text>
                      )}

                      <View style={styles.itemBottom}>
                        <Text style={styles.itemPrice}>{formatVnd(it.price)}</Text>

                        <View style={styles.stepper}>
                          <Pressable
                            style={[styles.stepBtn, busyMap[it.id] && styles.disabledBtn]}
                            onPress={() => setQty(it.id, it.qty - 1)}
                            disabled={!!busyMap[it.id]}
                          >
                            <Text style={styles.stepTxt}>−</Text>
                          </Pressable>

                          <View style={styles.stepMid}>
                            <Text style={styles.qtyNum}>{it.qty}</Text>
                          </View>

                          <Pressable
                            style={[styles.stepBtn, busyMap[it.id] && styles.disabledBtn]}
                            onPress={() => setQty(it.id, it.qty + 1)}
                            disabled={!!busyMap[it.id]}
                          >
                            <Text style={styles.stepTxt}>+</Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        )}
      </View>

      <View style={styles.bottom}>
        <View style={styles.sumRow}>
          <Text style={styles.sumLabel}>Tạm tính</Text>
          <Text style={styles.sumValue}>{formatVnd(subtotal)}</Text>
        </View>

        <View style={styles.sumRow}>
          <Text style={styles.sumLabel}>Phí vận chuyển</Text>
          <Text style={[styles.sumValue, { color: COLORS.GREEN_SHIP }]}>
            {Number(shipping) === 0 ? "Miễn phí" : formatVnd(shipping)}
          </Text>
        </View>

        <View style={styles.sumDivider} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tổng cộng</Text>
          <Text style={styles.totalValue}>{formatVnd(total)}</Text>
        </View>

        <Pressable style={[styles.checkoutBtn, subtotal <= 0 && styles.checkoutBtnDisabled]} onPress={checkout} disabled={subtotal <= 0}>
          <Text style={styles.checkoutText}>Tiến hành đặt hàng</Text>
          <Ionicons name="arrow-forward" size={18} color={COLORS.WHITE} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
