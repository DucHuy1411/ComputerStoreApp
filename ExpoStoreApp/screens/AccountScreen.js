import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Text, View, Pressable, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { apiMe, apiOrders, apiAddresses } from "../services/endpoints";

import styles, { COLORS } from "../styles/AccountStyle";

const STATUS_KEYS = {
  pending: "Chờ xác nhận",
  processing: "Đang xử lý",
  shipping: "Đang giao",
  done: "Đã giao",
};

export default function AccountScreen({ navigation }) {
  const { logout } = useContext(AuthContext);

  const [user, setUser] = useState({ name: "", phone: "", initial: "U", email: "" });
  const [stats, setStats] = useState([
    { id: "s1", icon: "time-outline", colorBg: "#FFF3E6", color: "#F59E0B", value: 0, label: "Chờ xác nhận" },
    { id: "s2", icon: "car-outline", colorBg: "#E9F7FF", color: "#0EA5E9", value: 0, label: "Đang giao" },
    { id: "s3", icon: "checkmark-circle-outline", colorBg: "#EAFBF3", color: "#22C55E", value: 0, label: "Đã giao" },
  ]);

  const [counts, setCounts] = useState({
    wishlist: 0,
    addresses: 0,
    vouchers: 0,
    notif: 0,
  });

  const normalizeUser = (me) => {
    const u = me?.user ?? me ?? {};
    const name = u.fullName || u.name || u.email || "User";
    const phone = u.phone || u.phoneNumber || "";
    const initial = (name?.trim?.()[0] || "U").toUpperCase();
    const email = u.email || "";
    return { name, phone, initial, email };
  };

  const loadAccount = async () => {
    try {
      const [meRes, ordersRes, addrRes] = await Promise.all([apiMe(), apiOrders({ limit: 500 }), apiAddresses()]);

      setUser(normalizeUser(meRes));

      const orders = ordersRes?.orders || ordersRes?.items || [];
      const c = { pending: 0, shipping: 0, done: 0 };
      orders.forEach((o) => {
        const k = o.statusKey || o.status || "";
        if (k === "pending") c.pending += 1;
        if (k === "shipping") c.shipping += 1;
        if (k === "done") c.done += 1;
      });

      setStats([
        { id: "s1", icon: "time-outline", colorBg: "#FFF3E6", color: "#F59E0B", value: c.pending, label: "Chờ xác nhận" },
        { id: "s2", icon: "car-outline", colorBg: "#E9F7FF", color: "#0EA5E9", value: c.shipping, label: "Đang giao" },
        { id: "s3", icon: "checkmark-circle-outline", colorBg: "#EAFBF3", color: "#22C55E", value: c.done, label: "Đã giao" },
      ]);

      const addresses = addrRes?.addresses || addrRes?.items || [];
      setCounts((p) => ({
        ...p,
        addresses: addresses.length,
        vouchers: 0,
        wishlist: 0,
      }));
    } catch (e) {
      Alert.alert("Lỗi", e?.message || "Không tải được dữ liệu tài khoản");
    }
  };

  useEffect(() => {
    loadAccount();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAccount();
    }, [])
  );

  const onLogout = () => {
    Alert.alert("Đăng xuất", "Bạn muốn đăng xuất khỏi tài khoản?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
          } catch (e) {
            Alert.alert("Lỗi", e?.message || "Đăng xuất thất bại");
          }
        },
      },
    ]);
  };

  const group1 = useMemo(
    () => [
      {
        id: "g1_1",
        title: "Đơn hàng của tôi",
        icon: "clipboard-text-outline",
        iconBg: "#E9F7FF",
        iconColor: "#0EA5E9",
        onPress: () => navigation.navigate("Orders"),
      },
      {
        id: "g1_2",
        title: "Sản phẩm yêu thích",
        icon: "heart-outline",
        iconBg: "#FFECEC",
        iconColor: "#EF4444",
        onPress: () => navigation.navigate("Wishlist"),
      },
      {
        id: "g1_3",
        title: "Đã xem gần đây",
        icon: "eye-outline",
        iconBg: "#F3E8FF",
        iconColor: "#A855F7",
        onPress: () => navigation.navigate("RecentlyViewed"),
      },
    ],
    [navigation, counts.wishlist]
  );

  const group2 = useMemo(
    () => [
      {
        id: "g2_1",
        title: "Địa chỉ giao hàng",
        sub: `${counts.addresses || 0} địa chỉ`,
        icon: "map-marker-outline",
        iconBg: "#EAFBF3",
        iconColor: "#22C55E",
        onPress: () => navigation.navigate("Address"),
      },
      {
        id: "g2_2",
        title: "Phương thức thanh toán",
        sub: "2 thẻ",
        icon: "card-outline",
        iconBg: "#E9F7FF",
        iconColor: "#0EA5E9",
        onPress: () => navigation.navigate("PaymentMethods"),
      },
      {
        id: "g2_3",
        title: "Voucher của tôi",
        sub: `${counts.vouchers || 0} voucher`,
        icon: "ticket-percent-outline",
        iconBg: "#FFF3E6",
        iconColor: "#F59E0B",
        badge: counts.vouchers ? String(counts.vouchers) : undefined,
        onPress: () => navigation.navigate("Deals"),
      },
    ],
    [navigation, counts.addresses, counts.vouchers]
  );

  const Row = ({ item, isLast }) => (
    <Pressable style={[styles.row, isLast && styles.rowLast]} onPress={item.onPress ? item.onPress : undefined}>
      <View style={styles.rowLeft}>
        <View style={[styles.rowIcon, { backgroundColor: item.iconBg }]}>
          <MaterialCommunityIcons name={item.icon} size={20} color={item.iconColor} />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.rowTitle}>{item.title}</Text>
          {!!item.sub && <Text style={styles.rowSub}>{item.sub}</Text>}
        </View>
      </View>

      <View style={styles.rowRight}>
        {!!item.badge && (
          <View style={styles.rowBadge}>
            <Text style={styles.rowBadgeText}>{item.badge}</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={18} color={COLORS.MUTED} />
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tài khoản</Text>

          <View style={styles.headerRight}>
            <Pressable style={styles.iconBtn} onPress={() => navigation.navigate("Notifications")}>
              <Ionicons name="notifications-outline" size={22} color={COLORS.TEXT} />
              {(counts.notif || 0) > 0 ? (
                <View style={styles.notifBadge}>
                  <Text style={styles.notifBadgeText}>{String(counts.notif)}</Text>
                </View>
              ) : null}
            </Pressable>

            <Pressable style={styles.iconBtn} onPress={() => navigation.navigate("Settings")}>
              <Ionicons name="settings-outline" size={22} color={COLORS.TEXT} />
            </Pressable>
          </View>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user.initial}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{user.name}</Text>
              {!!user.phone && <Text style={styles.phone}>{user.phone}</Text>}

              <Pressable style={styles.editBtn} onPress={() => navigation.navigate("EditProfile")}>
                <Ionicons name="create-outline" size={16} color={COLORS.WHITE} />
                <Text style={styles.editBtnText}>Chỉnh sửa hồ sơ</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.vipPill}>
            <Text style={styles.vipText}>{user.email}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          {stats.map((s) => (
            <Pressable
              key={s.id}
              style={styles.statCard}
              onPress={() => {
                if (s.label === STATUS_KEYS.pending) navigation.navigate("Orders", { tab: "pending" });
                if (s.label === STATUS_KEYS.shipping) navigation.navigate("Orders", { tab: "shipping" });
                if (s.label === STATUS_KEYS.done) navigation.navigate("Orders", { tab: "done" });
              }}
            >
              <View style={[styles.statIcon, { backgroundColor: s.colorBg }]}>
                <Ionicons name={s.icon} size={20} color={s.color} />
              </View>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.group}>
          {group1.map((it, idx) => (
            <Row key={it.id} item={it} isLast={idx === group1.length - 1} />
          ))}
        </View>

        <View style={styles.group}>
          {group2.map((it, idx) => (
            <Row key={it.id} item={it} isLast={idx === group2.length - 1} />
          ))}
        </View>

        <Pressable style={styles.logoutBtn} onPress={onLogout}>
          <Ionicons name="log-out-outline" size={18} color={COLORS.RED} />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </Pressable>

        <View style={{ height: 14 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
