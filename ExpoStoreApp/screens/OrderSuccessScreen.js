import React, { useMemo } from "react";
import { Text, View, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import styles, { COLORS } from "../styles/OrderSuccessStyle";

const formatVnd = (n) => {
    const s = Math.round(Number(n || 0)).toString();
    return `${s.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}đ`;
};

const fmtDateTime = (d) => {
    try {
        const x = new Date(d || Date.now());
        const dd = String(x.getDate()).padStart(2, "0");
        const mm = String(x.getMonth() + 1).padStart(2, "0");
        const yyyy = x.getFullYear();
        const hh = String(x.getHours()).padStart(2, "0");
        const mi = String(x.getMinutes()).padStart(2, "0");
        return `${hh}:${mi} • ${dd}/${mm}/${yyyy}`;
    } catch {
        return "";
    }
};

const pick = (obj, keys, fb = undefined) => {
    for (const k of keys) {
        const v = obj?.[k];
        if (v !== undefined && v !== null && String(v).trim?.() !== "") return v;
    }
    return fb;
};

export default function OrderSuccessScreen({ navigation, route }) {
    const raw = route?.params?.order || {};

    const order = useMemo(() => {
        const id = pick(raw, ["id", "orderId", "code", "orderCode"], "—");
        const statusKey = String(pick(raw, ["statusKey", "status"], "done")).toLowerCase();
        const createdAt = pick(raw, ["createdAt", "created_at", "time", "createdTime"], Date.now());

        const addressObj =
            pick(raw, ["address", "shippingAddress", "deliveryAddress"], null) || pick(route?.params, ["address"], null);

        const addrName = pick(addressObj, ["name", "fullName", "receiverName"], "");
        const addrPhone = pick(addressObj, ["phone", "phoneNumber", "receiverPhone"], "");
        const addrText =
            pick(addressObj, ["address", "detail", "line1", "text"], "") || pick(addressObj, ["fullAddress"], "");

        const uiProducts = pick(raw, ["products"], null);
        const beItems = pick(raw, ["items", "orderItems", "lines"], null);

        const itemsFromUI = Array.isArray(uiProducts)
            ? uiProducts.map((p, idx) => ({
                id: String(pick(p, ["id", "productId", "cartItemId"], idx)),
                name: pick(p, ["name"], "Sản phẩm"),
                qty: Number(pick(p, ["qty", "quantity"], 1)) || 1,
                price: Number(pick(p, ["priceNumber"], 0)) || 0,
            }))
            : [];

        const itemsFromBE = Array.isArray(beItems)
            ? beItems.map((it, idx) => {
                const p = it.product || it.Product || it.item || {};
                const name = pick(it, ["name", "productName"], null) || pick(p, ["name"], "Sản phẩm");
                const qty = Number(pick(it, ["qty", "quantity", "count"], 1)) || 1;

                const priceNumber = Number(pick(it, ["priceNumber", "price"], NaN));
                const pPrice = Number(pick(p, ["price"], NaN));
                const price = Number.isFinite(priceNumber) ? priceNumber : Number.isFinite(pPrice) ? pPrice : 0;

                return { id: String(pick(it, ["id", "productId"], idx)), name, qty, price };
            })
            : [];

        const items = itemsFromUI.length > 0 ? itemsFromUI : itemsFromBE;

        const subtotalNumber =
            Number(pick(raw, ["subtotalNumber", "subTotalNumber", "subtotal"], NaN)) || Number(pick(raw, ["subTotal"], NaN));

        const shippingNumber = Number(pick(raw, ["shippingNumber", "shippingFee", "shipping"], NaN)) || 0;

        const totalNumber =
            Number(pick(raw, ["totalNumber", "totalPrice", "grandTotal", "total"], NaN)) || 0;

        const calcSubtotal = items.reduce((s, it) => s + Number(it.price || 0) * Number(it.qty || 1), 0);
        const subN = Number.isFinite(subtotalNumber) ? subtotalNumber : calcSubtotal;
        const shipN = Number.isFinite(shippingNumber) ? shippingNumber : 0;
        const totN = Number.isFinite(totalNumber) && totalNumber > 0 ? totalNumber : subN + shipN;

        const discountNumber = Number(pick(raw, ["discountNumber", "discount", "voucherDiscount"], 0)) || 0;

        return {
            id,
            statusKey,
            createdAt,
            addrName,
            addrPhone,
            addrText,
            items,
            subtotalNumber: subN,
            shippingNumber: shipN,
            totalNumber: totN,
            discountNumber,
        };
    }, [raw, route?.params]);

    const statusLabel = useMemo(() => {
        const k = String(order.statusKey || "").toLowerCase();
        if (k === "pending") return "Chờ xác nhận";
        if (k === "processing") return "Đang xử lý";
        if (k === "shipping") return "Đang giao";
        if (k === "done" || k === "completed" || k === "success") return "Đã đặt thành công";
        if (k === "cancelled" || k === "canceled") return "Đã hủy";
        return "Đã đặt thành công";
    }, [order.statusKey]);

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <View style={styles.headerBtn} />
                <Text style={styles.headerTitle}>Hoàn tất</Text>
                <Pressable style={styles.headerBtn} onPress={() => navigation.popToTop?.()}>
                    <Ionicons name="close" size={22} color={COLORS.TEXT} />
                </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.hero}>
                    <View style={styles.checkWrap}>
                        <Ionicons name="checkmark" size={28} color={COLORS.WHITE} />
                    </View>
                    <Text style={styles.heroTitle}>Đặt hàng thành công</Text>
                    <Text style={styles.heroSub}>{statusLabel}</Text>

                    <View style={styles.metaRow}>
                        <View style={styles.metaPill}>
                            <Ionicons name="receipt-outline" size={14} color={COLORS.TEXT} />
                            <Text style={styles.metaText}>Mã đơn: {String(order.id)}</Text>
                        </View>

                        <View style={styles.metaPill}>
                            <Ionicons name="time-outline" size={14} color={COLORS.TEXT} />
                            <Text style={styles.metaText}>{fmtDateTime(order.createdAt)}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.cardHeaderLeft}>
                            <Ionicons name="location-outline" size={18} color={COLORS.BLUE} />
                            <Text style={styles.cardTitle}>Địa chỉ giao hàng</Text>
                        </View>
                    </View>

                    {order.addrText || order.addrName || order.addrPhone ? (
                        <View style={styles.addrRow}>
                            <View style={styles.addrIcon}>
                                <Ionicons name="home-outline" size={20} color={COLORS.WHITE} />
                            </View>
                            <View style={{ flex: 1 }}>
                                {!!order.addrName && <Text style={styles.addrName}>{order.addrName}</Text>}
                                {!!order.addrPhone && <Text style={styles.addrPhone}>{order.addrPhone}</Text>}
                                {!!order.addrText && <Text style={styles.addrText}>{order.addrText}</Text>}
                            </View>
                        </View>
                    ) : (
                        <Text style={styles.muted}>CheckoutScreen chưa truyền address sang.</Text>
                    )}
                </View>

                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.cardHeaderLeft}>
                            <Ionicons name="bag-outline" size={18} color={COLORS.BLUE} />
                            <Text style={styles.cardTitle}>Sản phẩm</Text>
                        </View>
                        <Text style={styles.smallNote}>{order.items.length} món</Text>
                    </View>

                    {order.items.length === 0 ? (
                        <Text style={styles.muted}>CheckoutScreen chưa truyền products sang.</Text>
                    ) : (
                        <View style={{ gap: 10 }}>
                            {order.items.map((it) => (
                                <View key={it.id} style={styles.itemRow}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.itemName} numberOfLines={1}>
                                            {it.name}
                                        </Text>
                                        <Text style={styles.itemSub}>Số lượng: {it.qty}</Text>
                                    </View>
                                    <Text style={styles.itemPrice}>{formatVnd(it.price)}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.cardHeaderLeft}>
                            <Ionicons name="calculator-outline" size={18} color={COLORS.BLUE} />
                            <Text style={styles.cardTitle}>Tóm tắt thanh toán</Text>
                        </View>
                    </View>

                    <View style={styles.sumRow}>
                        <Text style={styles.sumLabel}>Tạm tính</Text>
                        <Text style={styles.sumValue}>{formatVnd(order.subtotalNumber)}</Text>
                    </View>

                    <View style={styles.sumRow}>
                        <Text style={styles.sumLabel}>Giảm giá</Text>
                        <Text style={[styles.sumValue, { color: COLORS.GREEN }]}>
                            {order.discountNumber > 0 ? `-${formatVnd(order.discountNumber)}` : "0đ"}
                        </Text>
                    </View>

                    <View style={styles.sumRow}>
                        <Text style={styles.sumLabel}>Vận chuyển</Text>
                        <Text style={[styles.sumValue, { color: order.shippingNumber === 0 ? COLORS.GREEN : COLORS.TEXT }]}>
                            {order.shippingNumber === 0 ? "Miễn phí" : formatVnd(order.shippingNumber)}
                        </Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Tổng thanh toán</Text>
                        <Text style={styles.totalValue}>{formatVnd(order.totalNumber)}</Text>
                    </View>
                </View>

                <View style={{ height: 8 }} />

                <Pressable style={styles.primaryBtn} onPress={() => navigation.navigate("Orders", { tab: "processing" })}>
                    <Ionicons name="list-outline" size={18} color={COLORS.WHITE} />
                    <Text style={styles.primaryText}>Xem đơn hàng</Text>
                </Pressable>

                <Pressable style={styles.secondaryBtn} onPress={() => navigation.popToTop?.()}>
                    <Ionicons name="home-outline" size={18} color={COLORS.BLUE} />
                    <Text style={styles.secondaryText}>Về trang chủ</Text>
                </Pressable>

                <View style={{ height: 18 }} />
            </ScrollView>
        </SafeAreaView>
    );
}
