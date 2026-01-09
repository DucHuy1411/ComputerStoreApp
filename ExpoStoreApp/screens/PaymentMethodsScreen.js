import React from "react";
import { Text, View, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import styles, { COLORS } from "../styles/PaymentMethodsStyle";

const METHODS = [
  {
    id: "cod",
    title: "Thanh toán khi nhận hàng (COD)",
    sub: "Tiền mặt hoặc chuyển khoản khi nhận hàng",
    icon: "cash",
    iconBg: "#EAFBF3",
    iconColor: "#22C55E",
    isDefault: true,
  },
  {
    id: "vnpay",
    title: "VNPay",
    sub: "Thanh toán trực tuyến qua ví/ngân hàng",
    icon: "credit-card-outline",
    iconBg: "#E9F7FF",
    iconColor: "#0EA5E9",
    isDefault: false,
  },
];

export default function PaymentMethodsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={COLORS.TEXT} />
        </Pressable>
        <Text style={styles.headerTitle}>Phương thức thanh toán</Text>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {METHODS.map((it) => (
          <View key={it.id} style={styles.card}>
            <View style={styles.row}>
              <View style={[styles.iconWrap, { backgroundColor: it.iconBg }]}>
                <MaterialCommunityIcons name={it.icon} size={20} color={it.iconColor} />
              </View>

              <View style={{ flex: 1 }}>
                <View style={styles.titleRow}>
                  <Text style={styles.title}>{it.title}</Text>
                  {it.isDefault ? (
                    <View style={styles.pill}>
                      <Text style={styles.pillText}>Mặc định</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={styles.sub}>{it.sub}</Text>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Quản lý thẻ</Text>
          <Text style={styles.infoText}>
            Bạn có thể chọn phương thức khi thanh toán. Quản lý thẻ sẽ được cập nhật trong bản tiếp theo.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
