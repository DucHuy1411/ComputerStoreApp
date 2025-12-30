import React, { useContext, useMemo, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Checkbox from "expo-checkbox";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";

import styles, { COLORS } from "../styles/RegisterStyle";

export default function RegisterScreen({ navigation }) {
  const { register } = useContext(AuthContext);

  const [tab, setTab] = useState("register");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [agree, setAgree] = useState(true);
  const [busy, setBusy] = useState(false);

  const goTab = (next) => {
    setTab(next);
    if (next === "login") navigation.navigate("Login");
  };

  const canSubmit = useMemo(() => {
    return identifier.trim().length > 0 && password.trim().length > 0 && confirmPassword.trim().length > 0 && agree && !busy;
  }, [identifier, password, confirmPassword, agree, busy]);

  const onSubmit = async () => {
    try {
      setBusy(true);
      await register({ email: identifier.trim(), password: password.trim(), confirmPassword: confirmPassword.trim() });
    } catch (e) {
      Alert.alert("Lỗi", e?.message || "Đăng ký thất bại");
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

            <Text style={styles.welcome}>Tạo tài khoản TechStore</Text>
            <Text style={styles.subwelcome}>Đăng ký để bắt đầu mua sắm</Text>
          </View>

          <View style={styles.tabs}>
            <Pressable onPress={() => goTab("login")} style={styles.tabBtn}>
              <Text style={styles.tabText}>Đăng nhập</Text>
              <View style={styles.tabLine} />
            </Pressable>

            <Pressable onPress={() => goTab("register")} style={styles.tabBtn}>
              <Text style={[styles.tabText, styles.tabActive]}>Đăng ký</Text>
              <View style={[styles.tabLine, styles.tabLineActive]} />
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
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Mật khẩu (>= 6 ký tự)"
                secureTextEntry={!showPw}
                style={styles.input}
              />
              <Pressable onPress={() => setShowPw((v) => !v)} hitSlop={10}>
                <Ionicons name={showPw ? "eye-off-outline" : "eye-outline"} size={20} color={COLORS.ICON_GRAY} />
              </Pressable>
            </View>

            <Text style={styles.label}>Nhập lại mật khẩu</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color={COLORS.ICON_GRAY} />
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Nhập lại mật khẩu"
                secureTextEntry={!showPw2}
                style={styles.input}
              />
              <Pressable onPress={() => setShowPw2((v) => !v)} hitSlop={10}>
                <Ionicons name={showPw2 ? "eye-off-outline" : "eye-outline"} size={20} color={COLORS.ICON_GRAY} />
              </Pressable>
            </View>

            <Pressable style={styles.agreeRow} onPress={() => setAgree((v) => !v)}>
              <Checkbox value={agree} onValueChange={setAgree} color={agree ? COLORS.BLUE : undefined} />
              <Text style={styles.agreeText}>Tôi đồng ý với điều khoản sử dụng</Text>
            </Pressable>

            <Pressable onPress={onSubmit} disabled={!canSubmit} style={[styles.primaryBtn, !canSubmit && styles.primaryBtnDisabled]}>
              <Text style={styles.primaryBtnText}>{busy ? "Đang tạo tài khoản..." : "Đăng ký"}</Text>
              <Ionicons name="arrow-forward" size={18} color={COLORS.WHITE} />
            </Pressable>

            <View style={styles.bottomRow}>
              <Text style={styles.bottomText}>Đã có tài khoản?</Text>
              <Pressable onPress={() => navigation.navigate("Login")}>
                <Text style={[styles.bottomText, styles.bottomLink]}> Đăng nhập</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
