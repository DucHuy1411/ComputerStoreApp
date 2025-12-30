import React, { useContext, useMemo, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Checkbox from "expo-checkbox";
import { Ionicons, FontAwesome, AntDesign } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";

import styles, { COLORS } from "../styles/LoginStyle";

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);

  const [tab, setTab] = useState("login");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);

  const goTab = (next) => {
    setTab(next);
    if (next === "register") navigation.navigate("Register");
  };

  const canSubmit = useMemo(() => identifier.trim().length > 0 && password.trim().length > 0 && !busy, [identifier, password, busy]);

  const onSubmit = async () => {
    try {
      setBusy(true);
      await login({ email: identifier.trim(), password: password.trim(), remember });
    } catch (e) {
      Alert.alert("Lỗi", e?.message || "Đăng nhập thất bại");
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.brand}>TechStore</Text>
            <Text style={styles.tagline}>Chuyên Gia Công Nghệ</Text>

            <View style={styles.heroIconWrap}>
              <View style={styles.heroBarLeft} />
              <View style={styles.heroPhone}>
                <Ionicons name="phone-portrait" size={38} color={COLORS.BLUE} />
              </View>
              <View style={styles.heroBarRight} />
            </View>

            <Text style={styles.welcome}>Chào mừng bạn đến với TechStore</Text>
            <Text style={styles.subwelcome}>Đăng nhập để trải nghiệm mua sắm tốt nhất</Text>
          </View>

          <View style={styles.tabs}>
            <Pressable onPress={() => goTab("login")} style={styles.tabBtn}>
              <Text style={[styles.tabText, styles.tabActive]}>Đăng nhập</Text>
              <View style={[styles.tabLine, styles.tabLineActive]} />
            </Pressable>

            <Pressable onPress={() => goTab("register")} style={styles.tabBtn}>
              <Text style={styles.tabText}>Đăng ký</Text>
              <View style={styles.tabLine} />
            </Pressable>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Email hoặc số điện thoại</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="mail-outline" size={18} color={COLORS.ICON_GRAY} />
              <TextInput
                value={identifier}
                onChangeText={setIdentifier}
                placeholder="Nhập email hoặc số điện thoại"
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
              />
            </View>

            <Text style={styles.label}>Mật khẩu</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color={COLORS.ICON_GRAY} />
              <TextInput value={password} onChangeText={setPassword} placeholder="Nhập mật khẩu" secureTextEntry={!showPw} style={styles.input} />
              <Pressable onPress={() => setShowPw((v) => !v)} hitSlop={10}>
                <Ionicons name={showPw ? "eye-off-outline" : "eye-outline"} size={20} color={COLORS.ICON_GRAY} />
              </Pressable>
            </View>

            <View style={styles.rowBetween}>
              <Pressable style={styles.remember} onPress={() => setRemember((v) => !v)}>
                <Checkbox value={remember} onValueChange={setRemember} color={remember ? COLORS.BLUE : undefined} />
                <Text style={styles.rememberText}>Ghi nhớ đăng nhập</Text>
              </Pressable>

              <Pressable onPress={() => Alert.alert("Thông báo", "Chưa implement quên mật khẩu")}>
                <Text style={styles.link}>Quên mật khẩu?</Text>
              </Pressable>
            </View>

            <Pressable onPress={onSubmit} disabled={!canSubmit} style={[styles.primaryBtn, !canSubmit && styles.primaryBtnDisabled]}>
              <Text style={styles.primaryBtnText}>{busy ? "Đang đăng nhập..." : "Đăng nhập"}</Text>
              <Ionicons name="arrow-forward" size={18} color={COLORS.WHITE} />
            </Pressable>

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>Hoặc đăng nhập với</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.socialRow}>
              <Pressable style={styles.socialBtn} onPress={() => Alert.alert("Thông báo", "Chưa implement Facebook")}>
                <FontAwesome name="facebook" size={22} color={COLORS.FB} />
              </Pressable>
              <Pressable style={styles.socialBtn} onPress={() => Alert.alert("Thông báo", "Chưa implement Google")}>
                <AntDesign name="google" size={22} color={COLORS.GOOGLE} />
              </Pressable>
              <Pressable style={styles.socialBtn} onPress={() => Alert.alert("Thông báo", "Chưa implement Apple")}>
                <AntDesign name="apple" size={22} color={COLORS.APPLE} />
              </Pressable>
            </View>

            <View style={styles.bottomRow}>
              <Text style={styles.bottomText}>Chưa có tài khoản?</Text>
              <Pressable onPress={() => navigation.navigate("Register")}>
                <Text style={[styles.bottomText, styles.bottomLink]}> Đăng ký ngay</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
