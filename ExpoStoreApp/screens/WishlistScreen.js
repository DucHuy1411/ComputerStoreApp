import React, { useCallback, useState } from "react";
import { Text, View, Pressable, ScrollView, Image, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

import styles, { COLORS } from "../styles/WishlistStyle";

const WISHLIST_KEY = "favorite_products";
const FALLBACK_IMG = "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80";

const formatVnd = (n) => {
  const s = Math.round(Number(n || 0)).toString();
  return `${s.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}đ`;
};

const safeParse = (raw, fallback) => {
  if (raw == null) return fallback;
  try {
    const v = JSON.parse(raw);
    return v ?? fallback;
  } catch {
    return fallback;
  }
};

const normalizeRow = (x) => ({
  id: String(x?.id ?? ""),
  name: String(x?.name ?? "Sản phẩm"),
  price: Number(x?.price ?? 0),
  image: String(x?.image ?? x?.img ?? FALLBACK_IMG),
  brand: String(x?.brand ?? ""),
  sku: String(x?.sku ?? ""),
  addedAt: Number(x?.addedAt ?? x?.likedAt ?? x?.time ?? 0),
});

export default function WishlistScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const raw = await AsyncStorage.getItem(WISHLIST_KEY);
      const arr = safeParse(raw, []);
      const list = Array.isArray(arr) ? arr : [];
      const normalized = list
        .map(normalizeRow)
        .filter((x) => x.id)
        .sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
      setItems(normalized);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const removeOne = async (id) => {
    const prev = items;
    const next = prev.filter((x) => x.id !== String(id));
    setItems(next);
    try {
      await AsyncStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
    } catch {
      setItems(prev);
      Alert.alert("Lỗi", "Không xóa được yêu thích");
    }
  };

  const clearAll = async () => {
    if (items.length === 0) return;
    const prev = items;
    setItems([]);
    try {
      await AsyncStorage.removeItem(WISHLIST_KEY);
    } catch {
      setItems(prev);
      Alert.alert("Lỗi", "Không xóa được yêu thích");
    }
  };

  const openDetail = (id) => {
    const pid = Number(id);
    navigation.navigate("ProductDetail", { id: pid, product: { id: pid } });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.TEXT} />
        </Pressable>

        <Text style={styles.headerTitle}>Yêu thích</Text>

        <Pressable style={styles.headerBtn} onPress={clearAll}>
          <Ionicons name="trash-outline" size={22} color={items.length ? COLORS.RED : COLORS.MUTED_ICON} />
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {items.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="heart-outline" size={42} color={COLORS.MUTED_ICON} />
              <Text style={styles.emptyTitle}>Chưa có sản phẩm yêu thích</Text>
              <Text style={styles.emptySub}>Nhấn tim ở trang chi tiết để lưu</Text>
            </View>
          ) : (
            items.map((it) => (
              <Pressable key={it.id} style={styles.row} onPress={() => openDetail(it.id)}>
                <View style={styles.imgBox}>
                  <Image source={{ uri: it.image || FALLBACK_IMG }} style={styles.img} />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.name} numberOfLines={2}>
                    {it.name}
                  </Text>

                  {it.brand || it.sku ? (
                    <Text style={styles.meta} numberOfLines={1}>
                      {it.sku ? `SKU: ${it.sku}` : ""}
                      {it.sku && it.brand ? " · " : ""}
                      {it.brand ? `Hãng: ${it.brand}` : ""}
                    </Text>
                  ) : null}

                  <Text style={styles.price}>{formatVnd(it.price)}</Text>
                </View>

                <Pressable onPress={() => removeOne(it.id)} hitSlop={10} style={styles.iconBtn}>
                  <Ionicons name="heart-dislike-outline" size={18} color={COLORS.RED} />
                </Pressable>
              </Pressable>
            ))
          )}

          <View style={{ height: 16 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
