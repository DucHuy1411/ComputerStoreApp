import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import { apiMe, apiUpdateMe } from "../services/endpoints";
import styles, { COLORS } from "../styles/EditProfileStyle";

const isValidEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || "").trim());

export default function EditProfileScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [user, setUser] = useState(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [showCur, setShowCur] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showNew2, setShowNew2] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiMe();
      const u = res?.user || res || null;

      setUser(u);
      setFullName(String(u?.fullName ?? u?.name ?? "").trim());
      setPhone(String(u?.phone ?? "").trim());
      setEmail(String(u?.email ?? "").trim());
    } catch (e) {
      Alert.alert("Lỗi", e?.message || "Không tải được thông tin");
      setUser(null);
      setFullName("");
      setPhone("");
      setEmail("");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const hasPwChange = useMemo(() => {
    return (
      String(currentPassword || "").trim().length > 0 ||
      String(newPassword || "").trim().length > 0 ||
      String(confirmNewPassword || "").trim().length > 0
    );
  }, [currentPassword, newPassword, confirmNewPassword]);

  const dirty = useMemo(() => {
    const baseChanged =
      String(fullName || "").trim() !== String(user?.fullName ?? user?.name ?? "").trim() ||
      String(phone || "").trim() !== String(user?.phone ?? "").trim() ||
      String(email || "").trim() !== String(user?.email ?? "").trim();
    return baseChanged || hasPwChange;
  }, [fullName, phone, email, user, hasPwChange]);

  const canSave = useMemo(() => {
    if (saving || loading) return false;
    if (!dirty) return false;

    const fn = String(fullName || "").trim();
    if (!fn) return false;

    const em = String(email || "").trim();
    if (!em || !isValidEmail(em)) return false;

    if (hasPwChange) {
      if (!String(currentPassword || "").trim()) return false;
      if (String(newPassword || "").length < 6) return false;
      if (newPassword !== confirmNewPassword) return false;
    }

    return true;
  }, [saving, loading, dirty, fullName, email, hasPwChange, currentPassword, newPassword, confirmNewPassword]);

  const payload = useMemo(() => {
    const p = {
      fullName: String(fullName || "").trim(),
      phone: String(phone || "").trim(),
      email: String(email || "").trim().toLowerCase(),
    };

    if (hasPwChange) {
      p.currentPassword = String(currentPassword || "");
      p.password = String(newPassword || "");
    }

    return p;
  }, [fullName, phone, email, hasPwChange, currentPassword, newPassword]);

  const onSave = useCallback(async () => {
    if (!canSave) return;

    try {
      setSaving(true);
      await apiUpdateMe(payload);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");

      await load();

      Alert.alert("Thành công", "Đã cập nhật thông tin");
      navigation.goBack();
    } catch (e) {
      Alert.alert("Lỗi", e?.message || "Không cập nhật được");
    } finally {
      setSaving(false);
    }
  }, [canSave, payload, load, navigation]);

  const FieldLabel = ({ children }) => <Text style={styles.label}>{children}</Text>;
  const InputWrap = ({ children }) => <View style={styles.inputWrap}>{children}</View>;

  const PwInput = ({ value, onChangeText, placeholder, show, onToggleShow }) => (
    <InputWrap>
      <Ionicons name="lock-closed-outline" size={18} color="#8A8A8A" />
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} secureTextEntry={!show} style={styles.input} />
      <Pressable onPress={onToggleShow} hitSlop={10}>
        <Ionicons name={show ? "eye-off-outline" : "eye-outline"} size={20} color="#8A8A8A" />
      </Pressable>
    </InputWrap>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.TEXT} />
        </Pressable>
        <Text style={styles.headerTitle}>Chỉnh sửa hồ sơ</Text>
        <Pressable style={styles.headerBtn} onPress={load} disabled={loading || saving}>
          <Ionicons name="refresh" size={22} color={loading || saving ? "#9AA0A6" : COLORS.TEXT} />
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Thông tin cá nhân</Text>

              <FieldLabel>Họ và tên</FieldLabel>
              <InputWrap>
                <Ionicons name="person-outline" size={18} color="#8A8A8A" />
                <TextInput value={fullName} onChangeText={setFullName} placeholder="Nhập họ và tên" style={styles.input} />
              </InputWrap>

              <FieldLabel>Số điện thoại</FieldLabel>
              <InputWrap>
                <Ionicons name="call-outline" size={18} color="#8A8A8A" />
                <TextInput value={phone} onChangeText={setPhone} placeholder="Nhập số điện thoại" keyboardType="phone-pad" style={styles.input} />
              </InputWrap>

              <FieldLabel>Email</FieldLabel>
              <InputWrap>
                <Ionicons name="mail-outline" size={18} color="#8A8A8A" />
                <TextInput value={email} onChangeText={setEmail} placeholder="Nhập email" autoCapitalize="none" keyboardType="email-address" style={styles.input} />
              </InputWrap>

              {!String(email || "").trim() || !isValidEmail(email) ? <Text style={styles.hintRed}>Email không hợp lệ</Text> : null}
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeadRow}>
                <Text style={styles.cardTitle}>Đổi mật khẩu</Text>
                <View style={[styles.pill, hasPwChange ? styles.pillOn : styles.pillOff]}>
                  <Text style={[styles.pillText, hasPwChange ? styles.pillTextOn : styles.pillTextOff]}>
                    {hasPwChange ? "Đang đổi" : "Không đổi"}
                  </Text>
                </View>
              </View>

              <Text style={styles.muted}>Muốn đổi thì nhập đủ 3 ô. Không đổi thì để trống.</Text>

              <FieldLabel>Mật khẩu hiện tại</FieldLabel>
              <PwInput
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Nhập mật khẩu hiện tại"
                show={showCur}
                onToggleShow={() => setShowCur((v) => !v)}
              />

              <FieldLabel>Mật khẩu mới</FieldLabel>
              <PwInput
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Mật khẩu mới (>= 6 ký tự)"
                show={showNew}
                onToggleShow={() => setShowNew((v) => !v)}
              />

              <FieldLabel>Nhập lại mật khẩu mới</FieldLabel>
              <PwInput
                value={confirmNewPassword}
                onChangeText={setConfirmNewPassword}
                placeholder="Nhập lại mật khẩu mới"
                show={showNew2}
                onToggleShow={() => setShowNew2((v) => !v)}
              />

              {hasPwChange && String(newPassword || "").length > 0 && String(newPassword || "").length < 6 ? (
                <Text style={styles.hintRed}>Mật khẩu mới tối thiểu 6 ký tự</Text>
              ) : null}

              {hasPwChange && String(confirmNewPassword || "").length > 0 && newPassword !== confirmNewPassword ? (
                <Text style={styles.hintRed}>Mật khẩu nhập lại không khớp</Text>
              ) : null}
            </View>

            <Pressable onPress={onSave} disabled={!canSave} style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}>
              {saving ? <ActivityIndicator color="#fff" /> : <Ionicons name="save-outline" size={18} color="#fff" />}
              <Text style={styles.saveText}>{saving ? "Đang lưu..." : "Lưu thay đổi"}</Text>
            </Pressable>

            <Pressable style={styles.cancelBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="close-outline" size={18} color={COLORS.BLUE} />
              <Text style={styles.cancelText}>Hủy</Text>
            </Pressable>

            <View style={{ height: 18 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}
