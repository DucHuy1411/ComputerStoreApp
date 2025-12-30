import React, { useCallback, useEffect, useState } from "react";
import { Text, View, Pressable, ScrollView, Alert, Modal, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import { apiAddresses, apiAddressCreate, apiAddressUpdate, apiAddressDelete, apiAddressSetDefault } from "../services/endpoints";

import styles, { COLORS } from "../styles/AddressStyle";

const pickIconByType = (type) => {
  const t = (type || "").toLowerCase();
  if (t === "home") return { icon: "home-variant-outline", iconBg: "#E9F7FF", iconColor: "#0EA5E9" };
  if (t === "office") return { icon: "briefcase-outline", iconBg: "#FFF3E6", iconColor: "#F59E0B" };
  return { icon: "map-marker-outline", iconBg: "#F3E8FF", iconColor: "#A855F7" };
};

const buildAddressText = (a) => {
  const parts = [a.line1, a.ward, a.district, a.city, a.province, a.country].filter(Boolean);
  return parts.join(", ");
};

const normalizeAddress = (a) => {
  const id = a.id;
  const name = a.recipientName || "";
  const phone = a.recipientPhone || "";
  const addressText = buildAddressText(a);
  const isDefault = !!a.isDefault;
  const type = a.type || "other";
  const ic = pickIconByType(type);

  return {
    id: String(id),
    name,
    phone,
    address: addressText || a.line1 || "",
    isDefault,
    type,
    ...ic,
    raw: a,
  };
};

export default function AddressScreen({ navigation }) {
  const [selectedId, setSelectedId] = useState(null);
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [fType, setFType] = useState("home");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [ward, setWard] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [country, setCountry] = useState("VN");
  const [isDefault, setIsDefault] = useState(false);

  const resetForm = () => {
    setEditing(null);
    setFType("home");
    setRecipientName("");
    setRecipientPhone("");
    setLine1("");
    setWard("");
    setDistrict("");
    setCity("");
    setProvince("");
    setCountry("VN");
    setIsDefault(false);
  };

  const openCreate = () => {
    resetForm();
    setOpen(true);
  };

  const openEdit = (it) => {
    const a = it.raw || {};
    setEditing(it);
    setFType(a.type || "home");
    setRecipientName(a.recipientName || "");
    setRecipientPhone(a.recipientPhone || "");
    setLine1(a.line1 || "");
    setWard(a.ward || "");
    setDistrict(a.district || "");
    setCity(a.city || "");
    setProvince(a.province || "");
    setCountry(a.country || "VN");
    setIsDefault(!!a.isDefault);
    setOpen(true);
  };

  const load = async () => {
    try {
      setBusy(true);
      const res = await apiAddresses();
      const list = (res?.addresses || []).map(normalizeAddress);
      setItems(list);

      const def = list.find((x) => x.isDefault) || list[0];
      setSelectedId(def ? def.id : null);
    } catch (e) {
      Alert.alert("Lỗi", e?.message || "Không tải được địa chỉ");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const onDelete = (it) => {
    Alert.alert("Xóa địa chỉ", "Bạn chắc chắn muốn xóa địa chỉ này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            setBusy(true);
            await apiAddressDelete(it.id);
            await load();
          } catch (e) {
            Alert.alert("Lỗi", e?.message || "Xóa thất bại");
          } finally {
            setBusy(false);
          }
        },
      },
    ]);
  };

  const onSetDefault = async (it) => {
    try {
      setBusy(true);
      await apiAddressSetDefault(it.id);
      await load();
    } catch (e) {
      Alert.alert("Lỗi", e?.message || "Đặt mặc định thất bại");
    } finally {
      setBusy(false);
    }
  };

  const onSave = async () => {
    const payload = {
      recipientName: recipientName.trim(),
      recipientPhone: recipientPhone.trim(),
      line1: line1.trim(),
      ward: ward.trim() || null,
      district: district.trim() || null,
      city: city.trim() || null,
      province: province.trim() || null,
      country: (country.trim() || "VN").toUpperCase(),
      type: (fType || "home").toLowerCase(),
      isDefault: !!isDefault,
    };

    if (!payload.recipientName || !payload.recipientPhone || !payload.line1) {
      Alert.alert("Thiếu thông tin", "recipientName, recipientPhone, line1 là bắt buộc");
      return;
    }

    try {
      setBusy(true);
      if (editing) {
        await apiAddressUpdate(editing.id, payload);
      } else {
        await apiAddressCreate(payload);
      }
      setOpen(false);
      resetForm();
      await load();
    } catch (e) {
      Alert.alert("Lỗi", e?.message || "Lưu địa chỉ thất bại");
    } finally {
      setBusy(false);
    }
  };

  const TypeChip = ({ id, label }) => {
    const on = fType === id;
    return (
      <Pressable style={[styles.chip, on && styles.chipOn]} onPress={() => setFType(id)}>
        <Text style={[styles.chipText, on && styles.chipTextOn]}>{label}</Text>
      </Pressable>
    );
  };

  const CardItem = ({ item }) => {
    const selected = selectedId === item.id;
    const highlight = item.isDefault;

    return (
      <Pressable style={[styles.card, highlight && styles.cardDefault]} onPress={() => setSelectedId(item.id)}>
        <View style={styles.topRow}>
          <Ionicons
            name={selected ? "radio-button-on" : "radio-button-off"}
            size={22}
            color={selected ? COLORS.BLUE : COLORS.GRAY_200}
          />

          <View style={[styles.leftIcon, { backgroundColor: item.iconBg }]}>
            <MaterialCommunityIcons name={item.icon} size={20} color={item.iconColor} />
          </View>

          <View style={{ flex: 1 }}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{item.name || "—"}</Text>
              {item.isDefault && (
                <View style={styles.defaultPill}>
                  <Text style={styles.defaultText}>Mặc định</Text>
                </View>
              )}
            </View>
            {!!item.phone && <Text style={styles.phone}>{item.phone}</Text>}
            <Text style={styles.addr}>{item.address || "—"}</Text>
          </View>
        </View>

        <View style={styles.btnRow}>
          <Pressable style={[styles.btn, styles.btnBlue]} onPress={() => openEdit(item)}>
            <Ionicons name="create-outline" size={16} color={COLORS.BLUE} />
            <Text style={[styles.btnText, { color: COLORS.BLUE }]}>Sửa</Text>
          </Pressable>

          <Pressable style={[styles.btn, styles.btnRed]} onPress={() => onDelete(item)}>
            <Ionicons name="trash-outline" size={16} color={COLORS.RED} />
            <Text style={[styles.btnText, { color: COLORS.RED }]}>Xóa</Text>
          </Pressable>

          {!item.isDefault && (
            <Pressable style={[styles.btn, styles.btnOutlineBlue]} onPress={() => onSetDefault(item)}>
              <Ionicons name="checkmark" size={16} color={COLORS.BLUE} />
              <Text style={[styles.btnText, { color: COLORS.BLUE }]}>Đặt mặc định</Text>
            </Pressable>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.TEXT} />
        </Pressable>

        <Text style={styles.headerTitle}>Địa chỉ giao hàng</Text>

        <Pressable style={styles.headerBtn} onPress={openCreate}>
          <Ionicons name="add" size={26} color={COLORS.BLUE} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {items.map((a) => (
          <CardItem key={a.id} item={a} />
        ))}
        <View style={{ height: 90 }} />
      </ScrollView>

      <Pressable style={styles.fab} onPress={openCreate}>
        <Ionicons name="add" size={26} color={COLORS.WHITE} />
      </Pressable>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{editing ? "Sửa địa chỉ" : "Thêm địa chỉ"}</Text>
              <Pressable style={styles.sheetClose} onPress={() => setOpen(false)}>
                <Ionicons name="close" size={22} color={COLORS.TEXT} />
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.sheetBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Loại địa chỉ</Text>
              <View style={styles.chipRow}>
                <TypeChip id="home" label="Nhà" />
                <TypeChip id="office" label="Công ty" />
                <TypeChip id="other" label="Khác" />
              </View>

              <Text style={styles.label}>Người nhận</Text>
              <TextInput value={recipientName} onChangeText={setRecipientName} placeholder="Nguyễn Văn A" style={styles.input} />

              <Text style={styles.label}>SĐT người nhận</Text>
              <TextInput
                value={recipientPhone}
                onChangeText={setRecipientPhone}
                placeholder="0912xxxxxx"
                keyboardType="phone-pad"
                style={styles.input}
              />

              <Text style={styles.label}>Địa chỉ (line1)</Text>
              <TextInput value={line1} onChangeText={setLine1} placeholder="123 Nguyễn Huệ" style={styles.input} />

              <Text style={styles.label}>Phường/Xã (ward)</Text>
              <TextInput value={ward} onChangeText={setWard} placeholder="Bến Nghé" style={styles.input} />

              <Text style={styles.label}>Quận/Huyện (district)</Text>
              <TextInput value={district} onChangeText={setDistrict} placeholder="Quận 1" style={styles.input} />

              <Text style={styles.label}>Thành phố (city)</Text>
              <TextInput value={city} onChangeText={setCity} placeholder="TP. Hồ Chí Minh" style={styles.input} />

              <Text style={styles.label}>Tỉnh (province)</Text>
              <TextInput value={province} onChangeText={setProvince} placeholder="Hồ Chí Minh" style={styles.input} />

              <Text style={styles.label}>Quốc gia (country)</Text>
              <TextInput value={country} onChangeText={setCountry} placeholder="VN" style={styles.input} />

              <Pressable style={styles.defaultRow} onPress={() => setIsDefault((v) => !v)}>
                <Ionicons name={isDefault ? "checkbox" : "square-outline"} size={20} color={isDefault ? COLORS.BLUE : COLORS.MUTED} />
                <Text style={styles.defaultRowText}>Đặt làm mặc định</Text>
              </Pressable>
            </ScrollView>

            <View style={styles.sheetFooter}>
              <Pressable
                style={[styles.footerBtn, styles.footerGhost]}
                onPress={() => {
                  setOpen(false);
                  resetForm();
                }}
              >
                <Text style={[styles.footerBtnText, { color: COLORS.BLUE }]}>Hủy</Text>
              </Pressable>

              <Pressable style={[styles.footerBtn, styles.footerPrimary]} onPress={onSave} disabled={busy}>
                <Text style={[styles.footerBtnText, { color: COLORS.WHITE }]}>{busy ? "Đang lưu..." : "Lưu"}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
